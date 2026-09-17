import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  AlertTriangle,
  Bell,
  Camera,
  ChevronRight,
  CircleAlert,
  FileText,
  Gauge,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Map,
  Phone,
  Radio,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

type DemoMode = "NORMAL" | "RISING" | "HIGH" | "CRITICAL";

const ZONE_LOCATIONS: Record<
  string,
  { lat: number; lng: number; radius: number; description: string }
> = {
  "Zone A": {
    lat: 20.0095,
    lng: 73.7905,
    radius: 230,
    description: "Ramkund Ghats",
  },
  "Zone B": {
    lat: 20.0075,
    lng: 73.797,
    radius: 270,
    description: "Kalaram Temple",
  },
  "Zone C": {
    lat: 20.0032,
    lng: 73.7935,
    radius: 250,
    description: "Tapovan Entry",
  },
};

const getZoneHexColor = (risk: string) => {
  const r = (risk || "").toUpperCase();
  if (r === "CRITICAL") return "#c94b3d";
  if (r === "HIGH") return "#d87535";
  if (r === "WARNING" || r === "RISING") return "#c79528";
  return "#3d9560";
};


interface Zone {
  name: string;
  people: number;
  occupancy?: number;
  risk: string;
  color?: string;
  prediction: string;
  action: string;
}

interface DashboardScenario {
  total_crowd: number;
  average_density: number;
  active_alerts: number;
  prediction: string;
  latest_alert_title: string;
  latest_alert_desc: string;
  recommendation: string;
  alert_risk: string;
  alert_color: string;
  zones: Zone[];
}

const DEMO_SCENARIOS: Record<DemoMode, DashboardScenario> = {
  NORMAL: {
    total_crowd: 122,
    average_density: 41,
    active_alerts: 0,
    prediction: "Stable",
    latest_alert_title: "All zones operational",
    latest_alert_desc: "No active crowd congestion detected.",
    recommendation: "Continue normal monitoring",
    alert_risk: "SAFE",
    alert_color: "safe",
    zones: [
      {
        name: "Zone A",
        people: 42,
        occupancy: 42,
        risk: "SAFE",
        color: "safe",
        prediction: "Stable",
        action: "Continue normal monitoring",
      },
      {
        name: "Zone B",
        people: 42,
        occupancy: 42,
        risk: "SAFE",
        color: "safe",
        prediction: "Stable",
        action: "Continue normal monitoring",
      },
      {
        name: "Zone C",
        people: 38,
        occupancy: 38,
        risk: "SAFE",
        color: "safe",
        prediction: "Stable",
        action: "Continue normal monitoring",
      },
    ],
  },
  RISING: {
    total_crowd: 168,
    average_density: 56,
    active_alerts: 1,
    prediction: "Congestion Likely",
    latest_alert_title: "Zone B & C crowd rising",
    latest_alert_desc: "Crowd density increasing in Zone B and C.",
    recommendation: "Monitor closely",
    alert_risk: "WARNING",
    alert_color: "warning",
    zones: [
      {
        name: "Zone A",
        people: 48,
        occupancy: 48,
        risk: "SAFE",
        color: "safe",
        prediction: "Stable",
        action: "Continue normal monitoring",
      },
      {
        name: "Zone B",
        people: 68,
        occupancy: 68,
        risk: "WARNING",
        color: "warning",
        prediction: "Crowd Rising",
        action: "Monitor closely",
      },
      {
        name: "Zone C",
        people: 52,
        occupancy: 52,
        risk: "WARNING",
        color: "warning",
        prediction: "Crowd Rising",
        action: "Monitor closely",
      },
    ],
  },
  HIGH: {
    total_crowd: 191,
    average_density: 64,
    active_alerts: 2,
    prediction: "Rising",
    latest_alert_title: "Zone B high congestion",
    latest_alert_desc: "High crowd density detected in Zone B.",
    recommendation: "Redirect incoming flow + deploy personnel",
    alert_risk: "HIGH",
    alert_color: "high",
    zones: [
      {
        name: "Zone A",
        people: 52,
        occupancy: 52,
        risk: "WARNING",
        color: "warning",
        prediction: "Crowd Rising",
        action: "Monitor closely",
      },
      {
        name: "Zone B",
        people: 78,
        occupancy: 78,
        risk: "HIGH",
        color: "high",
        prediction: "Congestion Likely",
        action: "Redirect incoming flow + deploy personnel",
      },
      {
        name: "Zone C",
        people: 61,
        occupancy: 61,
        risk: "WARNING",
        color: "warning",
        prediction: "Crowd Rising",
        action: "Monitor closely",
      },
    ],
  },
  CRITICAL: {
    total_crowd: 212,
    average_density: 71,
    active_alerts: 3,
    prediction: "Critical",
    latest_alert_title: "Zone B critical overload",
    latest_alert_desc: "Stampede risk in Zone B. Immediate action required!",
    recommendation: "Restrict entry + Redirect flow + Deploy personnel",
    alert_risk: "CRITICAL",
    alert_color: "critical",
    zones: [
      {
        name: "Zone A",
        people: 55,
        occupancy: 55,
        risk: "WARNING",
        color: "warning",
        prediction: "Crowd Rising",
        action: "Monitor closely",
      },
      {
        name: "Zone B",
        people: 92,
        occupancy: 92,
        risk: "CRITICAL",
        color: "critical",
        prediction: "Stampede Risk",
        action: "Restrict entry + Redirect flow + Deploy personnel",
      },
      {
        name: "Zone C",
        people: 65,
        occupancy: 65,
        risk: "HIGH",
        color: "high",
        prediction: "Congestion Likely",
        action: "Redirect incoming flow + deploy personnel",
      },
    ],
  },
};

const ANALYTICS_TRENDS: Record<
  DemoMode,
  Array<{ time: string; zoneA: number; zoneB: number; zoneC: number }>
> = {
  NORMAL: [
    { time: "10:00", zoneA: 32, zoneB: 35, zoneC: 30 },
    { time: "10:10", zoneA: 35, zoneB: 38, zoneC: 32 },
    { time: "10:20", zoneA: 38, zoneB: 40, zoneC: 35 },
    { time: "10:30", zoneA: 40, zoneB: 42, zoneC: 36 },
    { time: "10:40", zoneA: 41, zoneB: 42, zoneC: 37 },
    { time: "10:50", zoneA: 42, zoneB: 42, zoneC: 38 },
  ],
  RISING: [
    { time: "10:00", zoneA: 35, zoneB: 42, zoneC: 34 },
    { time: "10:10", zoneA: 38, zoneB: 48, zoneC: 38 },
    { time: "10:20", zoneA: 40, zoneB: 54, zoneC: 42 },
    { time: "10:30", zoneA: 43, zoneB: 60, zoneC: 46 },
    { time: "10:40", zoneA: 45, zoneB: 64, zoneC: 49 },
    { time: "10:50", zoneA: 48, zoneB: 68, zoneC: 52 },
  ],
  HIGH: [
    { time: "10:00", zoneA: 38, zoneB: 45, zoneC: 32 },
    { time: "10:10", zoneA: 40, zoneB: 51, zoneC: 35 },
    { time: "10:20", zoneA: 43, zoneB: 58, zoneC: 39 },
    { time: "10:30", zoneA: 46, zoneB: 65, zoneC: 45 },
    { time: "10:40", zoneA: 48, zoneB: 72, zoneC: 52 },
    { time: "10:50", zoneA: 52, zoneB: 78, zoneC: 61 },
  ],
  CRITICAL: [
    { time: "10:00", zoneA: 42, zoneB: 55, zoneC: 38 },
    { time: "10:10", zoneA: 45, zoneB: 68, zoneC: 44 },
    { time: "10:20", zoneA: 48, zoneB: 76, zoneC: 50 },
    { time: "10:30", zoneA: 50, zoneB: 84, zoneC: 55 },
    { time: "10:40", zoneA: 53, zoneB: 89, zoneC: 60 },
    { time: "10:50", zoneA: 55, zoneB: 92, zoneC: 65 },
  ],
};

