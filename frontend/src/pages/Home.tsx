import { useState } from "react";
import {
  ArrowRight,
  Shield,
  Eye,
  TrendingUp,
  AlertTriangle,
  Phone,
  Activity,
  Layers,
  MapPin,
  Cpu,
  Video,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  Map,
  Camera,
  Bell,
  Radio,
  Settings,
  Home as HomeIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import { PravahaLogo } from "../components/PravahaLogo";
import type { TabType, DemoMode } from "../types";
import { DEMO_SCENARIOS, ZONE_LOCATIONS, getZoneHexColor } from "../data/demoData";

interface HomeProps {
  demoMode?: DemoMode;
  setActiveTab: (tab: TabType) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export function Home({
  demoMode = "HIGH",
  setActiveTab,
  theme,
  setTheme,
}: HomeProps) {
  const [activeTabSection, setActiveTabSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scenario = DEMO_SCENARIOS[demoMode];
  const zones = scenario.zones;
  const getZone = (name: string) =>
    zones.find((z) => z.name === name) || zones[0];

  // Smooth scroll handler for anchor links
  const scrollTo = (id: string) => {
    setActiveTabSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      {/* 1. STICKY LANDING NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => scrollTo("hero")}>
            <div className="landing-brand-logo">
              <PravahaLogo size={26} />
            </div>
            <div className="landing-brand-text">
              <span className="brand-name">PRAVAHA</span>
              <span className="brand-sub">AI CROWD INTELLIGENCE</span>
            </div>
          </div>

          <nav className="landing-nav-links">
            <button
              className={`nav-link ${activeTabSection === "overview" ? "active" : ""}`}
              onClick={() => scrollTo("hero")}
            >
              Overview
            </button>
            <button
              className={`nav-link ${activeTabSection === "how-it-works" ? "active" : ""}`}
              onClick={() => scrollTo("how-it-works")}
            >
              How It Works
            </button>
            <button
              className={`nav-link ${activeTabSection === "ai-vision" ? "active" : ""}`}
              onClick={() => scrollTo("ai-vision")}
            >
              AI Intelligence
            </button>
            <button
              className={`nav-link ${activeTabSection === "emergency" ? "active" : ""}`}
              onClick={() => scrollTo("emergency")}
            >
              Emergency
            </button>
          </nav>

          <div className="landing-nav-actions">
            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span className="theme-label">{theme === "light" ? "DARK" : "LIGHT"}</span>
            </button>

            {/* GET STARTED Button */}
            <button
              className="btn-get-started"
              onClick={() => setActiveTab("dashboard")}
            >
              <span>GET STARTED</span>
              <ArrowRight size={16} />
            </button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="mobile-drawer">
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <PravahaLogo size={24} />
                <div className="mobile-drawer-brand-text">
                  <h2>PRAVAHA</h2>
                  <span>AI CROWD INTELLIGENCE</span>
                </div>
              </div>

              <button
                className="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-nav">
              <div className="mobile-drawer-nav-group-title">COMMAND CENTER</div>

              <button
                className="mobile-drawer-nav-item active"
                onClick={() => {
                  scrollTo("hero");
                  setMobileMenuOpen(false);
                }}
              >
                <HomeIcon size={18} />
                <span>HOME PAGE</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutDashboard size={18} />
                <span>DASHBOARD</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("crowd-map");
                  setMobileMenuOpen(false);
                }}
              >
                <Map size={18} />
                <span>CROWD MAP</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("cameras");
                  setMobileMenuOpen(false);
                }}
              >
                <Camera size={18} />
                <span>LIVE CAMERAS</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("alerts");
                  setMobileMenuOpen(false);
                }}
              >
                <Bell size={18} />
                <span>ALERTS</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("ivr");
                  setMobileMenuOpen(false);
                }}
              >
                <Radio size={18} />
                <span>EMERGENCY IVR</span>
              </button>

              <div className="mobile-drawer-nav-group-title">SYSTEM</div>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("analytics");
                  setMobileMenuOpen(false);
                }}
              >
                <Activity size={18} />
                <span>ANALYTICS</span>
              </button>

              <button
                className="mobile-drawer-nav-item"
                onClick={() => {
                  setActiveTab("settings");
                  setMobileMenuOpen(false);
                }}
              >
                <Settings size={18} />
                <span>SETTINGS</span>
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <button
                className="mobile-drawer-theme-btn"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                <span>{theme === "light" ? "SWITCH TO DARK THEME" : "SWITCH TO LIGHT THEME"}</span>
              </button>
            </div>
          </aside>
        </>
      )}


      {/* 2. HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-content-grid">
          {/* Left Side Copy */}
          <div className="hero-text-side">
            <div className="hero-badge">
              <span className="badge-marker">◈</span>
              <span className="badge-title">PRAVAHA</span>
              <span className="badge-sep">•</span>
              <span>AI CROWD INTELLIGENCE</span>
            </div>

            <h1 className="hero-headline">
              Observe. Predict. <br />
              <span className="gold-gradient-text">Prevent. Protect.</span>
            </h1>

            <p className="hero-support">
              AI-powered crowd intelligence for safer large gatherings.
            </p>

            <p className="hero-desc">
              PRAVAHA transforms live crowd surveillance into actionable intelligence — helping authorities detect risk, predict congestion and coordinate emergency response.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary-hero"
                onClick={() => setActiveTab("dashboard")}
              >
                <span>GET STARTED</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-secondary-hero"
                onClick={() => scrollTo("how-it-works")}
              >
                <span>EXPLORE PRAVAHA</span>
              </button>
            </div>

            <div className="hero-location-tag">
              <MapPin size={14} className="tag-icon" />
              <span>PROTOTYPE TESTBED: PANCHAVATI • GODAVARI BASIN, NASHIK</span>
            </div>
          </div>

          {/* Right Side Visual - REAL PANCHAVATI MAP */}
          <div className="hero-visual-side">
            <div className="hero-visual-card">
              <div className="visual-header">
                <div className="visual-title">
                  <Sparkles size={14} className="gold-icon" />
                  <span>PANCHAVATI INTELLIGENCE</span>
                </div>
                <div className="visual-live-tag">
                  <span className="pulse-dot" />
                  <span>LIVE INTELLIGENCE LOOP</span>
                </div>
              </div>

              {/* REAL INTERACTIVE PANCHAVATI MAP */}
              <div className="hero-map-wrapper">
                <MapContainer
                  center={[20.0067, 73.7936]}
                  zoom={14.5}
                  scrollWheelZoom={false}
                  style={{ height: "310px", width: "100%", borderRadius: "10px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {(["Zone A", "Zone B", "Zone C"] as const).map((zName) => {
                    const zData = getZone(zName);
                    const loc = ZONE_LOCATIONS[zName];
                    const hexColor = getZoneHexColor(zData.risk);

                    return (
                      <Circle
                        key={zName}
                        center={[loc.lat, loc.lng]}
                        radius={loc.radius}
                        pathOptions={{
                          color: hexColor,
                          fillColor: hexColor,
                          fillOpacity: 0.42,
                          weight: 2.5,
                        }}
                      >
                        <Tooltip permanent direction="top" className="hero-map-tooltip">
                          <div className="tooltip-zone-content">
                            <strong>{zName}</strong>
                            <span>{zData.people}% • {zData.risk}</span>
                          </div>
                        </Tooltip>
                      </Circle>
                    );
                  })}
                </MapContainer>

                {/* AI Overlay Badge */}
                <div className="hero-map-overlay-badge">
                  <span className="cam-pulse-dot" />
                  <span>● CAM-01 • AI MONITORING ACTIVE</span>
                </div>
              </div>

              {/* Loop Status Process Indicator */}
              <div className="visual-footer">
                <div className="pipeline-steps-mini">
                  <span className="step-tag active">01 OBSERVE</span>
                  <ChevronRight size={12} className="step-arrow" />
                  <span className="step-tag active">02 ANALYZE</span>
                  <ChevronRight size={12} className="step-arrow" />
                  <span className="step-tag active">03 PREDICT</span>
                  <ChevronRight size={12} className="step-arrow" />
                  <span className="step-tag active">04 ALERT</span>
                  <ChevronRight size={12} className="step-arrow" />
                  <span className="step-tag active">05 ACT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST & QUICK STATS STRIP */}
      <section className="stats-strip-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Eye size={20} className="gold-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-label">AI PERSON DETECTION</span>
              <strong className="stat-value">YOLOv8n</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Activity size={20} className="gold-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-label">REAL-TIME TRACKING</span>
              <strong className="stat-value">ByteTrack</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Layers size={20} className="gold-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-label">MONITORED ZONES</span>
              <strong className="stat-value">3 SECTORS</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Phone size={20} className="gold-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-label">EMERGENCY CHANNELS</span>
              <strong className="stat-value">2 IVR PATHS</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW PRAVAHA WORKS */}
      <section id="how-it-works" className="how-section">
        <div className="section-header center">
          <div className="section-kicker">
            <span>◆ INTELLIGENCE PIPELINE</span>
          </div>
          <h2 className="section-title">How PRAVAHA Works</h2>
          <p className="section-subtitle">
            A continuous closed-loop crowd safety intelligence workflow designed for real-time authority action.
          </p>
        </div>

        <div className="pipeline-grid">
          {/* Step 1 */}
          <div className="pipeline-card">
            <div className="card-step-num">01</div>
            <div className="card-icon">
              <Video size={24} />
            </div>
            <h3>OBSERVE</h3>
            <p>AI-powered camera monitoring</p>
            <span className="card-detail">Continuous stream analysis via YOLOv8 vision pipeline.</span>
          </div>

          <div className="pipeline-connector">
            <ArrowRight size={20} />
          </div>

          {/* Step 2 */}
          <div className="pipeline-card">
            <div className="card-step-num">02</div>
            <div className="card-icon">
              <Eye size={24} />
            </div>
            <h3>ANALYZE</h3>
            <p>Crowd density + flow</p>
            <span className="card-detail">Calculates occupancy percentage and directional movement velocity.</span>
          </div>

          <div className="pipeline-connector">
            <ArrowRight size={20} />
          </div>

          {/* Step 3 */}
          <div className="pipeline-card">
            <div className="card-step-num">03</div>
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <h3>PREDICT</h3>
            <p>Congestion risk</p>
            <span className="card-detail">Forecasts risk state evolution from SAFE to CRITICAL trends.</span>
          </div>

          <div className="pipeline-connector">
            <ArrowRight size={20} />
          </div>

          {/* Step 4 */}
          <div className="pipeline-card">
            <div className="card-step-num">04</div>
            <div className="card-icon">
              <AlertTriangle size={24} />
            </div>
            <h3>ALERT</h3>
            <p>Real-time authority alerts</p>
            <span className="card-detail">Triggers prioritized dispatch notifications & IVR intake.</span>
          </div>

          <div className="pipeline-connector">
            <ArrowRight size={20} />
          </div>

          {/* Step 5 */}
          <div className="pipeline-card highlight">
            <div className="card-step-num">05</div>
            <div className="card-icon">
              <Shield size={24} />
            </div>
            <h3>ACT</h3>
            <p>Recommended response</p>
            <span className="card-detail">Deploys barricade routing and crowd diversion protocols.</span>
          </div>
        </div>
      </section>

      {/* 5. AI VISION SECTION */}
      <section id="ai-vision" className="ai-vision-section">
        <div className="ai-vision-grid">
          <div className="vision-text-side">
            <div className="section-kicker">
              <span>◆ COMPUTER VISION LAYER</span>
            </div>
            <h2 className="section-title">See the Crowd. Understand the Crowd.</h2>
            <p className="vision-desc">
              PRAVAHA's vision layer processes live optical camera telemetry in real-time, detecting individuals, tracking trajectories across zones, and calculating precise spatial density.
            </p>

            <div className="vision-features-list">
              <div className="feature-item">
                <CheckCircle2 size={18} className="gold-check" />
                <div>
                  <strong>Person Detection</strong>
                  <p>YOLOv8 deep learning model trained for dense mass gatherings.</p>
                </div>
              </div>

              <div className="feature-item">
                <CheckCircle2 size={18} className="gold-check" />
                <div>
                  <strong>People Tracking</strong>
                  <p>ByteTrack multi-object tracking to preserve identity trajectories across occlusions.</p>
                </div>
              </div>

              <div className="feature-item">
                <CheckCircle2 size={18} className="gold-check" />
                <div>
                  <strong>Zone Analysis</strong>
                  <p>Dynamic sector partitioning for localized risk scoring in Panchavati.</p>
                </div>
              </div>

              <div className="feature-item">
                <CheckCircle2 size={18} className="gold-check" />
                <div>
                  <strong>Crowd Density & Flow</strong>
                  <p>Live people count per sq meter and directional motion vectors.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="vision-media-side">
            <div className="ai-camera-frame">
              <div className="frame-header">
                <div className="cam-title">
                  <span className="rec-dot" />
                  <span>CAM-01 • PANCHAVATI MAIN GHAT</span>
                </div>
                <div className="cam-hud-stats">
                  <span>FPS: 30</span>
                  <span>CONF: 94.2%</span>
                </div>
              </div>

              <div className="frame-video-wrapper">
                <video
                  src="/zones_web.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="ai-feed-video"
                />

                {/* AI HUD Overlay graphics */}
                <div className="hud-overlay">
                  <div className="hud-corner top-left" />
                  <div className="hud-corner top-right" />
                  <div className="hud-corner bottom-left" />
                  <div className="hud-corner bottom-right" />

                  {/* Simulated Bounding Box Overlay */}
                  <div className="ai-bbox bbox-1">
                    <span className="bbox-label">PERSON 98%</span>
                  </div>
                  <div className="ai-bbox bbox-2">
                    <span className="bbox-label">PERSON 96%</span>
                  </div>
                  <div className="ai-bbox bbox-3">
                    <span className="bbox-label">DENSE CLUSTER [ZONE B]</span>
                  </div>
                </div>
              </div>

              <div className="frame-footer">
                <span>AI VISION PIPELINE OPERATIONAL</span>
                <span>MODEL: YOLOv8n-CROWD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREDICTIVE INTELLIGENCE SECTION */}
      <section id="predictive" className="predictive-section">
        <div className="section-header center">
          <div className="section-kicker">
            <span>◆ RISK CLASSIFICATION ENGINE</span>
          </div>
          <h2 className="section-title">From Crowd Density to Crowd Intelligence</h2>
          <p className="section-subtitle">
            PRAVAHA continuously evaluates occupancy, crowd flow, risk level, trend, and congestion to trigger early warnings.
          </p>
        </div>

        <div className="risk-levels-grid">
          {/* SAFE */}
          <div className="risk-card safe">
            <div className="risk-badge">SAFE</div>
            <div className="risk-percent">&lt; 40%</div>
            <h4>NORMAL FLOW</h4>
            <p>Crowd density is optimal. Free movement maintained across ghats.</p>
            <div className="risk-bar"><div className="fill safe-fill" /></div>
          </div>

          {/* WARNING */}
          <div className="risk-card warning">
            <div className="risk-badge">WARNING</div>
            <div className="risk-percent">40% - 65%</div>
            <h4>MODERATE DENSITY</h4>
            <p>Pockets of slowing crowd movement. Patrol units alerted for monitoring.</p>
            <div className="risk-bar"><div className="fill warning-fill" /></div>
          </div>

          {/* HIGH */}
          <div className="risk-card high">
            <div className="risk-badge">HIGH</div>
            <div className="risk-percent">65% - 85%</div>
            <h4>CONGESTION RISING</h4>
            <p>Significant flow restriction. Recommend opening secondary bypass lanes.</p>
            <div className="risk-bar"><div className="fill high-fill" /></div>
          </div>

          {/* CRITICAL */}
          <div className="risk-card critical">
            <div className="risk-badge">CRITICAL</div>
            <div className="risk-percent">&gt; 85%</div>
            <h4>STAMPEDE RISK</h4>
            <p>Extreme bottleneck detected. Immediate barrier deployment required.</p>
            <div className="risk-bar"><div className="fill critical-fill" /></div>
          </div>
        </div>
      </section>

      {/* 7. PANCHAVATI GEOGRAPHIC ENVIRONMENT & SECTOR CARDS */}
      <section id="panchavati" className="panchavati-section">
        <div className="section-header center">
          <div className="section-kicker">
            <span>◆ GEOGRAPHIC PROTOTYPE ENVIRONMENT</span>
          </div>
          <h2 className="section-title">Built for Real-World Crowd Environments</h2>
          <p className="section-subtitle">
            Panchavati • Nashik — PRAVAHA overlays configurable monitoring zones on the Panchavati area to demonstrate real-time geographic crowd intelligence.
          </p>
          <div className="disclaimer-chip">
            <span>PRAVAHA PROTOTYPE MONITORING ZONES • NOT OFFICIAL ADMINISTRATIVE BOUNDARIES</span>
          </div>
        </div>

        {/* 3 EQUAL-WIDTH & EQUAL-HEIGHT SECTOR CARDS */}
        <div className="sector-cards-grid">
          {(["Zone A", "Zone B", "Zone C"] as const).map((zName) => {
            const zData = getZone(zName);
            const loc = ZONE_LOCATIONS[zName];
            const hexColor = getZoneHexColor(zData.risk);

            return (
              <div key={zName} className={`sector-card risk-${zData.color}`}>
                <div className="sector-card-header">
                  <div>
                    <h4 className="sector-name">{zName}</h4>
                    <span className="sector-loc">{loc.description}</span>
                  </div>
                  <span
                    className="sector-status-pill"
                    style={{ backgroundColor: `${hexColor}18`, color: hexColor, borderColor: `${hexColor}40` }}
                  >
                    {zData.risk}
                  </span>
                </div>

                <div className="sector-card-body">
                  <div className="sector-metric-item">
                    <span>ESTIMATED PEOPLE</span>
                    <strong>{zData.people}</strong>
                  </div>
                  <div className="sector-metric-item">
                    <span>OCCUPANCY</span>
                    <strong>{zData.people}%</strong>
                  </div>
                </div>

                <div className="sector-card-progress">
                  <div
                    className="sector-progress-bar"
                    style={{ width: `${zData.people}%`, backgroundColor: hexColor }}
                  />
                </div>

                <div className="sector-card-footer">
                  <span>PREDICTION: {zData.prediction}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panchavati-cta-bar">
          <button
            className="btn-primary-hero small"
            onClick={() => setActiveTab("crowd-map")}
          >
            <span>OPEN COMMAND CROWD MAP</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 8. EMERGENCY COMMUNICATION & DUAL IVR */}
      <section id="emergency" className="emergency-section">
        <div className="section-header center">
          <div className="section-kicker">
            <span>◆ IVR EMERGENCY RESPONSE SYSTEM</span>
          </div>
          <h2 className="section-title">Help Is Only a Call Away</h2>
          <p className="section-subtitle">
            Two emergency communication paths. One response system.
          </p>
        </div>

        {/* DUAL IVR CARDS */}
        <div className="ivr-cards-grid">
          {/* STANDARD IVR */}
          <div className="ivr-card standard">
            <div className="ivr-header">
              <div className="ivr-type-badge">STANDARD IVR</div>
              <div className="ivr-status-available">
                <span className="status-dot green" />
                <span>● AVAILABLE</span>
              </div>
            </div>

            <h3>STANDARD EMERGENCY IVR</h3>
            <p className="ivr-desc">Guided assistance for emergency and crowd-related reports</p>

            <div className="phone-display">
              <Phone size={22} className="phone-icon" />
              <div className="phone-number-wrap">
                <strong className="phone-num">0204-8565-937</strong>
                <span className="demo-tag">DEMO NUMBER</span>
              </div>
            </div>

            {/* Voice Waveform Animation */}
            <div className="waveform-box">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <span className="wave-label">VOICE CHANNEL ACTIVE</span>
            </div>

            <div className="ivr-flow-pills">
              <span>CALL</span>
              <ChevronRight size={12} />
              <span>LANGUAGE</span>
              <ChevronRight size={12} />
              <span>ISSUE</span>
              <ChevronRight size={12} />
              <span>ZONE</span>
              <ChevronRight size={12} />
              <span>ALERT</span>
            </div>

            <button
              className="btn-ivr-explore"
              onClick={() => setActiveTab("ivr")}
            >
              <span>Explore Emergency IVR →</span>
            </button>
          </div>

          {/* EXTREME EMERGENCY IVR */}
          <div className="ivr-card extreme">
            <div className="ivr-header">
              <div className="ivr-type-badge extreme-badge">EXTREME EMERGENCY</div>
              <div className="ivr-status-available">
                <span className="status-dot red" />
                <span>● AVAILABLE</span>
              </div>
            </div>

            <h3>EXTREME EMERGENCY IVR</h3>
            <p className="ivr-desc">Minimal-step reporting when every second matters</p>

            <div className="phone-display extreme-display">
              <Phone size={22} className="phone-icon red" />
              <div className="phone-number-wrap">
                <strong className="phone-num">0951-3886-363</strong>
                <span className="demo-tag red">DEMO NUMBER</span>
              </div>
            </div>

            {/* Voice Waveform Animation */}
            <div className="waveform-box extreme-wave">
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <div className="wave-bar red" />
              <span className="wave-label red">RAPID INTENSE CHANNEL</span>
            </div>

            <div className="ivr-flow-pills">
              <span>CALL</span>
              <ChevronRight size={12} />
              <span>PRESS 1</span>
              <ChevronRight size={12} />
              <span>ZONE</span>
              <ChevronRight size={12} />
              <span>INSTANT ALERT</span>
            </div>

            <button
              className="btn-ivr-explore extreme-btn"
              onClick={() => setActiveTab("ivr")}
            >
              <span>Explore Emergency IVR →</span>
            </button>
          </div>
        </div>

        {/* 9. EMERGENCY FLOW VISUAL */}
        <div className="emergency-flow-diagram">
          <div className="flow-title">PRAVAHA EMERGENCY INCIDENT ENGINE</div>
          <div className="diagram-nodes">
            <div className="diagram-node">STANDARD IVR (0204-8565-937)</div>
            <div className="diagram-join">┐</div>
            <div className="diagram-node core">INCIDENT ENGINE</div>
            <div className="diagram-arrow">→</div>
            <div className="diagram-node alert">AUTHORITY ALERT</div>
            <div className="diagram-arrow">→</div>
            <div className="diagram-node action">RESPONSE ACTION</div>
            <div className="diagram-join left">┘</div>
            <div className="diagram-node">EXTREME IVR (0951-388-6363)</div>
          </div>
        </div>
      </section>

      {/* 10. FEATURES GRID */}
      <section id="features" className="features-section">
        <div className="section-header center">
          <div className="section-kicker">
            <span>◆ SYSTEM CAPABILITIES</span>
          </div>
          <h2 className="section-title">Comprehensive Crowd Safety Suite</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Cpu size={24} className="gold-icon" />
            <h4>AI CROWD DETECTION</h4>
            <p>Detect people accurately from multiple live optical camera feeds.</p>
          </div>

          <div className="feature-card">
            <Layers size={24} className="gold-icon" />
            <h4>ZONE INTELLIGENCE</h4>
            <p>Monitor configurable crowd sectors with localized risk boundaries.</p>
          </div>

          <div className="feature-card">
            <Activity size={24} className="gold-icon" />
            <h4>RISK ENGINE</h4>
            <p>Dynamic progression from SAFE → WARNING → HIGH → CRITICAL states.</p>
          </div>

          <div className="feature-card">
            <TrendingUp size={24} className="gold-icon" />
            <h4>CONGESTION PREDICTION</h4>
            <p>Identify rising crowd-risk trends before stampede thresholds occur.</p>
          </div>

          <div className="feature-card">
            <AlertTriangle size={24} className="gold-icon" />
            <h4>REAL-TIME ALERTS</h4>
            <p>Surface high-priority incidents requiring immediate authority attention.</p>
          </div>

          <div className="feature-card">
            <Shield size={24} className="gold-icon" />
            <h4>ACTION RECOMMENDATIONS</h4>
            <p>Suggest operational crowd-flow responses and barrier diversions.</p>
          </div>
        </div>
      </section>

      {/* 11. LANDING FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand" onClick={() => scrollTo("hero")}>
              <PravahaLogo size={24} />
              <div className="brand-text">
                <span className="title">PRAVAHA</span>
                <span className="sub">AI CROWD INTELLIGENCE</span>
              </div>
            </div>
            <p className="footer-tagline">"Observe. Predict. Prevent. Protect."</p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="footer-col">
            <h4>PLATFORM</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => setActiveTab("dashboard")}>Dashboard</button></li>
              <li><button onClick={() => setActiveTab("crowd-map")}>Crowd Map</button></li>
              <li><button onClick={() => setActiveTab("cameras")}>Live Cameras</button></li>
              <li><button onClick={() => setActiveTab("alerts")}>Alerts</button></li>
            </ul>
          </div>

          {/* Column 3: Emergency */}
          <div className="footer-col">
            <h4>EMERGENCY</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => setActiveTab("ivr")}>Standard IVR</button></li>
              <li><button onClick={() => setActiveTab("ivr")}>Extreme Emergency IVR</button></li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div className="footer-col info-col">
            <h4>PANCHAVATI PROTOTYPE</h4>
            <p className="footer-info-desc">
              AI-powered crowd intelligence for safer large gatherings.
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <span>© 2026 PRAVAHA • TechFusion Hackathon • Prototype</span>
            <span className="footer-disc-sep">•</span>
            <span className="footer-disc-text">"Prototype monitoring zones are for demonstration purposes."</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
