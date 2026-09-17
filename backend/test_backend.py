import subprocess
import time
import requests
import sys

print("Starting Uvicorn process...")
proc = subprocess.Popen(
    [
        r"d:\Hackathon\Pravaha\ai\.venv\Scripts\python.exe",
        "-m", "uvicorn",
        "main:app",
        "--host", "127.0.0.1",
        "--port", "8000"
    ],
    cwd=r"d:\Hackathon\Pravaha\backend"
)

try:
    print("Waiting 2 seconds for server startup...")
    time.sleep(2)

    no_proxy = {"http": None, "https": None}
    
    print("\n--- Testing GET / ---")
    r1 = requests.get("http://127.0.0.1:8000/", proxies=no_proxy, timeout=5)
    print("STATUS:", r1.status_code)
    print("RESPONSE:", r1.json())

    print("\n--- Testing GET /api/dashboard ---")
    r2 = requests.get("http://127.0.0.1:8000/api/dashboard", proxies=no_proxy, timeout=5)
    print("STATUS:", r2.status_code)
    print("RESPONSE:", r2.json())

    print("\nVERIFICATION COMPLETE! KEEPING SERVER ALIVE.")

finally:
    pass
