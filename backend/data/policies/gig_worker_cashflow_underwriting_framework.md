# Gig Economy & Informal Worker Cashflow Underwriting Guidelines (POL-GIG-2026)

**Policy ID:** POL-GIG-2026
**Effective Date:** 2026-01-01
**Review Cycle:** Annual
**Owning Function:** Inclusive Credit Policy & New-Segment Underwriting
**Applicable To:** All consumer credit originations to: gig economy platform workers, freelancers, unorganized-sector self-employed (kirana / traders / micro-manufacturers), daily-wage workers with digital payment trails, ride-share and delivery partners, content creators, consultants, and informal sector borrowers lacking formal payslip / ITR documentation.

This policy operationalizes the RBI Master Direction on Digital Lending, the RBI Charter of Customer Rights, the Fair Practices Code for Lenders, and the committee recommendations on Alternative Data-Based Credit Decisioning. It defines cashflow-driven underwriting standards, dynamic credit limits, micro-liquidity lines, and protective safeguards for a segment whose income is structurally volatile.

---

## Section 1: Non-Traditional Income & Volatility Assessment

### Clause 1.1 — 180-Day Cashflow Average
**Clause 1.1** For gig economy contractors, freelancers, and platform workers without fixed payslips, income eligibility is determined by the **180-day rolling average** of digital bank deposits. Banks deposits include: UPI collect-requests from verified platforms, IMPS / NEFT credits from employer / platform partners, card payments, and standing-instruction credits. Cash deposits are weighted at **50.0%** of declared value unless independently corroborated.

### Clause 1.2 — Volatility Coefficient Buffer
**Clause 1.2** If monthly income volatility exceeds **40.0%** (coefficient of variation = standard deviation / mean), credit limits must be dynamically adjusted to **60.0%** of the lowest quarterly income baseline to prevent overindebtedness during seasonal lulls. The volatility coefficient is recomputed weekly and limit adjustments take effect at the next statement cycle.

### Clause 1.3 — Multi-Platform Aggregation
**Clause 1.3** Where a customer earns from multiple platforms (e.g., ride-share + food delivery + freelancing), the bank may aggregate deposits across all platforms subject to: explicit customer consent, platform-level confirmation via partner APIs, and reconciliation of platform declared earnings with bank credits (variance <= 15.0%).

### Clause 1.4 — Income Smoothing Methodology
**Clause 1.4** For underwriting purposes, the smoothed monthly income = **min (180-day average, 90-day average × 0.95, last-month income × 1.20)**. This tri-floored approach protects against both overstatement (using a high recent month) and under-statement (using a single bad month).

### Clause 1.5 — Stable Earnings Cohort
**Clause 1.5** Customers with **12+ months** of bank trace, volatility coefficient < 20.0%, and a consistent platform-of-record qualify for the Stable Earnings Cohort. Stable Earnings customers may be underwritten using the 90-day average (instead of 180-day) and enjoy a **+10.0%** credit limit multiplier.

### Clause 1.6 — Account Aggregator Integration
**Clause 1.6** Where the customer consents via the Account Aggregator framework, the bank may pull a 12-month financial summary across all linked bank accounts. This data is used solely for underwriting and is purged within 90 days unless required for ongoing portfolio analytics (anonymized).

---

## Section 2: Flexible Repayment and Micro-Liquidity Lines

### Clause 2.1 — Income-Contingent Micro-Lines
**Clause 2.1** Gig workers maintaining positive platform activity ratings (where verifiable through platform partners) are eligible for income-contingent liquidity lines up to **₹25,000** with flexible daily / weekly micro-deductions. Repayment frequency aligns with the customer's income cadence (daily / weekly / on-demand).

### Clause 2.2 — Essential Expense Overdraft
**Clause 2.2** Emergency advances specifically designated for vehicle maintenance, health emergencies, or tools of trade qualify for **zero-penalty** deferred repayment plans. The customer declares the emergency purpose at application; post-use verification is done via receipt / invoice submission within 30 days.

