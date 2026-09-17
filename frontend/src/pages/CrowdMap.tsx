import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import { Map } from "lucide-react";
import type { DemoMode } from "../types";
import { DEMO_SCENARIOS, ZONE_LOCATIONS, getZoneHexColor } from "../data/demoData";

interface CrowdMapProps {
  demoMode: DemoMode;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
}

export function CrowdMap({
  demoMode,
  selectedZone,
  setSelectedZone,
}: CrowdMapProps) {
  const scenario = DEMO_SCENARIOS[demoMode];
  const zones = scenario.zones;
  const selected =
    zones.find((zone) => zone.name === selectedZone) || zones[0];
  const getZone = (name: string) =>
    zones.find((z) => z.name === name) || zones[0];

  return (
    <div className="crowd-map-page-container">
      {/* 1. HEADER */}
      <div className="panel crowd-map-header-panel">
        <div className="crowd-map-header-info">
          <span className="welcome-tag">
            <Map size={15} />
            SPATIAL INTELLIGENCE
          </span>
          <h3>Crowd Map</h3>
          <p>Panchavati • Real-time zone intelligence</p>
        </div>
        <div className="live-status-badge">
          <span className="online-dot" />
          <span>LIVE MONITORING</span>
        </div>
      </div>

      {/* 2. LARGE INTERACTIVE MAP */}
      <div className="panel dedicated-map-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">MONITORED SECTOR: NASHIK</span>
            <h3>Panchavati Command Map</h3>
            <p className="panel-sub">
              PRAVAHA Prototype Monitoring Zones A, B & C
            </p>
          </div>

          <div className="map-legend inline-legend">
            <span>
              <i className="legend-safe" /> Safe
            </span>
            <span>
              <i className="legend-warning" /> Warning
            </span>
            <span>
              <i className="legend-high" /> High
            </span>
            <span>
              <i className="legend-critical" /> Critical
            </span>
          </div>
        </div>

        <div className="heatmap dedicated-map-container">
          <MapContainer
            center={[20.0067, 73.7936]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
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
      </div>

      {/* 4. SELECTED ZONE DETAILS */}
      <div className="panel selected-zone-details-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">INTERACTIVE INSPECTION</span>
            <h3>Selected Sector Details: {selected.name}</h3>
          </div>

          <span className={`status-pill ${selected.color}`}>
            {selected.risk}
          </span>
        </div>

        <div className="zone-info">
          <div className="zone-main">
            <h4>{selected.name}</h4>
            <span className="zone-sub">
              {ZONE_LOCATIONS[selected.name]?.description ||
                "Primary monitored sector"}
            </span>
          </div>

          <div className="zone-metrics">
            <div className="metric">
              <span>OCCUPANCY</span>
              <strong>{selected.people}%</strong>
            </div>

            <div className="metric">
              <span>ESTIMATED PEOPLE</span>
              <strong>{selected.people}</strong>
            </div>

            <div className="metric">
              <span>RISK LEVEL</span>
              <strong className={selected.color}>{selected.risk}</strong>
            </div>

            <div className="metric">
              <span>PREDICTION</span>
              <strong>{selected.prediction}</strong>
            </div>
          </div>

          <div className="zone-action" style={{ marginTop: "12px" }}>
            <span>RECOMMENDED ACTION</span>
            <strong>{selected.action}</strong>
          </div>
        </div>
      </div>

      {/* 6. ZONE SUMMARY CARDS */}
      <div className="zone-summary-cards-grid">
        {(["Zone A", "Zone B", "Zone C"] as const).map((zName) => {
          const zData = getZone(zName);
          const isSelected = selectedZone === zName;
          const loc = ZONE_LOCATIONS[zName];

          return (
            <div
              key={zName}
              className={`panel zone-summary-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => setSelectedZone(zName)}
            >
              <div className="zsc-header">
                <div>
                  <h4>{zName}</h4>
                  <small>{loc.description}</small>
                </div>
                <span className={`status-pill ${zData.color}`}>
                  {zData.risk}
                </span>
              </div>

              <div className="zsc-metrics">
                <div>
                  <span>PEOPLE</span>
                  <strong>{zData.people}</strong>
                </div>
                <div>
                  <span>OCCUPANCY</span>
                  <strong>{zData.people}%</strong>
                </div>
              </div>

              <div className="zsc-progress">
                <div
                  className={`zsc-bar ${zData.color}`}
                  style={{ width: `${zData.people}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
