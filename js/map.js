// Map module - Leaflet initialization and marker management
// Manages the Leaflet map, markers, and overlays for the Strait of Hormuz

let map;
let layerGroups = { cooperative: null, dark: null, gone_dark: null };
let markerLookup = {};
let cepCircles = {};
let trackLines = {};
let ghostTrails = {};

// ============ MARKER ICON CREATION ============

function createMarkerIcon(vessel) {
  const fillColor = getVesselClassColor(vessel.vesselClass);
  const rotation = vessel.heading || vessel.course || 0;
  const mode = vessel.trackingMode || "cooperative";

  // Determine stroke style by tracking mode
  let stroke, strokeWidth, strokeDash;
  if (mode === "dark") {
    stroke = "#E8461E";
    strokeWidth = 2;
    strokeDash = ' stroke-dasharray="4 2"';
  } else if (mode === "gone_dark") {
    stroke = "#F59E0B";
    strokeWidth = 2;
    strokeDash = ' stroke-dasharray="4 2"';
  } else {
    stroke = "#ffffff";
    strokeWidth = 1;
    strokeDash = "";
  }

  // Determine shape SVG by vessel class
  let shapeSvg;
  const cls = vessel.vesselClass || "unknown";
  switch (cls) {
    case "cargo":
      shapeSvg = `<path d="M10 3 L17 17 L10 13 L3 17 Z" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash}/>`;
      break;
    case "tanker":
      shapeSvg = `<rect x="3" y="3" width="14" height="14" rx="1" transform="rotate(45 10 10)" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash}/>`;
      break;
    case "fishing":
      shapeSvg = `<circle cx="10" cy="10" r="6" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash}/>`;
      break;
    case "military":
      shapeSvg = `<path d="M10 2 L18 18 L2 18 Z" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash}/>`;
      break;
    case "passenger":
      shapeSvg = `<rect x="3" y="5" width="14" height="10" rx="3" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"${strokeDash}/>`;
      break;
    case "unknown":
    default:
      shapeSvg = `<rect x="3" y="3" width="14" height="14" rx="1" transform="rotate(45 10 10)" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="3 2"/>`;
      break;
  }

  const svg = `<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg">${shapeSvg}</svg>`;

  let iconHtml;
  if (mode === "dark") {
    iconHtml = `<div class="marker-dark" style="transform:rotate(${rotation}deg)">${svg}</div>`;
  } else if (mode === "gone_dark") {
    iconHtml = `<div class="marker-gone-dark" style="transform:rotate(${rotation}deg)">${svg}</div>`;
  } else {
    iconHtml = `<div style="transform:rotate(${rotation}deg)">${svg}</div>`;
  }

  return L.divIcon({
    html: iconHtml,
    className: "vessel-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// ============ TOOLTIP CONTENT ============

function createTooltipContent(vessel) {
  const name = vessel.name || "UNKNOWN VESSEL";
  const cls = getVesselClassLabel(vessel.vesselClass);
  const modeConfig = TRACKING_MODES[vessel.trackingMode] || TRACKING_MODES.cooperative;
  const modeColor = modeConfig.color;
  const modeLabel = modeConfig.label;
  const speed = formatSpeed(vessel.speed);
  const course = formatCourse(vessel.course);

  return `<div class="vessel-tooltip">
    <strong>${name}</strong><br>
    <span style="opacity:0.7">${cls}</span>
    <span style="display:inline-block;margin-left:6px;padding:1px 5px;border-radius:3px;font-size:10px;background:${modeColor}22;color:${modeColor};border:1px solid ${modeColor}55">${modeLabel}</span><br>
    <span style="opacity:0.7">${speed} / ${course}</span>
  </div>`;
}

// ============ MAP INITIALIZATION ============

function initMap() {
  map = L.map("map-container", {
    center: [26.0, 54.5],
    zoom: 8,
    zoomControl: false,
    attributionControl: false
  });

  // Dark tile layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }).addTo(map);

  // Zoom control on topright
  L.control.zoom({ position: "topright" }).addTo(map);

  // Create layer groups
  layerGroups.cooperative = L.layerGroup().addTo(map);
  layerGroups.dark = L.layerGroup().addTo(map);
  layerGroups.gone_dark = L.layerGroup().addTo(map);

  // Add legend control
  const legend = createLegendControl();
  legend.addTo(map);
}

// ============ PLOT VESSELS ============

function plotVessels(vessels) {
  // Clear existing
  Object.values(layerGroups).forEach(lg => { if (lg) lg.clearLayers(); });
  markerLookup = {};
  cepCircles = {};
  trackLines = {};
  ghostTrails = {};

  vessels.forEach(vessel => {
    const icon = createMarkerIcon(vessel);
    const marker = L.marker([vessel.lat, vessel.lng], { icon: icon });

    // Bind tooltip for hover (lightweight)
    marker.bindTooltip(createTooltipContent(vessel), {
      className: "dark-tooltip",
      direction: "top",
      offset: [0, -12],
      opacity: 0.95
    });

    // Click handler calls showVesselDetail directly
    marker.on("click", () => {
      showVesselDetail(vessel);
    });

    marker.vesselId = vessel.id;
    markerLookup[vessel.id] = marker;

    // Add to appropriate layer group
    const mode = vessel.trackingMode || "cooperative";
    if (layerGroups[mode]) {
      marker.addTo(layerGroups[mode]);
    }

    // CEP uncertainty circle for RF detections
    if (vessel.rf && vessel.rf.detected && vessel.rf.cepMeters) {
      let circleColor;
      if (mode === "dark") {
        circleColor = "#E8461E";
      } else if (mode === "gone_dark") {
        circleColor = "#F59E0B";
      } else {
        circleColor = "#22C55E";
      }

      const circle = L.circle([vessel.lat, vessel.lng], {
        radius: vessel.rf.cepMeters,
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.06,
        weight: 1,
        dashArray: "5 5",
        opacity: 0.4
      });
      circle.addTo(layerGroups[mode]);
      cepCircles[vessel.id] = circle;
    }

    // Track history polyline
    if (vessel.trackHistory && vessel.trackHistory.length > 1) {
      const modeColor = getTrackingModeColor(mode);
      const latlngs = vessel.trackHistory.map(p => [p.lat, p.lng]);
      const trackLine = L.polyline(latlngs, {
        color: modeColor,
        weight: 1.5,
        opacity: 0.3,
        dashArray: "4 6"
      });
      trackLine.addTo(layerGroups[mode]);
      trackLines[vessel.id] = trackLine;
    }

    // Ghost trail for gone_dark vessels
    if (mode === "gone_dark" && vessel.ais && vessel.ais.lastSeen && vessel.ais.lastPosition) {
      const lastPos = vessel.ais.lastPosition;
      const ghostLine = L.polyline(
        [[lastPos.lat, lastPos.lng], [vessel.lat, vessel.lng]],
        {
          color: "#F59E0B",
          weight: 2,
          opacity: 0.6,
          dashArray: "6 4"
        }
      );

      // Add arrow decorator at the endpoint
      const arrowHead = L.circleMarker([vessel.lat, vessel.lng], {
        radius: 3,
        color: "#F59E0B",
        fillColor: "#F59E0B",
        fillOpacity: 0.8,
        weight: 1
      });

      ghostLine.addTo(layerGroups.gone_dark);
      arrowHead.addTo(layerGroups.gone_dark);
      ghostTrails[vessel.id] = ghostLine;
    }
  });
}

// ============ UPDATE MARKER POSITIONS ============

function updateMarkerPositions(vessels) {
  vessels.forEach(vessel => {
    const marker = markerLookup[vessel.id];
    if (marker) {
      marker.setLatLng([vessel.lat, vessel.lng]);
      marker.setIcon(createMarkerIcon(vessel));
    }
    const circle = cepCircles[vessel.id];
    if (circle) {
      circle.setLatLng([vessel.lat, vessel.lng]);
    }
  });
}

// ============ LAYER TOGGLING ============

function toggleLayer(mode, visible) {
  if (layerGroups[mode]) {
    if (visible) {
      map.addLayer(layerGroups[mode]);
    } else {
      map.removeLayer(layerGroups[mode]);
    }
  }
}

// ============ HIGHLIGHT VESSEL ============

function highlightVessel(vesselId) {
  const marker = markerLookup[vesselId];
  if (marker) {
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 10), { animate: true });
    marker.openTooltip();
  }
}

// ============ LEGEND CONTROL ============

function createLegendControl() {
  const LegendControl = L.Control.extend({
    options: {
      position: "bottomleft"
    },

    onAdd: function () {
      const container = L.DomUtil.create("div", "leaflet-legend-control");
      container.innerHTML = `
        <div class="legend-compact">
          <div class="legend-title">TRACKING</div>
          <div class="legend-row"><span class="legend-dot-sm" style="background:#22C55E"></span> Cooperative</div>
          <div class="legend-row"><span class="legend-dot-sm pulse-sm-orange" style="background:#E8461E"></span> Dark</div>
          <div class="legend-row"><span class="legend-dot-sm pulse-sm-amber" style="background:#F59E0B"></span> Gone Dark</div>
          <div class="legend-divider"></div>
          <div class="legend-title">CLASS</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><path d="M10 3 L17 17 L10 13 L3 17 Z" fill="#3B82F6"/></svg> Cargo</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" transform="rotate(45 10 10)" fill="#8B5CF6"/></svg> Tanker</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="#06B6D4"/></svg> Fishing</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><path d="M10 2 L18 18 L2 18 Z" fill="#EF4444"/></svg> Military</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="3" fill="#10B981"/></svg> Passenger</div>
          <div class="legend-row"><svg width="12" height="12" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" transform="rotate(45 10 10)" fill="#6B7280" stroke="#6B7280" stroke-dasharray="3 2" stroke-width="1" fill-opacity="0.5"/></svg> Unknown</div>
        </div>
      `;

      // Prevent map interactions when clicking on the legend
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      return container;
    }
  });

  return new LegendControl();
}
