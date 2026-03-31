// Utility functions and constants for uLook Maritime Intelligence Dashboard

// ============ TRACKING MODE CONFIG ============
const TRACKING_MODES = {
  cooperative: { label: "Cooperative", sublabel: "AIS Active", color: "#22C55E", glowColor: null },
  dark:        { label: "Dark Vessel", sublabel: "RF Only", color: "#E8461E", glowColor: "#E8461E" },
  gone_dark:   { label: "Gone Dark", sublabel: "AIS Lost", color: "#F59E0B", glowColor: "#F59E0B" }
};

// ============ VESSEL CLASS CONFIG ============
const VESSEL_CLASSES = {
  cargo:     { label: "Cargo",     color: "#3B82F6", shape: "chevron" },
  tanker:    { label: "Tanker",    color: "#8B5CF6", shape: "diamond" },
  fishing:   { label: "Fishing",   color: "#06B6D4", shape: "circle" },
  military:  { label: "Military",  color: "#EF4444", shape: "triangle" },
  passenger: { label: "Passenger", color: "#10B981", shape: "rounded-rect" },
  unknown:   { label: "Unknown",   color: "#6B7280", shape: "dashed-diamond" }
};

// ============ SEVERITY COLORS ============
const SEVERITY_COLORS = {
  critical: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6"
};

// ============ FLAG DATA ============
const FLAG_NAMES = {
  SG: "Singapore", CN: "China", JP: "Japan", KR: "South Korea",
  PH: "Philippines", VN: "Vietnam", MY: "Malaysia", ID: "Indonesia",
  TW: "Taiwan", HK: "Hong Kong", PA: "Panama", LR: "Liberia",
  MH: "Marshall Islands", BS: "Bahamas", GR: "Greece", NO: "Norway",
  IR: "Iran", OM: "Oman", AE: "UAE", BH: "Bahrain",
  KW: "Kuwait", QA: "Qatar", SA: "Saudi Arabia", IQ: "Iraq",
  IN: "India", PK: "Pakistan", US: "United States", GB: "United Kingdom",
  TR: "Turkey", MT: "Malta", CY: "Cyprus", DK: "Denmark"
};

// ============ RF EMITTER TYPES ============
const EMITTER_TYPES = {
  "x-band-nav":  { label: "X-band Navigation Radar", band: "X-band", freqRange: "9.2–9.5 GHz" },
  "s-band-radar": { label: "S-band Surface Search Radar", band: "S-band", freqRange: "2.9–3.1 GHz" },
  "ku-vsat":     { label: "Ku-band VSAT Terminal", band: "Ku-band", freqRange: "14.0–14.5 GHz" },
  "vhf-marine":  { label: "VHF Marine Radio", band: "VHF", freqRange: "156–162 MHz" },
  "l-satphone":  { label: "L-band Satphone", band: "L-band", freqRange: "1.616–1.627 GHz" },
  "ka-vsat":     { label: "Ka-band VSAT Terminal", band: "Ka-band", freqRange: "27.5–30.0 GHz" },
  "ais-tx":      { label: "AIS Transponder", band: "VHF", freqRange: "161.975–162.025 MHz" },
  "military-radar": { label: "Military Fire Control Radar", band: "X-band", freqRange: "8.5–10.5 GHz" }
};

// ============ FORMATTING FUNCTIONS ============

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

function formatFrequency(mhz) {
  if (mhz >= 1000) return `${(mhz / 1000).toFixed(2)} GHz`;
  return `${mhz.toFixed(1)} MHz`;
}

function formatSpeed(speed) {
  if (speed === undefined || speed === null) return "N/A";
  return `${speed.toFixed(1)} kn`;
}

function formatCourse(course) {
  if (course === undefined || course === null) return "N/A";
  return `${course.toFixed(1)}\u00B0`;
}

function knotsToKmh(knots) {
  return Math.round(knots * 1.852 * 10) / 10;
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function getTrackingModeColor(mode) {
  return (TRACKING_MODES[mode] || TRACKING_MODES.cooperative).color;
}

function getTrackingModeLabel(mode) {
  return (TRACKING_MODES[mode] || TRACKING_MODES.cooperative).label;
}

function getVesselClassColor(cls) {
  return (VESSEL_CLASSES[cls] || VESSEL_CLASSES.unknown).color;
}

function getVesselClassLabel(cls) {
  return (VESSEL_CLASSES[cls] || VESSEL_CLASSES.unknown).label;
}

function getVesselDisplayName(vessel) {
  if (vessel.name) return vessel.name;
  if (vessel.rf && vessel.rf.emitters && vessel.rf.emitters.length > 0) {
    return `RF: ${vessel.rf.emitters[0].fingerprintId}`;
  }
  return `Unknown [${vessel.id}]`;
}

function getEmitterTypeLabel(type) {
  return (EMITTER_TYPES[type] || { label: type }).label;
}

function signalStrengthPercent(dbm) {
  // Map -30 (strong) to -100 (weak) → 100% to 0%
  return Math.max(0, Math.min(100, ((dbm + 100) / 70) * 100));
}

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
