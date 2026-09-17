import { useState, useEffect } from "react";
import "./App.css";

import type { DemoMode, TabType, AlertFilter } from "./types";
import { DEMO_SCENARIOS } from "./data/demoData";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { InteractiveFlowModal } from "./components/InteractiveFlowModal";

import { Dashboard } from "./pages/Dashboard";
import { CrowdMap } from "./pages/CrowdMap";
import { LiveCameras } from "./pages/LiveCameras";
import { Alerts } from "./pages/Alerts";
import { EmergencyIVR } from "./pages/EmergencyIVR";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";

function App() {
  const [demoMode, setDemoMode] = useState<DemoMode>("HIGH");
  const [selectedZone, setSelectedZone] = useState("Zone B");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("All");
  const [selectedFlowModal, setSelectedFlowModal] = useState<
    "standard" | "extreme" | null
  >(null);
  const [, setApiData] = useState<any | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setApiData(data);
      })
      .catch((err) => console.error("API fetch error:", err));
  }, []);

  const scenario = DEMO_SCENARIOS[demoMode];

  return (
    <div className="app">
      {/* Decorative background */}
      <div className="flow flow-one" />
      <div className="flow flow-two" />

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlerts={scenario.active_alerts}
      />

      {/* MAIN CONTENT AREA */}
      <main className="main">
        {/* TOPBAR HEADER */}
        <Topbar
          activeTab={activeTab}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
        />

        {/* PAGE RENDERING */}
        {activeTab === "dashboard" && (
          <Dashboard
            demoMode={demoMode}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "ivr" && (
          <EmergencyIVR setSelectedFlowModal={setSelectedFlowModal} />
        )}

        {activeTab === "analytics" && <Analytics demoMode={demoMode} />}

        {activeTab === "cameras" && <LiveCameras />}

        {activeTab === "crowd-map" && (
          <CrowdMap
            demoMode={demoMode}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
          />
        )}

        {activeTab === "alerts" && (
          <Alerts
            demoMode={demoMode}
            alertFilter={alertFilter}
            setAlertFilter={setAlertFilter}
            setSelectedZone={setSelectedZone}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "settings" && <Settings demoMode={demoMode} />}

        {/* INTERACTIVE FLOW MODAL */}
        {selectedFlowModal && (
          <InteractiveFlowModal
            selectedFlowModal={selectedFlowModal}
            onClose={() => setSelectedFlowModal(null)}
          />
        )}

        {/* FOOTER */}
        <footer>
          <span>PRAVAHA • AI CROWD INTELLIGENCE</span>
          <span>OBSERVE • PREDICT • PREVENT • PROTECT</span>
        </footer>
      </main>
    </div>
  );
}

export default App;