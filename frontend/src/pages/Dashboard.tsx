import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import {
  ChevronRight,
  CircleAlert,
  Gauge,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { DemoMode, TabType } from "../types";
import { DEMO_SCENARIOS, ZONE_LOCATIONS, getZoneHexColor } from "../data/demoData";

interface DashboardProps {
  demoMode: DemoMode;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export function Dashboard({
  demoMode,
  selectedZone,
  setSelectedZone,
  setActiveTab,
}: DashboardProps) {
  const scenario = DEMO_SCENARIOS[demoMode];
  const zones = scenario.zones;
  const selected =
    zones.find((zone) => zone.name === selectedZone) || zones[0];
  const getZone = (name: string) =>
    zones.find((z) => z.name === name) || zones[0];

  return (
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

          <p>AI-powered crowd intelligence for safer large gatherings.</p>
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
            <small>
              {scenario.active_alerts > 0
                ? `${scenario.active_alerts} require attention`
                : "All systems normal"}
            </small>
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
              <span className="panel-kicker">SPATIAL INTELLIGENCE</span>

              <h3>Crowd Risk Map</h3>
            </div>

            <button
              className="expand-btn"
              onClick={() => setActiveTab("crowd-map")}
            >
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
                <span className="panel-kicker">SELECTED ZONE</span>

                <h4>{selected.name}</h4>
              </div>

              <span className={`risk ${selected.color}`}>{selected.risk}</span>
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
              <span className="panel-kicker">ZONE ANALYTICS</span>

              <h3>Live Zone Status</h3>
            </div>
          </div>

          <div className="zone-list">
            {zones.map((zone) => (
              <div className="zone-row" key={zone.name}>
                <div className={`zone-indicator ${zone.color}`} />

                <div className="zone-name">
                  <strong>{zone.name}</strong>

                  <span>{zone.people} people detected</span>
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

                <span className={`risk ${zone.color}`}>{zone.risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ALERT */}

        <div className="panel alert-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">INTELLIGENT RESPONSE</span>

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
  );
}
