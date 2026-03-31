// Mock Data Generator for Maritime Domain Awareness Dashboard
// Generates realistic vessel tracks across the South China Sea region

const VESSEL_NAMES = [
  "PACIFIC VOYAGER", "EASTERN SPIRIT", "OCEAN PIONEER", "STAR NAVIGATOR",
  "GOLDEN DRAGON", "SEA EMPRESS", "CORAL MERCHANT", "SWIFT HORIZON",
  "JADE CARRIER", "NORTHERN STAR", "BLUE MARLIN", "CRIMSON TIDE",
  "PEARL RIVER", "SILVER WAVE", "IRON MONARCH", "CRYSTAL SEA",
  "FORTUNE BRIDGE", "HARMONY SPIRIT", "GLOBAL PHOENIX", "SUMMIT TRADER",
  "DAWN BREAKER", "EMERALD SKY", "ARCTIC WIND", "ROYAL FORTUNE",
  "LIBERTY STAR", "DRAGON KING", "OCEAN TITAN", "MAERSK SERENITY",
  "COSCO HARMONY", "EVERGREEN VALOR"
];

const FLAGS = ["SG", "CN", "JP", "KR", "PH", "VN", "MY", "ID", "TW", "HK", "PA", "LR", "MH", "BS", "GR", "NO"];

const VESSEL_TYPES = ["cargo", "tanker", "fishing", "container", "bulk_carrier", "passenger", "military", "tug"];

const NAV_STATUSES = ["underway", "at_anchor", "moored", "restricted_maneuverability", "not_under_command"];

const SATELLITES = ["SENTINEL-1A", "SENTINEL-1B", "RADARSAT-2", "COSMO-SKYMED", "ICEYE-X7", "CAPELLA-6", "WORLDVIEW-3", "PLEIADES-NEO"];

const SIGNAL_TYPES = ["radar", "comms", "satcom", "navigation", "ais-spoof"];
const FREQUENCY_BANDS = ["X-band", "S-band", "L-band", "C-band", "Ku-band", "Ka-band", "VHF", "UHF"];

// South China Sea bounding box
const AREA = {
  latMin: 4.0,
  latMax: 22.0,
  lngMin: 104.0,
  lngMax: 121.0
};

// Shipping lanes / hotspot clusters
const HOTSPOTS = [
  { lat: 1.26, lng: 103.85, radius: 0.5, name: "Singapore Strait" },
  { lat: 10.3, lng: 107.1, radius: 1.0, name: "Ho Chi Minh City approaches" },
  { lat: 22.3, lng: 114.2, radius: 0.8, name: "Hong Kong" },
  { lat: 14.6, lng: 120.9, radius: 0.6, name: "Manila Bay" },
  { lat: 5.3, lng: 115.0, radius: 1.5, name: "Brunei-Sabah corridor" },
  { lat: 16.0, lng: 112.3, radius: 2.0, name: "Paracel Islands" },
  { lat: 9.5, lng: 114.0, radius: 2.5, name: "Spratly Islands" },
  { lat: 18.2, lng: 109.8, radius: 0.8, name: "Hainan" }
];

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMMSI() {
  const mids = ["412", "431", "440", "441", "548", "574", "533", "525", "416", "477"];
  return randomChoice(mids) + String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
}

function generateIMO() {
  return "IMO" + String(Math.floor(Math.random() * 9000000) + 1000000);
}

function generatePositionNearHotspot() {
  if (Math.random() < 0.7) {
    const hotspot = randomChoice(HOTSPOTS);
    return {
      lat: hotspot.lat + (Math.random() - 0.5) * hotspot.radius * 2,
      lng: hotspot.lng + (Math.random() - 0.5) * hotspot.radius * 2
    };
  }
  return {
    lat: randomInRange(AREA.latMin, AREA.latMax),
    lng: randomInRange(AREA.lngMin, AREA.lngMax)
  };
}

function generateTrackHistory(baseLat, baseLng, course, speed, points = 8) {
  const history = [];
  let lat = baseLat;
  let lng = baseLng;
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    const timeDelta = i * 30 * 60 * 1000; // 30 min intervals
    const dist = speed * 0.00027 * 30; // approximate degree movement per 30 min at speed
    history.push({
      lat: lat + (Math.random() - 0.5) * 0.01,
      lng: lng + (Math.random() - 0.5) * 0.01,
      timestamp: new Date(now - timeDelta).toISOString(),
      speed: speed + (Math.random() - 0.5) * 2
    });
    lat -= Math.cos(course * Math.PI / 180) * dist;
    lng -= Math.sin(course * Math.PI / 180) * dist;
  }
  return history.reverse();
}

