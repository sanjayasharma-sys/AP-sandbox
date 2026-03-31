// Vessel Detail Panel - right-side dossier for selected vessel
// Manages the detail panel with tabbed vessel information

// ============ PANEL OPEN / CLOSE ============

function showVesselDetail(vessel) {
  const panel = document.getElementById("detail-panel");
  if (!panel) return;

  window.appState.selectedVessel = vessel;

  panel.innerHTML = buildDetailHTML(vessel);
  panel.classList.add("open");

  // Bind close button
  const closeBtn = panel.querySelector(".detail-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeDetailPanel);
  }

  // Bind tab switching
  const tabBtns = panel.querySelectorAll(".detail-tab");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchDetailTab(btn.getAttribute("data-tab"));
    });
  });

  // Bind task satellite button
  const taskBtn = panel.querySelector(".imagery-task-btn");
  if (taskBtn) {
    taskBtn.addEventListener("click", () => {
      const form = panel.querySelector(".imagery-task-form");
      if (form) {
        form.style.display = form.style.display === "none" ? "block" : "none";
      }
    });
  }

  // Bind task form submit
  const submitBtn = panel.querySelector(".imagery-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      submitImageryTask(vessel);
    });
  }

  // Bind task form mode toggles
  const modeToggles = panel.querySelectorAll(".task-mode-btn");
  modeToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      modeToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Bind task form priority toggles
  const priorityToggles = panel.querySelectorAll(".task-priority-btn");
  priorityToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function closeDetailPanel() {
  const panel = document.getElementById("detail-panel");
  if (panel) {
    panel.classList.remove("open");
    window.appState.selectedVessel = null;
  }
}

// ============ BUILD DETAIL HTML ============

function buildDetailHTML(vessel) {
  const name = vessel.name || "UNIDENTIFIED VESSEL";
  const flag = vessel.flag ? flagEmoji(vessel.flag) : "";
  const displayName = flag ? flag + " " + name : name;
  const vesselClassLabel = getVesselClassLabel(vessel.vesselClass);
  const modeConfig = TRACKING_MODES[vessel.trackingMode] || TRACKING_MODES.cooperative;
  const modeCssClass = (vessel.trackingMode || "cooperative").replace("_", "-");

  return `
    <div class="detail-header">
      <div class="detail-title-row">
        <h3>${displayName}</h3>
        <button class="detail-close" title="Close">&times;</button>
      </div>
      <div class="detail-meta">
        ${vessel.id} &middot; ${vesselClassLabel}
      </div>
      <span class="tracking-badge ${modeCssClass}">${modeConfig.label}</span>
    </div>

    <div class="detail-tabs">
      <button class="detail-tab active" data-tab="overview">Overview</button>
      <button class="detail-tab" data-tab="rf">RF Fingerprint</button>
      <button class="detail-tab" data-tab="imagery">Imagery</button>
      <button class="detail-tab" data-tab="history">History</button>
    </div>

    <div class="detail-tab-content" id="tab-overview">
      ${renderOverviewTab(vessel)}
    </div>
    <div class="detail-tab-content" id="tab-rf" style="display:none">
      ${renderRFTab(vessel)}
    </div>
    <div class="detail-tab-content" id="tab-imagery" style="display:none">
      ${renderImageryTab(vessel)}
    </div>
    <div class="detail-tab-content" id="tab-history" style="display:none">
      ${renderHistoryTab(vessel)}
    </div>
  `;
}

// ============ TAB SWITCHING ============

function switchDetailTab(tabName) {
  // Hide all tab contents
  const contents = document.querySelectorAll(".detail-tab-content");
  contents.forEach(c => { c.style.display = "none"; });

  // Show selected
  const selected = document.getElementById("tab-" + tabName);
  if (selected) {
    selected.style.display = "block";
  }

  // Update active tab button
  const tabs = document.querySelectorAll(".detail-tab");
  tabs.forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-tab") === tabName);
  });
}

// ============ OVERVIEW TAB ============

