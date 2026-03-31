// Dashboard module - analytics charts for the Analytics slide panel

let modeChart = null;
let classChart = null;

function initDashboard() {
  updateDashboard();
}

function updateDashboard() {
  const { vessels } = window.appState;
  if (!vessels) return;

  const stats = computeStats(vessels);

  // Update stat cards
  setStatValue("stat-total", stats.total);
  setStatValue("stat-cooperative", stats.cooperative);
  setStatValue("stat-dark", stats.dark);
  setStatValue("stat-gone-dark", stats.goneDark);
  setStatValue("stat-alerts", stats.alerts);

  updateModeChart(stats);
  updateClassChart(stats);
}

function computeStats(vessels) {
  const byMode = { cooperative: 0, dark: 0, gone_dark: 0 };
  const byClass = {};
  let alerts = 0;

  vessels.forEach(v => {
    byMode[v.trackingMode] = (byMode[v.trackingMode] || 0) + 1;
    byClass[v.vesselClass] = (byClass[v.vesselClass] || 0) + 1;
    if (v.alerts && v.alerts.length > 0) alerts++;
  });

  return {
    total: vessels.length,
    cooperative: byMode.cooperative,
    dark: byMode.dark,
    goneDark: byMode.gone_dark,
    alerts,
    byMode,
    byClass
  };
}

function updateModeChart(stats) {
  const canvas = document.getElementById("mode-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const data = [stats.cooperative, stats.dark, stats.goneDark];
  const colors = ["#22C55E", "#E8461E", "#F59E0B"];
  const labels = ["Cooperative", "Dark Vessels", "Gone Dark"];

  if (modeChart) {
    modeChart.data.datasets[0].data = data;
    modeChart.update("none");
    return;
  }

  modeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: "#0C1424",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#8A94A8",
            font: { size: 11, family: "Inter" },
            padding: 12,
            usePointStyle: true,
            pointStyleWidth: 8
          }
        }
      }
    }
  });
}

function updateClassChart(stats) {
  const canvas = document.getElementById("class-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const classKeys = Object.keys(stats.byClass);
  const labels = classKeys.map(k => getVesselClassLabel(k));
  const values = classKeys.map(k => stats.byClass[k]);
  const colors = classKeys.map(k => getVesselClassColor(k));

  if (classChart) {
    classChart.data.labels = labels;
    classChart.data.datasets[0].data = values;
    classChart.data.datasets[0].backgroundColor = colors.map(c => c + "40");
    classChart.data.datasets[0].borderColor = colors;
    classChart.update("none");
    return;
  }

  classChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + "40"),
        borderColor: colors,
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
          grid: { color: "#ffffff08" },
          ticks: { color: "#8A94A8", font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#8A94A8", font: { size: 10 } }
        }
      }
    }
  });
}
