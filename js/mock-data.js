// Curated scenario data — Strait of Hormuz / Persian Gulf
// 5 vessels for initial demo: 2 cooperative, 2 dark, 1 gone-dark

function generateScenarioData() {
  const now = new Date("2026-03-31T07:00:00Z");

  const vessels = [
    // ====== COOPERATIVE VESSELS ======
    {
      id: "V-001",
      name: "DESH VIBHOR",
      vesselClass: "tanker",
      trackingMode: "cooperative",
      mmsi: "419001234",
      imo: "IMO9234567",
      flag: "IN",
      callsign: "ATCZ",
      lat: 25.72,
      lng: 56.42,
      course: 285.0,
      speed: 11.8,
      heading: 283,
      destination: "MUMBAI",
      navStatus: "underway",
      draught: 14.2,
      dimensions: { length: 274, beam: 48 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          {
            type: "x-band-nav",
            frequencyMHz: 9410,
            signalStrengthDbm: -58,
            pulsePattern: "pulsed",
            confidence: 0.96,
            fingerprintId: "FP-V001-A"
          },
          {
            type: "ku-vsat",
            frequencyMHz: 14250,
            signalStrengthDbm: -74,
            pulsePattern: "continuous",
            confidence: 0.89,
            fingerprintId: "FP-V001-B"
          }
        ],
        cepMeters: 3.8,
        lastDetected: new Date(now.getTime() - 120000).toISOString()
      },
      imagery: [
        {
          id: "IMG-001",
          type: "SAR",
          satellite: "ICEYE-X7",
          timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(),
          resolution: "1m",
          cloudCover: null,
          status: "acquired"
        }
      ],
      alerts: [],
      trackHistory: generateTrack(25.72, 56.42, 285, 11.8, now, 8),
      portHistory: [
        { port: "Fujairah", arrived: "2026-03-28T08:00:00Z", departed: "2026-03-30T14:00:00Z" },
        { port: "Jebel Ali", arrived: "2026-03-24T06:00:00Z", departed: "2026-03-27T10:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-15T00:00:00Z"
    },
    {
      id: "V-002",
      name: "OCEAN GUARDIAN",
      vesselClass: "cargo",
      trackingMode: "cooperative",
      mmsi: "538006742",
      imo: "IMO9876123",
      flag: "MH",
      callsign: "V7AB3",
      lat: 26.48,
      lng: 55.15,
      course: 118.0,
      speed: 14.2,
      heading: 120,
      destination: "SINGAPORE",
      navStatus: "underway",
      draught: 10.8,
      dimensions: { length: 189, beam: 32 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: {
        detected: false,
        emitters: [],
        cepMeters: null,
        lastDetected: null
      },
      imagery: [],
      alerts: [],
      trackHistory: generateTrack(26.48, 55.15, 118, 14.2, now, 8),
      portHistory: [
        { port: "Dammam", arrived: "2026-03-26T12:00:00Z", departed: "2026-03-30T06:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-20T00:00:00Z"
    },

    // ====== DARK VESSELS (RF-only) ======
    {
      id: "V-003",
      name: null,
      vesselClass: "unknown",
      trackingMode: "dark",
      mmsi: null,
      imo: null,
      flag: null,
      callsign: null,
      lat: 26.31,
      lng: 56.68,
      course: 195.0,
      speed: 8.5,
      heading: null,
      destination: null,
      navStatus: "underway",
      draught: null,
      dimensions: null,
      ais: { active: false, lastSeen: null, lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          {
            type: "x-band-nav",
            frequencyMHz: 9380,
            signalStrengthDbm: -65,
            pulsePattern: "pulsed",
            confidence: 0.88,
            fingerprintId: "FP-V003-A"
          },
          {
            type: "vhf-marine",
            frequencyMHz: 156.8,
            signalStrengthDbm: -82,
            pulsePattern: "continuous",
            confidence: 0.62,
            fingerprintId: "FP-V003-B"
          }
        ],
        cepMeters: 4.5,
        lastDetected: new Date(now.getTime() - 300000).toISOString()
      },
      imagery: [
        {
          id: "IMG-003",
          type: "SAR",
          satellite: "Capella-6",
          timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
          resolution: "0.5m",
          cloudCover: null,
          status: "processing"
        }
      ],
      alerts: [
        {
          type: "dark_vessel",
          severity: "warning",
          message: "No AIS — tracked by RF emissions only. X-band nav radar + VHF marine radio detected.",
          timestamp: new Date(now.getTime() - 600000).toISOString()
        }
      ],
      trackHistory: generateTrack(26.31, 56.68, 195, 8.5, now, 6),
      portHistory: [],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-31T03:00:00Z"
    },
    {
      id: "V-004",
      name: null,
      vesselClass: "tanker",
      trackingMode: "dark",
      mmsi: null,
      imo: null,
      flag: null,
      callsign: null,
      lat: 25.82,
      lng: 56.78,
      course: 210.0,
      speed: 6.2,
      heading: null,
      destination: null,
      navStatus: "underway",
      draught: null,
      dimensions: null,
      ais: { active: false, lastSeen: null, lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          {
            type: "x-band-nav",
            frequencyMHz: 9445,
            signalStrengthDbm: -55,
            pulsePattern: "pulsed",
            confidence: 0.93,
            fingerprintId: "FP-V004-A"
          },
          {
            type: "ku-vsat",
            frequencyMHz: 14100,
            signalStrengthDbm: -70,
            pulsePattern: "continuous",
            confidence: 0.85,
            fingerprintId: "FP-V004-B"
          },
          {
            type: "l-satphone",
            frequencyMHz: 1626.5,
            signalStrengthDbm: -88,
            pulsePattern: "continuous",
            confidence: 0.71,
            fingerprintId: "FP-V004-C"
          }
        ],
        cepMeters: 2.9,
        lastDetected: new Date(now.getTime() - 180000).toISOString()
      },
      imagery: [
        {
          id: "IMG-004a",
          type: "EO",
          satellite: "Pleiades Neo",
          timestamp: new Date(now.getTime() - 6 * 3600000).toISOString(),
          resolution: "0.3m",
          cloudCover: 12,
          status: "acquired"
        },
        {
          id: "IMG-004b",
          type: "SAR",
          satellite: "ICEYE-X7",
          timestamp: new Date(now.getTime() - 1 * 3600000).toISOString(),
          resolution: "1m",
          cloudCover: null,
          status: "acquired"
        }
      ],
      alerts: [
        {
          type: "dark_vessel",
          severity: "critical",
          message: "Suspected tanker — strong X-band radar + VSAT + satphone detected. Potential sanctions evasion.",
          timestamp: new Date(now.getTime() - 900000).toISOString()
        },
        {
          type: "ship_to_ship",
          severity: "warning",
          message: "Proximity alert: within 800m of V-003. Potential ship-to-ship transfer.",
          timestamp: new Date(now.getTime() - 1200000).toISOString()
        }
      ],
      trackHistory: generateTrack(25.82, 56.78, 210, 6.2, now, 6),
      portHistory: [],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-30T22:00:00Z"
    },

    // ====== GONE-DARK VESSEL ======
    {
      id: "V-005",
      name: "SHADOW RUNNER",
      vesselClass: "cargo",
      trackingMode: "gone_dark",
      mmsi: "412999888",
      imo: "IMO9345678",
      flag: "PA",
      callsign: "3FXK7",
      lat: 26.85,
      lng: 56.02,
      course: 45.0,
      speed: 10.1,
      heading: 43,
      destination: "BANDAR ABBAS",
      navStatus: "underway",
      draught: 9.4,
      dimensions: { length: 172, beam: 28 },
      ais: {
        active: false,
        lastSeen: new Date(now.getTime() - 6 * 3600000).toISOString(),
        lastPosition: { lat: 26.55, lng: 55.72 }
      },
      rf: {
        detected: true,
        emitters: [
          {
            type: "x-band-nav",
            frequencyMHz: 9420,
            signalStrengthDbm: -61,
            pulsePattern: "pulsed",
            confidence: 0.92,
            fingerprintId: "FP-V005-A"
          },
          {
            type: "s-band-radar",
            frequencyMHz: 3050,
            signalStrengthDbm: -68,
            pulsePattern: "pulsed",
            confidence: 0.78,
            fingerprintId: "FP-V005-B"
          }
        ],
        cepMeters: 4.1,
        lastDetected: new Date(now.getTime() - 240000).toISOString()
      },
      imagery: [
        {
          id: "IMG-005",
          type: "SAR",
          satellite: "Sentinel-1A",
          timestamp: new Date(now.getTime() - 3 * 3600000).toISOString(),
          resolution: "5m",
          cloudCover: null,
          status: "acquired"
        }
      ],
      alerts: [
        {
          type: "ais_gap",
          severity: "critical",
          message: "AIS lost 6h ago — still tracked via X-band + S-band radar emissions. Heading toward Bandar Abbas.",
          timestamp: new Date(now.getTime() - 6 * 3600000).toISOString()
        }
      ],
      trackHistory: [
        // Before going dark (AIS positions)
        { lat: 26.20, lng: 55.30, timestamp: new Date(now.getTime() - 10 * 3600000).toISOString(), speed: 12.0 },
        { lat: 26.28, lng: 55.38, timestamp: new Date(now.getTime() - 9 * 3600000).toISOString(), speed: 11.5 },
        { lat: 26.36, lng: 55.48, timestamp: new Date(now.getTime() - 8 * 3600000).toISOString(), speed: 11.8 },
        { lat: 26.44, lng: 55.58, timestamp: new Date(now.getTime() - 7 * 3600000).toISOString(), speed: 11.2 },
        // Last AIS position
        { lat: 26.55, lng: 55.72, timestamp: new Date(now.getTime() - 6 * 3600000).toISOString(), speed: 10.8 },
        // RF-only positions (after going dark)
        { lat: 26.62, lng: 55.80, timestamp: new Date(now.getTime() - 5 * 3600000).toISOString(), speed: 10.5 },
        { lat: 26.70, lng: 55.88, timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(), speed: 10.3 },
        { lat: 26.78, lng: 55.95, timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(), speed: 10.0 },
        { lat: 26.85, lng: 56.02, timestamp: now.toISOString(), speed: 10.1 }
      ],
      portHistory: [
        { port: "Jebel Ali", arrived: "2026-03-27T10:00:00Z", departed: "2026-03-30T18:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-25T00:00:00Z"
    }
  ];

  return { vessels };
}

// Helper: generate simple track history along a course
function generateTrack(lat, lng, course, speed, now, points) {
  const history = [];
  const courseRad = course * Math.PI / 180;
  const stepHours = 0.5;

  for (let i = points; i >= 0; i--) {
    const dt = i * stepHours;
    const dist = speed * 0.00027 * stepHours * 60; // approx degree movement
    history.push({
      lat: lat - Math.cos(courseRad) * dist * i + (Math.random() - 0.5) * 0.005,
      lng: lng - Math.sin(courseRad) * dist * i + (Math.random() - 0.5) * 0.005,
      timestamp: new Date(now.getTime() - dt * 3600000).toISOString(),
      speed: speed + (Math.random() - 0.5) * 1.5
    });
  }
  return history;
}

// Simulate live position updates for cooperative underway vessels
function updateVesselPositions(vessels) {
  vessels.forEach(v => {
    if (v.trackingMode === "cooperative" && v.navStatus === "underway") {
      const speedFactor = (v.speed || 10) * 0.00001;
      const courseRad = (v.course || 0) * Math.PI / 180;
      v.lat += Math.cos(courseRad) * speedFactor + (Math.random() - 0.5) * 0.001;
      v.lng += Math.sin(courseRad) * speedFactor + (Math.random() - 0.5) * 0.001;
      v.course = ((v.course || 0) + (Math.random() - 0.5) * 2 + 360) % 360;
      v.speed = Math.max(0, v.speed + (Math.random() - 0.5) * 0.5);
      v.lastUpdate = new Date().toISOString();
    }
  });
}
