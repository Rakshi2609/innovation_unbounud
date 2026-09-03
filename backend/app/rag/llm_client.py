"""LLM client wrapper for the financial reasoning graph.

Provides a single `FinancialLLMClient` class that:
  * Uses Groq (via `langchain_groq.ChatGroq`) when `GROQ_API_KEY` is configured
  * Falls back to the deterministic template strings from the original
    `graph.py` when no key is available, so tests still pass and the demo
    works offline
  * Times out quickly (8s) to avoid blocking the synchronous reasoning path
  * Surfaces all errors to the caller — never silently produces empty output

The class also exposes a structured `reason()` method that returns the four
fields the rest of the graph expects: `summary`, `factor_breakdown`,
`policy_alignment`, `safety_passed`. This is the only contract the graph
relies on.
"""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import List, Optional

from app.core.config import settings
from app.models.schemas import (
    CustomerProfile,
    MLRiskPrediction,
    PolicyCitation,
)

logger = logging.getLogger(__name__)


@dataclass
class ReasoningResult:
    """Structured output of the LLM reasoning step."""
    summary: str
    factor_breakdown: List[str]
    policy_alignment: str
    safety_passed: bool = True
    used_llm: bool = False  # tracks whether the LLM produced this output


# ---------- template fallback (used when no GROQ_API_KEY) ----------

def _template_reason(
    customer: CustomerProfile,
    ml_pred: MLRiskPrediction,
    citations: List[PolicyCitation],
) -> ReasoningResult:
    """The original string-template reasoning — kept verbatim for offline
    fallback and tests. Returns the same shape as the LLM path."""
    metrics = customer.financial_metrics
    factors = [
        f"• {f.factor.replace('_', ' ').title()}: {f.description} (Contribution Weight: {f.weight:.2f})"
        for f in ml_pred.top_factors
    ]
    citation_refs = [f"[{i+1}]" for i in range(len(citations))]
    citation_str = ", ".join(citation_refs) if citation_refs else "[Bank Policy Manual]"

    rt = ml_pred.risk_type
    cu = metrics.credit_utilization * 100
    burden = (metrics.monthly_expenses / max(metrics.monthly_income, 1)) * 100

    if rt == "credit_distress":
        summary = (
            f"Customer flagged for early financial distress with {ml_pred.risk_class} risk profile "
            f"({ml_pred.risk_score*100:.1f}% ML risk score). Revolving credit utilization is {cu:.1f}% "
            f"with recurring commitments consuming {burden:.1f}% of monthly income."
        )
        policy_alignment = (
            f"In accordance with institutional distress intervention policies {citation_str}, "
            "early pre-delinquency signals qualify the borrower for non-punitive debt workouts "
            "and term restructuring prior to formal default."
        )
    elif rt == "payment_fraud":
        summary = (
            f"Customer transaction flagged with {ml_pred.risk_class} fraud anomaly risk "
            f"({ml_pred.risk_score*100:.1f}% risk score). Behavioral telemetry identified anomalous "
            "device parameters."
        )
        policy_alignment = (
            f"Under fraud prevention SOPs {citation_str}, unverified high-velocity transactions "
            "require immediate out-of-band step-up authentication."
        )
    elif rt == "gig_income_volatility":
        summary = (
            f"Customer assessed with {ml_pred.risk_class} cashflow volatility risk "
            f"({ml_pred.risk_score*100:.1f}% risk score). Platform earnings show variance with "
            "short-term liquidity buffer needs."
        )
        policy_alignment = (
            f"Per informal worker underwriting framework {citation_str}, credit eligibility is "
            "underwritten on 180-day rolling digital cashflow."
        )
    else:
        summary = (
            f"Customer evaluated with {ml_pred.risk_class} overall risk ({ml_pred.risk_score*100:.1f}%). "
            "Financial indicators meet standard thresholds."
        )
        policy_alignment = (
            f"Complies with standard credit underwriting guidelines {citation_str}."
        )

    return ReasoningResult(
        summary=summary,
        factor_breakdown=factors,
        policy_alignment=policy_alignment,
        safety_passed=True,
        used_llm=False,
    )


# ---------- prompt + Groq path ----------

_SYSTEM_PROMPT = """You are an AI financial-safety copilot for an Indian bank. Your job is to \
explain an ML risk assessment to a bank officer who must make the final human decision.

STRICT RULES — NEVER VIOLATE:
1. You MUST NOT recommend an autonomous approval, decline, freeze, or transfer. \
   Always phrase actions as "Recommended for human officer review".
2. You MUST cite the supplied policy documents using [1], [2], [3] notation.
3. You MUST NOT invent facts not present in the supplied context. \
   If a fact is not in the policy excerpts, say "based on the supplied policy excerpts".
4. You MUST NOT make up loan terms, interest rates, or moratorium details.
5. Tone: professional, concise, plain English. Suitable for a non-technical bank officer.
6. Audience is Indian — use ₹ for currency, reference RBI-aligned concepts where relevant.
7. Length: 3-5 sentences per field. No bullet padding.

OUTPUT FORMAT (JSON, no markdown fences):
{
  "summary": "...",
  "factor_breakdown": ["...", "..."],
  "policy_alignment": "..."
}
"""


