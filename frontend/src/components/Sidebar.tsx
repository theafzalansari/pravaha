import {
  Activity,
  Bell,
  Camera,
  LayoutDashboard,
  Map,
  Radio,
  Settings,
  Waves,
} from "lucide-react";
import type { TabType } from "../types";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeAlerts: number;
}

export function Sidebar({ activeTab, setActiveTab, activeAlerts }: SidebarProps) {
  return (
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
          <span className="alert-count">{activeAlerts}</span>
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
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
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
  );
}
