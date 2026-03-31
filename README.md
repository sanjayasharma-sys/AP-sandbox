# ULOOK Maritime Intelligence Platform

A real-time maritime domain awareness dashboard focused on **RF-first vessel tracking**. Tracks vessels across three operational modes in the Strait of Hormuz / Persian Gulf region.

| Mode | Description | Visual |
|------|-------------|--------|
| **Cooperative** | AIS active, fully identified | Green solid track |
| **Dark** | No AIS, RF emissions only | Orange pulsing markers |
| **Gone Dark** | AIS lost, still tracked via RF | Amber glow + color-coded split track |

## Architecture

- **Stack**: Vanilla JS, Leaflet 1.9.4, Chart.js 4.4.0, custom CSS (dark theme)
- **Layout**: Navbar + left toolbar + slide panels + Leaflet map + right detail panel + bottom status bar
- **State**: Single `window.appState` object + separate `filterState`

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Main layout & external dependencies |
| `css/styles.css` | Full theming, responsive design, dark theme |
| `js/app.js` | Initialization, toolbar, live update loops |
| `js/dashboard.js` | Analytics charts (tracking mode/vessel class) |
| `js/filters.js` | Search, filter, layer toggling |
| `js/map.js` | Leaflet map, markers, color-coded tracks, CEP circles |
| `js/mock-data.js` | 19 curated vessels with RF/AIS/imagery data |
| `js/utils.js` | Constants, formatters, helpers |
| `js/vessel-detail.js` | 4-tab dossier panel (Overview, RF, Imagery, History) |

## Features

### Complete
- Multi-source vessel tracking (AIS, RF, satellite imagery)
- Three tracking mode classification with distinct visual styles
- 19 vessels: 10 cooperative, 5 dark, 4 gone-dark
- Simulated live position updates (10s interval, cooperative only)
- Leaflet map with class-specific SVG markers and tracking mode styling
- Color-coded tracks for gone-dark vessels (green AIS / amber RF with "AIS LOST" marker)
- Layer toggling, search/filter by name/MMSI/IMO/callsign/RF fingerprint
- Detailed vessel dossier with 4 tabs (Overview, RF Fingerprint, Imagery, History)
- Rich satellite imagery timeline with visual thumbnails and analyst notes
- Satellite imagery tasking UI (SAR/EO mode + priority)
- RF fingerprint visualization (emitter cards, spectrum bar)
- Analytics dashboard with Chart.js (mode/class distribution)
- Responsive design (desktop + mobile)
- Dark theme with ULOOK orange branding
- Pulsing glow animations for dark/gone-dark vessels

### Known Issues
- **Search Bug** — RF fingerprint concatenation in `filters.js` uses `+` instead of `+=`

### Planned Improvements

**High Priority**
- [ ] Fix RF fingerprint search bug in `filters.js`
- [ ] Ship-to-ship detection visualization on map (proximity lines/zones)
- [ ] Dynamic satellite pass prediction (replace hardcoded "Next SAR Pass")

**Medium Priority**
- [ ] Persist filter/UI state with localStorage
- [ ] Real API integration (replace mock-data.js)
- [ ] Marker clustering for large fleets

**Low Priority / Enhancements**
- [ ] Waterfall spectrogram for RF frequency monitoring
- [ ] Data export (CSV, GeoJSON)
- [ ] Improved accessibility (ARIA labels, keyboard nav, colorblind-friendly)
- [ ] Tablet-specific responsive layout
- [ ] Authentication & role-based access

## Running Locally

Open `index.html` in a browser, or serve with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
