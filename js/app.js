// Main application - initialization and orchestration

window.appState = {
  vessels: [],
  correlationGroups: {},
  selectedVessel: null,
  lastUpdate: null
};

document.addEventListener("DOMContentLoaded", () => {
  // Generate mock data
  const { vessels, correlationGroups } = generateMockData();
  window.appState.vessels = vessels;
  window.appState.correlationGroups = correlationGroups;
  window.appState.lastUpdate = new Date();

  // Initialize components
  initMap();
  plotVessels(vessels);
  initFilters();
  initDashboard();
  updateFilteredCounts();
  updateVesselList();

  // Start live clock
  updateClock();
  setInterval(updateClock, 1000);

  // Simulated live updates - move vessels every 10 seconds
  setInterval(() => {
    updateVesselPositions(window.appState.vessels);
    updateMarkerPositions(window.appState.vessels);
    window.appState.lastUpdate = new Date();
    updateLastUpdateDisplay();
  }, 10000);

  // Update dashboard less frequently
  setInterval(() => {
    updateDashboard();
  }, 30000);

  // Wire up the vessels tab search
  const vesselSearchList = document.getElementById("vessel-search-list");
  if (vesselSearchList) {
    vesselSearchList.addEventListener("input", debounce((e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      // Also sync the overview search
      const mainSearch = document.getElementById("vessel-search");
      if (mainSearch) mainSearch.value = e.target.value;
      applyFilters();
    }, 200));
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailPanel();
    }
  });

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById("sidebar-toggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  // Tab switching in sidebar
  document.querySelectorAll(".sidebar-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".sidebar-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.getElementById(`panel-${target}`).classList.add("active");
    });
  });

  console.log(`Maritime DA Dashboard initialized: ${vessels.length} tracks loaded`);
});

function updateClock() {
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = now.toISOString().replace("T", " ").substring(0, 19) + "Z";
  }
}

function updateLastUpdateDisplay() {
  const el = document.getElementById("last-update");
  if (el && window.appState.lastUpdate) {
    el.textContent = `Last update: ${timeAgo(window.appState.lastUpdate.toISOString())}`;
  }
}