const INSIGHTS: Record<DemoMode, string> = {
  NORMAL: "All monitored zones are within safe operating levels.",
  RISING: "Zone B occupancy is increasing. Monitor incoming flow.",
  HIGH: "Zone B is at high occupancy. Congestion is likely.",
  CRITICAL: "Zone B has reached critical occupancy. Restrict entry and redirect flow.",
};

interface AlertItem {
  id: string;
  risk: "CRITICAL" | "HIGH" | "WARNING" | "SAFE" | "RESOLVED";
  color: "critical" | "high" | "warning" | "safe";
  zone: "Zone A" | "Zone B" | "Zone C";
  time: string;
  title: string;
  description: string;
  occupancy: number;
  prediction?: string;
  action: string;
  status: "ACTIVE" | "RESOLVED";
}

const DEMO_ALERTS: Record<DemoMode, AlertItem[]> = {
  CRITICAL: [
    {
      id: "alt-1",
      risk: "CRITICAL",
      color: "critical",
      zone: "Zone B",
      time: "10:52 AM",
      title: "Stampede Risk & Critical Overload",
      description: "Crowd occupancy reached critical level in Zone B. Immediate intervention required!",
      occupancy: 92,
      prediction: "Critical",
      action: "Restrict entry + Redirect flow + Deploy personnel",
      status: "ACTIVE",
    },
    {
      id: "alt-2",
      risk: "HIGH",
      color: "high",
      zone: "Zone C",
      time: "10:48 AM",
      title: "Heavy Entry Flow Bottleneck",
      description: "Tapovan Entry approach corridor experiencing severe slowdown.",
      occupancy: 65,
      prediction: "Rising",
      action: "Redirect incoming flow + deploy personnel",
      status: "ACTIVE",
    },
    {
      id: "alt-3",
      risk: "WARNING",
      color: "warning",
      zone: "Zone A",
      time: "10:40 AM",
      title: "Elevated Crowd Density",
      description: "Ramkund Ghats Sector A density approaching warning threshold.",
      occupancy: 55,
      prediction: "Crowd Rising",
      action: "Monitor closely",
      status: "ACTIVE",
    },
    {
      id: "alt-4",
      risk: "RESOLVED",
      color: "safe",
      zone: "Zone A",
      time: "10:15 AM",
      title: "Ghat Gate Clearance",
      description: "Temporary congestion resolved following gate opening.",
      occupancy: 42,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "RESOLVED",
    },
  ],
  HIGH: [
    {
      id: "alt-1",
      risk: "HIGH",
      color: "high",
      zone: "Zone B",
      time: "10:48 AM",
      title: "Crowd Density Increasing Rapidly",
      description: "High crowd density detected in Zone B (Kalaram Temple Sector).",
      occupancy: 78,
      prediction: "Congestion Likely",
      action: "Redirect incoming flow + deploy personnel",
      status: "ACTIVE",
    },
    {
      id: "alt-2",
      risk: "WARNING",
      color: "warning",
      zone: "Zone C",
      time: "10:42 AM",
      title: "Approach Route Slowdown",
      description: "Zone C occupancy rising as pilgrims divert from main bridge.",
      occupancy: 61,
      prediction: "Crowd Rising",
      action: "Monitor closely",
      status: "ACTIVE",
    },
    {
      id: "alt-3",
      risk: "WARNING",
      color: "warning",
      zone: "Zone A",
      time: "10:35 AM",
      title: "Moderate Crowd Accumulation",
      description: "Ramkund sector experiencing steady crowd buildup.",
      occupancy: 52,
      prediction: "Crowd Rising",
      action: "Monitor closely",
      status: "ACTIVE",
    },
    {
      id: "alt-4",
      risk: "RESOLVED",
      color: "safe",
      zone: "Zone B",
      time: "09:50 AM",
      title: "Morning Queue Clearance",
      description: "Temple courtyard queue cleared smoothly.",
      occupancy: 45,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "RESOLVED",
    },
  ],
  RISING: [
    {
      id: "alt-1",
      risk: "WARNING",
      color: "warning",
      zone: "Zone B",
      time: "10:45 AM",
      title: "Crowd Level Requires Monitoring",
      description: "Occupancy in Zone B rising steadily above baseline.",
      occupancy: 68,
      prediction: "Crowd Rising",
      action: "Monitor closely",
      status: "ACTIVE",
    },
    {
      id: "alt-2",
      risk: "WARNING",
      color: "warning",
      zone: "Zone C",
      time: "10:38 AM",
      title: "Entry Sector Inflow Increase",
      description: "Inflow from Tapovan bridge sector increasing.",
      occupancy: 52,
      prediction: "Crowd Rising",
      action: "Monitor closely",
      status: "ACTIVE",
    },
    {
      id: "alt-3",
      risk: "SAFE",
      color: "safe",
      zone: "Zone A",
      time: "10:20 AM",
      title: "Zone A Stable Capacity",
      description: "Ramkund Ghats operating within safe parameters.",
      occupancy: 48,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "ACTIVE",
    },
    {
      id: "alt-4",
      risk: "RESOLVED",
      color: "safe",
      zone: "Zone C",
      time: "09:30 AM",
      title: "Bridge Flow Regularized",
      description: "Flow rate on Tapovan entry bridge normalized.",
      occupancy: 38,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "RESOLVED",
    },
  ],
  NORMAL: [
    {
      id: "alt-1",
      risk: "SAFE",
      color: "safe",
      zone: "Zone A",
      time: "10:45 AM",
      title: "Zone A Normal Operations",
      description: "Zone operating within safe capacity at Ramkund Ghats.",
      occupancy: 42,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "ACTIVE",
    },
    {
      id: "alt-2",
      risk: "SAFE",
      color: "safe",
      zone: "Zone B",
      time: "10:40 AM",
      title: "Zone B Normal Operations",
      description: "Kalaram Temple Sector operating comfortably below capacity.",
      occupancy: 42,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "ACTIVE",
    },
    {
      id: "alt-3",
      risk: "SAFE",
      color: "safe",
      zone: "Zone C",
      time: "10:30 AM",
      title: "Zone C Normal Operations",
      description: "Tapovan Entry sector flow smooth and unrestricted.",
      occupancy: 38,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "ACTIVE",
    },
    {
      id: "alt-4",
      risk: "RESOLVED",
      color: "safe",
      zone: "Zone B",
      time: "09:15 AM",
      title: "Morning Routine Check",
      description: "All automated detection cameras calibrated and operational.",
      occupancy: 35,
      prediction: "Stable",
      action: "Continue normal monitoring",
      status: "RESOLVED",
    },
  ],
};

