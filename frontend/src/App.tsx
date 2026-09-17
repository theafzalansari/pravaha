import { useState, useEffect } from "react";
import {
  Activity,
  Bell,
  Camera,
  ChevronRight,
  CircleAlert,
  Gauge,
  LayoutDashboard,
  Map,
  Radio,
  Settings,
  ShieldCheck,
  Users,
  Waves,
} from "lucide-react";
import "./App.css";

type DemoMode = "NORMAL" | "RISING" | "HIGH" | "CRITICAL";

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

function App() {
  const [demoMode, setDemoMode] = useState<DemoMode>("HIGH");
  const [selectedZone, setSelectedZone] = useState("Zone B");
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

          <button className="nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="nav-item">
            <Map size={18} />
            Crowd Map
          </button>

          <button className="nav-item">
            <Camera size={18} />
            Live Cameras
          </button>

          <button className="nav-item">
            <Bell size={18} />
            Alerts
            <span className="alert-count">{scenario.active_alerts}</span>
          </button>

          <button className="nav-item">
            <Radio size={18} />
            Emergency IVR
          </button>

          <p className="nav-label second">SYSTEM</p>

          <button className="nav-item">
            <Activity size={18} />
            Analytics
          </button>

          <button className="nav-item">
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
            <h2>Command Center</h2>
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

            <div className="heatmap">
              <div className="map-pattern" />

              {/* ZONE A */}

              <button
                className={`zone zone-a ${getZone("Zone A").color} ${
                  selectedZone === "Zone A" ? "selected" : ""
                }`}
                onClick={() => setSelectedZone("Zone A")}
              >
                <strong>A</strong>
                <span>{getZone("Zone A").people}%</span>
              </button>

              {/* ZONE B */}

              <button
                className={`zone zone-b ${getZone("Zone B").color} ${
                  selectedZone === "Zone B" ? "selected" : ""
                }`}
                onClick={() => setSelectedZone("Zone B")}
              >
                <strong>B</strong>
                <span>{getZone("Zone B").people}%</span>
              </button>

              {/* ZONE C */}

              <button
                className={`zone zone-c ${getZone("Zone C").color} ${
                  selectedZone === "Zone C" ? "selected" : ""
                }`}
                onClick={() => setSelectedZone("Zone C")}
              >
                <strong>C</strong>
                <span>{getZone("Zone C").people}%</span>
              </button>

              <div className="map-flow flow-arrow-one">↓</div>

              <div className="map-flow flow-arrow-two">→</div>

              <div className="map-flow flow-arrow-three">↓</div>

              <div className="map-label entry">ENTRY</div>

              <div className="map-label exit">EXIT</div>
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