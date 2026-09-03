@echo off
echo ========================================================
echo AI Financial Safety Platform - Complete Startup Script
echo ========================================================
echo.

echo [1/4] Installing ML and Backend Dependencies...
pip install fastapi uvicorn pydantic joblib scikit-learn pandas
pip install -r backend/requirements.txt

echo.
echo [2/4] Starting ML Inference Service (Port 8001)...
start "ML Inference API" cmd /c "python -m uvicorn ml_research.services.predict_api:app --host 0.0.0.0 --port 8001"

echo.
echo [3/4] Starting Core Backend Service (Port 8000)...
start "Backend API (LangGraph + RAG)" cmd /c "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo [4/4] Starting Next.js Frontend (Port 3000)...
start "Frontend UI" cmd /c "cd frontend && npm install && npm run dev"

echo.
echo ========================================================
echo ALL SERVICES ARE STARTING!
echo ========================================================
echo [API] ML Backend:     http://localhost:8001/docs
echo [API] Core Backend:   http://localhost:8000/docs
echo [UI]  Customer UI:    http://localhost:3000/copilot
echo [UI]  Officer UI:     http://localhost:3000/audit
echo [UI]  Triage Queue:   http://localhost:3000/triage
echo ========================================================
pause
