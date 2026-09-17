import { Activity, CircleAlert, Gauge, Users } from "lucide-react";
import type { DemoMode } from "../types";
import { ANALYTICS_TRENDS, DEMO_SCENARIOS, INSIGHTS } from "../data/demoData";

interface AnalyticsProps {
  demoMode: DemoMode;
}

export function Analytics({ demoMode }: AnalyticsProps) {
  const scenario = DEMO_SCENARIOS[demoMode];
  const zones = scenario.zones;

  return (
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
            <p className="panel-sub">
              Occupancy across monitored zones (Last 60 minutes)
            </p>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <i className="dot zone-a" /> Zone A
            </span>
            <span className="legend-item">
              <i className="dot zone-b" /> Zone B
            </span>
            <span className="legend-item">
              <i className="dot zone-c" /> Zone C
            </span>
          </div>
        </div>

        <div className="svg-chart-wrapper">
          <svg
            className="analytics-svg-chart"
            viewBox="0 0 600 220"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = 180 - (val / 100) * 140;
              return (
                <g key={val}>
                  <line
                    x1="40"
                    y1={y}
                    x2="570"
                    y2={y}
                    stroke="#e9e5dc"
                    strokeDasharray="3,3"
                  />
                  <text
                    x="30"
                    y={y + 4}
                    fill="#858077"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* X Axis Labels */}
            {ANALYTICS_TRENDS[demoMode].map((item, idx) => {
              const x = 40 + (idx / 5) * 530;
              return (
                <text
                  key={item.time}
                  x={x}
                  y="205"
                  fill="#858077"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {item.time}
                </text>
              );
            })}

            {/* Line Paths & Circles */}
            {(() => {
              const trend = ANALYTICS_TRENDS[demoMode];
              const pointsA = trend.map((d, i) => ({
                x: 40 + (i / 5) * 530,
                y: 180 - (d.zoneA / 100) * 140,
              }));
              const pointsB = trend.map((d, i) => ({
                x: 40 + (i / 5) * 530,
                y: 180 - (d.zoneB / 100) * 140,
              }));
              const pointsC = trend.map((d, i) => ({
                x: 40 + (i / 5) * 530,
                y: 180 - (d.zoneC / 100) * 140,
              }));

              const pathA =
                "M " + pointsA.map((p) => `${p.x},${p.y}`).join(" L ");
              const pathB =
                "M " + pointsB.map((p) => `${p.x},${p.y}`).join(" L ");
              const pathC =
                "M " + pointsC.map((p) => `${p.x},${p.y}`).join(" L ");

              return (
                <>
                  {/* Zone A Line (Green) */}
                  <path
                    d={pathA}
                    fill="none"
                    stroke="#3d9560"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pointsA.map((p, idx) => (
                    <circle
                      key={`a-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#3d9560"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Zone C Line (Amber) */}
                  <path
                    d={pathC}
                    fill="none"
                    stroke="#c79528"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pointsC.map((p, idx) => (
                    <circle
                      key={`c-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#c79528"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Zone B Line (Red/Saffron) */}
                  <path
                    d={pathB}
                    fill="none"
                    stroke="#c94b3d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pointsB.map((p, idx) => (
                    <circle
                      key={`b-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#c94b3d"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
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
                  <span className={`status-pill ${zone.color}`}>
                    {zone.risk}
                  </span>
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
                  <div
                    className={`zac-progress-fill ${zone.color}`}
                    style={{ width: `${zone.people}%` }}
                  />
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
            {(["SAFE", "WARNING", "HIGH", "CRITICAL"] as const).map(
              (level) => {
                const count = zones.filter(
                  (z) => z.risk.toUpperCase() === level
                ).length;
                const pct = Math.round((count / zones.length) * 100);
                const colorClass = level.toLowerCase();

                return (
                  <div key={level} className="risk-dist-row">
                    <div className="risk-dist-label">
                      <span className={`risk-dot ${colorClass}`} />
                      <strong>{level}</strong>
                    </div>
                    <div className="risk-dist-bar-wrap">
                      <div
                        className={`risk-dist-bar ${colorClass}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="risk-dist-count">
                      {count} {count === 1 ? "Zone" : "Zones"}
                    </span>
                  </div>
                );
              }
            )}
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
  );
}
