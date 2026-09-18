import {
  Activity,
  Camera,
  Gauge,
  Layers,
  Moon,
  Radio,
  Settings as SettingsIcon,
  Sun,
  Zap,
} from "lucide-react";
import type { DemoMode } from "../types";
import { DEMO_SCENARIOS } from "../data/demoData";

interface SettingsProps {
  demoMode: DemoMode;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

export function Settings({ demoMode, theme = "light", setTheme }: SettingsProps) {
  const scenario = DEMO_SCENARIOS[demoMode];

  return (
    <div className="settings-page-container">
      {/* 1. HEADER */}
      <div className="panel settings-header-panel">
        <div className="settings-header-info">
          <span className="welcome-tag">
            <SettingsIcon size={15} />
            SYSTEM CONFIGURATION
          </span>
          <h3>Settings</h3>
          <p>System configuration, operational themes, and monitoring status</p>
        </div>
        <div className="live-status-badge">
          <span className="online-dot" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="settings-grid">
        {/* THEME CONFIGURATION CARD */}
        {setTheme && (
          <div className="panel settings-card">
            <div className="card-title-group">
              {theme === "dark" ? (
                <Moon size={18} className="icon-gold" />
              ) : (
                <Sun size={18} className="icon-gold" />
              )}
              <h4>Application Theme</h4>
            </div>

            <div className="settings-status-list">
              <div className="settings-row">
                <div>
                  <strong>Command Center Theme</strong>
                  <small>Persisted operating mode</small>
                </div>
                <div className="theme-select-pills">
                  <button
                    className={`theme-chip ${theme === "light" ? "active" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    LIGHT
                  </button>
                  <button
                    className={`theme-chip ${theme === "dark" ? "active" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    DARK
                  </button>
                </div>
              </div>
            </div>

            <p className="settings-note-sub">
              Dark mode provides a night-time command center interface while preserving Indian heritage identity.
            </p>
          </div>
        )}
        {/* 2. SYSTEM STATUS CARD */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Activity size={18} className="icon-gold" />
            <h4>System Status</h4>
          </div>

          <div className="settings-status-list">
            <div className="settings-row">
              <span>PRAVAHA System</span>
              <span className="status-badge green">
                <span className="dot" /> ONLINE
              </span>
            </div>

            <div className="settings-row">
              <span>AI Monitoring</span>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <span>Backend</span>
              <span className="status-badge green">
                <span className="dot" /> CONNECTED
              </span>
            </div>

            <div className="settings-row">
              <span>Realtime Monitoring</span>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* 3. AI PIPELINE */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Zap size={18} className="icon-gold" />
            <h4>AI Monitoring</h4>
          </div>

          <div className="settings-status-list">
            <div className="settings-row">
              <div>
                <strong>Person Detection</strong>
                <small>YOLOv8n Vision Model</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Object Tracking</strong>
                <small>ByteTrack Multi-Object Tracker</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Zone Analysis</strong>
                <small>3 Monitored Sectors</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Risk Engine</strong>
                <small>Threshold Assessment Engine</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Congestion Prediction</strong>
                <small>Heuristic Predictive Model</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* 4. CAMERA CONFIGURATION */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Camera size={18} className="icon-gold" />
            <h4>Camera Configuration</h4>
          </div>

          <div className="camera-config-box">
            <div className="camera-config-header">
              <div className="camera-badge">
                <Camera size={16} />
                <strong>CAMERA 01</strong>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ONLINE
              </span>
            </div>

            <div className="camera-config-details">
              <div>
                <span>LOCATION</span>
                <strong>Panchavati</strong>
              </div>
              <div>
                <span>PURPOSE</span>
                <strong>AI Crowd Monitoring</strong>
              </div>
              <div>
                <span>STATUS</span>
                <strong style={{ color: "#3d9560" }}>ONLINE</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5. MONITORING ZONES */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Layers size={18} className="icon-gold" />
            <h4>Monitoring Zones</h4>
          </div>

          <div className="settings-status-list">
            <div className="settings-row">
              <div>
                <strong>Zone A</strong>
                <small>Ramkund Ghats Sector</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Zone B</strong>
                <small>Kalaram Temple Sector</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Zone C</strong>
                <small>Tapovan Entry Sector</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> ACTIVE
              </span>
            </div>
          </div>

          <p className="settings-note-sub">
            These are PRAVAHA prototype monitoring zones.
          </p>
        </div>

        {/* 6. EMERGENCY SYSTEM */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Radio size={18} className="icon-gold" />
            <h4>Emergency System</h4>
          </div>

          <div className="settings-status-list">
            <div className="settings-row">
              <div>
                <strong>Standard IVR</strong>
                <small>Guided voice emergency menu</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> CONFIGURED
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Extreme Emergency IVR</strong>
                <small>Rapid SOS bypass workflow</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> CONFIGURED
              </span>
            </div>

            <div className="settings-row">
              <div>
                <strong>Incident Alert Engine</strong>
                <small>Authority notification queue</small>
              </div>
              <span className="status-badge green">
                <span className="dot" /> CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* 7. DEMO CONFIGURATION */}
        <div className="panel settings-card">
          <div className="card-title-group">
            <Gauge size={18} className="icon-gold" />
            <h4>Demo Configuration</h4>
          </div>

          <div className="settings-status-list">
            <div className="settings-row">
              <span>Demo Mode</span>
              <span className="status-badge green">
                <span className="dot" /> ENABLED
              </span>
            </div>

            <div className="settings-row">
              <span>Current Scenario</span>
              <span className={`status-pill ${scenario.alert_color}`}>
                {demoMode}
              </span>
            </div>
          </div>

          <div className="demo-config-note">
            <p>
              "Demo Mode allows controlled crowd-risk scenarios for
              demonstration without changing the underlying AI vision
              pipeline."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
