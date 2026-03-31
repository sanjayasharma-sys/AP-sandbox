// Map module - Leaflet initialization and marker management

let map;
let layerGroups = { ais: null, rf: null, satellite: null };
let markerLookup = {};
let cepCircles = {};
let trackLines = {};

function createMarkerIcon(vessel) {
  const sources = getCorrelatedSources(vessel, window.appState.correlationGroups);
  const isCorrelated = sources.length > 1;
  const color = getSourceColor(vessel.source);
  const hasAlert = vessel.alerts && vessel.alerts.length > 0;
  const alertClass = hasAlert ? "has-alert" : "";

  let iconHtml = "";
  let iconClass = "";
  let size = [28, 28];
  let anchor = [14, 14];

  if (vessel.source === "ais") {
    const rotation = vessel.heading || vessel.course || 0;
    iconHtml = `<div class="marker-ais ${alertClass}" style="transform: rotate(${rotation}deg)">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 2 L18 20 L12 16 L6 20 Z" fill="${color}" stroke="#0a1628" stroke-width="1.5"/>
      </svg>
    </div>`;
    iconClass = "vessel-marker ais-marker";
  } else if (vessel.source === "rf") {
    iconHtml = `<div class="marker-rf ${alertClass}">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" fill="${color}" stroke="#0a1628" stroke-width="1.5"/>
      </svg>
    </div>`;
    iconClass = "vessel-marker rf-marker";
  } else if (vessel.source === "satellite") {
    iconHtml = `<div class="marker-sat ${alertClass}">
      <svg viewBox="0 0 24 24" width="22" height="22">
        <rect x="4" y="4" width="16" height="16" rx="1" fill="${color}" stroke="#0a1628" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="#0a1628" stroke-width="0.8" opacity="0.5"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="#0a1628" stroke-width="0.8" opacity="0.5"/>
      </svg>
    </div>`;
    iconClass = "vessel-marker sat-marker";
  }

  if (isCorrelated) {
    const rings = sources.map(s => `<span class="corr-ring" style="border-color:${getSourceColor(s)}"></span>`).join("");
    iconHtml = `<div class="marker-correlated">${rings}${iconHtml}</div>`;
    iconClass += " correlated";
  }

  return L.divIcon({
    html: iconHtml,
    className: iconClass,
    iconSize: size,
    iconAnchor: anchor
  });
}

function createPopupContent(vessel) {
  const name = getVesselDisplayName(vessel);
  const color = getSourceColor(vessel.source);
  const sourceLabel = getSourceLabel(vessel.source);
  const age = timeAgo(vessel.timestamp);

  let details = "";
  if (vessel.source === "ais") {
    details = `
      <div class="popup-row"><span>Speed:</span> ${formatSpeed(vessel.speed)}</div>
      <div class="popup-row"><span>Course:</span> ${formatCourse(vessel.course)}</div>
      <div class="popup-row"><span>Destination:</span> ${vessel.destination || "N/A"}</div>
      <div class="popup-row"><span>Flag:</span> ${flagEmoji(vessel.flag)} ${FLAG_NAMES[vessel.flag] || vessel.flag}</div>
    `;
  } else if (vessel.source === "rf") {
    details = `
      <div class="popup-row"><span>Signal:</span> ${vessel.signalType}</div>
      <div class="popup-row"><span>Band:</span> ${vessel.frequencyBand}</div>
      <div class="popup-row"><span>CEP:</span> ${vessel.cep} km</div>
      <div class="popup-row"><span>Strength:</span> ${vessel.signalStrength} dBm</div>
    `;
  } else if (vessel.source === "satellite") {
    details = `
      <div class="popup-row"><span>Sensor:</span> ${vessel.sensorType}</div>
      <div class="popup-row"><span>Satellite:</span> ${vessel.satellite}</div>
      <div class="popup-row"><span>Est. Length:</span> ${vessel.estimatedLength}m</div>
      <div class="popup-row"><span>Confidence:</span> ${Math.round(vessel.confidence * 100)}%</div>
    `;
  }

  return `
    <div class="vessel-popup">
      <div class="popup-header" style="border-left: 3px solid ${color}">
        <strong>${name}</strong>
        <span class="popup-source" style="color:${color}">${sourceLabel}</span>
      </div>
      <div class="popup-body">
        ${details}
        <div class="popup-row popup-time"><span>Updated:</span> ${age}</div>
      </div>
      <div class="popup-footer">Click for details</div>
    </div>
  `;
}

function initMap() {
  map = L.map("map-container", {
    center: [12.0, 112.0],
    zoom: 5,
    zoomControl: false,
    attributionControl: false
  });

  // Dark tile layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }).addTo(map);

  // Zoom control on the right
  L.control.zoom({ position: "topright" }).addTo(map);

  // Attribution
  L.control.attribution({ position: "bottomright" }).addTo(map);

  // Create layer groups
  layerGroups.ais = L.layerGroup().addTo(map);
  layerGroups.rf = L.layerGroup().addTo(map);
  layerGroups.satellite = L.layerGroup().addTo(map);
}

function plotVessels(vessels) {
  // Clear existing
  Object.values(layerGroups).forEach(lg => lg.clearLayers());
  markerLookup = {};
  cepCircles = {};
  trackLines = {};

  vessels.forEach(vessel => {
    const icon = createMarkerIcon(vessel);
    const marker = L.marker([vessel.lat, vessel.lng], { icon: icon });

    marker.bindPopup(createPopupContent(vessel), {
      className: "dark-popup",
      maxWidth: 280
    });

    marker.on("click", () => {
      showVesselDetail(vessel);
    });

    marker.vesselId = vessel.id;
    markerLookup[vessel.id] = marker;

    // Add to appropriate layer group
    if (layerGroups[vessel.source]) {
      marker.addTo(layerGroups[vessel.source]);
    }

    // Add CEP uncertainty circle for RF detections
    if (vessel.source === "rf" && vessel.cep) {
      const circle = L.circle([vessel.lat, vessel.lng], {
        radius: vessel.cep * 1000,
        color: SOURCE_COLORS.rf,
        fillColor: SOURCE_COLORS.rf,
        fillOpacity: 0.08,
        weight: 1,
        dashArray: "5 5",
        opacity: 0.4
      });
      circle.addTo(layerGroups.rf);
      cepCircles[vessel.id] = circle;
    }

    // Add track history line for AIS vessels
    if (vessel.source === "ais" && vessel.trackHistory && vessel.trackHistory.length > 1) {
      const latlngs = vessel.trackHistory.map(p => [p.lat, p.lng]);
      const trackLine = L.polyline(latlngs, {
        color: SOURCE_COLORS.ais,
        weight: 1.5,
        opacity: 0.3,
        dashArray: "4 6"
      });
      trackLine.addTo(layerGroups.ais);
      trackLines[vessel.id] = trackLine;
    }
  });
}

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

function highlightVessel(vesselId) {
  const marker = markerLookup[vesselId];
  if (marker) {
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 8), { animate: true });
    marker.openPopup();
  }
}

function toggleLayer(source, visible) {
  if (layerGroups[source]) {
    if (visible) {
      map.addLayer(layerGroups[source]);
    } else {
      map.removeLayer(layerGroups[source]);
    }
  }
}