### Clause 2.3 — Step-Up Credit Lines
**Clause 2.3** Customers with clean repayment history for **6 months** are eligible for a Step-Up credit line with a +25.0% incremental limit, capped at **₹100,000**. Each subsequent step-up requires another 6 months of clean history and is subject to a fresh volatility assessment.

### Clause 2.4 — Micro-EMI on Platform Earnings
**Clause 2.4** Customers may opt for micro-EMI auto-deduction on every platform payout, subject to a maximum **20.0%** of any single payout and a total EMI obligation not exceeding **35.0%** of trailing 30-day inflows.

### Clause 2.5 — Off-Platform Income Acceptance
**Clause 2.5** A portion of declared off-platform income (e.g., cash tips, walk-in customers) may be recognized up to **15.0%** of declared income subject to: 3 months of self-declared pattern, geo-stamping evidence (where available), and absence of contradiction in bank credits.

---

## Section 3: Affordability, FOIR, and Stress Tests

### Clause 3.1 — Segment-Adjusted FOIR
**Clause 3.1** For gig and informal segment borrowers, the Fixed Obligations to Income Ratio (FOIR) cap is **40.0%** (vs. 45.0% for salaried) to compensate for income volatility. This cap is reduced to **30.0%** for customers with volatility coefficient > 60.0%.

### Clause 3.2 — Stress-Tested Affordability
**Clause 3.2** Each application is stress-tested with a hypothetical income shock of **−30.0%** for 3 consecutive months. The customer must demonstrate a post-stress minimum monthly surplus of **₹5,000** to qualify. This guards against over-indebtedness during predictable seasonal lulls.

### Clause 3.3 — Existing Obligation Discovery
**Clause 3.3** Beyond bureau-reported obligations, the bank runs a transaction-debit scan for the prior 12 months to identify recurring outflows that look like EMIs (e.g., a fixed monthly transfer to a known lender). These are added to FOIR even if not reported to the bureau.

### Clause 3.4 — Expense Anchoring
**Clause 3.4** A minimum monthly expense anchor of **₹12,000** (for metro customers) / **₹8,000** (for non-metro) is preserved after debt servicing. The bank does not underwrite customers into a position where their residual cash after EMI is below this anchor.

---

## Section 4: Documentation & Alternative Data

### Clause 4.1 — Streamlined Documentation
**Clause 4.1** Customers in the gig / informal segment may onboard with: Aadhaar (eKYC), PAN, bank statement (PDF or digital), and a 1-minute video self-introduction. Traditional payslip / Form 16 / ITR is not required.

### Clause 4.2 — Alternative Data Signals
**Clause 4.2** The bank may consider, with explicit consent:
- Utility payment history (electricity, water, gas, broadband).
- Telecom payment history.
- Rent payment history (through Account Aggregator or lease + bank trace).
- Education and skill certifications (recognized bodies).
- Geo-stable living pattern (12 months without address changes).

Each signal is documented in the credit decision log with a positive / neutral / negative contribution.

### Clause 4.3 — Platform Partner Verification
**Clause 4.3** Where the customer is active on a partner platform (ride-share, delivery, freelancing), the bank may request platform-issued earnings certificates, ratings, and tenure data via a partner API. This data supplements but does not replace bank-traced deposits.

### Clause 4.4 — Customer Consent and Data Privacy
**Clause 4.4** Use of alternative data requires explicit, granular, revocable consent. The bank's privacy notice describes data usage, retention, and customer rights. Customers may withdraw consent at any time without losing the in-flight facility (subject to contractual obligations).

---

## Section 5: Dynamic Limits, Behavior-Based Pricing

### Clause 5.1 — Dynamic Credit Limit Adjustment
**Clause 5.1** Credit limits are recomputed **monthly** based on the trailing 90-day inflow pattern, volatility, and repayment performance. Increases require a minimum 60-day clean repayment history; decreases can happen within 24 hours of a volatility signal.

