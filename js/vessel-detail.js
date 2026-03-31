// Vessel Detail Panel - shows comprehensive information about a selected vessel

function showVesselDetail(vessel) {
  const panel = document.getElementById("detail-panel");
  if (!panel) return;

  window.appState.selectedVessel = vessel;
  const { correlationGroups } = window.appState;
  const correlated = correlationGroups[vessel.correlationId] || [vessel];
  const sources = [...new Set(correlated.map(v => v.source))];

  panel.innerHTML = buildDetailHTML(vessel, correlated, sources);
  panel.classList.add("open");

  // Bind close
  const closeBtn = panel.querySelector(".detail-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeDetailPanel);
  }

  // Bind flag button
  const flagBtn = panel.querySelector(".flag-suspicious-btn");
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      if (!vessel.alerts) vessel.alerts = [];
      vessel.alerts.push({ type: "flagged", message: "Manually flagged as suspicious", severity: "warning" });
      flagBtn.textContent = "Flagged";
      flagBtn.disabled = true;
      flagBtn.classList.add("flagged");
      updateFilteredCounts();
    });
  }
}

function closeDetailPanel() {
  const panel = document.getElementById("detail-panel");
  if (panel) {
    panel.classList.remove("open");
    window.appState.selectedVessel = null;
  }
}

function buildDetailHTML(vessel, correlated, sources) {
  const color = getSourceColor(vessel.source);
  const name = getVesselDisplayName(vessel);

  // Source badges
  const sourceBadges = sources.map(s =>
    `<span class="source-badge" style="background:${getSourceColor(s)}20;color:${getSourceColor(s)};border:1px solid ${getSourceColor(s)}40">${getSourceLabel(s)}</span>`
  ).join("");

  // Alerts section
  let alertsHTML = "";
  const allAlerts = correlated.flatMap(v => (v.alerts || []).map(a => ({ ...a, sourceId: v.id })));
  if (allAlerts.length > 0) {
    alertsHTML = `
      <div class="detail-section alerts-section">
        <h4>Alerts</h4>
        ${allAlerts.map(a => `
          <div class="alert-item alert-${a.severity}">
            <span class="alert-severity">${a.severity.toUpperCase()}</span>
            <span class="alert-message">${a.message}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  // Build source-specific sections
  let sectionsHTML = correlated.map(v => buildSourceSection(v)).join("");

  // Confidence bar
  const confidence = Math.round(vessel.confidence * 100);
  const confColor = confidence > 80 ? "#00d4aa" : confidence > 60 ? "#f0a030" : "#ff3b5c";

  return `
    <div class="detail-header">
      <div class="detail-title-row">
        <h3 style="border-left: 4px solid ${color}; padding-left: 12px">${name}</h3>
        <button class="detail-close" title="Close">&times;</button>
      </div>
      <div class="detail-id">${vessel.id} &middot; ${vessel.correlationId}</div>
      <div class="detail-sources">${sourceBadges}</div>
    </div>

    <div class="detail-body">
      <div class="detail-section">
        <h4>Position</h4>
        <div class="detail-grid">
          <div class="detail-field">
            <label>Coordinates</label>
            <value>${formatCoord(vessel.lat, vessel.lng)}</value>
          </div>
          <div class="detail-field">
            <label>Last Updated</label>
            <value>${timeAgo(vessel.timestamp)}</value>
          </div>
          <div class="detail-field">
            <label>Confidence</label>
            <value>
              <div class="confidence-bar">
                <div class="confidence-fill" style="width:${confidence}%;background:${confColor}"></div>
              </div>
              <span class="confidence-value">${confidence}%</span>
            </value>
          </div>
        </div>
      </div>

      ${alertsHTML}
      ${sectionsHTML}

      <div class="detail-section">
        <h4>Correlation</h4>
        <div class="detail-grid">
          <div class="detail-field">
            <label>Track ID</label>
            <value>${vessel.correlationId}</value>
          </div>
          <div class="detail-field">
            <label>Sources</label>
            <value>${sources.length} of 3</value>
          </div>
          <div class="detail-field">
            <label>Correlated Detections</label>
            <value>${correlated.length}</value>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="flag-suspicious-btn">Flag as Suspicious</button>
      </div>
    </div>
  `;
}

function buildSourceSection(vessel) {
  const color = getSourceColor(vessel.source);
  const label = getSourceLabel(vessel.source);

  let fields = "";
  if (vessel.source === "ais") {
    fields = `
      <div class="detail-field"><label>MMSI</label><value>${vessel.mmsi}</value></div>
      <div class="detail-field"><label>IMO</label><value>${vessel.imo}</value></div>
      <div class="detail-field"><label>Flag</label><value>${flagEmoji(vessel.flag)} ${FLAG_NAMES[vessel.flag] || vessel.flag}</value></div>
      <div class="detail-field"><label>Type</label><value>${VESSEL_TYPE_LABELS[vessel.vesselType] || vessel.vesselType}</value></div>
      <div class="detail-field"><label>Speed</label><value>${formatSpeed(vessel.speed)} (${knotsToKmh(vessel.speed)} km/h)</value></div>
      <div class="detail-field"><label>Course</label><value>${formatCourse(vessel.course)}</value></div>
      <div class="detail-field"><label>Heading</label><value>${vessel.heading}\u00B0</value></div>
      <div class="detail-field"><label>Destination</label><value>${vessel.destination || "N/A"}</value></div>
      <div class="detail-field"><label>Nav Status</label><value>${vessel.navStatus}</value></div>
    `;
  } else if (vessel.source === "rf") {
    fields = `
      <div class="detail-field"><label>Emitter ID</label><value>${vessel.emitterId}</value></div>
      <div class="detail-field"><label>Signal Type</label><value>${vessel.signalType}</value></div>
      <div class="detail-field"><label>Frequency</label><value>${vessel.frequencyBand}</value></div>
      <div class="detail-field"><label>Signal Strength</label><value>${vessel.signalStrength} dBm</value></div>
      <div class="detail-field"><label>CEP</label><value>${vessel.cep} km</value></div>
      <div class="detail-field"><label>Attributed</label><value>${vessel.attributed ? "Yes" : "No"}</value></div>
    `;
  } else if (vessel.source === "satellite") {
    fields = `
      <div class="detail-field"><label>Sensor</label><value>${vessel.sensorType}</value></div>
      <div class="detail-field"><label>Satellite</label><value>${vessel.satellite}</value></div>
      <div class="detail-field"><label>Est. Length</label><value>${vessel.estimatedLength}m</value></div>
      <div class="detail-field"><label>Est. Beam</label><value>${vessel.estimatedBeam}m</value></div>
      <div class="detail-field"><label>Cloud Cover</label><value>${vessel.cloudCover}%</value></div>
    `;
  }

  return `
    <div class="detail-section source-section">
      <h4 style="color:${color}">${label} <span class="source-id">${vessel.id}</span></h4>
      <div class="detail-grid">${fields}</div>
    </div>
  `;
}
