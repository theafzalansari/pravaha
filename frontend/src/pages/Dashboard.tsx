import { useState } from "react";
import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import {
  Activity,
  Camera,
  ChevronRight,
  CircleAlert,
  Compass,
  Gauge,
  PhoneCall,
  Radio,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  Zap,
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
  const [isFeedExpanded, setIsFeedExpanded] = useState(false);
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
          PRIMARY STAT CARDS
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
          SECONDARY OPERATIONAL DATA ROW
          ===================================================== */}

      <section className="stats-grid secondary-stats">
        <div className="stat-card compact">
          <div className="stat-icon-sm">
            <TrendingUp size={16} />
          </div>
          <div>
            <span>PEOPLE FLOW</span>
            <strong>{scenario.people_flow}</strong>
            <small>Estimated movement rate</small>
          </div>
        </div>

        <div className="stat-card compact">
          <div className="stat-icon-sm">
            <Compass size={16} />
          </div>
          <div>
            <span>ZONES MONITORED</span>
            <strong>3 / 3</strong>
            <small>Panchavati sector active</small>
          </div>
        </div>

        <div className="stat-card compact">
          <div className="stat-icon-sm">
            <Camera size={16} />
          </div>
          <div>
            <span>CAMERAS ONLINE</span>
            <strong>1 / 1</strong>
            <small>YOLOv8 ByteTrack active</small>
          </div>
        </div>

        <div className="stat-card compact">
          <div className="stat-icon-sm">
            <Activity size={16} />
          </div>
          <div>
            <span>PEAK OCCUPANCY</span>
            <strong>{scenario.peak_occupancy}</strong>
            <small>Peak sector threshold</small>
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

            <div className="header-actions">
              <span className="camera-live">
                <span className="pulse" />
                CAMERA 01
              </span>
              <button
                className="btn-header-expand"
                onClick={() => setIsFeedExpanded(true)}
              >
                Expand <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="video-container">
            <video
              className="crowd-video"
              src="/zones_web.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
            />

            <div className="video-top-overlay">
              <span className="cam-title">CAMERA 01</span>
              <span className="cam-sub">PANCHAVATI</span>
            </div>

            <div className="video-bottom-overlay">
              <span>YOLOv8n Person</span>
              <span>ByteTrack</span>
              <span className="active-tag">Active Analysis</span>
            </div>
          </div>
        </div>

        {/* ===================================================
            INTERACTIVE MAP
            =================================================== */}

        <div className="panel map-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">SPATIAL INTELLIGENCE</span>

              <h3>Panchavati Sectors</h3>
            </div>

            <button
              className="btn-header-expand"
              onClick={() => setActiveTab("crowd-map")}
            >
              Expand <ChevronRight size={14} />
            </button>
          </div>

          <div className="heatmap leaflet-map-container">
            <MapContainer
              center={[20.0067, 73.7936]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
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
                        <span>
                          {z.people}% • {z.risk}
                        </span>
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
          EMERGENCY COMMUNICATION SUMMARY
          ===================================================== */}

      <section className="panel ivr-dash-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">EMERGENCY COMMUNICATION</span>
            <h3>Emergency Communication</h3>
            <p className="panel-sub">Voice-based incident reporting</p>
          </div>
          <span className="demo-state-badge">
            <span className="online-dot" /> Dual-Channel IVR Active
          </span>
        </div>

        <div className="ivr-dash-cards-grid">
          {/* STANDARD IVR CARD */}
          <div className="ivr-dash-card standard">
            <div className="idc-header">
              <div className="idc-title-group">
                <div className="idc-icon-box standard">
                  <Radio size={16} />
                </div>
                <div>
                  <h4>STANDARD IVR</h4>
                  <span className="idc-kicker gold">Guided Assistance</span>
                </div>
              </div>
              <button
                className="btn-open-ivr"
                onClick={() => setActiveTab("ivr")}
              >
                Open IVR <ChevronRight size={13} />
              </button>
            </div>

            <div className="idc-metrics">
              <div className="idc-metric">
                <span>CALLS TODAY</span>
                <strong>24</strong>
              </div>
              <div className="idc-metric">
                <span>ACTIVE REPORTS</span>
                <strong>3</strong>
              </div>
            </div>

            <div className="idc-flow">
              <span className="flow-lbl">FLOW:</span>
              <div className="idc-flow-steps">
                <span className="step-chip">Language</span>
                <span className="arrow">→</span>
                <span className="step-chip">Issue</span>
                <span className="arrow">→</span>
                <span className="step-chip">Zone</span>
              </div>
            </div>
          </div>

          {/* EXTREME EMERGENCY IVR CARD */}
          <div className="ivr-dash-card extreme">
            <div className="idc-header">
              <div className="idc-title-group">
                <div className="idc-icon-box extreme">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <h4>EXTREME EMERGENCY</h4>
                  <span className="idc-kicker critical">Immediate Response</span>
                </div>
              </div>
              <button
                className="btn-open-ivr extreme"
                onClick={() => setActiveTab("ivr")}
              >
                Open IVR <ChevronRight size={13} />
              </button>
            </div>

            <div className="idc-metrics">
              <div className="idc-metric">
                <span>CALLS TODAY</span>
                <strong>7</strong>
              </div>
              <div className="idc-metric">
                <span>CRITICAL REPORTS</span>
                <strong className="red-text">2</strong>
              </div>
            </div>

            <div className="idc-flow">
              <span className="flow-lbl">FLOW:</span>
              <div className="idc-flow-steps">
                <span className="step-chip press-one">Press 1</span>
                <span className="arrow">→</span>
                <span className="step-chip">Zone</span>
                <span className="arrow">→</span>
                <span className="step-chip alert-tag">Alert</span>
              </div>
            </div>
          </div>
        </div>

        {/* IVR CONNECTION VISUAL */}
        <div className="ivr-connection-visual">
          <div className="diagram-node standard">STANDARD IVR</div>
          <div className="diagram-connector-left">─────┐</div>
          <div className="diagram-connector-join">├──→</div>
          <div className="diagram-connector-right">─────┘</div>
          <div className="diagram-node extreme">EXTREME IVR</div>
          <div className="diagram-target-box">
            <strong>PRAVAHA INCIDENT SYSTEM</strong>
          </div>
          <div className="diagram-arrow">──→</div>
          <div className="diagram-target-box response">
            <strong>AUTHORITY RESPONSE</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          OPERATIONAL INTELLIGENCE PANEL
          ===================================================== */}

      <section className="panel op-intel-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">OPERATIONAL INTELLIGENCE</span>
            <h3>Sector Overview & Insights</h3>
          </div>
          <span className="demo-state-badge">
            <span className="online-dot" /> Demo monitoring state
          </span>
        </div>

        <div className="op-intel-grid">
          <div className="op-intel-card">
            <div className="op-intel-header">
              <Zap size={15} className="icon-gold" />
              <span>CROWD FLOW</span>
            </div>
            <strong>{scenario.crowd_flow_insight}</strong>
          </div>

          <div className="op-intel-card">
            <div className="op-intel-header">
              <Radio size={15} className="icon-gold" />
              <span>AI PREDICTION</span>
            </div>
            <strong>{scenario.prediction_insight}</strong>
          </div>

          <div className="op-intel-card">
            <div className="op-intel-header">
              <CircleAlert size={15} className="icon-gold" />
              <span>RESPONSE STATUS</span>
            </div>
            <strong>{scenario.response_insight}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          BALANCED LOWER GRID
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

      {/* =====================================================
          EXPANDED LIVE CROWD FEED MODAL
          ===================================================== */}
      {isFeedExpanded && (
        <div className="expanded-feed-overlay" onClick={() => setIsFeedExpanded(false)}>
          <div className="expanded-feed-modal" onClick={(e) => e.stopPropagation()}>
            <div className="expanded-feed-header">
              <div className="expanded-feed-title">
                <Camera size={20} className="icon-gold" />
                <div>
                  <h3>CAMERA 01 • PANCHAVATI</h3>
                  <span className="cam-live-tag">
                    <span className="pulse" /> ● LIVE MONITORING
                  </span>
                </div>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setIsFeedExpanded(false)}
              >
                <X size={16} /> Close
              </button>
            </div>

            <div className="expanded-video-viewport">
              <video
                className="expanded-video-player"
                src="/zones_web.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
              />

              <div className="cam-overlay-top">
                <span className="cam-overlay-title">CAMERA 01</span>
                <span className="cam-overlay-loc">PANCHAVATI</span>
                <span className="cam-overlay-live">
                  <span className="pulse" /> ● LIVE
                </span>
              </div>

              <div className="cam-overlay-bottom">
                <span className="cam-tech-chip">YOLOv8n</span>
                <span className="cam-tech-chip">BYTETRACK</span>
                <span className="cam-tech-chip highlight">ZONE ANALYSIS ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
