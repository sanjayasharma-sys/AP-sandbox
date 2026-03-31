// Main application - initialization and orchestration

window.appState = {
  vessels: [],
  selectedVessel: null,
  lastUpdate: null,
  activePanel: null
};

document.addEventListener("DOMContentLoaded", () => {
  // Generate scenario data
  const { vessels } = generateScenarioData();
  window.appState.vessels = vessels;
  window.appState.lastUpdate = new Date();

  // Initialize components
  initMap();
  plotVessels(vessels);
  initFilters();
  initDashboard();
  initToolbar();

  // Initial UI updates
  updateStats();
  updateVesselList();
  updateAlertFeed();

  // Start live clock
  updateClock();
  setInterval(updateClock, 1000);

  // Simulated live updates — move cooperative vessels every 10s
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

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailPanel();
      closeActivePanel();
    }
  });

  console.log(`uLook Maritime Intelligence initialized: ${vessels.length} vessels tracked`);
});

// ============ TOOLBAR ============

function initToolbar() {
  document.querySelectorAll(".toolbar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const panelId = btn.dataset.panel;
      if (!panelId) return;

      // If same panel is open, close it
      if (window.appState.activePanel === panelId) {
        closeActivePanel();
        return;
      }

      // Close any open panel, then open the new one
      closeActivePanel();
      openPanel(panelId);
    });
  });

  // Panel close buttons
  document.querySelectorAll(".panel-close").forEach(btn => {
    btn.addEventListener("click", closeActivePanel);
  });
}

function openPanel(panelId) {
  const panel = document.getElementById(`panel-${panelId}`);
  if (!panel) return;

  panel.classList.add("open");
  window.appState.activePanel = panelId;

  // Update toolbar button active state
  document.querySelectorAll(".toolbar-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.toolbar-btn[data-panel="${panelId}"]`);
  if (btn) btn.classList.add("active");

  // Refresh content for specific panels
  if (panelId === "vessels") updateVesselList();
  if (panelId === "alerts") updateAlertFeed();
  if (panelId === "analytics") updateDashboard();
}

function closeActivePanel() {
  if (!window.appState.activePanel) return;
  const panel = document.getElementById(`panel-${window.appState.activePanel}`);
  if (panel) panel.classList.remove("open");
  document.querySelectorAll(".toolbar-btn").forEach(b => b.classList.remove("active"));
  window.appState.activePanel = null;
}

// ============ CLOCK & STATUS ============

function updateClock() {
  const clockEl = document.getElementById("navbar-clock");
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = now.toISOString().replace("T", " ").substring(11, 19) + "Z";
  }
}

function updateLastUpdateDisplay() {
  const el = document.getElementById("last-update");
  if (el && window.appState.lastUpdate) {
    el.textContent = `Updated ${timeAgo(window.appState.lastUpdate.toISOString())}`;
  }
}
