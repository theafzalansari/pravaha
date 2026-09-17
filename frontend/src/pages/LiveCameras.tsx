import { Camera } from "lucide-react";

export function LiveCameras() {
  return (
    <div className="cameras-page-container">
      {/* 1. HEADER */}
      <div className="panel cameras-header-panel">
        <div className="cameras-header-info">
          <span className="welcome-tag">
            <Camera size={15} />
            AI VISION PIPELINE
          </span>
          <h3>Live Cameras</h3>
          <p>Real-time AI vision across monitored areas</p>
        </div>
        <div className="live-camera-status-badge">
          <span className="online-dot" />
          <span>LIVE MONITORING</span>
        </div>
      </div>

      {/* 2. MAIN CAMERA DISPLAY CARD */}
      <div className="panel main-camera-card">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">PRIMARY FEED</span>
            <h3>CAMERA 01</h3>
            <p className="panel-sub">Panchavati • Crowd Monitoring</p>
          </div>
          <div className="cam-live-indicator">
            <span className="pulse" />
            ● LIVE
          </div>
        </div>

        <div className="camera-feed-viewport">
          <video
            className="camera-video-player"
            src="/zones_web.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
          />

          {/* Top Overlay */}
          <div className="cam-overlay-top">
            <span className="cam-overlay-title">CAMERA 01</span>
            <span className="cam-overlay-loc">PANCHAVATI</span>
            <span className="cam-overlay-live">
              <span className="pulse" /> ● LIVE
            </span>
          </div>

          {/* Bottom Overlay */}
          <div className="cam-overlay-bottom">
            <span className="cam-tech-chip">YOLOv8n</span>
            <span className="cam-tech-chip">BYTETRACK</span>
            <span className="cam-tech-chip highlight">ZONE ANALYSIS ACTIVE</span>
          </div>
        </div>

        {/* 4. CAMERA INFORMATION */}
        <div className="camera-info-bar">
          <div className="cam-info-item">
            <span>CAMERA STATUS</span>
            <strong className="safe-text">ONLINE</strong>
          </div>
          <div className="cam-info-item">
            <span>FEED TYPE</span>
            <strong>AI Processed Video</strong>
          </div>
          <div className="cam-info-item">
            <span>DETECTION MODEL</span>
            <strong>YOLOv8n Person</strong>
          </div>
          <div className="cam-info-item">
            <span>TRACKING ALGORITHM</span>
            <strong>ByteTrack</strong>
          </div>
          <div className="cam-info-item">
            <span>ZONE ANALYSIS</span>
            <strong className="amber-text">Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
