@echo off
ECHO [INFO] Setup started. This may take a few minutes...

REM Check if python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Python is not installed or not in PATH. Please install Python 3.9+ and try again.
    pause
    EXIT /B 1
)

REM Create a virtual environment if it doesn't exist
IF NOT EXIST .venv (
    ECHO [INFO] Creating Python virtual environment...
    python -m venv .venv
)

REM Activate the virtual environment
ECHO [INFO] Activating virtual environment...
CALL .\.venv\Scripts\activate

REM Upgrade pip
ECHO [INFO] Upgrading pip...
python.exe -m pip install --upgrade pip

REM Install dependencies
ECHO [INFO] Installing required Python packages...
pip install -r requirements.txt || (
    ECHO.
    ECHO [ERROR] Failed to install Python packages. Please check the errors above.
    pause
    EXIT /B 1
)

ECHO.
ECHO [SUCCESS] Setup complete.
ECHO [ACTION] Starting the backend server at http://localhost:8000
ECHO [INFO] Press CTRL+C in this window to stop the server.
ECHO.

REM Run the FastAPI server
uvicorn src.model.api_service:app --host 0.0.0.0 --port 8000

deactivate
ECHO [INFO] Server stopped.
pause
