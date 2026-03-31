// Filter module - controls data source visibility, search, and vessel filtering

let filterState = {
  trackingMode: { cooperative: true, dark: true, gone_dark: true },
  vesselClass: "all",
  searchQuery: "",
  alertsOnly: false,
  timeWindow: 24
};

function initFilters() {
  // Tracking mode toggles (data-mode attributes)
  document.querySelectorAll('.toggle-switch[data-mode]').forEach(el => {
    el.addEventListener("change", (e) => {
      const mode = e.target.dataset.mode;
      filterState.trackingMode[mode] = e.target.checked;
      toggleLayer(mode, e.target.checked);
      applyFilters();
    });
  });

  // Vessel class filter
  const classFilter = document.getElementById("class-filter");
  if (classFilter) {
    classFilter.addEventListener("change", (e) => {
      filterState.vesselClass = e.target.value;
      applyFilters();
    });
  }

  // Search
  const searchInput = document.getElementById("layer-search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    }, 200));
  }

  // Vessel search in vessel panel
  const vesselSearch = document.getElementById("vessel-search");
  if (vesselSearch) {
    vesselSearch.addEventListener("input", debounce((e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      // Sync with layer search
      if (searchInput) searchInput.value = e.target.value;
      applyFilters();
    }, 200));
  }

  // Alerts only
  const alertsOnly = document.getElementById("alerts-only");
  if (alertsOnly) {
    alertsOnly.addEventListener("change", (e) => {
      filterState.alertsOnly = e.target.checked;
      applyFilters();
    });
  }

  // Time window slider
  const timeSlider = document.getElementById("time-slider");
  if (timeSlider) {
    timeSlider.addEventListener("input", (e) => {
      filterState.timeWindow = parseInt(e.target.value);
      const label = document.getElementById("time-value");
      if (label) label.textContent = `${filterState.timeWindow}h`;
      applyFilters();
    });
  }

  // Vessel list tab buttons
  document.querySelectorAll(".vessel-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".vessel-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      updateVesselList(tab.dataset.filter);
    });
  });
}

function applyFilters() {
  const { vessels } = window.appState;
  if (!vessels) return;
  const now = Date.now();

  vessels.forEach(vessel => {
    const marker = markerLookup[vessel.id];
    if (!marker) return;

    let visible = true;

    // Tracking mode filter
    if (!filterState.trackingMode[vessel.trackingMode]) {
      visible = false;
    }

    // Vessel class filter
    if (visible && filterState.vesselClass !== "all") {
      if (vessel.vesselClass !== filterState.vesselClass) {
        visible = false;
      }
    }

    // Search filter
    if (visible && filterState.searchQuery) {
      const q = filterState.searchQuery;
      const searchable = [
        vessel.name, vessel.mmsi, vessel.imo, vessel.id,
        vessel.callsign, vessel.destination, vessel.flag
      ].filter(Boolean).join(" ").toLowerCase();

      // Also search RF fingerprint IDs
      if (vessel.rf && vessel.rf.emitters) {
        vessel.rf.emitters.forEach(em => {
          if (em.fingerprintId) searchable + " " + em.fingerprintId.toLowerCase();
        });
      }

      if (!searchable.includes(q)) {
        visible = false;
      }
    }

    // Alerts only
    if (visible && filterState.alertsOnly) {
      if (!vessel.alerts || vessel.alerts.length === 0) {
        visible = false;
      }
    }

    // Time window
    if (visible && vessel.lastUpdate) {
      const age = (now - new Date(vessel.lastUpdate).getTime()) / 3600000;
      if (age > filterState.timeWindow) {
        visible = false;
      }
    }

    // Apply visibility
    const el = marker.getElement && marker.getElement();
    if (el) {
      el.style.display = visible ? "" : "none";
    }
  });

  updateStats();
  updateVesselList();
}

function updateStats() {
  const { vessels } = window.appState;
  if (!vessels) return;

  const counts = { total: 0, cooperative: 0, dark: 0, gone_dark: 0, alerts: 0 };

  vessels.forEach(v => {
    if (filterState.trackingMode[v.trackingMode]) {
      counts.total++;
      counts[v.trackingMode]++;
      if (v.alerts && v.alerts.length > 0) counts.alerts++;
    }
  });

  setStatValue("stat-total", counts.total);
  setStatValue("stat-cooperative", counts.cooperative);
  setStatValue("stat-dark", counts.dark);
  setStatValue("stat-gone-dark", counts.gone_dark);
  setStatValue("stat-alerts", counts.alerts);

  // Update toolbar alert badge
  const badge = document.getElementById("toolbar-alert-badge");
  if (badge) {
    badge.textContent = counts.alerts;
    badge.style.display = counts.alerts > 0 ? "" : "none";
  }
}

