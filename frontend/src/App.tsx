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

interface Zone {
  name: string;
  people: number;
  occupancy?: number;
  risk: string;
  color?: string;
  prediction: string;
  action: string;
}

interface DashboardData {
  total_crowd: number;
  average_density: number;
  active_alerts: number;
  prediction: string;
  zones: Zone[];
}

const initialZones: Zone[] = [
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
    people: 78,
    occupancy: 78,
    risk: "HIGH",
    color: "high",
    prediction: "Congestion Likely",
    action: "Redirect incoming flow + deploy personnel",
  },
  {
    name: "Zone C",
    people: 58,
    occupancy: 58,
    risk: "WARNING",
    color: "warning",
    prediction: "Crowd Rising",
    action: "Monitor closely",
  },
];

function App() {
  const [selectedZone, setSelectedZone] = useState("Zone B");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then((data: DashboardData) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const rawZones = dashboardData?.zones || initialZones;
  const zones = rawZones.map((z) => ({
    ...z,
    color: z.color || z.risk.toLowerCase(),
  }));

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
            <span className="alert-count">{dashboardData?.active_alerts ?? 3}</span>
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
              <strong>{error ? "Backend Warning" : loading ? "Connecting..." : "System Online"}</strong>
              <small>{error ? "Using cached state" : "All services operational"}</small>
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
              <strong>{dashboardData?.total_crowd ?? 178}</strong>
              <small>Across monitored zones</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Gauge size={20} />
            </div>

            <div>
              <span>Average Density</span>
              <strong>{dashboardData?.average_density ?? 59}%</strong>
              <small className="up">↑ 8.4% from previous</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning-icon">
              <CircleAlert size={20} />
            </div>

            <div>
              <span>Active Alerts</span>
              <strong>{dashboardData?.active_alerts ?? 3}</strong>
              <small>1 requires attention</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Radio size={20} />
            </div>

            <div>
              <span>AI Prediction</span>
              <strong>{dashboardData?.prediction ?? "Rising"}</strong>
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
                className={`zone zone-a ${
                  selectedZone === "Zone A" ? "selected" : ""
                }`}
                onClick={() => setSelectedZone("Zone A")}
              >
                <strong>A</strong>
                <span>{getZone("Zone A").people}%</span>
              </button>

              {/* ZONE B */}

              <button
                className={`zone zone-b ${
                  selectedZone === "Zone B" ? "selected" : ""
                }`}
                onClick={() => setSelectedZone("Zone B")}
              >
                <strong>B</strong>
                <span>{getZone("Zone B").people}%</span>
              </button>

              {/* ZONE C */}

              <button
                className={`zone zone-c ${
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

              <span className="critical-badge">HIGH</span>
            </div>

            <div className="alert-content">
              <div className="alert-symbol">
                <CircleAlert size={24} />
              </div>

              <div>
                <strong>Zone B crowd rising</strong>

                <p>
                  Congestion likely if current flow continues.
                </p>
              </div>
            </div>

            <div className="recommendation">
              <span>RECOMMENDED ACTION</span>

              <strong>
                Redirect incoming flow + deploy personnel
              </strong>
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