import {
  AlertTriangle,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Phone,
  Radio,
  ShieldAlert,
  UserX,
  Users,
  Zap,
} from "lucide-react";

interface EmergencyIVRProps {
  setSelectedFlowModal: (modal: "standard" | "extreme" | null) => void;
}

export function EmergencyIVR({ setSelectedFlowModal }: EmergencyIVRProps) {
  return (
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
              <span className="chip">
                <ShieldAlert size={12} /> Emergency Help
              </span>
              <span className="chip">
                <Users size={12} /> Crowd Issue
              </span>
              <span className="chip">
                <UserX size={12} /> Missing Person
              </span>
              <span className="chip">
                <HelpCircle size={12} /> Volunteer / Help Desk
              </span>
            </div>
          </div>

          <button
            className="btn-view-flow"
            onClick={() => setSelectedFlowModal("standard")}
          >
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
              <div className="priority-tag">
                <AlertTriangle size={12} /> HIGH PRIORITY
              </div>
              <h3>Extreme Emergency IVR</h3>
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

          <button
            className="btn-view-flow extreme"
            onClick={() => setSelectedFlowModal("extreme")}
          >
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
              <div className="node">
                <span>1</span>CALL
              </div>
              <div className="arrow">→</div>
              <div className="node">
                <span>2</span>LANGUAGE
              </div>
              <div className="arrow">→</div>
              <div className="node">
                <span>3</span>ASSISTANCE TYPE
              </div>
              <div className="arrow">→</div>
              <div className="node">
                <span>4</span>ZONE
              </div>
              <div className="arrow">→</div>
              <div className="node">
                <span>5</span>INCIDENT CREATED
              </div>
              <div className="arrow">→</div>
              <div className="node alert-node">
                <span>6</span>AUTHORITY ALERT
              </div>
            </div>
          </div>

          {/* Extreme IVR Flow */}
          <div className="visual-flow-card extreme">
            <div className="flow-card-header extreme">
              <Zap size={16} />
              <strong>EXTREME EMERGENCY IVR FLOW</strong>
            </div>
            <div className="flow-nodes-horizontal">
              <div className="node extreme">
                <span>1</span>CALL
              </div>
              <div className="arrow">→</div>
              <div className="node urgent">
                <span>2</span>PRESS 1
              </div>
              <div className="arrow">→</div>
              <div className="node extreme">
                <span>3</span>ZONE
              </div>
              <div className="arrow">→</div>
              <div className="node critical">
                <span>4</span>CRITICAL ALERT
              </div>
              <div className="arrow">→</div>
              <div className="node response">
                <span>5</span>AUTHORITY RESPONSE
              </div>
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
                  <span className="incident-type">
                    <ShieldAlert size={14} /> Medical
                  </span>
                </td>
                <td>
                  <span className="channel-badge extreme">Extreme IVR</span>
                </td>
                <td>
                  <strong>Zone A</strong>
                </td>
                <td>
                  <span className="status-badge critical">CRITICAL</span>
                </td>
                <td>12:01 PM</td>
              </tr>
              <tr>
                <td>
                  <span className="incident-type">
                    <Users size={14} /> Crowd Issue
                  </span>
                </td>
                <td>
                  <span className="channel-badge standard">Standard IVR</span>
                </td>
                <td>
                  <strong>Zone B</strong>
                </td>
                <td>
                  <span className="status-badge safe">RESOLVED</span>
                </td>
                <td>5:04 PM</td>
              </tr>
              <tr>
                <td>
                  <span className="incident-type">
                    <Zap size={14} /> Extreme Emergency
                  </span>
                </td>
                <td>
                  <span className="channel-badge extreme">Extreme IVR</span>
                </td>
                <td>
                  <strong>Zone C</strong>
                </td>
                <td>
                  <span className="status-badge critical">CRITICAL</span>
                </td>
                <td>4:58 PM</td>
              </tr>
              <tr>
                <td>
                  <span className="incident-type">
                    <AlertTriangle size={14} /> Blocked Route
                  </span>
                </td>
                <td>
                  <span className="channel-badge standard">Standard IVR</span>
                </td>
                <td>
                  <strong>Zone B</strong>
                </td>
                <td>
                  <span className="status-badge warning">ACTIVE</span>
                </td>
                <td>4:42 PM</td>
              </tr>
              <tr>
                <td>
                  <span className="incident-type">
                    <Zap size={14} /> Extreme Emergency
                  </span>
                </td>
                <td>
                  <span className="channel-badge extreme">Extreme IVR</span>
                </td>
                <td>
                  <strong>Zone B</strong>
                </td>
                <td>
                  <span className="status-badge critical">CRITICAL</span>
                </td>
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
  );
}