function generateMockData() {
  const vessels = [];
  const correlationGroups = {};
  let correlationCounter = 1;

  // Generate 30 AIS vessels
  for (let i = 0; i < 30; i++) {
    const pos = generatePositionNearHotspot();
    const course = Math.random() * 360;
    const speed = randomInRange(2, 22);
    const correlationId = `TRACK-${String(correlationCounter++).padStart(3, "0")}`;
    const vesselType = randomChoice(VESSEL_TYPES);

    const vessel = {
      id: `AIS-${String(i + 1).padStart(4, "0")}`,
      source: "ais",
      mmsi: generateMMSI(),
      name: VESSEL_NAMES[i] || `VESSEL ${i + 1}`,
      imo: generateIMO(),
      flag: randomChoice(FLAGS),
      vesselType: vesselType,
      lat: pos.lat,
      lng: pos.lng,
      course: Math.round(course * 10) / 10,
      speed: Math.round(speed * 10) / 10,
      heading: Math.round(course + (Math.random() - 0.5) * 10),
      destination: randomChoice(["SINGAPORE", "HONG KONG", "SHANGHAI", "TOKYO", "BUSAN", "MANILA", "HO CHI MINH", "BANGKOK", "JAKARTA"]),
      navStatus: randomChoice(NAV_STATUSES),
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      confidence: Math.round((0.85 + Math.random() * 0.15) * 100) / 100,
      correlationId: correlationId,
      trackHistory: generateTrackHistory(pos.lat, pos.lng, course, speed),
      alerts: []
    };

    // Add some alerts/anomalies
    if (Math.random() < 0.15) {
      vessel.alerts.push({ type: "ais_gap", message: "AIS signal gap detected (2h 15m)", severity: "warning" });
    }
    if (Math.random() < 0.1) {
      vessel.alerts.push({ type: "speed_anomaly", message: "Unusual speed change detected", severity: "caution" });
    }
    if (Math.random() < 0.05) {
      vessel.alerts.push({ type: "zone_violation", message: "Entered restricted maritime zone", severity: "critical" });
    }

    vessels.push(vessel);
    correlationGroups[correlationId] = [vessel];
  }

  // Generate 15 RF detections - some correlated to AIS, some standalone
  for (let i = 0; i < 15; i++) {
    let pos, correlationId;

    if (i < 8 && vessels[i]) {
      // Correlate with an existing AIS vessel
      pos = {
        lat: vessels[i].lat + (Math.random() - 0.5) * 0.05,
        lng: vessels[i].lng + (Math.random() - 0.5) * 0.05
      };
      correlationId = vessels[i].correlationId;
    } else {
      // Standalone RF detection
      pos = generatePositionNearHotspot();
      correlationId = `TRACK-${String(correlationCounter++).padStart(3, "0")}`;
    }

    const detection = {
      id: `RF-${String(i + 1).padStart(4, "0")}`,
      source: "rf",
      emitterId: `EM-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      signalType: randomChoice(SIGNAL_TYPES),
      frequencyBand: randomChoice(FREQUENCY_BANDS),
      lat: pos.lat,
      lng: pos.lng,
      cep: Math.round((0.5 + Math.random() * 5) * 10) / 10,
      signalStrength: Math.round(-60 - Math.random() * 40),
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      confidence: Math.round((0.5 + Math.random() * 0.35) * 100) / 100,
      attributed: i < 8,
      correlationId: correlationId,
      alerts: []
    };

    if (detection.signalType === "ais-spoof") {
      detection.alerts.push({ type: "spoofing", message: "Potential AIS spoofing detected", severity: "critical" });
    }

    vessels.push(detection);
    if (correlationGroups[correlationId]) {
      correlationGroups[correlationId].push(detection);
    } else {
      correlationGroups[correlationId] = [detection];
    }
  }

  // Generate 12 satellite detections
  for (let i = 0; i < 12; i++) {
    let pos, correlationId;

    if (i < 5 && vessels[i]) {
      pos = {
        lat: vessels[i].lat + (Math.random() - 0.5) * 0.03,
        lng: vessels[i].lng + (Math.random() - 0.5) * 0.03
      };
      correlationId = vessels[i].correlationId;
    } else {
      pos = generatePositionNearHotspot();
      correlationId = `TRACK-${String(correlationCounter++).padStart(3, "0")}`;
    }

    const sensorType = Math.random() < 0.6 ? "SAR" : "EO";
    const detection = {
      id: `SAT-${String(i + 1).padStart(4, "0")}`,
      source: "satellite",
      sensorType: sensorType,
      satellite: randomChoice(SATELLITES),
      lat: pos.lat,
      lng: pos.lng,
      estimatedLength: Math.round(50 + Math.random() * 300),
      estimatedBeam: Math.round(10 + Math.random() * 50),
      timestamp: new Date(Date.now() - (1 + Math.random() * 12) * 3600000).toISOString(),
      cloudCover: sensorType === "SAR" ? 0 : Math.round(Math.random() * 80),
      confidence: Math.round((0.4 + Math.random() * 0.4) * 100) / 100,
      correlationId: correlationId,
      alerts: []
    };

    if (i >= 5) {
      detection.alerts.push({ type: "dark_vessel", message: "No AIS correlation - potential dark vessel", severity: "warning" });
    }

    vessels.push(detection);
    if (correlationGroups[correlationId]) {
      correlationGroups[correlationId].push(detection);
    } else {
      correlationGroups[correlationId] = [detection];
    }
  }

  return { vessels, correlationGroups };
}

// Simulate live position updates
function updateVesselPositions(vessels) {
  vessels.forEach(v => {
    if (v.source === "ais" && v.navStatus === "underway") {
      const speedFactor = (v.speed || 10) * 0.00001;
      const courseRad = (v.course || 0) * Math.PI / 180;
      v.lat += Math.cos(courseRad) * speedFactor + (Math.random() - 0.5) * 0.001;
      v.lng += Math.sin(courseRad) * speedFactor + (Math.random() - 0.5) * 0.001;
      v.course = (v.course + (Math.random() - 0.5) * 2) % 360;
      if (v.course < 0) v.course += 360;
      v.speed = Math.max(0, v.speed + (Math.random() - 0.5) * 0.5);
      v.timestamp = new Date().toISOString();
    }
  });
}