function renderOverviewTab(vessel) {
  const mode = vessel.trackingMode || "cooperative";

  // Position section - always shown
  let html = `
    <div class="detail-section">
      <h4>Position</h4>
      <div class="detail-grid">
        <div class="detail-field">
          <label>Coordinates</label>
          <value>${formatCoord(vessel.lat, vessel.lng)}</value>
        </div>
        <div class="detail-field">
          <label>Speed</label>
          <value>${formatSpeed(vessel.speed)}</value>
        </div>
        <div class="detail-field">
          <label>Course</label>
          <value>${formatCourse(vessel.course)}</value>
        </div>
        <div class="detail-field">
          <label>Heading</label>
          <value>${vessel.heading !== undefined && vessel.heading !== null ? vessel.heading + "\u00B0" : "N/A"}</value>
        </div>
      </div>
    </div>
  `;

  // Mode-specific information
  if (mode === "cooperative") {
    html += `
      <div class="detail-section">
        <h4>AIS Data</h4>
        <div class="detail-grid">
          <div class="detail-field">
            <label>MMSI</label>
            <value>${vessel.mmsi || "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>IMO</label>
            <value>${vessel.imo || "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Flag</label>
            <value>${vessel.flag ? flagEmoji(vessel.flag) + " " + (FLAG_NAMES[vessel.flag] || vessel.flag) : "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Callsign</label>
            <value>${vessel.callsign || "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Destination</label>
            <value>${vessel.destination || "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Draught</label>
            <value>${vessel.draught ? vessel.draught + " m" : "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Dimensions</label>
            <value>${vessel.dimensions ? vessel.dimensions.length + "m x " + vessel.dimensions.beam + "m" : "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Nav Status</label>
            <value>${vessel.navStatus || "N/A"}</value>
          </div>
        </div>
      </div>
    `;
  } else if (mode === "dark") {
    html += `
      <div class="detail-section">
        <div class="detail-info-message dark-message">
          <span class="info-icon">&#x26A0;</span>
          No AIS data available &mdash; vessel tracked by RF emissions only
        </div>
      </div>
    `;
  } else if (mode === "gone_dark") {
    html += `
      <div class="detail-section">
        <h4>Last AIS Contact</h4>
        <div class="detail-grid">
          <div class="detail-field">
            <label>MMSI</label>
            <value>${vessel.ais && vessel.ais.mmsi ? vessel.ais.mmsi : "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Last Seen</label>
            <value>${vessel.ais && vessel.ais.lastSeen ? timeAgo(vessel.ais.lastSeen) : "N/A"}</value>
          </div>
          <div class="detail-field">
            <label>Last Position</label>
            <value>${vessel.ais && vessel.ais.lastPosition ? formatCoord(vessel.ais.lastPosition.lat, vessel.ais.lastPosition.lng) : "N/A"}</value>
          </div>
        </div>
        <div class="detail-info-message gone-dark-message">
          <span class="info-icon">&#x26A0;</span>
          AIS signal lost &mdash; tracking via RF emissions
        </div>
      </div>
    `;
  }

  // Alerts section
  if (vessel.alerts && vessel.alerts.length > 0) {
    html += `
      <div class="detail-section alerts-section">
        <h4>Alerts</h4>
        ${vessel.alerts.map(a => `
          <div class="alert-item alert-${a.severity}">
            <span class="alert-severity" style="color:${SEVERITY_COLORS[a.severity] || "#3B82F6"}">${a.severity.toUpperCase()}</span>
            <span class="alert-message">${a.message}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  return html;
}

// ============ RF TAB ============

function renderRFTab(vessel) {
  if (!vessel.rf || !vessel.rf.detected) {
    return `
      <div class="detail-section">
        <div class="detail-info-message">
          No RF emissions detected for this vessel
        </div>
      </div>
    `;
  }

  const rf = vessel.rf;
  const emitters = rf.emitters || [];

  // CEP accuracy section
  let cepHtml = "";
  if (rf.cepMeters) {
    const cepDisplay = rf.cepMeters >= 1000
      ? (rf.cepMeters / 1000).toFixed(1) + " km"
      : rf.cepMeters + " m";
    cepHtml = `
      <div class="detail-section">
        <h4>Position Accuracy</h4>
        <div class="rf-cep-display">
          <div class="rf-cep-visual">
            <div class="rf-cep-ring"></div>
            <div class="rf-cep-dot"></div>
          </div>
          <span class="rf-cep-label">&lt; ${cepDisplay} CEP</span>
        </div>
      </div>
    `;
  }

  // Fingerprint summary
  let summaryHtml = `
    <div class="detail-section">
      <h4>RF Fingerprint</h4>
      <div class="rf-summary">${emitters.length} emitter${emitters.length !== 1 ? "s" : ""} detected</div>
    </div>
  `;

  // Emitter cards
  let emitterCardsHtml = "";
  emitters.forEach(emitter => {
    const typeLabel = getEmitterTypeLabel(emitter.type);
    const freqFormatted = emitter.frequencyMHz ? formatFrequency(emitter.frequencyMHz) : "N/A";
    const strengthPct = emitter.signalStrengthDbm !== undefined ? signalStrengthPercent(emitter.signalStrengthDbm) : 0;
    const strengthDbm = emitter.signalStrengthDbm !== undefined ? emitter.signalStrengthDbm + " dBm" : "N/A";
    const confidencePct = emitter.confidence !== undefined ? Math.round(emitter.confidence * 100) : 0;

    let pulseBadge = "";
    if (emitter.pulsePattern) {
      const pulseLabels = { cw: "CW", pulsed: "PULSED", fh: "FH" };
      const pulseLabel = pulseLabels[emitter.pulsePattern] || emitter.pulsePattern.toUpperCase();
      pulseBadge = `<span class="rf-pulse-badge">${pulseLabel}</span>`;
    }

    emitterCardsHtml += `
      <div class="rf-emitter-card">
        <div class="rf-emitter-header">
          <span class="rf-emitter-type">${typeLabel}</span>
          ${pulseBadge}
        </div>
        <div class="rf-emitter-body">
          <div class="rf-emitter-row">
            <label>Frequency</label>
            <value>${freqFormatted}</value>
          </div>
          <div class="rf-emitter-row">
            <label>Signal Strength</label>
            <value>
              <div class="signal-bar-container">
                <div class="signal-bar-fill" style="width:${strengthPct}%;background:${strengthPct > 60 ? "#22C55E" : strengthPct > 30 ? "#F59E0B" : "#EF4444"}"></div>
              </div>
              <span class="signal-bar-label">${strengthDbm}</span>
            </value>
          </div>
          <div class="rf-emitter-row">
            <label>Confidence</label>
            <value>
              <div class="signal-bar-container">
                <div class="signal-bar-fill" style="width:${confidencePct}%;background:#3B82F6"></div>
              </div>
              <span class="signal-bar-label">${confidencePct}%</span>
            </value>
          </div>
          <div class="rf-emitter-row">
            <label>Fingerprint ID</label>
            <value><span class="rf-fingerprint-id">${emitter.fingerprintId || "N/A"}</span></value>
          </div>
        </div>
      </div>
    `;
  });

  // RF spectrum visualization
  let spectrumHtml = "";
  if (emitters.length > 0) {
    const bandLabels = [
      { name: "VHF", startPct: 0, endPct: 10 },
      { name: "L", startPct: 20, endPct: 30 },
      { name: "S", startPct: 30, endPct: 40 },
      { name: "X", startPct: 55, endPct: 65 },
      { name: "Ku", startPct: 70, endPct: 78 },
      { name: "Ka", startPct: 85, endPct: 95 }
    ];

    const emitterBars = emitters.map(emitter => {
      if (!emitter.frequencyMHz) return "";
      const freqMHz = emitter.frequencyMHz;
      // Position on log scale: 100 MHz (10^2) to 30 GHz (30000 MHz, ~10^4.477)
      const logMin = 2; // log10(100)
      const logMax = Math.log10(30000);
      const pct = ((Math.log10(freqMHz) - logMin) / (logMax - logMin)) * 100;
      const color = getVesselClassColor(vessel.vesselClass);
      return `<div class="spectrum-emitter-bar" style="left:${pct}%;background:${color}" title="${formatFrequency(freqMHz)}"></div>`;
    }).join("");

    const bandLabelHtml = bandLabels.map(b =>
      `<span class="spectrum-band-label" style="left:${(b.startPct + b.endPct) / 2}%">${b.name}</span>`
    ).join("");

    spectrumHtml = `
      <div class="detail-section">
        <h4>RF Spectrum</h4>
        <div class="rf-spectrum">
          <div class="spectrum-axis">
            ${emitterBars}
          </div>
          <div class="spectrum-labels">
            <span class="spectrum-edge-label" style="left:0">100 MHz</span>
            ${bandLabelHtml}
            <span class="spectrum-edge-label" style="right:0">30 GHz</span>
          </div>
        </div>
      </div>
    `;
  }

  return cepHtml + summaryHtml + emitterCardsHtml + spectrumHtml;
}

// ============ IMAGERY TAB ============

function renderImageryTab(vessel) {
  let html = `
    <div class="detail-section">
      <button class="imagery-task-btn">Request Imagery Collection</button>
    </div>
  `;

  // Imagery timeline
  if (vessel.imagery && vessel.imagery.length > 0) {
    html += `
      <div class="detail-section">
        <h4>Imagery Timeline</h4>
        <div class="imagery-count">${vessel.imagery.length} collection${vessel.imagery.length !== 1 ? "s" : ""}</div>
        <div class="imagery-timeline">
          ${vessel.imagery.map(img => {
            const typeBadgeColor = img.type === "SAR" ? "#06B6D4" : "#F59E0B";
            const typeBadgeBg = img.type === "SAR" ? "rgba(6,182,212,0.15)" : "rgba(245,158,11,0.15)";
            let statusColor = "#6B7280";
            if (img.status === "acquired") statusColor = "#22C55E";
            else if (img.status === "processing") statusColor = "#F59E0B";
            else if (img.status === "tasked") statusColor = "#E8461E";

            let detailLine = "";
            if (img.resolution) detailLine += `Res: ${img.resolution}`;
            if (img.type === "EO" && img.cloudCover !== undefined && img.cloudCover !== null) detailLine += ` &middot; Cloud: ${img.cloudCover}%`;

            // Satellite imagery thumbnail
            const thumbGradient = img.type === "SAR"
              ? "linear-gradient(135deg, #0a1628 0%, #0d2040 30%, #14304a 50%, #0b1a30 70%, #091320 100%)"
              : "linear-gradient(135deg, #1a2a18 0%, #2a3d25 30%, #1e3328 50%, #15281c 70%, #0d1a12 100%)";
            const isTasked = img.status === "tasked";
            const detectionDots = img.detections ? buildDetectionDots(img.detections, img.type) : "";

            return `
              <div class="imagery-card-full ${isTasked ? 'tasked' : ''}">
                <div class="imagery-thumb" style="background:${thumbGradient}">
                  ${isTasked ? `
                    <div class="imagery-thumb-pending">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="${statusColor}" stroke-width="1.5" stroke-dasharray="4 3"/>
                        <path d="M12 7v5l3 3" stroke="${statusColor}" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      <span>PENDING</span>
                    </div>
                  ` : `
                    <div class="imagery-thumb-overlay">
                      ${detectionDots}
                      <div class="imagery-thumb-grid"></div>
                    </div>
                    <div class="imagery-thumb-label">${img.type}</div>
                  `}
                </div>
                <div class="imagery-card-body">
                  <div class="imagery-entry-header">
                    <span class="imagery-satellite">${img.satellite || "Unknown"}</span>
                    <span class="imagery-type-badge" style="background:${typeBadgeBg};color:${typeBadgeColor};border:1px solid ${typeBadgeColor}40">${img.type}</span>
                  </div>
                  <div class="imagery-entry-meta">
                    <span class="imagery-timestamp">${img.timestamp ? timeAgo(img.timestamp) : "Pending"}</span>
                    <span class="imagery-status-badge" style="color:${statusColor}">${img.status.toUpperCase()}</span>
                  </div>
                  ${img.location ? `<div class="imagery-location">${img.location}</div>` : ""}
                  ${detailLine ? `<div class="imagery-entry-detail">${detailLine}</div>` : ""}
                  ${img.notes ? `<div class="imagery-notes">${img.notes}</div>` : ""}
                  ${img.detections ? `<div class="imagery-detections">${img.detections} detection${img.detections !== 1 ? "s" : ""}</div>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="detail-section">
        <div class="detail-info-message">
          No satellite imagery acquired for this vessel yet
        </div>
      </div>
    `;
  }

  // Task form (hidden by default)
  html += `
    <div class="imagery-task-form" style="display:none">
      <div class="detail-section">
        <h4>Task Satellite Collection</h4>
        <div class="task-form-group">
          <label>Mode</label>
          <div class="task-toggle-group">
            <button class="task-mode-btn active" data-mode="SAR">SAR</button>
            <button class="task-mode-btn" data-mode="EO">EO</button>
          </div>
        </div>
        <div class="task-form-group">
          <label>Priority</label>
          <div class="task-toggle-group">
            <button class="task-priority-btn active" data-priority="routine">Routine</button>
            <button class="task-priority-btn" data-priority="urgent">Urgent</button>
            <button class="task-priority-btn" data-priority="critical">Critical</button>
          </div>
        </div>
        <button class="imagery-submit-btn">Submit Collection Request</button>
      </div>
    </div>
  `;

  return html;
}

function submitImageryTask(vessel) {
  const panel = document.getElementById("detail-panel");
  if (!panel) return;

  const activeMode = panel.querySelector(".task-mode-btn.active");
  const activePriority = panel.querySelector(".task-priority-btn.active");

  const mode = activeMode ? activeMode.getAttribute("data-mode") : "SAR";
  const priority = activePriority ? activePriority.getAttribute("data-priority") : "routine";

  // Add new tasked imagery entry
  if (!vessel.imagery) vessel.imagery = [];
  vessel.imagery.unshift({
    satellite: mode === "SAR" ? "ICEYE-X" : "Planet SkySat",
    type: mode,
    timestamp: null,
    resolution: mode === "SAR" ? "1m" : "0.5m",
    cloudCover: mode === "EO" ? null : undefined,
    status: "tasked",
    priority: priority
  });

  // Re-render the imagery tab
  const imageryTab = document.getElementById("tab-imagery");
  if (imageryTab) {
    imageryTab.innerHTML = renderImageryTab(vessel);
  }

  // Re-bind buttons after re-render
  const taskBtn = panel.querySelector(".imagery-task-btn");
  if (taskBtn) {
    taskBtn.addEventListener("click", () => {
      const form = panel.querySelector(".imagery-task-form");
      if (form) {
        form.style.display = form.style.display === "none" ? "block" : "none";
      }
    });
  }

  const submitBtn = panel.querySelector(".imagery-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      submitImageryTask(vessel);
    });
  }

  const modeToggles = panel.querySelectorAll(".task-mode-btn");
  modeToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      modeToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const priorityToggles = panel.querySelectorAll(".task-priority-btn");
  priorityToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      priorityToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Show confirmation
  const confirmation = document.createElement("div");
  confirmation.className = "imagery-confirmation";
  confirmation.innerHTML = `Collection request submitted: ${mode} / ${priority.toUpperCase()}`;
  const imagerySection = panel.querySelector("#tab-imagery .detail-section");
  if (imagerySection) {
    imagerySection.parentNode.insertBefore(confirmation, imagerySection.nextSibling);
    setTimeout(() => { confirmation.remove(); }, 4000);
  }
}

