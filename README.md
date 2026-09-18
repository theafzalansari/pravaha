# PRAVAHA — AI Crowd Intelligence & Emergency Management

> Observe. Predict. Prevent. Protect.

**PRAVAHA** is an AI-powered crowd intelligence and emergency management prototype designed for safer large gatherings such as Kumbh Mela.

It transforms passive CCTV surveillance into actionable intelligence by detecting people, tracking movement, monitoring configurable zones, assessing crowd risk, predicting congestion trends, generating alerts, and supporting emergency reporting through IVR.

---

## 📌 Problem

Large religious and public gatherings present significant safety challenges:

- **Rapid Crowd Congestion**: Sudden influxes of pilgrims at riverbanks, bottlenecks, and temple corridors.
- **Overcrowding & Stampede Risk**: High localized crowd density that degrades movement capacity.
- **Delayed Response Times**: Difficulty for authorities in identifying emerging bottlenecks manually.
- **Fragmented Monitoring**: Inability to monitor multiple high-risk sectors simultaneously in real-time.
- **Communication Barriers**: Slow emergency reporting by attendees during chaotic situations.

Traditional crowd management relies on reactive surveillance:

$$\text{Observe} \longrightarrow \text{React}$$

PRAVAHA transitions crowd safety operations to proactive intelligence:

$$\text{Observe} \longrightarrow \text{Analyze} \longrightarrow \text{Predict} \longrightarrow \text{Alert} \longrightarrow \text{Act}$$

---

## ✨ Key Features

### 🔍 AI Crowd Detection
Leverages a pretrained **YOLOv8n** deep learning model for real-time person detection from video/CCTV feeds.

### 🎯 People Tracking
Integrates **ByteTrack** multi-object tracking to maintain person identities across video frames and handle occlusions in dense crowd scenes.

### 🗺️ Zone Intelligence
Divides monitored sectors into configurable spatial zones (**Zone A: Ramkund Ghats**, **Zone B: Kalaram Temple**, **Zone C: Tapovan Entry**).

### 📊 Crowd Density & Flow
Calculates real-time headcounts, spatial occupancy percentages, and directional movement vectors per zone.

### ⚠️ Risk Engine
Dynamically classifies monitored zones into four prioritized risk states:
- **SAFE**: Optimal crowd flow (<40% occupancy)
- **WARNING**: Moderate crowd density (40%–65% occupancy)
- **HIGH**: Rising congestion (65%–85% occupancy)
- **CRITICAL**: Extreme bottleneck / stampede risk (>85% occupancy)

### 📈 Congestion Prediction
Analyzes crowd occupancy trends and movement velocity to forecast rising risk states before critical thresholds are breached.

### 🚨 Real-Time Alerts
Automatically generates prioritized incident alerts for high-risk zones, notifying command center operators immediately.

### 📋 Action Recommendations
Provides operational crowd-management directives based on current risk levels, such as deploying diversion barricades, opening secondary bypass lanes, or restricting sector entry.

### 📍 Geographic Intelligence
Integrates interactive **Leaflet + OpenStreetMap** GIS visualization centered on Panchavati, Nashik, displaying live spatial risk overlays.

### ☎️ Emergency IVR (Dual Path)
Demonstrates two interactive emergency communication channels:
1. **Standard Emergency IVR (`0204-8565-937` DEMO)**: Guided multi-step intake (Language Selection → Incident Type → Zone Selection → Authority Alert).
2. **Extreme Emergency IVR (`0951-3886-363` DEMO)**: Rapid 1-key reporting designed for life-threatening situations where seconds matter.

> *Note: The hackathon presentation demonstrates interactive frontend simulations of these IVR flows. Live telephony integration is not required for the prototype.*

---

## 🏗️ System Architecture