### Clause 5.2 — Reward-Grade Pricing
**Clause 5.2** Customers are mapped to reward grades G1–G6 based on a composite of income stability, repayment history, and platform ratings. APR ranges from **14.0%** (G1, most stable) to **28.0%** (G6, highest volatility). Grade transitions are announced to the customer in the monthly statement.

### Clause 5.3 — Seasonality Allowance
**Clause 5.3** Customers with predictable seasonal income (e.g., agriculture-linked, festive-period sellers, tourist-season workers) may opt for a Seasonality Allowance that pre-authorizes higher limits during peak months and lower limits during lean months, with EMI scheduling aligned to income timing.

### Clause 5.4 — Late Fee Discipline
**Clause 5.4** Late fees are capped per RBI guidelines. A first late payment within a 12-month period is forgiven. Repeat lateness triggers a structured conversation (not aggressive collection) about income-cadence alignment and possible re-scheduling.

---

## Section 6: Customer Protection and Fair Practices

### Clause 6.1 — Transparent Pricing
**Clause 6.1** All-in cost of credit (APR + fees + GST) is disclosed in the Key Fact Statement (KFS) before contract execution. Verbal explanations are available in 12 Indian languages via the helpline.

### Clause 6.2 — Right to Foreclose
**Clause 6.2** Customers may foreclose the facility at any time with **zero** foreclosure charge on micro-lines up to ₹25,000 and a proportionate (not punitive) charge on larger lines. Foreclosure is processed within **7 business days**.

### Clause 6.3 — No Hidden Cross-Sell
**Clause 6.3** Loan origination does not bundle insurance, mutual fund, or any other product. Optional add-ons are offered with explicit opt-in and easy opt-out before disbursement.

### Clause 6.4 — Cooling-Off Period
**Clause 6.4** Customers have a **3-day** cooling-off period after disbursement during which they may cancel the facility at no cost (interest charged only for the days funds were used).

### Clause 6.5 — No Discrimination
**Clause 6.5** Underwriting decisions are made on credit-relevant criteria only. The bank does not discriminate based on gender, caste, religion, region of residence, language, or platform of work.

---

## Section 7: Collection Practices Aligned to Income Cadence

### Clause 7.1 — Cadence-Aligned Collections
**Clause 7.1** Collection contact respects the customer's work schedule. Calls are scheduled outside peak working hours (avoid 6 AM–10 AM and 5 PM–9 PM for ride-share / delivery partners). Repayment options include daily, weekly, bi-weekly, and monthly frequencies.

### Clause 7.2 — Restructuring for Income Shock
**Clause 7.2** Customers experiencing a verifiable income shock (loss of platform access, vehicle breakdown, regional disruption) are eligible for restructuring under the Hardship Relief Policy (POL-HD-2026) without standard delinquency penalties.

### Clause 7.3 — No Aggressive Recovery
**Clause 7.3** The bank follows RBI's Fair Practices Code on recovery: no harassment, no calls to family / employers, no public shaming, no threatening language. Violations by recovery agents are subject to immediate termination and regulatory reporting.

---

## Section 8: Data-Driven Risk Monitoring

### Clause 8.1 — Monthly Portfolio Review
**Clause 8.1** The gig / informal segment portfolio is reviewed monthly with vintage curves, delinquency concentrations, and stress-test outcomes. Material adverse signals trigger a model recalibration and a policy review by the Credit Policy Committee.

### Clause 8.2 — Bias and Fairness Audit
**Clause 8.2** Annual bias and fairness audit of segment-specific models assesses disparate impact across gender, geography, language, and platform. Findings are remediated within 90 days.

### Clause 8.3 — Model Governance
**Clause 8.3** All cashflow-underwriting models are subject to model governance standards: monthly performance monitoring, quarterly back-testing, semi-annual independent validation, and an annual comprehensive review.

### Clause 8.4 — Customer Outcome Tracking
**Clause 8.4** Beyond repayment, the bank tracks customer outcome indicators: monthly surplus, emergency liquidity buffer, financial wellness app engagement, and self-reported well-being (in aggregate, anonymized). These inform policy refinements.

---

## Section 9: Financial Wellness and Inclusion Programs

