import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from app.realtime.bus import event_bus
from app.realtime.websocket import ws_manager

router = APIRouter(tags=["realtime"])

@router.websocket("/api/v1/ws/cases")
async def websocket_cases_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep-alive loop
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

@router.get("/api/v1/events/stream")
async def events_sse_stream():
    queue = event_bus.subscribe()
    async def sse_generator():
        try:
            # Send initial recent events
            for evt in event_bus.get_recent_events(limit=10):
                yield f"data: {json.dumps(evt.model_dump())}\n\n"

            while True:
                evt = await queue.get()
                yield f"data: {json.dumps(evt.model_dump())}\n\n"
        except asyncio.CancelledError:
            event_bus.unsubscribe(queue)
        finally:
            event_bus.unsubscribe(queue)

    return StreamingResponse(sse_generator(), media_type="text/event-stream")