```text
CCTV / VIDEO FEED
       │
       ▼
YOLOv8n PERSON DETECTION
       │
       ▼
BYTETRACK TRACKING
       │
       ▼
CROWD ANALYTICS
Count • Density • Flow • Trend
       │
       ▼
RISK ENGINE
       │
       ▼
CONGESTION PREDICTION
       │
       ▼
ALERT / INCIDENT ENGINE ◄──────────┐
       │                          │
       ▼                          │ Emergency Intake
PRAVAHA AUTHORITY DASHBOARD       │ Path
       │                          │
       ▼                          │
ACTION RECOMMENDATION             │
                                  │
STANDARD IVR / EXTREME IVR ───────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Status / Usage |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript | Implemented |
| **Styling** | Vanilla CSS, Design Tokens | Implemented |
| **Icons** | Lucide React | Implemented |
| **Maps** | Leaflet, React-Leaflet | Implemented |
| **Map Data** | OpenStreetMap | Implemented |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | Implemented |
| **Computer Vision** | OpenCV, PyTorch | Implemented |
| **Object Detection** | Pretrained YOLOv8n (`yolov8n.pt`) | Implemented |
| **Tracking** | ByteTrack | Implemented |
| **Charts** | Recharts | Implemented |
| **Database** | PostgreSQL | *Planned Architecture* |
| **Realtime Push** | FastAPI WebSockets | *Planned Architecture* |
| **IVR Integration** | Exotel Telephony API | *Planned Architecture* |
| **Version Control** | Git, GitHub | Implemented |

---

## 📁 Project Structure

```text
Pravaha/
├── ai/
│   ├── crowd.py
│   └── requirements.txt
│
├── backend/
│   ├── main.py
│   ├── test_backend.py
│   └── uvicorn.log
│
├── data/
│   └── videos/
│       ├── input.mp4
│       ├── output.mp4
│       ├── tracking.mp4
│       └── zones.mp4
│
├── frontend/
│   ├── public/
│   │   └── zones_web.mp4
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   ├── InteractiveFlowModal.tsx
│   │   │   ├── PravahaLogo.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── data/
│   │   │   └── demoData.ts
│   │   ├── pages/
│   │   │   ├── Alerts.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── CrowdMap.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EmergencyIVR.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── LiveCameras.tsx
│   │   │   └── Settings.tsx
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── ivr/
│   └── .gitkeep
│
├── yolov8n.pt
└── README.md
```

---

## 💻 Application Modules

1. **Home (`/`)**: Public-facing product overview page featuring a sticky navbar, Panchavati GIS map preview, system capabilities, pipeline breakdown, and IVR cards.
2. **Dashboard**: Authority command center displaying overall headcount, average density, active alerts, AI predictions, live crowd feed, Panchavati sector map, and recent alerts.
3. **Crowd Map**: Dedicated interactive GIS monitoring view centered on Panchavati, Nashik, with sector selection, interactive zone circles, and detailed metrics.
4. **Live Cameras**: Optical feed monitoring displaying AI bounding boxes, ByteTrack IDs, camera controls, HUD stats, and expandable video feeds.
5. **Alerts**: Incident management center filtering active and resolved alerts by severity (**CRITICAL**, **HIGH**, **WARNING**, **SAFE**).
6. **Emergency IVR**: Interactive reporting module demonstrating both **Standard IVR** and **Extreme Emergency IVR** workflow simulations.
7. **Analytics**: System telemetry analytics including crowd trends over time, risk classification distribution, and operational insights.
8. **Settings**: Configuration control panel and **Demo Mode** selector.

---

## 🎮 Demo Mode

To allow judges to evaluate how PRAVAHA handles different risk conditions safely during presentations, the prototype includes a global **Demo Mode** toggle:

- **NORMAL**: Crowd density is low (~41%), all zones are **SAFE**, 0 active alerts.
- **RISING**: Occupancy increases (~62%), **Zone A** transitions to **WARNING**.
- **HIGH**: Congestion rises (~78%), **Zone B** transitions to **HIGH** risk.
- **CRITICAL**: Stampede risk threshold (~91%), **Zone B** / **Zone C** escalate to **CRITICAL**.

> *Note: The underlying computer vision layer runs actual YOLOv8n detection and ByteTrack tracking on video feeds. The Demo Mode toggle provides controlled simulation of risk state transitions for consistent authority workflow evaluation.*

---

## 🔬 AI Model Note

For the prototype demonstration, PRAVAHA uses a **pretrained YOLOv8n** model for base person detection. The primary AI engineering developed for this prototype includes:

- Multi-object trajectory tracking via ByteTrack
- Spatial zone polygon/circle intersection logic
- Zone-wise headcounts and occupancy density calculations
- Multi-tier risk classification logic
- Congestion trend analysis
- Automated action recommendation generation

*YOLOv8n is used out-of-the-box as the detection foundation and was not custom-trained for this hackathon prototype.*

---

## 🚀 Run Locally

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: `http://localhost:5173`

