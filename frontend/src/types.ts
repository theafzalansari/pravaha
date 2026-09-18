export type DemoMode = "NORMAL" | "RISING" | "HIGH" | "CRITICAL";

export type TabType =
  | "home"
  | "dashboard"
  | "ivr"
  | "analytics"
  | "cameras"
  | "crowd-map"
  | "alerts"
  | "settings";

export type AlertFilter = "All" | "Critical" | "High" | "Warning" | "Resolved";

export interface ZoneLocation {
  lat: number;
  lng: number;
  radius: number;
  description: string;
}

export interface Zone {
  name: string;
  people: number;
  occupancy?: number;
  risk: string;
  color?: string;
  prediction: string;
  action: string;
}

export interface DashboardScenario {
  total_crowd: number;
  average_density: number;
  active_alerts: number;
  prediction: string;
  latest_alert_title: string;
  latest_alert_desc: string;
  recommendation: string;
  alert_risk: string;
  alert_color: string;
  people_flow: string;
  peak_occupancy: string;
  crowd_flow_insight: string;
  prediction_insight: string;
  response_insight: string;
  zones: Zone[];
}

export interface AlertItem {
  id: string;
  risk: "CRITICAL" | "HIGH" | "WARNING" | "SAFE" | "RESOLVED";
  color: "critical" | "high" | "warning" | "safe";
  zone: "Zone A" | "Zone B" | "Zone C";
  time: string;
  title: string;
  description: string;
  occupancy: number;
  prediction?: string;
  action: string;
  status: "ACTIVE" | "RESOLVED";
}
