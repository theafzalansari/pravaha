from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PRAVAHA API")

# Allow the React/Vite frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "PRAVAHA Backend",
    }


@app.get("/api/dashboard")
def dashboard():
    return {
        "total_crowd": 178,
        "average_density": 59,
        "active_alerts": 3,
        "prediction": "Rising",
        "zones": [
            {
                "name": "Zone A",
                "people": 42,
                "occupancy": 42,
                "risk": "SAFE",
                "prediction": "Stable",
                "action": "Continue normal monitoring",
            },
            {
                "name": "Zone B",
                "people": 78,
                "occupancy": 78,
                "risk": "HIGH",
                "prediction": "Congestion Likely",
                "action": "Redirect incoming flow + deploy personnel",
            },
            {
                "name": "Zone C",
                "people": 58,
                "occupancy": 58,
                "risk": "WARNING",
                "prediction": "Crowd Rising",
                "action": "Monitor closely",
            },
        ],
    }