import os
import sys
import cv2
from ultralytics import YOLO
from collections import deque

# ==========================================
# Configuration
# ==========================================
INPUT_VIDEO_NAME = "input.mp4"
MODEL_NAME = "yolov8n.pt"

# Relative paths based on project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
VIDEOS_DIR = os.path.join(PROJECT_ROOT, "data", "videos")

INPUT_VIDEO_PATH = os.path.join(VIDEOS_DIR, INPUT_VIDEO_NAME)
OUTPUT_VIDEO_PATH = os.path.join(VIDEOS_DIR, "output.mp4")
TRACKING_VIDEO_PATH = os.path.join(VIDEOS_DIR, "tracking.mp4")
ZONES_VIDEO_PATH = os.path.join(VIDEOS_DIR, "zones.mp4")

# COCO Dataset Class ID 0 corresponds to 'person'
PERSON_CLASS_ID = 0

# ==========================================
# Zone Definitions (for 720x1280 frame)
# Each zone is (x1, y1, x2, y2)
# Divided into top / middle / bottom thirds
# ==========================================
ZONES = {
    "Zone A": (0,   0,   720, 426),   # top third
    "Zone B": (0, 426,   720, 853),   # middle third
    "Zone C": (0, 853,   720, 1280),  # bottom third
}

ZONE_COLORS = {
    "Zone A": (255, 100,  50),   # blue-ish
    "Zone B": ( 50, 200,  50),   # green
    "Zone C": ( 50,  50, 255),   # red
}

# Capacity and risk thresholds for each zone
ZONE_CAPACITY = {
    "Zone A": 50,
    "Zone B": 50,
    "Zone C": 50,
}

def get_risk(occupancy):
    if occupancy < 50:
        return "SAFE"
    elif occupancy < 70:
        return "WARNING"
    elif occupancy < 85:
        return "HIGH"
    else:
        return "CRITICAL"

# Recent occupancy history for congestion prediction
ZONE_HISTORY = {
    name: deque(maxlen=30) for name in ZONES
}

def predict_congestion(zone, occupancy):
    history = ZONE_HISTORY[zone]
    history.append(occupancy)

    # Need enough observations to identify a trend
    if len(history) < 10:
        return "MONITORING"

    increase = history[-1] - history[0]

    if occupancy >= 85:
        return "CRITICAL"

    if occupancy >= 60 and increase >= 10:
        return "CONGESTION LIKELY"

    return "STABLE"   


def get_recommendation(risk, prediction):
    if risk == "CRITICAL":
        return "Restrict entry + Redirect flow + Deploy personnel"

    if risk == "HIGH":
        if prediction == "CONGESTION LIKELY":
            return "Redirect incoming flow + Deploy personnel"
        return "Monitor zone + Prepare alternate route"

    if risk == "WARNING":
        return "Monitor closely"

    return "Continue normal monitoring"         


def get_zone(cx, cy):
    """Return the zone name for a center point, or None if outside all zones."""
    for name, (x1, y1, x2, y2) in ZONES.items():
        if x1 <= cx < x2 and y1 <= cy < y2:
            return name
    return None


def main():
    # Check if input video exists
    if not os.path.exists(INPUT_VIDEO_PATH):
        print(f"[ERROR] Input video not found at: {INPUT_VIDEO_PATH}")
        print(f"Please place a test crowd video inside 'data/videos/' and name it '{INPUT_VIDEO_NAME}'.")
        sys.exit(1)

    print(f"Loading YOLO model ({MODEL_NAME})...")
    model = YOLO(MODEL_NAME)

    cap = cv2.VideoCapture(INPUT_VIDEO_PATH)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video file: {INPUT_VIDEO_PATH}")
        sys.exit(1)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    print(f"Video: {width}x{height} @ {fps:.1f} FPS")

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(ZONES_VIDEO_PATH, fourcc, fps, (width, height))

    frame_count = 0
    total_people_detected = 0

    print(f"Processing '{INPUT_VIDEO_NAME}' with ByteTrack + Zone analysis...")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # --- Draw zone boundaries ---
        for name, (x1, y1, x2, y2) in ZONES.items():
            color = ZONE_COLORS[name]
            cv2.rectangle(frame, (x1, y1), (x2 - 1, y2 - 1), color, 2)
            cv2.putText(frame, name, (x1 + 8, y1 + 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        # --- ByteTrack inference ---
        results = model.track(
            frame,
            classes=[PERSON_CLASS_ID],
            tracker="bytetrack.yaml",
            persist=True,
            verbose=False
        )[0]

        person_count = len(results.boxes)
        total_people_detected += person_count

        # Zone counts for this frame
        zone_counts = {name: 0 for name in ZONES}

        # --- Draw boxes + assign zones ---
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            track_id = int(box.id[0]) if box.id is not None else -1

            # Center point for zone assignment
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2

            zone = get_zone(cx, cy)
            if zone:
                zone_counts[zone] += 1
                box_color = ZONE_COLORS[zone]
            else:
                box_color = (200, 200, 200)

            label = f"ID:{track_id}" if track_id >= 0 else "Person"
            cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)
            cv2.putText(frame, label, (x1, max(y1 - 8, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, box_color, 2)

        # --- Overlay total count ---
        cv2.putText(frame, f"People Count: {person_count}",
                    (20, 55), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)

        # --- Overlay zone counts ---
                       # --- Overlay zone density + risk ---
        y_offset = 100

        risk_order = {"SAFE": 0, "WARNING": 1, "HIGH": 2, "CRITICAL": 3}

        highest_risk = "SAFE"
        highest_zone = None
        highest_prediction = "STABLE"
        highest_recommendation = "Continue normal monitoring"

        for name, count in zone_counts.items():
            color = ZONE_COLORS[name]

            capacity = ZONE_CAPACITY[name]
            occupancy = (count / capacity) * 100
            risk = get_risk(occupancy)
            prediction = predict_congestion(name, occupancy)
            recommendation = get_recommendation(risk, prediction)

            if risk_order[risk] > risk_order[highest_risk]:
                highest_risk = risk
                highest_zone = name
                highest_prediction = prediction
                highest_recommendation = recommendation

            cv2.putText(
                frame,
                f"{name}: {count} | {occupancy:.0f}% | {risk} | {prediction}",
                (20, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                color,
                2
            )
            y_offset += 35

        # --- Display recommended action for highest-risk zone ---
        cv2.putText(
            frame,
            f"Action: {highest_recommendation}",
            (20, height - 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 255, 255),
            2
        )

        out.write(frame)

    cap.release()
    out.release()

    # Report results
    zones_size = os.path.getsize(ZONES_VIDEO_PATH) if os.path.exists(ZONES_VIDEO_PATH) else 0

    print("\n" + "=" * 44)
    print("      PRAVAHA - Zone Analysis Report")
    print("=" * 44)
    print(f"• Model:        {MODEL_NAME}")
    print(f"• Tracker:      ByteTrack")
    print(f"• Input:        {INPUT_VIDEO_PATH}")
    print(f"• Resolution:   {width}x{height} @ {fps:.1f} FPS")
    print(f"• Frames:       {frame_count}")
    print(f"• People Total: {total_people_detected} detections")
    print(f"• Zones:        {list(ZONES.keys())}")
    print(f"• Output:       {ZONES_VIDEO_PATH}")
    print(f"• File size:    {zones_size / 1024:.1f} KB")
    print("=" * 44)


if __name__ == "__main__":
    main()