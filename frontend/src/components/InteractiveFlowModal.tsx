import { Phone, X, Zap } from "lucide-react";

interface InteractiveFlowModalProps {
  selectedFlowModal: "standard" | "extreme";
  onClose: () => void;
}

export function InteractiveFlowModal({
  selectedFlowModal,
  onClose,
}: InteractiveFlowModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {selectedFlowModal === "standard" ? (
              <div className="modal-icon-badge standard">
                <Phone size={20} />
              </div>
            ) : (
              <div className="modal-icon-badge extreme">
                <Zap size={20} />
              </div>
            )}
            <div>
              <h3>
                {selectedFlowModal === "standard"
                  ? "Standard IVR - Step-by-Step Flow"
                  : "Extreme Emergency IVR - Step-by-Step Flow"}
              </h3>
              <p>Interactive Call Logic Simulation</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {selectedFlowModal === "standard" ? (
            <div className="flow-steps-list">
              <div className="step-item">
                <div className="step-badge">STEP 1</div>
                <div className="step-content">
                  <strong>CALL INITIATION</strong>
                  <p>Citizen calls PRAVAHA IVR Helpline.</p>
                  <div className="audio-bubble">
                    🔊 "Welcome to Kumbh Mela Emergency Helpline."
                  </div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-badge">STEP 2</div>
                <div className="step-content">
                  <strong>LANGUAGE SELECTION</strong>
                  <p>User selects preferred audio language.</p>
                  <div className="audio-bubble">
                    🔊 "Press 1 for Hindi, Press 2 for Marathi, Press 3 for
                    English."
                  </div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-badge">STEP 3</div>
                <div className="step-content">
                  <strong>ISSUE CATEGORY</strong>
                  <p>User selects type of emergency assistance.</p>
                  <div className="audio-bubble">
                    🔊 "Press 1 Medical, Press 2 Stampede/Crowd, Press 3
                    Missing Person."
                  </div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-badge">STEP 4</div>
                <div className="step-content">
                  <strong>ZONE CONFIRMATION</strong>
                  <p>User selects current location zone.</p>
                  <div className="audio-bubble">
                    🔊 "Press 1 for Ramkund (Zone A), Press 2 for Kalaram (Zone
                    B), Press 3 for Tapovan (Zone C)."
                  </div>
                </div>
              </div>
              <div className="step-item final">
                <div className="step-badge final">STEP 5</div>
                <div className="step-content">
                  <strong>INCIDENT CREATED & DISPATCHED</strong>
                  <p>
                    System automatically registers ticket and alerts command
                    center.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flow-steps-list extreme">
              <div className="step-item extreme">
                <div className="step-badge extreme">STEP 1</div>
                <div className="step-content">
                  <strong>CRITICAL EMERGENCY CALL</strong>
                  <p>Caller dials Emergency Hotline.</p>
                  <div className="audio-bubble urgent">
                    🔊 "PRAVAHA Extreme Hotline. Press 1 NOW for immediate
                    SOS."
                  </div>
                </div>
              </div>
              <div className="step-item urgent">
                <div className="step-badge urgent">STEP 2</div>
                <div className="step-content">
                  <strong>PRESS 1 (INSTANT OVERRIDE)</strong>
                  <p>Bypasses all language and category menus instantly.</p>
                </div>
              </div>
              <div className="step-item extreme">
                <div className="step-badge extreme">STEP 3</div>
                <div className="step-content">
                  <strong>ONE-DIGIT ZONE SELECTION</strong>
                  <p>
                    Quick DTMF input: 1 for Zone A, 2 for Zone B, 3 for Zone
                    C.
                  </p>
                </div>
              </div>
              <div className="step-item final-critical">
                <div className="step-badge critical">STEP 4</div>
                <div className="step-content">
                  <strong>CRITICAL ALERT & RAPID DISPATCH</strong>
                  <p>
                    Instant high-priority alarm triggered on Authority
                    Dashboard. Quick Response Team dispatched in under 30
                    seconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Close Flow View
          </button>
        </div>
      </div>
    </div>
  );
}