function App() {
  const [demoMode, setDemoMode] = useState<DemoMode>("HIGH");
  const [selectedZone, setSelectedZone] = useState("Zone B");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ivr" | "analytics" | "cameras" | "crowd-map" | "alerts"
  >("dashboard");
  const [alertFilter, setAlertFilter] = useState<
    "All" | "Critical" | "High" | "Warning" | "Resolved"
  >("All");
  const [selectedFlowModal, setSelectedFlowModal] = useState<"standard" | "extreme" | null>(null);
  const [, setApiData] = useState<any | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setApiData(data);
      })
      .catch((err) => console.error("API fetch error:", err));
  }, []);

  const scenario = DEMO_SCENARIOS[demoMode];
  const zones = scenario.zones;
  const selected =
    zones.find((zone) => zone.name === selectedZone) || zones[0];
  const getZone = (name: string) =>
    zones.find((z) => z.name === name) || zones[0];

  const alertsList = DEMO_ALERTS[demoMode] || [];
  const criticalCount = alertsList.filter((a) => a.risk === "CRITICAL").length;
  const highCount = alertsList.filter((a) => a.risk === "HIGH").length;
  const activeCount = alertsList.filter((a) => a.status === "ACTIVE").length;

  const filteredAlerts = alertsList.filter((alert) => {
    if (alertFilter === "All") return true;
    if (alertFilter === "Critical") return alert.risk === "CRITICAL";
    if (alertFilter === "High") return alert.risk === "HIGH";
    if (alertFilter === "Warning") return alert.risk === "WARNING";
    if (alertFilter === "Resolved") return alert.status === "RESOLVED" || alert.risk === "RESOLVED";
    return true;
  });

  return (
    <div className="app">
      {/* Decorative background */}
      <div className="flow flow-one" />
      <div className="flow flow-two" />

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol">
            <Waves size={25} />
          </div>

          <div>
            <h1>PRAVAHA</h1>
            <span>AI CROWD INTELLIGENCE</span>
          </div>
        </div>

        <div className="culture-line" />

        <nav>
          <p className="nav-label">COMMAND CENTER</p>

          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`nav-item ${activeTab === "crowd-map" ? "active" : ""}`}
            onClick={() => setActiveTab("crowd-map")}
          >
            <Map size={18} />
            Crowd Map
          </button>

          <button
            className={`nav-item ${activeTab === "cameras" ? "active" : ""}`}
            onClick={() => setActiveTab("cameras")}
          >
            <Camera size={18} />
            Live Cameras
          </button>

          <button
            className={`nav-item ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            <Bell size={18} />
            Alerts
            <span className="alert-count">{scenario.active_alerts}</span>
          </button>

          <button
            className={`nav-item ${activeTab === "ivr" ? "active" : ""}`}
            onClick={() => setActiveTab("ivr")}
          >
            <Radio size={18} />
            Emergency IVR
          </button>

          <p className="nav-label second">SYSTEM</p>

          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <Activity size={18} />
            Analytics
          </button>

          <button
            className="nav-item"
            onClick={() => setActiveTab("dashboard")}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />

            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>

          <div className="om-symbol">ॐ</div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="main">
        {/* TOP BAR */}

        <header className="topbar">
          <div>
            <p className="eyebrow">KUMBH MELA • AUTHORITY VIEW</p>
            <h2>
              {activeTab === "ivr"
                ? "Emergency IVR"
                : activeTab === "analytics"
                ? "Analytics"
                : activeTab === "cameras"
                ? "Live Cameras"
                : activeTab === "crowd-map"
                ? "Crowd Map"
                : activeTab === "alerts"
                ? "Alerts"
                : "Command Center"}
            </h2>
          </div>

          {/* DEMO MODE CONTROLLER */}
          <div className="demo-mode-bar">
            <span className="demo-label">DEMO MODE:</span>
            {(["NORMAL", "RISING", "HIGH", "CRITICAL"] as const).map((mode) => (
              <button
                key={mode}
                className={`demo-btn ${demoMode === mode ? "active" : ""} ${mode.toLowerCase()}`}
                onClick={() => setDemoMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="top-actions">
            <div className="live-status">
              <span className="pulse" />
              LIVE MONITORING
            </div>

            <div className="time">12:06:24 PM</div>

            <button className="profile">AA</button>
          </div>
        </header>

        {activeTab === "dashboard" ? (
          <>
            {/* =====================================================
                WELCOME
                ===================================================== */}

            <section className="welcome">
          <div>
            <span className="welcome-tag">
              <ShieldCheck size={15} />
              PRAVAHA ACTIVE
            </span>

            <h3>Observe. Predict. Prevent. Protect.</h3>

            <p>
              AI-powered crowd intelligence for safer large gatherings.
            </p>
          </div>

          <div className="mandala">
            <div className="mandala-ring ring-one" />
            <div className="mandala-ring ring-two" />
            <div className="mandala-center">ॐ</div>
          </div>
        </section>

        {/* =====================================================
            STAT CARDS
            ===================================================== */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Total Crowd</span>
              <strong>{scenario.total_crowd}</strong>
              <small>Across monitored zones</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Gauge size={20} />
            </div>

            <div>
              <span>Average Density</span>
              <strong>{scenario.average_density}%</strong>
              <small className="up">↑ 8.4% from previous</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning-icon">
              <CircleAlert size={20} />
            </div>

            <div>
              <span>Active Alerts</span>
              <strong>{scenario.active_alerts}</strong>
              <small>{scenario.active_alerts > 0 ? `${scenario.active_alerts} require attention` : "All systems normal"}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Radio size={20} />
            </div>

            <div>
              <span>AI Prediction</span>
              <strong>{scenario.prediction}</strong>
              <small>Zone B congestion risk</small>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN DASHBOARD
            ===================================================== */}

        <section className="dashboard-grid">
          {/* ===================================================
              REAL AI VIDEO
              =================================================== */}

          <div className="panel video-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">AI VISION</span>
                <h3>Live Crowd Feed</h3>
              </div>

              <span className="camera-live">
                <span className="pulse" />
                CAMERA 01
              </span>
            </div>

            <div className="video-container">
              <video
                className="crowd-video"
                src="/zones_web.mp4"
                autoPlay
                muted
                loop
                playsInline
              />

              <div className="video-top-overlay">
                <span>CAM-01</span>
                <span className="video-live-badge">
                  <span className="pulse" />
                  LIVE
                </span>
              </div>

              <div className="video-bottom-overlay">
                <span>YOLOv8n</span>
                <span>BYTETRACK</span>
                <span>ZONE ANALYSIS ACTIVE</span>
              </div>
            </div>
          </div>

          {/* ===================================================
              CROWD RISK MAP
              =================================================== */}

          <div className="panel map-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">
                  SPATIAL INTELLIGENCE
                </span>

                <h3>Crowd Risk Map</h3>
              </div>

              <button className="expand-btn">
                Expand <ChevronRight size={15} />
              </button>
            </div>

            <div className="heatmap leaflet-map-container">
              <MapContainer
                center={[20.0067, 73.7936]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {(["Zone A", "Zone B", "Zone C"] as const).map((zoneName) => {
                  const z = getZone(zoneName);
                  const loc = ZONE_LOCATIONS[zoneName];
                  const color = getZoneHexColor(z.risk);
                  const isSelected = selectedZone === zoneName;
                  const isHighRisk =
                    z.risk.toUpperCase() === "HIGH" ||
                    z.risk.toUpperCase() === "CRITICAL";

                  return (
                    <Circle
                      key={zoneName}
                      center={[loc.lat, loc.lng]}
                      radius={loc.radius}
                      pathOptions={{
                        color: isSelected ? "#c88732" : color,
                        fillColor: color,
                        fillOpacity: isSelected ? 0.5 : 0.35,
                        weight: isSelected ? 3 : 2,
                        dashArray: isSelected ? "4, 4" : undefined,
                        className: isHighRisk
                          ? "leaflet-zone-pulse"
                          : isSelected
                          ? "leaflet-zone-selected"
                          : "",
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zoneName),
                      }}
                    >
                      <Tooltip
                        permanent
                        direction="center"
                        className={`zone-leaflet-tooltip ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div
                          className="zone-tooltip-content"
                          onClick={() => setSelectedZone(zoneName)}
                        >
                          <strong>{zoneName.replace("Zone ", "Zone ")}</strong>
                          <span>{z.people}% Occupancy</span>
                        </div>
                      </Tooltip>
                    </Circle>
                  );
                })}
              </MapContainer>
            </div>

            {/* MAP LEGEND */}

            <div className="map-legend">
              <span>
                <i className="legend-safe" />
                Safe
              </span>

              <span>
                <i className="legend-warning" />
                Warning
              </span>

              <span>
                <i className="legend-high" />
                High
              </span>

              <span>
                <i className="legend-critical" />
                Critical
              </span>
            </div>

            {/* SELECTED ZONE */}

            <div className="selected-zone">
              <div className="selected-zone-header">
                <div>
                  <span className="panel-kicker">
                    SELECTED ZONE
                  </span>

                  <h4>{selected.name}</h4>
                </div>

                <span className={`risk ${selected.color}`}>
                  {selected.risk}
                </span>
              </div>

              <div className="zone-intelligence">
                <div>
                  <span>OCCUPANCY</span>
                  <strong>{selected.occupancy ?? selected.people}%</strong>
                </div>

                <div>
                  <span>PEOPLE</span>
                  <strong>{selected.people}</strong>
                </div>

                <div>
                  <span>PREDICTION</span>
                  <strong>{selected.prediction}</strong>
                </div>
              </div>

              <div className="zone-action">
                <span>RECOMMENDED ACTION</span>

                <strong>{selected.action}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BOTTOM
            ===================================================== */}

        <section className="bottom-grid">
          {/* ZONE ANALYTICS */}

          <div className="panel zones-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">
                  ZONE ANALYTICS
                </span>

                <h3>Live Zone Status</h3>
              </div>
            </div>

            <div className="zone-list">
              {zones.map((zone) => (
                <div className="zone-row" key={zone.name}>
                  <div
                    className={`zone-indicator ${zone.color}`}
                  />

                  <div className="zone-name">
                    <strong>{zone.name}</strong>

                    <span>
                      {zone.people} people detected
                    </span>
                  </div>

                  <div className="density">
                    <div className="density-bar">
                      <div
                        className={`density-fill ${zone.color}`}
                        style={{
                          width: `${zone.people}%`,
                        }}
                      />
                    </div>

                    <span>{zone.people}%</span>
                  </div>

                  <span className={`risk ${zone.color}`}>
                    {zone.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ALERT */}

          <div className="panel alert-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">
                  INTELLIGENT RESPONSE
                </span>

                <h3>Latest Alert</h3>
              </div>

              <span className={`critical-badge ${scenario.alert_color}`}>
                {scenario.alert_risk}
              </span>
            </div>

            <div className="alert-content">
              <div className={`alert-symbol ${scenario.alert_color}`}>
                <CircleAlert size={24} />
              </div>

              <div>
                <strong>{scenario.latest_alert_title}</strong>

                <p>{scenario.latest_alert_desc}</p>
              </div>
            </div>

            <div className="recommendation">
              <span>RECOMMENDED ACTION</span>

              <strong>{scenario.recommendation}</strong>
            </div>
          </div>
        </section>
      </>
    ) : activeTab === "ivr" ? (
          /* =====================================================
             EMERGENCY IVR PAGE
             ===================================================== */
          <div className="ivr-page-container">
            {/* 1. HEADER */}
            <div className="panel ivr-header-panel">
              <div className="ivr-header-info">
                <span className="welcome-tag">
                  <Radio size={15} />
                  EXOTEL VOICE GATEWAY
                </span>
                <h3>Emergency IVR</h3>
                <p>Voice-based emergency reporting and rapid response</p>
              </div>
              <div className="ivr-status-indicator">
                <span className="online-dot" />
                <span>SYSTEM ONLINE</span>
              </div>
            </div>

            {/* 2. TWO IVR CARDS SIDE BY SIDE */}
            <div className="ivr-cards-grid">
              {/* CARD 1: Standard IVR */}
              <div className="panel ivr-card standard-card">
                <div className="ivr-card-top">
                  <div className="ivr-icon-badge standard">
                    <Phone size={22} />
                  </div>
                  <div>
                    <span className="panel-kicker">GUIDED HELPLINE</span>
                    <h3>Standard IVR</h3>
                    <p>Guided emergency and assistance reporting</p>
                  </div>
                </div>

                <div className="ivr-stats-row">
                  <div className="ivr-stat-box">
                    <span>Calls Today</span>
                    <strong>24</strong>
                  </div>
                  <div className="ivr-stat-box">
                    <span>Active Reports</span>
                    <strong className="amber-text">3</strong>
                  </div>
                </div>

                <div className="ivr-flow-preview-box">
                  <span className="preview-heading">IVR ROUTING FLOW</span>
                  <div className="flow-step-line">
                    <span>Language</span>
                    <ChevronRight size={12} />
                    <span>Issue</span>
                    <ChevronRight size={12} />
                    <span>Zone</span>
                    <ChevronRight size={12} />
                    <span className="highlight-tag">Incident</span>
                  </div>
                </div>

                <div className="supported-options-box">
                  <span className="preview-heading">SUPPORTED OPTIONS</span>
                  <div className="options-chips">
                    <span className="chip"><ShieldAlert size={12} /> Emergency Help</span>
                    <span className="chip"><Users size={12} /> Crowd Issue</span>
                    <span className="chip"><UserX size={12} /> Missing Person</span>
                    <span className="chip"><HelpCircle size={12} /> Volunteer / Help Desk</span>
                  </div>
                </div>

                <button className="btn-view-flow" onClick={() => setSelectedFlowModal("standard")}>
                  <FileText size={15} />
                  View Flow
                </button>
              </div>

              {/* CARD 2: Extreme Emergency IVR */}
              <div className="panel ivr-card extreme-card">
                <div className="ivr-card-top">
                  <div className="ivr-icon-badge extreme">
                    <Zap size={22} />
                  </div>
                  <div>
                    <div className="priority-tag"><AlertTriangle size={12} /> HIGH PRIORITY</div>
                    <h3>Extreme Emergency IVR </h3>
                    <p>Minimal-step emergency reporting</p>
                  </div>
                </div>

                <div className="ivr-stats-row">
                  <div className="ivr-stat-box">
                    <span>Calls Today</span>
                    <strong>7</strong>
                  </div>
                  <div className="ivr-stat-box">
                    <span>Critical Reports</span>
                    <strong className="red-text">2</strong>
                  </div>
                </div>

                <div className="ivr-flow-preview-box urgent">
                  <span className="preview-heading">MINIMAL STEP FLOW</span>
                  <div className="flow-step-line urgent">
                    <span>Call</span>
                    <ChevronRight size={12} />
                    <span className="press-one">Press 1</span>
                    <ChevronRight size={12} />
                    <span>Zone</span>
                    <ChevronRight size={12} />
                    <span className="alert-tag">Instant Alert</span>
                  </div>
                </div>

                <div className="extreme-notice-box">
                  <AlertTriangle size={15} />
                  <span>Designed for situations where every second matters.</span>
                </div>

                <button className="btn-view-flow extreme" onClick={() => setSelectedFlowModal("extreme")}>
                  <Zap size={15} />
                  View Flow
                </button>
              </div>
            </div>

            {/* 3. IVR FLOW SECTION */}
            <div className="panel ivr-flow-section">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">AUTOMATED CALL PIPELINE</span>
                  <h3>IVR Flow Visualizer</h3>
                </div>
              </div>

              <div className="visual-flows-grid">
                {/* Standard IVR Flow */}
                <div className="visual-flow-card">
                  <div className="flow-card-header">
                    <Phone size={16} />
                    <strong>STANDARD IVR FLOW</strong>
                  </div>
                  <div className="flow-nodes-horizontal">
                    <div className="node"><span>1</span>CALL</div>
                    <div className="arrow">→</div>
                    <div className="node"><span>2</span>LANGUAGE</div>
                    <div className="arrow">→</div>
                    <div className="node"><span>3</span>ASSISTANCE TYPE</div>
                    <div className="arrow">→</div>
                    <div className="node"><span>4</span>ZONE</div>
                    <div className="arrow">→</div>
                    <div className="node"><span>5</span>INCIDENT CREATED</div>
                    <div className="arrow">→</div>
                    <div className="node alert-node"><span>6</span>AUTHORITY ALERT</div>
                  </div>
                </div>

                {/* Extreme IVR Flow */}
                <div className="visual-flow-card extreme">
                  <div className="flow-card-header extreme">
                    <Zap size={16} />
                    <strong>EXTREME EMERGENCY IVR FLOW</strong>
                  </div>
                  <div className="flow-nodes-horizontal">
                    <div className="node extreme"><span>1</span>CALL</div>
                    <div className="arrow">→</div>
                    <div className="node urgent"><span>2</span>PRESS 1</div>
                    <div className="arrow">→</div>
                    <div className="node extreme"><span>3</span>ZONE</div>
                    <div className="arrow">→</div>
                    <div className="node critical"><span>4</span>CRITICAL ALERT</div>
                    <div className="arrow">→</div>
                    <div className="node response"><span>5</span>AUTHORITY RESPONSE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. RECENT IVR INCIDENTS TABLE */}
            <div className="panel ivr-table-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">LIVE CALL DISPATCH LOG</span>
                  <h3>Recent IVR Incidents</h3>
                </div>
                <span className="live-pulse-badge">
                  <span className="pulse-dot" /> LIVE FEED
                </span>
              </div>

              <div className="table-responsive">
                <table className="ivr-incidents-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>IVR CHANNEL</th>
                      <th>ZONE</th>
                      <th>STATUS</th>
                      <th>TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="incident-type"><ShieldAlert size={14} /> Medical</span>
                      </td>
                      <td><span className="channel-badge extreme">Extreme IVR</span></td>
                      <td><strong>Zone A</strong></td>
                      <td><span className="status-badge critical">CRITICAL</span></td>
                      <td>12:12 PM</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="incident-type"><Users size={14} /> Crowd Issue</span>
                      </td>
                      <td><span className="channel-badge standard">Standard IVR</span></td>
                      <td><strong>Zone B</strong></td>
                      <td><span className="status-badge safe">RESOLVED</span></td>
                      <td>5:04 PM</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="incident-type"><Zap size={14} /> Extreme Emergency</span>
                      </td>
                      <td><span className="channel-badge extreme">Extreme IVR</span></td>
                      <td><strong>Zone C</strong></td>
                      <td><span className="status-badge critical">CRITICAL</span></td>
                      <td>4:58 PM</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="incident-type"><AlertTriangle size={14} /> Blocked Route</span>
                      </td>
                      <td><span className="channel-badge standard">Standard IVR</span></td>
                      <td><strong>Zone B</strong></td>
                      <td><span className="status-badge warning">ACTIVE</span></td>
                      <td>4:42 PM</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="incident-type"><Zap size={14} /> Extreme Emergency</span>
                      </td>
                      <td><span className="channel-badge extreme">Extreme IVR</span></td>
                      <td><strong>Zone B</strong></td>
                      <td><span className="status-badge critical">CRITICAL</span></td>
                      <td>4:31 PM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. HOW IT WORKS SECTION */}
            <div className="panel how-it-works-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">ARCHITECTURE OVERVIEW</span>
                  <h3>How It Works</h3>
                </div>
              </div>

              <p className="architecture-text">
                Both IVR channels feed into the same PRAVAHA incident and alert system.
              </p>

              <div className="arch-flow-visual">
                <div className="arch-channels-column">
                  <div className="arch-channel-box standard">
                    <Phone size={16} /> STANDARD IVR
                  </div>
                  <div className="arch-channel-box extreme">
                    <Zap size={16} /> EXTREME IVR
                  </div>
                </div>

                <div className="arch-connector-branch">
                  <div className="branch-lines" />
                  <span className="arrow-head">→</span>
                </div>

                <div className="arch-center-box">
                  <Layers size={18} />
                  <div>
                    <strong>INCIDENT ENGINE</strong>
                    <small>AI Triage & Geo-Tagging</small>
                  </div>
                </div>

                <div className="arch-connector-straight">
                  <div className="line-bar" />
                  <span className="arrow-head">→</span>
                </div>

                <div className="arch-dest-box">
                  <LayoutDashboard size={18} />
                  <div>
                    <strong>AUTHORITY DASHBOARD</strong>
                    <small>Command & Control Center</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "analytics" ? (
          /* =====================================================
             ANALYTICS PAGE
             ===================================================== */
          <div className="analytics-page-container">
            {/* 1. HEADER */}
            <div className="panel analytics-header-panel">
              <div className="analytics-header-info">
                <span className="welcome-tag">
                  <Activity size={15} />
                  AI ANALYTICS
                </span>
                <h3>Analytics</h3>
                <p>Crowd intelligence, risk trends and operational insights</p>
              </div>
              <div className="analytics-mode-badge">
                <span>SCENARIO MODE:</span>
                <strong className={`status-pill ${scenario.alert_color}`}>
                  {demoMode}
                </strong>
              </div>
            </div>

            {/* 2. KPI CARDS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={20} />
                </div>
                <div>
                  <span>Total People Detected</span>
                  <strong>{scenario.total_crowd}</strong>
                  <small className="up">↑ Real-time tracked</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Gauge size={20} />
                </div>
                <div>
                  <span>Average Occupancy</span>
                  <strong>{scenario.average_density}%</strong>
                  <small>Capacity utilization</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon warning-icon">
                  <Activity size={20} />
                </div>
                <div>
                  <span>Peak Occupancy</span>
                  <strong>{Math.max(...zones.map((z) => z.people))}%</strong>
                  <small>Peak sector load</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon warning-icon">
                  <CircleAlert size={20} />
                </div>
                <div>
                  <span>Active Alerts</span>
                  <strong>{scenario.active_alerts}</strong>
                  <small>Requires response</small>
                </div>
              </div>
            </div>

            {/* 3. CROWD DENSITY TREND (CUSTOM SVG LINE CHART) */}
            <div className="panel chart-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">SPATIAL TRENDS</span>
                  <h3>Crowd Density Trend</h3>
                  <p className="panel-sub">Occupancy across monitored zones (Last 60 minutes)</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><i className="dot zone-a" /> Zone A</span>
                  <span className="legend-item"><i className="dot zone-b" /> Zone B</span>
                  <span className="legend-item"><i className="dot zone-c" /> Zone C</span>
                </div>
              </div>

              <div className="svg-chart-wrapper">
                <svg className="analytics-svg-chart" viewBox="0 0 600 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = 180 - (val / 100) * 140;
                    return (
                      <g key={val}>
                        <line x1="40" y1={y} x2="570" y2={y} stroke="#e9e5dc" strokeDasharray="3,3" />
                        <text x="30" y={y + 4} fill="#858077" fontSize="10" textAnchor="end">{val}%</text>
                      </g>
                    );
                  })}

                  {/* X Axis Labels */}
                  {ANALYTICS_TRENDS[demoMode].map((item, idx) => {
                    const x = 40 + (idx / 5) * 530;
                    return (
                      <text key={item.time} x={x} y="205" fill="#858077" fontSize="10" textAnchor="middle">
                        {item.time}
                      </text>
                    );
                  })}

                  {/* Line Paths & Circles */}
                  {(() => {
                    const trend = ANALYTICS_TRENDS[demoMode];
                    const pointsA = trend.map((d, i) => ({ x: 40 + (i / 5) * 530, y: 180 - (d.zoneA / 100) * 140 }));
                    const pointsB = trend.map((d, i) => ({ x: 40 + (i / 5) * 530, y: 180 - (d.zoneB / 100) * 140 }));
                    const pointsC = trend.map((d, i) => ({ x: 40 + (i / 5) * 530, y: 180 - (d.zoneC / 100) * 140 }));

                    const pathA = "M " + pointsA.map((p) => `${p.x},${p.y}`).join(" L ");
                    const pathB = "M " + pointsB.map((p) => `${p.x},${p.y}`).join(" L ");
                    const pathC = "M " + pointsC.map((p) => `${p.x},${p.y}`).join(" L ");

                    return (
                      <>
                        {/* Zone A Line (Green) */}
                        <path d={pathA} fill="none" stroke="#3d9560" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {pointsA.map((p, idx) => (
                          <circle key={`a-${idx}`} cx={p.x} cy={p.y} r="4" fill="#3d9560" stroke="#ffffff" strokeWidth="2" />
                        ))}

                        {/* Zone C Line (Amber) */}
                        <path d={pathC} fill="none" stroke="#c79528" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {pointsC.map((p, idx) => (
                          <circle key={`c-${idx}`} cx={p.x} cy={p.y} r="4" fill="#c79528" stroke="#ffffff" strokeWidth="2" />
                        ))}

                        {/* Zone B Line (Red/Saffron) */}
                        <path d={pathB} fill="none" stroke="#c94b3d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {pointsB.map((p, idx) => (
                          <circle key={`b-${idx}`} cx={p.x} cy={p.y} r="4" fill="#c94b3d" stroke="#ffffff" strokeWidth="2" />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* 4. LOWER ANALYTICS GRID */}
            <div className="analytics-lower-grid">
              {/* ZONE ANALYTICS */}
              <div className="panel zone-analytics-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-kicker">SECTOR BREAKDOWN</span>
                    <h3>Zone Analytics</h3>
                  </div>
                </div>

                <div className="zone-cards-list">
                  {zones.map((zone) => (
                    <div key={zone.name} className="zone-analytics-card">
                      <div className="zac-header">
                        <div>
                          <h4>{zone.name}</h4>
                          <span className="zac-sub">{zone.prediction}</span>
                        </div>
                        <span className={`status-pill ${zone.color}`}>{zone.risk}</span>
                      </div>

                      <div className="zac-metrics">
                        <div className="metric">
                          <span>Occupancy</span>
                          <strong>{zone.people}%</strong>
                        </div>
                        <div className="metric">
                          <span>People Count</span>
                          <strong>{zone.people}</strong>
                        </div>
                        <div className="metric">
                          <span>Risk Level</span>
                          <strong className={zone.color}>{zone.risk}</strong>
                        </div>
                      </div>

                      <div className="zac-progress-bg">
                        <div className={`zac-progress-fill ${zone.color}`} style={{ width: `${zone.people}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RISK DISTRIBUTION & INSIGHTS */}
              <div className="panel insights-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-kicker">CLASSIFICATION</span>
                    <h3>Risk Distribution</h3>
                  </div>
                </div>

                <div className="risk-dist-list">
                  {(["SAFE", "WARNING", "HIGH", "CRITICAL"] as const).map((level) => {
                    const count = zones.filter((z) => z.risk.toUpperCase() === level).length;
                    const pct = Math.round((count / zones.length) * 100);
                    const colorClass = level.toLowerCase();

                    return (
                      <div key={level} className="risk-dist-row">
                        <div className="risk-dist-label">
                          <span className={`risk-dot ${colorClass}`} />
                          <strong>{level}</strong>
                        </div>
                        <div className="risk-dist-bar-wrap">
                          <div className={`risk-dist-bar ${colorClass}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="risk-dist-count">{count} {count === 1 ? "Zone" : "Zones"}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="culture-line" style={{ margin: "20px 0" }} />

                <div className="panel-header">
                  <div>
                    <span className="panel-kicker">AI OPERATIONAL INSIGHTS</span>
                    <h3>Real-time Intelligence</h3>
                  </div>
                </div>

                <div className="ai-insight-card">
                  <div className="insight-icon-box">
                    <CircleAlert size={20} />
                  </div>
                  <div>
                    <strong>SYSTEM INSIGHT</strong>
                    <p>{INSIGHTS[demoMode]}</p>
                  </div>
                </div>

                <div className="recommendation" style={{ marginTop: "16px" }}>
                  <span>RECOMMENDED ACTION</span>
                  <strong>{scenario.recommendation}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "cameras" ? (
          /* =====================================================
             LIVE CAMERAS PAGE
             ===================================================== */
          <div className="cameras-page-container">
            {/* 1. HEADER */}
            <div className="panel cameras-header-panel">
              <div className="cameras-header-info">
                <span className="welcome-tag">
                  <Camera size={15} />
                  AI VISION PIPELINE
                </span>
                <h3>Live Cameras</h3>
                <p>Real-time AI vision across monitored areas</p>
              </div>
              <div className="live-camera-status-badge">
                <span className="online-dot" />
                <span>LIVE MONITORING</span>
              </div>
            </div>

            {/* 2. MAIN CAMERA DISPLAY CARD */}
            <div className="panel main-camera-card">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">PRIMARY FEED</span>
                  <h3>CAMERA 01</h3>
                  <p className="panel-sub">Panchavati • Crowd Monitoring</p>
                </div>
                <div className="cam-live-indicator">
                  <span className="pulse" />
                  ● LIVE
                </div>
              </div>

              <div className="camera-feed-viewport">
                <video
                  className="camera-video-player"
                  src="/zones_web.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />

                {/* Top Overlay */}
                <div className="cam-overlay-top">
                  <span className="cam-overlay-title">CAMERA 01</span>
                  <span className="cam-overlay-loc">PANCHAVATI</span>
                  <span className="cam-overlay-live"><span className="pulse" /> ● LIVE</span>
                </div>

                {/* Bottom Overlay */}
                <div className="cam-overlay-bottom">
                  <span className="cam-tech-chip">YOLOv8n</span>
                  <span className="cam-tech-chip">BYTETRACK</span>
                  <span className="cam-tech-chip highlight">ZONE ANALYSIS ACTIVE</span>
                </div>
              </div>

              {/* 4. CAMERA INFORMATION */}
              <div className="camera-info-bar">
                <div className="cam-info-item">
                  <span>CAMERA STATUS</span>
                  <strong className="safe-text">ONLINE</strong>
                </div>
                <div className="cam-info-item">
                  <span>FEED TYPE</span>
                  <strong>AI Processed Video</strong>
                </div>
                <div className="cam-info-item">
                  <span>DETECTION MODEL</span>
                  <strong>YOLOv8n Person</strong>
                </div>
                <div className="cam-info-item">
                  <span>TRACKING ALGORITHM</span>
                  <strong>ByteTrack</strong>
                </div>
                <div className="cam-info-item">
                  <span>ZONE ANALYSIS</span>
                  <strong className="amber-text">Active</strong>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "crowd-map" ? (
          /* =====================================================
             CROWD MAP PAGE
             ===================================================== */
          <div className="crowd-map-page-container">
            {/* 1. HEADER */}
            <div className="panel crowd-map-header-panel">
              <div className="crowd-map-header-info">
                <span className="welcome-tag">
                  <Map size={15} />
                  SPATIAL INTELLIGENCE
                </span>
                <h3>Crowd Map</h3>
                <p>Panchavati • Real-time zone intelligence</p>
              </div>
              <div className="live-status-badge">
                <span className="online-dot" />
                <span>LIVE MONITORING</span>
              </div>
            </div>

            {/* 2. LARGE INTERACTIVE MAP */}
            <div className="panel dedicated-map-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">MONITORED SECTOR: NASHIK</span>
                  <h3>Panchavati Command Map</h3>
                  <p className="panel-sub">PRAVAHA Prototype Monitoring Zones A, B & C</p>
                </div>

                <div className="map-legend inline-legend">
                  <span><i className="legend-safe" /> Safe</span>
                  <span><i className="legend-warning" /> Warning</span>
                  <span><i className="legend-high" /> High</span>
                  <span><i className="legend-critical" /> Critical</span>
                </div>
              </div>

              <div className="heatmap dedicated-map-container">
                <MapContainer
                  center={[20.0067, 73.7936]}
                  zoom={15}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {(["Zone A", "Zone B", "Zone C"] as const).map((zoneName) => {
                    const z = getZone(zoneName);
                    const loc = ZONE_LOCATIONS[zoneName];
                    const color = getZoneHexColor(z.risk);
                    const isSelected = selectedZone === zoneName;
                    const isHighRisk =
                      z.risk.toUpperCase() === "HIGH" ||
                      z.risk.toUpperCase() === "CRITICAL";

                    return (
                      <Circle
                        key={zoneName}
                        center={[loc.lat, loc.lng]}
                        radius={loc.radius}
                        pathOptions={{
                          color: isSelected ? "#c88732" : color,
                          fillColor: color,
                          fillOpacity: isSelected ? 0.55 : 0.38,
                          weight: isSelected ? 3.5 : 2,
                          dashArray: isSelected ? "4, 4" : undefined,
                          className: isHighRisk
                            ? "leaflet-zone-pulse"
                            : isSelected
                            ? "leaflet-zone-selected"
                            : "",
                        }}
                        eventHandlers={{
                          click: () => setSelectedZone(zoneName),
                        }}
                      >
                        <Tooltip
                          permanent
                          direction="center"
                          className={`zone-leaflet-tooltip ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          <div
                            className="zone-tooltip-content"
                            onClick={() => setSelectedZone(zoneName)}
                          >
                            <strong>{zoneName}</strong>
                            <span>{z.people}% • {z.risk}</span>
                          </div>
                        </Tooltip>
                      </Circle>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            {/* 4. SELECTED ZONE DETAILS */}
            <div className="panel selected-zone-details-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">INTERACTIVE INSPECTION</span>
                  <h3>Selected Sector Details: {selected.name}</h3>
                </div>

                <span className={`status-pill ${selected.color}`}>
                  {selected.risk}
                </span>
              </div>

              <div className="zone-info">
                <div className="zone-main">
                  <h4>{selected.name}</h4>
                  <span className="zone-sub">
                    {ZONE_LOCATIONS[selected.name]?.description || "Primary monitored sector"}
                  </span>
                </div>

                <div className="zone-metrics">
                  <div className="metric">
                    <span>OCCUPANCY</span>
                    <strong>{selected.people}%</strong>
                  </div>

                  <div className="metric">
                    <span>ESTIMATED PEOPLE</span>
                    <strong>{selected.people}</strong>
                  </div>

                  <div className="metric">
                    <span>RISK LEVEL</span>
                    <strong className={selected.color}>{selected.risk}</strong>
                  </div>

                  <div className="metric">
                    <span>PREDICTION</span>
                    <strong>{selected.prediction}</strong>
                  </div>
                </div>

                <div className="zone-action" style={{ marginTop: "12px" }}>
                  <span>RECOMMENDED ACTION</span>
                  <strong>{selected.action}</strong>
                </div>
              </div>
            </div>

            {/* 6. ZONE SUMMARY CARDS */}
            <div className="zone-summary-cards-grid">
              {(["Zone A", "Zone B", "Zone C"] as const).map((zName) => {
                const zData = getZone(zName);
                const isSelected = selectedZone === zName;
                const loc = ZONE_LOCATIONS[zName];

                return (
                  <div
                    key={zName}
                    className={`panel zone-summary-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedZone(zName)}
                  >
                    <div className="zsc-header">
                      <div>
                        <h4>{zName}</h4>
                        <small>{loc.description}</small>
                      </div>
                      <span className={`status-pill ${zData.color}`}>
                        {zData.risk}
                      </span>
                    </div>

                    <div className="zsc-metrics">
                      <div>
                        <span>PEOPLE</span>
                        <strong>{zData.people}</strong>
                      </div>
                      <div>
                        <span>OCCUPANCY</span>
                        <strong>{zData.people}%</strong>
                      </div>
                    </div>

                    <div className="zsc-progress">
                      <div
                        className={`zsc-bar ${zData.color}`}
                        style={{ width: `${zData.people}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =====================================================
             ALERTS PAGE
             ===================================================== */
          <div className="alerts-page-container">
            {/* 1. HEADER */}
            <div className="panel alerts-header-panel">
              <div className="alerts-header-info">
                <span className="welcome-tag">
                  <Bell size={15} />
                  REAL-TIME ALERTS
                </span>
                <h3>Alerts</h3>
                <p>Real-time crowd risks and emergency events requiring attention</p>
              </div>
              <div className="live-status-badge">
                <span className="online-dot" />
                <span>MONITORING ACTIVE</span>
              </div>
            </div>

            {/* 2. SUMMARY CARDS */}
            <div className="alerts-summary-grid">
              <div className="panel summary-card">
                <div className="card-top">
                  <span>ALL ALERTS</span>
                  <Bell size={18} className="icon-gold" />
                </div>
                <h3>{alertsList.length}</h3>
                <small>Total logged events</small>
              </div>

              <div className="panel summary-card critical">
                <div className="card-top">
                  <span>CRITICAL</span>
                  <ShieldAlert size={18} className="icon-critical" />
                </div>
                <h3>{criticalCount}</h3>
                <small>Immediate action needed</small>
              </div>

              <div className="panel summary-card high">
                <div className="card-top">
                  <span>HIGH</span>
                  <AlertTriangle size={18} className="icon-high" />
                </div>
                <h3>{highCount}</h3>
                <small>Elevated risk areas</small>
              </div>

              <div className="panel summary-card active">
                <div className="card-top">
                  <span>ACTIVE</span>
                  <Activity size={18} className="icon-active" />
                </div>
                <h3>{activeCount}</h3>
                <small>Ongoing incidents</small>
              </div>
            </div>

            {/* 4. FILTERS */}
            <div className="panel alerts-filter-panel">
              <span className="filter-label">FILTER ALERTS:</span>
              <div className="filter-chips">
                {(["All", "Critical", "High", "Warning", "Resolved"] as const).map((filter) => (
                  <button
                    key={filter}
                    className={`filter-chip ${alertFilter === filter ? "active" : ""}`}
                    onClick={() => setAlertFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. ALERT LIST */}
            <div className="alerts-list-container">
              {filteredAlerts.length === 0 ? (
                <div className="panel no-alerts-panel">
                  <ShieldCheck size={36} style={{ color: "#3d9560", marginBottom: "8px" }} />
                  <h4>No Alerts Found</h4>
                  <p>There are no alerts matching the selected filter in current mode.</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`panel alert-card ${alert.color}`}>
                    <div className="alert-card-header">
                      <div className="alert-badge-group">
                        <span className={`status-pill ${alert.color}`}>
                          {alert.risk}
                        </span>
                        <span className="alert-zone-tag">{alert.zone}</span>
                        <span className="alert-time-tag">{alert.time}</span>
                      </div>

                      <button
                        className="btn-view-zone"
                        onClick={() => {
                          setSelectedZone(alert.zone);
                          setActiveTab("crowd-map");
                        }}
                      >
                        View Zone <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="alert-card-body">
                      <h4>{alert.title}</h4>
                      <p className="alert-desc">{alert.description}</p>

                      <div className="alert-meta-grid">
                        <div className="meta-item">
                          <span>OCCUPANCY</span>
                          <strong>{alert.occupancy}% occupancy</strong>
                        </div>

                        {alert.prediction && (
                          <div className="meta-item">
                            <span>PREDICTION</span>
                            <strong>{alert.prediction}</strong>
                          </div>
                        )}

                        <div className="meta-item action-item">
                          <span>RECOMMENDED ACTION</span>
                          <strong>{alert.action}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* INTERACTIVE FLOW MODAL */}
        {selectedFlowModal && (
          <div className="modal-backdrop" onClick={() => setSelectedFlowModal(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-group">
                  {selectedFlowModal === "standard" ? (
                    <div className="modal-icon-badge standard"><Phone size={20} /></div>
                  ) : (
                    <div className="modal-icon-badge extreme"><Zap size={20} /></div>
                  )}
                  <div>
                    <h3>
                      {selectedFlowModal === "standard"
                        ? "Standard IVR - Step-by-Step Flow"
                        : "Extreme Emergency IVR - Step-by-Step Flow"}
                    </h3>
                    <p>Interactive Call Logic Simulation</p>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedFlowModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {selectedFlowModal === "standard" ? (
                  <div className="flow-steps-list">
                    <div className="step-item">
                      <div className="step-badge">STEP 1</div>
                      <div className="step-content">
                        <strong>CALL INITIATION</strong>
                        <p>Citizen calls PRAVAHA IVR Helpline.</p>
                        <div className="audio-bubble">🔊 "Welcome to Kumbh Mela Emergency Helpline."</div>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-badge">STEP 2</div>
                      <div className="step-content">
                        <strong>LANGUAGE SELECTION</strong>
                        <p>User selects preferred audio language.</p>
                        <div className="audio-bubble">🔊 "Press 1 for Hindi, Press 2 for Marathi, Press 3 for English."</div>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-badge">STEP 3</div>
                      <div className="step-content">
                        <strong>ISSUE CATEGORY</strong>
                        <p>User selects type of emergency assistance.</p>
                        <div className="audio-bubble">🔊 "Press 1 Medical, Press 2 Stampede/Crowd, Press 3 Missing Person."</div>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-badge">STEP 4</div>
                      <div className="step-content">
                        <strong>ZONE CONFIRMATION</strong>
                        <p>User selects current location zone.</p>
                        <div className="audio-bubble">🔊 "Press 1 for Ramkund (Zone A), Press 2 for Kalaram (Zone B), Press 3 for Tapovan (Zone C)."</div>
                      </div>
                    </div>
                    <div className="step-item final">
                      <div className="step-badge final">STEP 5</div>
                      <div className="step-content">
                        <strong>INCIDENT CREATED & DISPATCHED</strong>
                        <p>System automatically registers ticket and alerts command center.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flow-steps-list extreme">
                    <div className="step-item extreme">
                      <div className="step-badge extreme">STEP 1</div>
                      <div className="step-content">
                        <strong>CRITICAL EMERGENCY CALL</strong>
                        <p>Caller dials Emergency Hotline.</p>
                        <div className="audio-bubble urgent">🔊 "PRAVAHA Extreme Hotline. Press 1 NOW for immediate SOS."</div>
                      </div>
                    </div>
                    <div className="step-item urgent">
                      <div className="step-badge urgent">STEP 2</div>
                      <div className="step-content">
                        <strong>PRESS 1 (INSTANT OVERRIDE)</strong>
                        <p>Bypasses all language and category menus instantly.</p>
                      </div>
                    </div>
                    <div className="step-item extreme">
                      <div className="step-badge extreme">STEP 3</div>
                      <div className="step-content">
                        <strong>ONE-DIGIT ZONE SELECTION</strong>
                        <p>Quick DTMF input: 1 for Zone A, 2 for Zone B, 3 for Zone C.</p>
                      </div>
                    </div>
                    <div className="step-item final-critical">
                      <div className="step-badge critical">STEP 4</div>
                      <div className="step-content">
                        <strong>CRITICAL ALERT & RAPID DISPATCH</strong>
                        <p>Instant high-priority alarm triggered on Authority Dashboard. Quick Response Team dispatched in under 30 seconds.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-modal-close" onClick={() => setSelectedFlowModal(null)}>
                  Close Flow View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}

        <footer>
          <span>PRAVAHA • AI CROWD INTELLIGENCE</span>

          <span>
            OBSERVE • PREDICT • PREVENT • PROTECT
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;