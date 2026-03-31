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
      trackHistory: [
        { lat: 25.30, lng: 56.85, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 12.0 },
        { lat: 25.40, lng: 56.75, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 11.9 },
        { lat: 25.50, lng: 56.65, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 11.5 },
        { lat: 25.60, lng: 56.55, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 11.8 },
        { lat: 25.72, lng: 56.42, timestamp: now.toISOString(), speed: 11.8 }
      ],
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
      trackHistory: [
        { lat: 26.80, lng: 54.20, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 14.0 },
        { lat: 26.72, lng: 54.50, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 14.3 },
        { lat: 26.65, lng: 54.75, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 14.1 },
        { lat: 26.55, lng: 55.00, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 14.2 },
        { lat: 26.48, lng: 55.15, timestamp: now.toISOString(), speed: 14.2 }
      ],
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
      trackHistory: [
        { lat: 26.55, lng: 56.55, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 8.8 },
        { lat: 26.48, lng: 56.58, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 8.6 },
        { lat: 26.40, lng: 56.62, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 8.5 },
        { lat: 26.31, lng: 56.68, timestamp: now.toISOString(), speed: 8.5 }
      ],
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
      trackHistory: [
        { lat: 26.10, lng: 56.60, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 6.5 },
        { lat: 26.00, lng: 56.65, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 6.3 },
        { lat: 25.90, lng: 56.72, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 6.2 },
        { lat: 25.82, lng: 56.78, timestamp: now.toISOString(), speed: 6.2 }
      ],
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
      lat: 26.60,
      lng: 56.70,
      course: 55.0,
      speed: 10.1,
      heading: 53,
      destination: "BANDAR ABBAS",
      navStatus: "underway",
      draught: 9.4,
      dimensions: { length: 172, beam: 28 },
      ais: {
        active: false,
        lastSeen: new Date(now.getTime() - 6 * 3600000).toISOString(),
        lastPosition: { lat: 26.55, lng: 56.28 }
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
          id: "IMG-005a",
          type: "EO",
          satellite: "Pleiades Neo",
          timestamp: new Date(now.getTime() - 29 * 24 * 3600000).toISOString(),
          resolution: "0.3m",
          cloudCover: 8,
          status: "acquired",
          location: "Bandar Abbas Port",
          notes: "Vessel identified alongside berth at Shahid Rajaee terminal. Cargo operations observed.",
          detections: 3
        },
        {
          id: "IMG-005b",
          type: "SAR",
          satellite: "ICEYE-X7",
          timestamp: new Date(now.getTime() - 16 * 24 * 3600000).toISOString(),
          resolution: "1m",
          cloudCover: null,
          status: "acquired",
          location: "Bandar Abbas Anchorage",
          notes: "SAR detection of vessel at anchorage with two unidentified contacts within 500m. Possible STS transfer.",
          detections: 4
        },
        {
          id: "IMG-005c",
          type: "EO",
          satellite: "Planet SkySat",
          timestamp: new Date(now.getTime() - 12 * 24 * 3600000).toISOString(),
          resolution: "0.5m",
          cloudCover: 22,
          status: "acquired",
          location: "Strait of Hormuz",
          notes: "Vessel underway in outbound TSS lane. AIS active at time of collection.",
          detections: 1
        },
        {
          id: "IMG-005d",
          type: "SAR",
          satellite: "Capella-6",
          timestamp: new Date(now.getTime() - 5 * 24 * 3600000).toISOString(),
          resolution: "0.5m",
          cloudCover: null,
          status: "acquired",
          location: "Persian Gulf — Jebel Ali approach",
          notes: "Vessel inbound to Jebel Ali port. Confirmed identity via RF correlation.",
          detections: 1
        },
        {
          id: "IMG-005e",
          type: "SAR",
          satellite: "Sentinel-1A",
          timestamp: new Date(now.getTime() - 3 * 3600000).toISOString(),
          resolution: "5m",
          cloudCover: null,
          status: "acquired",
          location: "Strait of Hormuz — TSS",
          notes: "Post-AIS-loss detection. Vessel heading NE through strait. RF emitter correlation confirms identity.",
          detections: 2
        },
        {
          id: "IMG-005f",
          type: "SAR",
          satellite: "ICEYE-X12",
          timestamp: null,
          resolution: "1m",
          cloudCover: null,
          status: "tasked",
          location: "Current vessel position",
          notes: "Priority tasking requested — vessel operating dark.",
          detections: null
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
        // Before going dark (AIS positions) — following shipping lane north of Musandam
        { lat: 26.30, lng: 55.30, timestamp: new Date(now.getTime() - 10*3600000).toISOString(), speed: 12.0 },
        { lat: 26.38, lng: 55.55, timestamp: new Date(now.getTime() - 9*3600000).toISOString(), speed: 11.5 },
        { lat: 26.45, lng: 55.80, timestamp: new Date(now.getTime() - 8*3600000).toISOString(), speed: 11.8 },
        { lat: 26.50, lng: 56.05, timestamp: new Date(now.getTime() - 7*3600000).toISOString(), speed: 11.2 },
        // Last AIS position — in the TSS north of Musandam Peninsula
        { lat: 26.55, lng: 56.28, timestamp: new Date(now.getTime() - 6*3600000).toISOString(), speed: 10.8 },
        // RF-only positions (after going dark) — continuing northeast through strait
        { lat: 26.58, lng: 56.42, timestamp: new Date(now.getTime() - 5*3600000).toISOString(), speed: 10.5 },
        { lat: 26.60, lng: 56.55, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 10.3 },
        { lat: 26.60, lng: 56.63, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 10.0 },
        { lat: 26.60, lng: 56.70, timestamp: now.toISOString(), speed: 10.1 }
      ],
      portHistory: [
        { port: "Jebel Ali", arrived: "2026-03-27T10:00:00Z", departed: "2026-03-30T18:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-25T00:00:00Z"
    }
    // ====== ADDITIONAL COOPERATIVE VESSELS ======
    ,{
      id: "V-006",
      name: "MAERSK SELETAR",
      vesselClass: "cargo",
      trackingMode: "cooperative",
      mmsi: "220417000",
      imo: "IMO9778791",
      flag: "DK",
      callsign: "OYGR2",
      lat: 26.85,
      lng: 53.80,
      course: 135.0,
      speed: 16.4,
      heading: 137,
      destination: "JEBEL ALI",
      navStatus: "underway",
      draught: 12.5,
      dimensions: { length: 336, beam: 48 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 27.20, lng: 52.80, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 16.5 },
        { lat: 27.10, lng: 53.10, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 16.3 },
        { lat: 27.00, lng: 53.35, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 16.4 },
        { lat: 26.92, lng: 53.58, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 16.4 },
        { lat: 26.85, lng: 53.80, timestamp: now.toISOString(), speed: 16.4 }
      ],
      portHistory: [
        { port: "Salalah", arrived: "2026-03-27T14:00:00Z", departed: "2026-03-29T20:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-22T00:00:00Z"
    },
    {
      id: "V-007",
      name: "AL JASRAH",
      vesselClass: "tanker",
      trackingMode: "cooperative",
      mmsi: "470559000",
      imo: "IMO9232379",
      flag: "BH",
      callsign: "A9AB",
      lat: 26.20,
      lng: 53.40,
      course: 320.0,
      speed: 13.1,
      heading: 318,
      destination: "RAS TANURA",
      navStatus: "underway",
      draught: 16.8,
      dimensions: { length: 333, beam: 58 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9400, signalStrengthDbm: -52, pulsePattern: "pulsed", confidence: 0.97, fingerprintId: "FP-V007-A" }
        ],
        cepMeters: 3.2,
        lastDetected: new Date(now.getTime() - 60000).toISOString()
      },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 25.90, lng: 54.00, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 13.0 },
        { lat: 25.98, lng: 53.82, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 13.2 },
        { lat: 26.05, lng: 53.65, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 13.1 },
        { lat: 26.12, lng: 53.52, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 13.0 },
        { lat: 26.20, lng: 53.40, timestamp: now.toISOString(), speed: 13.1 }
      ],
      portHistory: [
        { port: "Fujairah", arrived: "2026-03-28T06:00:00Z", departed: "2026-03-30T22:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-18T00:00:00Z"
    },
    {
      id: "V-008",
      name: "PACIFIC VOYAGER",
      vesselClass: "passenger",
      trackingMode: "cooperative",
      mmsi: "311000418",
      imo: "IMO9636500",
      flag: "BS",
      callsign: "C6YR8",
      lat: 25.60,
      lng: 55.30,
      course: 45.0,
      speed: 18.5,
      heading: 44,
      destination: "DOHA",
      navStatus: "underway",
      draught: 8.2,
      dimensions: { length: 290, beam: 36 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 25.30, lng: 55.75, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 18.8 },
        { lat: 25.38, lng: 55.62, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 18.5 },
        { lat: 25.50, lng: 55.45, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 18.6 },
        { lat: 25.60, lng: 55.30, timestamp: now.toISOString(), speed: 18.5 }
      ],
      portHistory: [
        { port: "Dubai", arrived: "2026-03-29T08:00:00Z", departed: "2026-03-31T04:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-20T00:00:00Z"
    },
    {
      id: "V-009",
      name: "STENA SUPREME",
      vesselClass: "tanker",
      trackingMode: "cooperative",
      mmsi: "249078000",
      imo: "IMO9694094",
      flag: "MT",
      callsign: "9HJQ9",
      lat: 26.70,
      lng: 56.90,
      course: 240.0,
      speed: 12.6,
      heading: 238,
      destination: "FUJAIRAH",
      navStatus: "underway",
      draught: 15.1,
      dimensions: { length: 250, beam: 44 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9425, signalStrengthDbm: -56, pulsePattern: "pulsed", confidence: 0.94, fingerprintId: "FP-V009-A" },
          { type: "ku-vsat", frequencyMHz: 14300, signalStrengthDbm: -71, pulsePattern: "continuous", confidence: 0.88, fingerprintId: "FP-V009-B" }
        ],
        cepMeters: 3.5,
        lastDetected: new Date(now.getTime() - 90000).toISOString()
      },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 26.55, lng: 57.50, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 12.8 },
        { lat: 26.60, lng: 57.30, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 12.5 },
        { lat: 26.62, lng: 57.15, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 12.7 },
        { lat: 26.66, lng: 57.02, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 12.6 },
        { lat: 26.70, lng: 56.90, timestamp: now.toISOString(), speed: 12.6 }
      ],
      portHistory: [
        { port: "Muscat", arrived: "2026-03-27T12:00:00Z", departed: "2026-03-30T08:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-19T00:00:00Z"
    },
    {
      id: "V-010",
      name: "IRAN SHAHR",
      vesselClass: "cargo",
      trackingMode: "cooperative",
      mmsi: "422100100",
      imo: "IMO9283521",
      flag: "IR",
      callsign: "EPBZ",
      lat: 27.10,
      lng: 56.20,
      course: 185.0,
      speed: 10.2,
      heading: 183,
      destination: "BANDAR ABBAS",
      navStatus: "underway",
      draught: 8.8,
      dimensions: { length: 145, beam: 23 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 27.35, lng: 56.30, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 10.0 },
        { lat: 27.28, lng: 56.28, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 10.3 },
        { lat: 27.18, lng: 56.24, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 10.1 },
        { lat: 27.10, lng: 56.20, timestamp: now.toISOString(), speed: 10.2 }
      ],
      portHistory: [
        { port: "Bandar Lengeh", arrived: "2026-03-28T10:00:00Z", departed: "2026-03-31T02:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-15T00:00:00Z"
    },
    {
      id: "V-011",
      name: "MARLIN SAPPHIRE",
      vesselClass: "tanker",
      trackingMode: "cooperative",
      mmsi: "636015812",
      imo: "IMO9501287",
      flag: "LR",
      callsign: "D5BP4",
      lat: 25.95,
      lng: 54.80,
      course: 90.0,
      speed: 11.0,
      heading: 88,
      destination: "KHOR FAKKAN",
      navStatus: "underway",
      draught: 13.5,
      dimensions: { length: 228, beam: 42 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9390, signalStrengthDbm: -60, pulsePattern: "pulsed", confidence: 0.91, fingerprintId: "FP-V011-A" }
        ],
        cepMeters: 4.0,
        lastDetected: new Date(now.getTime() - 200000).toISOString()
      },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 25.95, lng: 54.30, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 11.2 },
        { lat: 25.95, lng: 54.48, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 10.9 },
        { lat: 25.95, lng: 54.65, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 11.1 },
        { lat: 25.95, lng: 54.80, timestamp: now.toISOString(), speed: 11.0 }
      ],
      portHistory: [
        { port: "Jebel Ali", arrived: "2026-03-26T16:00:00Z", departed: "2026-03-30T20:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-21T00:00:00Z"
    },

    // ====== ADDITIONAL DARK VESSELS ======
    {
      id: "V-012",
      name: null,
      vesselClass: "tanker",
      trackingMode: "dark",
      mmsi: null, imo: null, flag: null, callsign: null,
      lat: 26.75,
      lng: 55.60,
      course: 110.0,
      speed: 7.8,
      heading: null,
      destination: null,
      navStatus: "underway",
      draught: null, dimensions: null,
      ais: { active: false, lastSeen: null, lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9460, signalStrengthDbm: -62, pulsePattern: "pulsed", confidence: 0.86, fingerprintId: "FP-V012-A" },
          { type: "ku-vsat", frequencyMHz: 14050, signalStrengthDbm: -76, pulsePattern: "continuous", confidence: 0.72, fingerprintId: "FP-V012-B" }
        ],
        cepMeters: 5.2,
        lastDetected: new Date(now.getTime() - 420000).toISOString()
      },
      imagery: [
        { id: "IMG-012", type: "SAR", satellite: "ICEYE-X7", timestamp: new Date(now.getTime() - 5*3600000).toISOString(), resolution: "1m", cloudCover: null, status: "acquired" }
      ],
      alerts: [
        { type: "dark_vessel", severity: "warning", message: "Unidentified tanker — no AIS, RF emissions consistent with VLCC-class vessel.", timestamp: new Date(now.getTime() - 3600000).toISOString() }
      ],
      trackHistory: [
        { lat: 26.90, lng: 55.20, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 7.5 },
        { lat: 26.85, lng: 55.35, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 7.8 },
        { lat: 26.80, lng: 55.48, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 7.7 },
        { lat: 26.75, lng: 55.60, timestamp: now.toISOString(), speed: 7.8 }
      ],
      portHistory: [],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-31T02:00:00Z"
    },
    {
      id: "V-013",
      name: null,
      vesselClass: "fishing",
      trackingMode: "dark",
      mmsi: null, imo: null, flag: null, callsign: null,
      lat: 26.42,
      lng: 55.85,
      course: 270.0,
      speed: 3.2,
      heading: null,
      destination: null,
      navStatus: "underway",
      draught: null, dimensions: null,
      ais: { active: false, lastSeen: null, lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "vhf-marine", frequencyMHz: 156.8, signalStrengthDbm: -78, pulsePattern: "continuous", confidence: 0.65, fingerprintId: "FP-V013-A" }
        ],
        cepMeters: 8.5,
        lastDetected: new Date(now.getTime() - 600000).toISOString()
      },
      imagery: [],
      alerts: [
        { type: "dark_vessel", severity: "info", message: "Small vessel — VHF marine radio only. Likely fishing dhow operating without AIS.", timestamp: new Date(now.getTime() - 1800000).toISOString() }
      ],
      trackHistory: [
        { lat: 26.40, lng: 55.95, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 4.0 },
        { lat: 26.41, lng: 55.90, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 3.5 },
        { lat: 26.42, lng: 55.85, timestamp: now.toISOString(), speed: 3.2 }
      ],
      portHistory: [],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-31T04:30:00Z"
    },
    {
      id: "V-014",
      name: null,
      vesselClass: "unknown",
      trackingMode: "dark",
      mmsi: null, imo: null, flag: null, callsign: null,
      lat: 25.68,
      lng: 56.95,
      course: 340.0,
      speed: 9.5,
      heading: null,
      destination: null,
      navStatus: "underway",
      draught: null, dimensions: null,
      ais: { active: false, lastSeen: null, lastPosition: null },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9370, signalStrengthDbm: -58, pulsePattern: "pulsed", confidence: 0.90, fingerprintId: "FP-V014-A" },
          { type: "military-radar", frequencyMHz: 5600, signalStrengthDbm: -72, pulsePattern: "pulsed", confidence: 0.55, fingerprintId: "FP-V014-B" }
        ],
        cepMeters: 3.8,
        lastDetected: new Date(now.getTime() - 150000).toISOString()
      },
      imagery: [
        { id: "IMG-014", type: "SAR", satellite: "Capella-6", timestamp: new Date(now.getTime() - 2*3600000).toISOString(), resolution: "0.5m", cloudCover: null, status: "acquired" }
      ],
      alerts: [
        { type: "dark_vessel", severity: "critical", message: "Military-band radar emission detected. Unidentified vessel heading NNW in Gulf of Oman.", timestamp: new Date(now.getTime() - 600000).toISOString() }
      ],
      trackHistory: [
        { lat: 25.40, lng: 57.10, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 9.8 },
        { lat: 25.50, lng: 57.05, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 9.6 },
        { lat: 25.60, lng: 57.00, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 9.4 },
        { lat: 25.68, lng: 56.95, timestamp: now.toISOString(), speed: 9.5 }
      ],
      portHistory: [],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-31T03:30:00Z"
    },

    // ====== ADDITIONAL GONE-DARK VESSELS ======
    {
      id: "V-015",
      name: "FORTUNE STAR",
      vesselClass: "tanker",
      trackingMode: "gone_dark",
      mmsi: "256789000",
      imo: "IMO9187625",
      flag: "MT",
      callsign: "9HA2K",
      lat: 26.30,
      lng: 54.60,
      course: 140.0,
      speed: 8.8,
      heading: 138,
      destination: "KHARG ISLAND",
      navStatus: "underway",
      draught: 14.0,
      dimensions: { length: 244, beam: 42 },
      ais: {
        active: false,
        lastSeen: new Date(now.getTime() - 10 * 3600000).toISOString(),
        lastPosition: { lat: 26.65, lng: 54.20 }
      },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9435, signalStrengthDbm: -59, pulsePattern: "pulsed", confidence: 0.91, fingerprintId: "FP-V015-A" },
          { type: "l-satphone", frequencyMHz: 1630.5, signalStrengthDbm: -85, pulsePattern: "continuous", confidence: 0.68, fingerprintId: "FP-V015-B" }
        ],
        cepMeters: 4.8,
        lastDetected: new Date(now.getTime() - 300000).toISOString()
      },
      imagery: [
        { id: "IMG-015", type: "SAR", satellite: "Sentinel-1A", timestamp: new Date(now.getTime() - 4*3600000).toISOString(), resolution: "5m", cloudCover: null, status: "acquired" }
      ],
      alerts: [
        { type: "ais_gap", severity: "critical", message: "AIS lost 10h ago near Qeshm Island. Vessel now heading SE — possible attempt to avoid monitoring.", timestamp: new Date(now.getTime() - 10*3600000).toISOString() },
        { type: "dark_vessel", severity: "warning", message: "Intermittent satphone activity detected — possible covert communication.", timestamp: new Date(now.getTime() - 2*3600000).toISOString() }
      ],
      trackHistory: [
        { lat: 26.80, lng: 53.90, timestamp: new Date(now.getTime() - 14*3600000).toISOString(), speed: 11.0 },
        { lat: 26.75, lng: 54.00, timestamp: new Date(now.getTime() - 12*3600000).toISOString(), speed: 10.8 },
        { lat: 26.65, lng: 54.20, timestamp: new Date(now.getTime() - 10*3600000).toISOString(), speed: 10.5 },
        { lat: 26.55, lng: 54.32, timestamp: new Date(now.getTime() - 8*3600000).toISOString(), speed: 9.5 },
        { lat: 26.48, lng: 54.42, timestamp: new Date(now.getTime() - 6*3600000).toISOString(), speed: 9.0 },
        { lat: 26.40, lng: 54.50, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 8.9 },
        { lat: 26.30, lng: 54.60, timestamp: now.toISOString(), speed: 8.8 }
      ],
      portHistory: [
        { port: "Hamriyah", arrived: "2026-03-25T08:00:00Z", departed: "2026-03-30T16:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-16T00:00:00Z"
    },
    {
      id: "V-016",
      name: "JADE OCEAN",
      vesselClass: "cargo",
      trackingMode: "gone_dark",
      mmsi: "353736000",
      imo: "IMO9412890",
      flag: "PA",
      callsign: "3FMK2",
      lat: 25.45,
      lng: 56.55,
      course: 30.0,
      speed: 11.5,
      heading: 28,
      destination: "BANDAR ABBAS",
      navStatus: "underway",
      draught: 9.0,
      dimensions: { length: 180, beam: 28 },
      ais: {
        active: false,
        lastSeen: new Date(now.getTime() - 3 * 3600000).toISOString(),
        lastPosition: { lat: 25.22, lng: 56.72 }
      },
      rf: {
        detected: true,
        emitters: [
          { type: "x-band-nav", frequencyMHz: 9415, signalStrengthDbm: -63, pulsePattern: "pulsed", confidence: 0.87, fingerprintId: "FP-V016-A" }
        ],
        cepMeters: 5.5,
        lastDetected: new Date(now.getTime() - 180000).toISOString()
      },
      imagery: [],
      alerts: [
        { type: "ais_gap", severity: "warning", message: "AIS lost 3h ago in Gulf of Oman. Vessel now heading toward Strait of Hormuz.", timestamp: new Date(now.getTime() - 3*3600000).toISOString() }
      ],
      trackHistory: [
        { lat: 25.05, lng: 56.88, timestamp: new Date(now.getTime() - 5*3600000).toISOString(), speed: 12.0 },
        { lat: 25.12, lng: 56.82, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 11.8 },
        { lat: 25.22, lng: 56.72, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 11.5 },
        { lat: 25.30, lng: 56.65, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 11.6 },
        { lat: 25.38, lng: 56.60, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 11.4 },
        { lat: 25.45, lng: 56.55, timestamp: now.toISOString(), speed: 11.5 }
      ],
      portHistory: [
        { port: "Chabahar", arrived: "2026-03-26T14:00:00Z", departed: "2026-03-30T22:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-24T00:00:00Z"
    },

    // ====== MORE COOPERATIVE — ANCHORED / SLOW ======
    {
      id: "V-017",
      name: "BRIGHT HORIZON",
      vesselClass: "tanker",
      trackingMode: "cooperative",
      mmsi: "477328900",
      imo: "IMO9365420",
      flag: "HK",
      callsign: "VRDE5",
      lat: 25.20,
      lng: 55.28,
      course: 0,
      speed: 0.1,
      heading: 175,
      destination: "FUJAIRAH ANCHORAGE",
      navStatus: "at anchor",
      draught: 11.2,
      dimensions: { length: 183, beam: 32 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 25.20, lng: 55.28, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 0.1 },
        { lat: 25.20, lng: 55.28, timestamp: now.toISOString(), speed: 0.1 }
      ],
      portHistory: [
        { port: "Fujairah Anchorage", arrived: "2026-03-29T14:00:00Z", departed: null }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-17T00:00:00Z"
    },
    {
      id: "V-018",
      name: "NAVIGATOR GLORY",
      vesselClass: "cargo",
      trackingMode: "cooperative",
      mmsi: "538005678",
      imo: "IMO9456123",
      flag: "MH",
      callsign: "V7CC9",
      lat: 26.95,
      lng: 54.90,
      course: 85.0,
      speed: 15.0,
      heading: 84,
      destination: "MUSCAT",
      navStatus: "underway",
      draught: 10.4,
      dimensions: { length: 200, beam: 32 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 26.98, lng: 54.35, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 15.2 },
        { lat: 26.97, lng: 54.55, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 14.9 },
        { lat: 26.96, lng: 54.72, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 15.1 },
        { lat: 26.95, lng: 54.90, timestamp: now.toISOString(), speed: 15.0 }
      ],
      portHistory: [
        { port: "Abu Dhabi", arrived: "2026-03-27T06:00:00Z", departed: "2026-03-30T14:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-22T00:00:00Z"
    },
    {
      id: "V-019",
      name: "MSC ELENA",
      vesselClass: "cargo",
      trackingMode: "cooperative",
      mmsi: "255806260",
      imo: "IMO9767432",
      flag: "PT",
      callsign: "CQRM",
      lat: 26.50,
      lng: 52.80,
      course: 120.0,
      speed: 17.2,
      heading: 118,
      destination: "JEBEL ALI",
      navStatus: "underway",
      draught: 14.0,
      dimensions: { length: 366, beam: 51 },
      ais: { active: true, lastSeen: now.toISOString(), lastPosition: null },
      rf: { detected: false, emitters: [], cepMeters: null, lastDetected: null },
      imagery: [],
      alerts: [],
      trackHistory: [
        { lat: 26.80, lng: 51.90, timestamp: new Date(now.getTime() - 4*3600000).toISOString(), speed: 17.5 },
        { lat: 26.72, lng: 52.20, timestamp: new Date(now.getTime() - 3*3600000).toISOString(), speed: 17.3 },
        { lat: 26.64, lng: 52.45, timestamp: new Date(now.getTime() - 2*3600000).toISOString(), speed: 17.0 },
        { lat: 26.57, lng: 52.62, timestamp: new Date(now.getTime() - 1*3600000).toISOString(), speed: 17.2 },
        { lat: 26.50, lng: 52.80, timestamp: now.toISOString(), speed: 17.2 }
      ],
      portHistory: [
        { port: "Dammam", arrived: "2026-03-25T10:00:00Z", departed: "2026-03-30T06:00:00Z" }
      ],
      lastUpdate: now.toISOString(),
      firstDetected: "2026-03-20T00:00:00Z"
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
