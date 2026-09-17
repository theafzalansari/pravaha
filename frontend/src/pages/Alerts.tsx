import {
  Activity,
  AlertTriangle,
  Bell,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { AlertFilter, DemoMode, TabType } from "../types";
import { DEMO_ALERTS } from "../data/demoData";

interface AlertsProps {
  demoMode: DemoMode;
  alertFilter: AlertFilter;
  setAlertFilter: (filter: AlertFilter) => void;
  setSelectedZone: (zone: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export function Alerts({
  demoMode,
  alertFilter,
  setAlertFilter,
  setSelectedZone,
  setActiveTab,
}: AlertsProps) {
  const alertsList = DEMO_ALERTS[demoMode] || [];
  const criticalCount = alertsList.filter((a) => a.risk === "CRITICAL").length;
  const highCount = alertsList.filter((a) => a.risk === "HIGH").length;
  const activeCount = alertsList.filter((a) => a.status === "ACTIVE").length;

  const filteredAlerts = alertsList.filter((alert) => {
    if (alertFilter === "All") return true;
    if (alertFilter === "Critical") return alert.risk === "CRITICAL";
    if (alertFilter === "High") return alert.risk === "HIGH";
    if (alertFilter === "Warning") return alert.risk === "WARNING";
    if (alertFilter === "Resolved")
      return alert.status === "RESOLVED" || alert.risk === "RESOLVED";
    return true;
  });

  return (
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
          {(["All", "Critical", "High", "Warning", "Resolved"] as const).map(
            (filter) => (
              <button
                key={filter}
                className={`filter-chip ${
                  alertFilter === filter ? "active" : ""
                }`}
                onClick={() => setAlertFilter(filter)}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. ALERT LIST */}
      <div className="alerts-list-container">
        {filteredAlerts.length === 0 ? (
          <div className="panel no-alerts-panel">
            <ShieldCheck
              size={36}
              style={{ color: "#3d9560", marginBottom: "8px" }}
            />
            <h4>No Alerts Found</h4>
            <p>
              There are no alerts matching the selected filter in current mode.
            </p>
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
  );
}