function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateVesselList(tabFilter) {
  const listContainer = document.getElementById("vessel-list");
  if (!listContainer) return;

  const { vessels } = window.appState;
  if (!vessels) return;

  tabFilter = tabFilter || "all";

  const filtered = vessels.filter(v => {
    // Tab filter
    if (tabFilter === "dark" && v.trackingMode !== "dark") return false;
    if (tabFilter === "gone_dark" && v.trackingMode !== "gone_dark") return false;
    if (tabFilter === "alerts" && (!v.alerts || v.alerts.length === 0)) return false;

    // Search
    if (filterState.searchQuery) {
      const searchable = [v.name, v.mmsi, v.imo, v.id, v.callsign].filter(Boolean).join(" ").toLowerCase();
      if (!searchable.includes(filterState.searchQuery)) return false;
    }

    return true;
  });

  // Sort: dark first, then gone_dark, then alerts, then cooperative
  const modeOrder = { dark: 0, gone_dark: 1, cooperative: 2 };
  filtered.sort((a, b) => {
    const aOrder = modeOrder[a.trackingMode] || 2;
    const bOrder = modeOrder[b.trackingMode] || 2;
    if (aOrder !== bOrder) return aOrder - bOrder;
    const aAlerts = (a.alerts && a.alerts.length) || 0;
    const bAlerts = (b.alerts && b.alerts.length) || 0;
    return bAlerts - aAlerts;
  });

  listContainer.innerHTML = filtered.map(v => {
    const modeColor = getTrackingModeColor(v.trackingMode);
    const modeLabel = getTrackingModeLabel(v.trackingMode);
    const name = v.name || "UNKNOWN VESSEL";
    const cls = getVesselClassLabel(v.vesselClass);
    const hasAlert = v.alerts && v.alerts.length > 0;

    return `
      <div class="vessel-list-item" data-vessel-id="${v.id}" onclick="onVesselListClick('${v.id}')">
        <div class="vli-indicator" style="background:${modeColor}"></div>
        <div class="vli-info">
          <div class="vli-name">${name}</div>
          <div class="vli-meta">${v.id} &middot; ${cls}</div>
        </div>
        <div class="vli-right">
          <span class="vli-badge" style="color:${modeColor};border-color:${modeColor}40;background:${modeColor}15">${modeLabel}</span>
          ${hasAlert ? '<span class="vli-alert-dot"></span>' : ''}
        </div>
      </div>
    `;
  }).join("");
}

function onVesselListClick(vesselId) {
  const vessel = window.appState.vessels.find(v => v.id === vesselId);
  if (vessel) {
    highlightVessel(vesselId);
    showVesselDetail(vessel);
  }
}

function updateAlertFeed() {
  const feed = document.getElementById("alert-feed");
  if (!feed) return;

  const { vessels } = window.appState;
  if (!vessels) return;

  const allAlerts = [];
  vessels.forEach(v => {
    if (v.alerts) {
      v.alerts.forEach(a => {
        allAlerts.push({ ...a, vesselId: v.id, vesselName: v.name || "UNKNOWN VESSEL" });
      });
    }
  });

  // Sort by severity then timestamp
  const sevOrder = { critical: 0, warning: 1, info: 2 };
  allAlerts.sort((a, b) => (sevOrder[a.severity] || 2) - (sevOrder[b.severity] || 2));

  feed.innerHTML = allAlerts.map(a => {
    const sevColor = SEVERITY_COLORS[a.severity] || "#6B7280";
    return `
      <div class="alert-feed-item" onclick="onVesselListClick('${a.vesselId}')">
        <span class="alert-severity-badge" style="background:${sevColor}">${a.severity.toUpperCase()}</span>
        <div class="alert-feed-content">
          <div class="alert-feed-vessel">${a.vesselName}</div>
          <div class="alert-feed-message">${a.message}</div>
        </div>
      </div>
    `;
  }).join("");
}
