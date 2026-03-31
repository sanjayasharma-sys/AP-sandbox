// Filter module - controls data source visibility, search, and vessel filtering

let filterState = {
  sources: { ais: true, rf: true, satellite: true },
  vesselType: "all",
  searchQuery: "",
  alertsOnly: false,
  timeWindow: 24 // hours
};

function initFilters() {
  // Source toggles
  document.querySelectorAll(".source-toggle").forEach(toggle => {
    toggle.addEventListener("change", (e) => {
      const source = e.target.dataset.source;
      filterState.sources[source] = e.target.checked;
      toggleLayer(source, e.target.checked);
      updateFilteredCounts();
      updateDashboard();
    });
  });

  // Vessel type filter
  const typeSelect = document.getElementById("vessel-type-filter");
  if (typeSelect) {
    typeSelect.addEventListener("change", (e) => {
      filterState.vesselType = e.target.value;
      applyFilters();
    });
  }

  // Search
  const searchInput = document.getElementById("vessel-search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    }, 200));
  }

  // Alerts only toggle
  const alertsToggle = document.getElementById("alerts-only");
  if (alertsToggle) {
    alertsToggle.addEventListener("change", (e) => {
      filterState.alertsOnly = e.target.checked;
      applyFilters();
    });
  }

  // Time window slider
  const timeSlider = document.getElementById("time-window");
  if (timeSlider) {
    timeSlider.addEventListener("input", (e) => {
      filterState.timeWindow = parseInt(e.target.value);
      document.getElementById("time-window-value").textContent =
        filterState.timeWindow === 24 ? "24h" : `${filterState.timeWindow}h`;
      applyFilters();
    });
  }
}

function applyFilters() {
  const { vessels, correlationGroups } = window.appState;
  const now = Date.now();

  vessels.forEach(vessel => {
    const marker = markerLookup[vessel.id];
    if (!marker) return;

    let visible = true;

    // Source filter (handled by layer toggle, but also used for counts)
    if (!filterState.sources[vessel.source]) {
      visible = false;
    }

    // Vessel type filter
    if (visible && filterState.vesselType !== "all") {
      if (vessel.vesselType && vessel.vesselType !== filterState.vesselType) {
        visible = false;
      }
    }

    // Search filter
    if (visible && filterState.searchQuery) {
      const q = filterState.searchQuery;
      const searchable = [
        vessel.name, vessel.mmsi, vessel.id, vessel.emitterId,
        vessel.satellite, vessel.imo, vessel.destination
      ].filter(Boolean).join(" ").toLowerCase();
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
    if (visible && vessel.timestamp) {
      const age = (now - new Date(vessel.timestamp).getTime()) / 3600000;
      if (age > filterState.timeWindow) {
        visible = false;
      }
    }

    // Apply visibility via opacity
    const el = marker.getElement && marker.getElement();
    if (el) {
      el.style.display = visible ? "" : "none";
    }

    // Also handle CEP circles
    const circle = cepCircles[vessel.id];
    if (circle) {
      const circleEl = circle.getElement && circle.getElement();
      if (circleEl) {
        circleEl.style.display = visible ? "" : "none";
      }
    }
  });

  updateFilteredCounts();
  updateDashboard();
  updateVesselList();
}

function updateFilteredCounts() {
  const { vessels } = window.appState;
  const counts = { ais: 0, rf: 0, satellite: 0, total: 0, alerts: 0 };

  vessels.forEach(v => {
    if (filterState.sources[v.source]) {
      counts[v.source]++;
      counts.total++;
      if (v.alerts && v.alerts.length > 0) counts.alerts++;
    }
  });

  const aisCount = document.getElementById("ais-count");
  const rfCount = document.getElementById("rf-count");
  const satCount = document.getElementById("sat-count");
  const totalCount = document.getElementById("total-count");
  const alertCount = document.getElementById("alert-count");

  if (aisCount) aisCount.textContent = counts.ais;
  if (rfCount) rfCount.textContent = counts.rf;
  if (satCount) satCount.textContent = counts.satellite;
  if (totalCount) totalCount.textContent = counts.total;
  if (alertCount) alertCount.textContent = counts.alerts;
}

function updateVesselList() {
  const listContainer = document.getElementById("vessel-list");
  if (!listContainer) return;

  const { vessels } = window.appState;
  const now = Date.now();
  const filtered = vessels.filter(v => {
    if (!filterState.sources[v.source]) return false;
    if (filterState.vesselType !== "all" && v.vesselType && v.vesselType !== filterState.vesselType) return false;
    if (filterState.searchQuery) {
      const searchable = [v.name, v.mmsi, v.id, v.emitterId, v.satellite].filter(Boolean).join(" ").toLowerCase();
      if (!searchable.includes(filterState.searchQuery)) return false;
    }
    if (filterState.alertsOnly && (!v.alerts || v.alerts.length === 0)) return false;
    return true;
  });

  // Sort: alerts first, then by timestamp
  filtered.sort((a, b) => {
    const aAlerts = (a.alerts && a.alerts.length) || 0;
    const bAlerts = (b.alerts && b.alerts.length) || 0;
    if (bAlerts !== aAlerts) return bAlerts - aAlerts;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  listContainer.innerHTML = filtered.slice(0, 50).map(v => {
    const color = getSourceColor(v.source);
    const name = getVesselDisplayName(v);
    const hasAlert = v.alerts && v.alerts.length > 0;
    return `
      <div class="vessel-list-item ${hasAlert ? 'has-alert' : ''}" data-vessel-id="${v.id}" onclick="onVesselListClick('${v.id}')">
        <div class="vli-indicator" style="background:${color}"></div>
        <div class="vli-info">
          <div class="vli-name">${name}</div>
          <div class="vli-meta">${v.id} &middot; ${timeAgo(v.timestamp)}</div>
        </div>
        ${hasAlert ? '<div class="vli-alert-badge"></div>' : ''}
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

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