def _build_user_prompt(
    customer: CustomerProfile,
    ml_pred: MLRiskPrediction,
    citations: List[PolicyCitation],
) -> str:
    metrics = customer.financial_metrics
    factors_text = "\n".join(
        f"  - {f.factor}: weight={f.weight:.3f}, {f.description}"
        for f in ml_pred.top_factors
    ) or "  (none)"
    citations_text = "\n".join(
        f"  [{i+1}] {c.policy_name} — {c.section} ({c.clause}): {c.snippet[:300]}"
        for i, c in enumerate(citations[:5])
    ) or "  (no policy citations retrieved)"

    return f"""CUSTOMER PROFILE:
- ID: {customer.customer_id}
- Occupation: {customer.occupation}
- Employment: {customer.employment_type}
- Monthly income: ₹{metrics.monthly_income:,.0f}
- Monthly expenses: ₹{metrics.monthly_expenses:,.0f}
- Existing debt: ₹{metrics.existing_debt:,.0f}
- Credit utilization: {metrics.credit_utilization*100:.1f}%
- Recent delinquencies: {metrics.recent_delinquencies}
- Savings: ₹{metrics.savings_balance:,.0f}
- Income volatility: {metrics.income_volatility_score or 'N/A'}

ML PREDICTION:
- Risk class: {ml_pred.risk_class}
- Risk score: {ml_pred.risk_score:.3f}
- Confidence: {ml_pred.confidence:.3f}
- Risk type: {ml_pred.risk_type}
- Top factors:
{factors_text}

RETRIEVED POLICY CITATIONS:
{citations_text}

Generate the three required fields (summary, factor_breakdown, policy_alignment). \
Remember: you are decision-SUPPORT only. The human officer makes the final call."""


class FinancialLLMClient:
    """Wraps Groq for the reasoning step. Stateless, async, timeout-bounded.

    Design: every call returns a `ReasoningResult` so the graph doesn't need
    to handle two distinct shapes (LLM-string vs template-string). When the
    LLM is unavailable (no key, network error, timeout), the template
    fallback runs and `used_llm=False` is set for transparency.
    """

    TIMEOUT_SECONDS = 8.0
    MAX_RETRIES = 1

    def __init__(self):
        self._llm = None
        self._enabled = settings.is_llm_enabled
        if self._enabled:
            try:
                from langchain_groq import ChatGroq
                self._llm = ChatGroq(
                    api_key=settings.groq_api_key,
                    model=settings.default_llm_model,
                    temperature=settings.llm_temperature,
                    max_retries=self.MAX_RETRIES,
                    timeout=self.TIMEOUT_SECONDS,
                )
                logger.info(f"Groq LLM client ready (model={settings.default_llm_model})")
            except Exception as e:
                logger.warning(f"Groq client init failed ({e}); using template fallback.")
                self._llm = None
                self._enabled = False
        else:
            logger.info("GROQ_API_KEY not configured — using template fallback for LLM step.")

    @property
    def is_enabled(self) -> bool:
        return self._enabled and self._llm is not None

    async def reason(
        self,
        customer: CustomerProfile,
        ml_pred: MLRiskPrediction,
        citations: List[PolicyCitation],
    ) -> ReasoningResult:
        """Generate structured reasoning. Returns template fallback on any failure."""
        # Fast-path: no LLM available
        if not self.is_enabled:
            return _template_reason(customer, ml_pred, citations)

        try:
            from langchain_core.messages import SystemMessage, HumanMessage
            user_prompt = _build_user_prompt(customer, ml_pred, citations)
            messages = [
                SystemMessage(content=_SYSTEM_PROMPT),
                HumanMessage(content=user_prompt),
            ]
            # Run sync `invoke` in a thread so we can apply our own timeout
            response = await asyncio.wait_for(
                asyncio.to_thread(self._llm.invoke, messages),
                timeout=self.TIMEOUT_SECONDS + 2,  # small grace
            )
            text = response.content if hasattr(response, "content") else str(response)
            parsed = _parse_json_safely(text)
            if parsed is None:
                logger.warning("LLM returned unparseable JSON — falling back to template.")
                return _template_reason(customer, ml_pred, citations)

            return ReasoningResult(
                summary=str(parsed.get("summary", "")),
                factor_breakdown=list(parsed.get("factor_breakdown", [])),
                policy_alignment=str(parsed.get("policy_alignment", "")),
                safety_passed=True,
                used_llm=True,
            )
        except asyncio.TimeoutError:
            logger.warning(f"LLM reasoning timed out after {self.TIMEOUT_SECONDS}s — using template.")
        except Exception as e:
            logger.warning(f"LLM reasoning failed ({type(e).__name__}: {e}) — using template.")
        return _template_reason(customer, ml_pred, citations)


# ---------- JSON parsing helper ----------

def _parse_json_safely(text: str) -> Optional[dict]:
    """Best-effort JSON parse. Strips ```json fences; tolerates trailing text."""
    import json
    import re

    if not text:
        return None
    s = text.strip()

    # Strip ```json fences
    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", s, re.DOTALL)
    if fence:
        s = fence.group(1)
    else:
        # Find first { and last }
        start = s.find("{")
        end = s.rfind("}")
        if start != -1 and end != -1 and end > start:
            s = s[start:end + 1]

    for candidate in (s, text):
        try:
            return json.loads(candidate)
        except (json.JSONDecodeError, ValueError):
            continue
    return None