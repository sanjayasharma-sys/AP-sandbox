// Utility functions for Maritime Domain Awareness Dashboard

const SOURCE_COLORS = {
  ais: "#00d4aa",
  rf: "#f0a030",
  satellite: "#4a9eff"
};

const SOURCE_LABELS = {
  ais: "AIS Transponder",
  rf: "RF Emissions",
  satellite: "Satellite Imagery"
};

const SOURCE_ICONS = {
  ais: "ais-vessel",
  rf: "rf-emitter",
  satellite: "sat-detection"
};

const SEVERITY_COLORS = {
  critical: "#ff3b5c",
  warning: "#f0a030",
  caution: "#ffd700",
  info: "#4a9eff"
};

const VESSEL_TYPE_LABELS = {
  cargo: "Cargo",
  tanker: "Tanker",
  fishing: "Fishing",
  container: "Container",
  bulk_carrier: "Bulk Carrier",
  passenger: "Passenger",
  military: "Military",
  tug: "Tug",
  unknown: "Unknown"
};

const FLAG_NAMES = {
  SG: "Singapore", CN: "China", JP: "Japan", KR: "South Korea",
  PH: "Philippines", VN: "Vietnam", MY: "Malaysia", ID: "Indonesia",
  TW: "Taiwan", HK: "Hong Kong", PA: "Panama", LR: "Liberia",
  MH: "Marshall Islands", BS: "Bahamas", GR: "Greece", NO: "Norway"
};

function formatCoord(lat, lng) {
  function toDMS(val, posChar, negChar) {
    const dir = val >= 0 ? posChar : negChar;
    val = Math.abs(val);
    const deg = Math.floor(val);
    const minFloat = (val - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60 * 10) / 10;
    return `${deg}\u00B0${String(min).padStart(2, "0")}'${sec.toFixed(1)}"${dir}`;
  }
  return `${toDMS(lat, "N", "S")} ${toDMS(lng, "E", "W")}`;
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  const remainMins = minutes % 60;
  if (hours < 24) return `${hours}h ${remainMins}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h ago`;
}

function getSourceColor(source) {
  return SOURCE_COLORS[source] || "#888";
}

function getSourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function knotsToKmh(knots) {
  return Math.round(knots * 1.852 * 10) / 10;
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function getVesselDisplayName(vessel) {
  if (vessel.name) return vessel.name;
  if (vessel.emitterId) return `RF: ${vessel.emitterId}`;
  if (vessel.satellite) return `SAT: ${vessel.id}`;
  return vessel.id;
}

function getCorrelatedSources(vessel, correlationGroups) {
  const group = correlationGroups[vessel.correlationId];
  if (!group || group.length <= 1) return [vessel.source];
  return [...new Set(group.map(v => v.source))];
}

function formatSpeed(speed) {
  if (speed === undefined || speed === null) return "N/A";
  return `${speed.toFixed(1)} kn`;
}

function formatCourse(course) {
  if (course === undefined || course === null) return "N/A";
  return `${course.toFixed(1)}\u00B0`;
}
