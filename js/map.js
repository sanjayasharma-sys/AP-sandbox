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
    stroke = "#1a1a1a";
    strokeWidth = 1.5;
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

  // ---- Base maps ----
  const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
    }
  );

  const darkLayer = L.tileLayer(
    "https://{s}.basemaps-cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }
  );

  // Add default basemap (Street)
  streetLayer.addTo(map);

  // ---- Overlay layers (off by default) ----
  const sentinel2Layer = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2026-03-30/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    {
      maxZoom: 9,
      opacity: 0.7,
      attribution: "Imagery courtesy of NASA GIBS"
    }
  );

  const viirsLayer = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_At_Sensor_Radiance/default/2026-03-30/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png",
    {
      maxZoom: 8,
      opacity: 0.75,
      attribution: "Imagery courtesy of NASA GIBS / VIIRS"
    }
  );

  // ---- Layer control ----
  const baseMaps = {
    "Street": streetLayer,
    "Satellite": satelliteLayer,
    "Dark": darkLayer
  };

  const overlayMaps = {
    "Sentinel-2 Optical": sentinel2Layer,
    "VIIRS Night Lights": viirsLayer
  };

  L.control.layers(baseMaps, overlayMaps, { position: "topright", collapsed: true }).addTo(map);

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
      if (mode === "gone_dark" && vessel.ais && vessel.ais.lastSeen) {
        // Split track into AIS (cooperative) and RF (uncooperative) segments
        const lastSeenTime = new Date(vessel.ais.lastSeen).getTime();
        const aisPoints = [];
        const rfPoints = [];

        vessel.trackHistory.forEach(p => {
          const t = new Date(p.timestamp).getTime();
          if (t <= lastSeenTime) {
            aisPoints.push([p.lat, p.lng]);
          } else {
            rfPoints.push([p.lat, p.lng]);
          }
        });

        // Bridge: last AIS point is also the first RF point for continuity
        if (aisPoints.length > 0 && rfPoints.length > 0) {
          rfPoints.unshift(aisPoints[aisPoints.length - 1]);
        }

        // AIS segment — cooperative green, solid
        if (aisPoints.length > 1) {
          const aisLine = L.polyline(aisPoints, {
            color: "#22C55E",
            weight: 2.5,
            opacity: 0.7
          });
          aisLine.addTo(layerGroups[mode]);
        }

        // RF segment — highlighted orange, glowing
        if (rfPoints.length > 1) {
          // Glow layer behind
          const rfGlow = L.polyline(rfPoints, {
            color: "#F59E0B",
            weight: 8,
            opacity: 0.15
          });
          rfGlow.addTo(layerGroups[mode]);

          // Main RF track line
          const rfLine = L.polyline(rfPoints, {
            color: "#F59E0B",
            weight: 3,
            opacity: 0.9
          });
          rfLine.addTo(layerGroups[mode]);
        }

        // Transition marker — where AIS was lost
        if (aisPoints.length > 0) {
          const transitionPt = aisPoints[aisPoints.length - 1];
          const transitionMarker = L.circleMarker(transitionPt, {
            radius: 6,
            color: "#EF4444",
            fillColor: "#EF4444",
            fillOpacity: 0.9,
            weight: 2
          });
          transitionMarker.bindTooltip("AIS LOST", {
            className: "dark-tooltip",
            direction: "top",
            offset: [0, -8],
            permanent: false
          });
          transitionMarker.addTo(layerGroups[mode]);
        }

        trackLines[vessel.id] = true;
      } else {
        // Standard single-color track for cooperative / dark vessels
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

// ============ SAR CORRELATION ============

let sarCorrelationLayer = null;

function showSARCorrelation() {
  // Clear any existing SAR layer first
  clearSARCorrelation();

  const vessels = window.appState.vessels || [];
  const elements = [];

  // SAR swath rectangle covering the strait area
  const swath = L.rectangle(
    [[25.0, 54.0], [27.5, 58.0]],
    {
      color: "#4A90D9",
      weight: 1.5,
      opacity: 0.6,
      fillColor: "#4A90D9",
      fillOpacity: 0.08,
      dashArray: "6 4",
      className: "sar-swath"
    }
  );
  elements.push(swath);

  // Detection boxes for each vessel within the swath bounds
  const swathBounds = L.latLngBounds([25.0, 54.0], [27.5, 58.0]);
  const halfBox = 0.01; // 0.02 degrees wide total

  vessels.forEach(vessel => {
    const pos = L.latLng(vessel.lat, vessel.lng);
    if (!swathBounds.contains(pos)) return;

    const mode = vessel.trackingMode || "cooperative";
    const isMatched = mode === "cooperative";
    const isUnmatched = mode === "dark" || mode === "gone_dark";

    if (!isMatched && !isUnmatched) return;

    const boxColor = isMatched ? "#22C55E" : "#EF4444";
    const labelText = isMatched ? "MATCHED" : "DARK";

    const box = L.rectangle(
      [
        [vessel.lat - halfBox, vessel.lng - halfBox],
        [vessel.lat + halfBox, vessel.lng + halfBox]
      ],
      {
        color: boxColor,
        weight: 2,
        opacity: 0.9,
        fillColor: boxColor,
        fillOpacity: 0.12,
        className: "sar-detection-box"
      }
    );

    box.bindTooltip(
      `<div class="sar-tooltip"><strong>${vessel.name || "UNKNOWN"}</strong><br><span style="color:${boxColor}">${labelText}</span></div>`,
      { className: "dark-tooltip", direction: "top", offset: [0, -4] }
    );

    elements.push(box);

    // Label marker
    const labelIcon = L.divIcon({
      html: `<div class="sar-pass-label" style="color:${boxColor}">${labelText}</div>`,
      className: "",
      iconSize: null,
      iconAnchor: [0, 0]
    });

    const labelMarker = L.marker(
      [vessel.lat + halfBox + 0.005, vessel.lng],
      { icon: labelIcon, interactive: false }
    );
    elements.push(labelMarker);
  });

  // Timestamp label — positioned at top of swath
  const timestampIcon = L.divIcon({
    html: `<div class="sar-pass-label sar-pass-timestamp">SAR PASS: ICEYE-X7 | 2026-03-31 06:45:00Z</div>`,
    className: "",
    iconSize: null,
    iconAnchor: [0, 0]
  });
  const timestampMarker = L.marker([27.45, 54.05], { icon: timestampIcon, interactive: false });
  elements.push(timestampMarker);

  // Build layer group and add to map
  sarCorrelationLayer = L.layerGroup(elements).addTo(map);
}

function clearSARCorrelation() {
  if (sarCorrelationLayer) {
    map.removeLayer(sarCorrelationLayer);
    sarCorrelationLayer = null;
  }
}