### 3. Backend Setup

From the repository root (`D:\Hackathon\Pravaha`):

```bash
.\ai\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

The backend API will start at: `http://localhost:8000`

---

## 🎬 Presentation Demo Flow

1. **Open Landing Page**: Start at `http://localhost:5173` (Home page). Explore the Panchavati map visual, pipeline overview, and IVR channels.
2. **Launch Command Center**: Click **[ GET STARTED → ]** to transition to the Dashboard.
3. **Inspect Command Center**: Review live metrics, AI live crowd feed (CAM-01), and Panchavati sector status.
4. **Evaluate Demo Modes**: Switch Demo Mode from `NORMAL` → `RISING` → `HIGH` → `CRITICAL` in the Topbar to observe real-time telemetry updates.
5. **Explore Crowd Map**: Navigate to **Crowd Map** tab. Click on Zone A, B, or C to inspect sector details, estimated headcount, and recommended actions.
6. **View AI Detection Video**: Open **Live Cameras** tab to demonstrate YOLOv8 person detection boxes and ByteTrack IDs.
7. **Inspect Alerts**: Open **Alerts** tab to view generated priority alerts and recommended responses.
8. **Demonstrate IVR**: Open **Emergency IVR** tab. Click **Test Standard IVR Flow** or **Test Extreme Emergency IVR Flow** to launch interactive step-by-step reporting modals.
9. **Review Analytics**: Open **Analytics** tab to examine crowd trend graphs and risk distribution charts.

---

## 🎨 Visual Identity

PRAVAHA features a custom visual identity combining modern AI command-center aesthetics with Indian heritage-inspired design tokens:

- **Color Palette**: Warm Ivory (`#f7f5f0`), Antique Gold (`#c88732`), Muted Saffron, Deep Charcoal (`#181614`), Controlled Red/Amber/Green.
- **Theme Support**: Seamless toggle between Light Command Center mode and Dark Command Center mode.
- **Typography**: Clean hierarchy with geometric section kickers and tracking labels.

---

## ⚠️ Disclaimer & Map Attribution

- **Prototype Disclaimer**: *PRAVAHA monitoring zones displayed on the map are configurable prototype zones for demonstration purposes and do not represent official administrative boundaries.*
- **Map Data Attribution**: Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

---

## ⚡ Current Prototype Limitations

- **Single Feed Demo**: Demonstrates processing on one main camera feed for prototype constraints; multi-camera ingestion can be extended with edge compute.
- **Pretrained Detection**: Uses pretrained YOLOv8n rather than a domain-adapted crowd dataset.
- **Lightweight Prediction**: Congestion prediction uses trend-based heuristics.
- **IVR Simulation**: IVR emergency channels are demonstrated via interactive frontend flows without live PSTN/SIP telephony lines during the hackathon.
- **Production Readiness**: Production deployment would require validated crowd datasets, scalable cloud/edge infrastructure, security audits, and field testing.

---

## 🔮 Future Scope

- **Multi-Camera Processing**: Edge-node deployment across dozens of simultaneous IP camera streams.
- **Custom Model Fine-Tuning**: Fine-tuning YOLOv8/v9 on dense pilgrimage crowd datasets (e.g., Kumbh Mela archives).
- **Advanced Forecast Models**: LSTM/Graph Neural Network models for dynamic crowd density prediction.
- **Missing Person Assistance**: Facial feature matching for missing person reports.
- **IoT & Drone Integration**: Ingesting aerial footage from surveillance drones.
- **Automated Dispatch**: Direct Webhook/SMS integration with police and medical dispatch systems.

---

## 🏆 Hackathon Context

- **Hackathon**: TechFusion Hackathon
- **Theme**: Kumbh Mela Innovation
- **Problem Statement**: AI-Based Crowd Management & Safety
- **Team**: PRAVAHA
- **Institution**: MET's Bhujbal Knowledge City, Institute of Engineering, Nashik

---

## 👥 Team Members

- **Afzal Ansari**
- **Riya Jaware**
- **Pooja Gaikwad**
- **Atharva Khandekar**

---