// ============ HISTORY TAB ============

function renderHistoryTab(vessel) {
  let html = "";

  // Port history
  if (vessel.portHistory && vessel.portHistory.length > 0) {
    html += `
      <div class="detail-section">
        <h4>Port Calls</h4>
        <table class="detail-table">
          <thead>
            <tr><th>Port</th><th>Arrived</th><th>Departed</th></tr>
          </thead>
          <tbody>
            ${vessel.portHistory.map(p => `
              <tr>
                <td>${p.port}</td>
                <td>${p.arrived ? timeAgo(p.arrived) : "N/A"}</td>
                <td>${p.departed ? timeAgo(p.departed) : "In Port"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Track history - last 10 positions
  if (vessel.trackHistory && vessel.trackHistory.length > 0) {
    const recent = vessel.trackHistory.slice(-10).reverse();
    html += `
      <div class="detail-section">
        <h4>Recent Positions</h4>
        <table class="detail-table">
          <thead>
            <tr><th>Time</th><th>Lat</th><th>Lng</th><th>Speed</th></tr>
          </thead>
          <tbody>
            ${recent.map(p => `
              <tr>
                <td>${p.timestamp ? timeAgo(p.timestamp) : "N/A"}</td>
                <td>${p.lat !== undefined ? p.lat.toFixed(4) : "N/A"}</td>
                <td>${p.lng !== undefined ? p.lng.toFixed(4) : "N/A"}</td>
                <td>${p.speed !== undefined ? formatSpeed(p.speed) : "N/A"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Gone dark AIS gap info
  if (vessel.trackingMode === "gone_dark" && vessel.ais && vessel.ais.lastSeen) {
    const lastSeen = new Date(vessel.ais.lastSeen);
    const gapMs = Date.now() - lastSeen.getTime();
    const gapHours = Math.floor(gapMs / (1000 * 60 * 60));
    const gapMins = Math.floor((gapMs % (1000 * 60 * 60)) / (1000 * 60));

    html += `
      <div class="detail-section">
        <h4>AIS Gap Analysis</h4>
        <div class="detail-grid">
          <div class="detail-field">
            <label>Last AIS Signal</label>
            <value>${timeAgo(vessel.ais.lastSeen)}</value>
          </div>
          <div class="detail-field">
            <label>Gap Duration</label>
            <value class="gap-duration-value">${gapHours}h ${gapMins}m</value>
          </div>
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `
      <div class="detail-section">
        <div class="detail-info-message">
          No history data available for this vessel
        </div>
      </div>
    `;
  }

  return html;
}

// ============ IMAGERY HELPERS ============

function buildDetectionDots(count, type) {
  const color = type === "SAR" ? "#06B6D4" : "#F59E0B";
  const positions = [
    { top: "30%", left: "55%" },
    { top: "50%", left: "35%" },
    { top: "25%", left: "70%" },
    { top: "65%", left: "60%" },
    { top: "45%", left: "20%" }
  ];
  let dots = "";
  for (let i = 0; i < Math.min(count, positions.length); i++) {
    const p = positions[i];
    dots += `<div class="imagery-detection-marker" style="top:${p.top};left:${p.left};border-color:${color}"></div>`;
  }
  return dots;
}
