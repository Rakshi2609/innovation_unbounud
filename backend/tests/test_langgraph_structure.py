"""Tests the structure of the LangGraph orchestrator (not just its behaviour)."""
import pytest
from app.rag.store import FinancialPolicyStore
from app.rag.reranker import CrossEncoderReranker
from app.rag.graph import FinancialReasoningGraph


@pytest.fixture
def graph():
    """Build a FinancialReasoningGraph with the real policy store."""
    store = FinancialPolicyStore()
    store.index_directory("data/policies")
    return FinancialReasoningGraph(policy_store=store)


def test_graph_has_all_ten_nodes(graph):
    """The orchestrator exposes 10 distinct node identifiers."""
    expected = [
        "validate_input", "load_context", "evaluate_risk",
        "create_policy_queries", "rag_retrieval", "evidence_validation",
        "llm_reasoning", "generate_recommendations", "safety_guardrails",
        "route_to_human_review",
    ]
    assert graph.get_node_names() == expected
    assert len(graph.get_node_names()) == 10


def test_compiled_graph_is_langgraph(graph):
    """The compiled object is a real langgraph Pregel graph, not a plain class."""
    g = graph.get_compiled_graph()
    # langgraph exposes `nodes`, `edges`, and `.ainvoke`
    assert hasattr(g, "ainvoke")
    assert hasattr(g, "nodes")
    assert hasattr(g, "edges")
    assert len(g.nodes) == 10


def test_safety_conditional_routes_to_route_when_passed(graph):
    """Safety check passed → continue to human review."""
    state = {"safety_check_passed": True}
    assert graph._after_safety(state) == "continue"


def test_safety_conditional_retries_evidence_when_failed(graph):
    """Safety check failed → retry evidence validation."""
    state = {"safety_check_passed": False}
    assert graph._after_safety(state) == "retry_evidence"


def test_safety_conditional_defaults_to_continue(graph):
    """Missing safety flag should default to continue (defensive)."""
    state = {}
    assert graph._after_safety(state) == "continue"