### Clause 9.1 — In-App Financial Coach
**Clause 9.1** Customers in this segment have access to a free in-app financial coach with: budgeting tools, irregular-income planning aid, tax-saving guidance (for tax-eligible segments), and emergency-fund goal tracker.

### Clause 9.2 — Micro-Insurance Partnerships
**Clause 9.2** The bank partners with recognized insurers to offer optional micro-insurance (accident, health, equipment) at affordable premiums. Insurance is opt-in only and offered with simple claim filing.

### Clause 9.3 — Skill Development Tie-Ins
**Clause 9.3** The bank partners with recognized skilling bodies (NSDC, state skilling missions) to provide customers with optional upskilling opportunities. Successful skill completion may be considered a positive risk signal in the underwriting model.

---

## Section 10: Special Cohorts and Use-Cases

### Clause 10.1 — Women Gig Workers
**Clause 10.1** Women gig workers are eligible for: doorstep onboarding, female relationship-manager support, micro-lines up to ₹50,000 with extended step-up cadence, and access to a dedicated financial-wellness track. The bank does not require spousal consent for credit decisions for women earning independently.

### Clause 10.2 — Differently-Abled Workers
**Clause 10.2** Customers registered under the Differently-Abled category are offered: voice-only IVR, larger-font UIs, screen-reader compatibility, doorstep documentation collection, and the right to nominate a caregiver jointly on the account.

### Clause 10.3 — Migrant Workers
**Clause 10.3** Migrant workers with a verifiable employment pattern in the destination city may onboard through portable KYC. Repayment is enabled through employer-partner arrangements and UPI auto-debit.

### Clause 10.4 — Senior Citizens Continuing to Work
**Clause 10.4** Senior citizens (60+) continuing in active gig work are eligible for credit under this framework with the protections of the Senior Citizen Safeguards Clause (Clause 2.1, SOP-FR-2026).

### Clause 10.5 — Small-Kirana and Trader Segment
**Clause 10.5** Owners of small kirana / general stores with verifiable UPI collections may be underwritten based on collection patterns. Limit scaling follows a 6-month clean repayment cycle.

---

## Section 11: Governance and Reporting

### Clause 11.1 — Approval Authority
**Clause 11.1** Approval authority for gig / informal segment facilities:

| Ticket Size (₹)            | Approving Authority                |
|-----------------------------|--------------------------------------|
| Up to 25,000                | Automated Decision Engine            |
| 25,001 – 100,000            | Segment Underwriter                  |
| 100,001 – 500,000           | Segment Credit Manager               |
| 500,001 – 2,500,000         | Zonal Credit Head                    |
| Above 2,500,000             | National Inclusive Credit Committee  |

### Clause 11.2 — Quarterly Portfolio Review
**Clause 11.2** A quarterly Inclusive Credit Committee review covers portfolio health, segment penetration, customer outcome indicators, and policy refinements. Minutes are reported to the Board Risk Management Committee.

### Clause 11.3 — Annual Policy Refresh
**Clause 11.3** This policy is reviewed annually by the Inclusive Credit Policy team with inputs from FCO, Operations, and Customer Care. Material regulatory changes trigger an out-of-cycle revision.

---

## Section 12: Glossary

- **FOIR:** Fixed Obligations to Income Ratio.
- **Volatility Coefficient:** Standard deviation / mean of monthly inflows.
- **Account Aggregator (AA):** RBI-licensed entity that consolidates financial data with customer consent.
- **UPI:** Unified Payments Interface.
- **CKYC:** Central KYC Records Registry.
- **G1–G6:** Internal reward grades (G1 = most stable, G6 = highest volatility).
- **KFS:** Key Fact Statement — standard credit cost disclosure.
- **NSDC:** National Skill Development Corporation.

---

**Document Metadata:**
Version: 2026.1
Last Updated: 2026-01-01
Owner: Head — Inclusive Credit Policy & New-Segment Underwriting
Approved By: Board Risk Management Committee
Next Review Due: 2026-12-31
Classification: Internal — Confidential