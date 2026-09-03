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
    # langgraph exposes `ainvoke` and `get_graph()` (which returns a DrawableGraph
    # with .nodes / .edges). The drawable graph includes 2 synthetic nodes
    # (__start__, __end__) on top of the 10 real workflow nodes.
    assert hasattr(g, "ainvoke")
    assert hasattr(g, "get_graph")
    graph_view = g.get_graph()
    real_node_count = sum(
        1 for n in graph_view.nodes.values() if not n.id.startswith("__")
    )
    assert real_node_count == 10, f"expected 10 real nodes, got {real_node_count}"
    # The drawable graph should also have an edges collection
    assert hasattr(graph_view, "edges") or hasattr(graph_view, "_edges")


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