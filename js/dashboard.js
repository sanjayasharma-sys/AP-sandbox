// Dashboard module - summary statistics and Chart.js charts

let sourceChart = null;
let typeChart = null;

function initDashboard() {
  updateDashboard();
}

function updateDashboard() {
  const { vessels, correlationGroups } = window.appState;
  if (!vessels) return;

  // Compute stats
  const stats = computeStats(vessels, correlationGroups);

  // Update stat cards
  updateStatCard("total-count", stats.total);
  updateStatCard("ais-count", stats.bySrc.ais);
  updateStatCard("rf-count", stats.bySrc.rf);
  updateStatCard("sat-count", stats.bySrc.satellite);
  updateStatCard("correlated-count", stats.correlated);
  updateStatCard("dark-count", stats.dark);
  updateStatCard("alert-count", stats.alerts);
  updateStatCard("correlated-count-2", stats.correlated);
  updateStatCard("dark-count-2", stats.dark);

  // Update charts
  updateSourceChart(stats);
  updateTypeChart(stats);
  updateDataFreshness(stats);
}

function computeStats(vessels, correlationGroups) {
  const bySrc = { ais: 0, rf: 0, satellite: 0 };
  const byType = {};
  let alerts = 0;
  const now = Date.now();
  const ages = { ais: [], rf: [], satellite: [] };

  vessels.forEach(v => {
    bySrc[v.source]++;
    if (v.vesselType) {
      byType[v.vesselType] = (byType[v.vesselType] || 0) + 1;
    }
    if (v.alerts && v.alerts.length > 0) alerts++;
    const age = (now - new Date(v.timestamp).getTime()) / 3600000;
    ages[v.source].push(age);
  });

  // Count correlated tracks (groups with >1 source)
  let correlated = 0;
  let dark = 0;
  Object.values(correlationGroups).forEach(group => {
    const srcSet = new Set(group.map(v => v.source));
    if (srcSet.size > 1) correlated++;
    if (!srcSet.has("ais") && (srcSet.has("rf") || srcSet.has("satellite"))) dark++;
  });

  // Average ages
  const avgAge = {};
  Object.keys(ages).forEach(s => {
    const arr = ages[s];
    avgAge[s] = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  });

  return {
    total: vessels.length,
    bySrc,
    byType,
    correlated,
    dark,
    alerts,
    avgAge
  };
}

function updateStatCard(id, value) {
  const el = document.getElementById(id);
  if (el) {
    const current = parseInt(el.textContent) || 0;
    if (current !== value) {
      el.textContent = value;
      el.classList.add("stat-updated");
      setTimeout(() => el.classList.remove("stat-updated"), 600);
    }
  }
}

function updateSourceChart(stats) {
  const canvas = document.getElementById("source-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (sourceChart) {
    sourceChart.data.datasets[0].data = [stats.bySrc.ais, stats.bySrc.rf, stats.bySrc.satellite];
    sourceChart.update("none");
    return;
  }

  sourceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["AIS", "RF Emissions", "Satellite"],
      datasets: [{
        data: [stats.bySrc.ais, stats.bySrc.rf, stats.bySrc.satellite],
        backgroundColor: [SOURCE_COLORS.ais, SOURCE_COLORS.rf, SOURCE_COLORS.satellite],
        borderColor: "#0f1d32",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function updateTypeChart(stats) {
  const canvas = document.getElementById("type-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const labels = Object.keys(stats.byType).map(k => VESSEL_TYPE_LABELS[k] || k);
  const values = Object.values(stats.byType);

  if (typeChart) {
    typeChart.data.labels = labels;
    typeChart.data.datasets[0].data = values;
    typeChart.update("none");
    return;
  }

  typeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: "#00d4aa40",
        borderColor: "#00d4aa",
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "#ffffff10" },
          ticks: { color: "#8892a4", font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#8892a4", font: { size: 10 } }
        }
      }
    }
  });
}

function updateDataFreshness(stats) {
  ["ais", "rf", "satellite"].forEach(source => {
    const bar = document.getElementById(`freshness-${source}`);
    if (bar) {
      const avgMinutes = Math.round(stats.avgAge[source] * 60);
      const freshness = Math.max(0, Math.min(100, 100 - stats.avgAge[source] * 10));
      bar.style.width = freshness + "%";
      bar.title = `Avg age: ${avgMinutes}m`;
      const label = bar.parentElement.querySelector(".freshness-label");
      if (label) label.textContent = avgMinutes < 60 ? `${avgMinutes}m` : `${(avgMinutes / 60).toFixed(1)}h`;
    }
  });
}
