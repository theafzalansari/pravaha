import { Menu } from "lucide-react";
import type { DemoMode, TabType } from "../types";
import { PravahaLogo } from "./PravahaLogo";

interface TopbarProps {
  activeTab: TabType;
  demoMode: DemoMode;
  setDemoMode: (mode: DemoMode) => void;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function Topbar({
  activeTab,
  demoMode,
  setDemoMode,
  theme = "light",
  setTheme,
  isMobileOpen = false,
  setIsMobileOpen,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-header-left">
        <div className="topbar-mobile-brand">
          <PravahaLogo size={22} />
          <span className="mobile-brand-title">PRAVAHA</span>
        </div>

        <div className="topbar-title-group">
          <p className="eyebrow">◇ KUMBH MELA • AUTHORITY VIEW</p>
          <h2>
            {activeTab === "ivr"
              ? "Emergency IVR"
              : activeTab === "analytics"
              ? "Analytics"
              : activeTab === "cameras"
              ? "Live Cameras"
              : activeTab === "crowd-map"
              ? "Crowd Map"
              : activeTab === "alerts"
              ? "Alerts"
              : activeTab === "settings"
              ? "Settings"
              : "Command Center"}
          </h2>
        </div>

        {setIsMobileOpen && (
          <button
            className="mobile-menu-toggle-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Navigation Menu"
            title="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* DEMO MODE CONTROLLER */}
      <div className="demo-mode-bar">
        <span className="demo-label">DEMO MODE:</span>
        {(["NORMAL", "RISING", "HIGH", "CRITICAL"] as const).map((mode) => (
          <button
            key={mode}
            className={`demo-btn ${
              demoMode === mode ? "active" : ""
            } ${mode.toLowerCase()}`}
            onClick={() => setDemoMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="top-actions">
        {/* THEME TOGGLE */}
        {setTheme && (
          <div className="theme-mode-bar">
            <span className="theme-label">THEME:</span>
            <button
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              LIGHT
            </button>
            <button
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              DARK
            </button>
          </div>
        )}

        <div className="live-status">
          <span className="pulse" />
          LIVE MONITORING
        </div>

        <div className="time">12:06:24 PM</div>

        <button className="profile">AA</button>
      </div>
    </header>
  );
}

