import { useState } from "react";
import {
  Activity,
  Bell,
  Camera,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  LayoutDashboard,
  Map,
  Radio,
  Settings,
} from "lucide-react";
import { PravahaLogo } from "./PravahaLogo";
import type { TabType } from "../types";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeAlerts: number;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  activeAlerts,
  isCollapsed: controlledIsCollapsed,
  setIsCollapsed: controlledSetIsCollapsed,
}: SidebarProps) {
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  const isCollapsed = controlledIsCollapsed ?? localIsCollapsed;
  const toggleCollapse = () => {
    if (controlledSetIsCollapsed) {
      controlledSetIsCollapsed(!isCollapsed);
    } else {
      setLocalIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="brand-header">
        <div className="brand" title={isCollapsed ? "PRAVAHA AI Crowd Intelligence" : undefined}>
          <div className="brand-symbol">
            <PravahaLogo size={isCollapsed ? 20 : 24} />
          </div>

          {!isCollapsed && (
            <div className="brand-title-group">
              <h1>PRAVAHA</h1>
              <span>AI CROWD INTELLIGENCE</span>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle-btn"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      <div className="culture-line" />

      <nav>
        {!isCollapsed && (
          <div className="nav-section-header">
            <span className="nav-section-marker">◆</span>
            <span className="nav-label">COMMAND CENTER</span>
          </div>
        )}

        <button
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
          title={isCollapsed ? "Home Page" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "home" ? "◈" : "◇"}</span>
          )}
          <HomeIcon size={18} />
          {!isCollapsed && <span>Home Page</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "dashboard" ? "◈" : "◇"}</span>
          )}
          <LayoutDashboard size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "crowd-map" ? "active" : ""}`}
          onClick={() => setActiveTab("crowd-map")}
          title={isCollapsed ? "Crowd Map" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "crowd-map" ? "◈" : "◇"}</span>
          )}
          <Map size={18} />
          {!isCollapsed && <span>Crowd Map</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "cameras" ? "active" : ""}`}
          onClick={() => setActiveTab("cameras")}
          title={isCollapsed ? "Live Cameras" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "cameras" ? "◈" : "◇"}</span>
          )}
          <Camera size={18} />
          {!isCollapsed && <span>Live Cameras</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
          title={isCollapsed ? "Alerts" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "alerts" ? "◈" : "◇"}</span>
          )}
          <Bell size={18} />
          {!isCollapsed && <span>Alerts</span>}
          <span className="alert-count">{activeAlerts}</span>
        </button>

        <button
          className={`nav-item ${activeTab === "ivr" ? "active" : ""}`}
          onClick={() => setActiveTab("ivr")}
          title={isCollapsed ? "Emergency IVR" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "ivr" ? "◈" : "◇"}</span>
          )}
          <Radio size={18} />
          {!isCollapsed && <span>Emergency IVR</span>}
        </button>

        {!isCollapsed && (
          <div className="nav-section-header second">
            <span className="nav-section-marker">◆</span>
            <span className="nav-label">SYSTEM</span>
          </div>
        )}

        <button
          className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
          title={isCollapsed ? "Analytics" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "analytics" ? "◈" : "◇"}</span>
          )}
          <Activity size={18} />
          {!isCollapsed && <span>Analytics</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
          title={isCollapsed ? "Settings" : undefined}
        >
          {!isCollapsed && (
            <span className="nav-item-marker">{activeTab === "settings" ? "◈" : "◇"}</span>
          )}
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div
          className="system-status"
          title={isCollapsed ? "PRAVAHA Status: System Operational" : undefined}
        >
          <span className="status-dot" />

          {!isCollapsed ? (
            <div className="status-module">
              <div className="status-kicker">◇ PRAVAHA STATUS</div>
              <div className="status-rows">
                <div className="status-row">
                  <span>● AI PIPELINE</span>
                  <strong className="active">ACTIVE</strong>
                </div>
                <div className="status-row">
                  <span>● CAMERA 01</span>
                  <strong className="online">ONLINE</strong>
                </div>
                <div className="status-row">
                  <span>● ALERT ENGINE</span>
                  <strong className="ready">READY</strong>
                </div>
              </div>
              <div className="status-footer">SYSTEM OPERATIONAL</div>
            </div>
          ) : (
            <span className="status-mini-tag">OP</span>
          )}
        </div>
      </div>
    </aside>
  );
}
