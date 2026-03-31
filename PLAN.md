# uLook Space Maritime Intelligence Platform - Project Plan

## Project Overview
A real-time maritime domain awareness dashboard focused on RF-first vessel tracking. Tracks vessels across three modes: **Cooperative** (AIS active), **Dark** (RF-only, no AIS), and **Gone Dark** (AIS lost, RF tracked). Currently uses mock data for 5 vessels in the Strait of Hormuz/Persian Gulf region.

## Architecture
- **Stack**: Vanilla JS, Leaflet 1.9.4, Chart.js 4.4.0, custom CSS (dark theme)
- **Layout**: Navbar + left toolbar + slide panels + Leaflet map + right detail panel + bottom status bar
- **State**: Single `window.appState` object + separate `filterState`

## File Structure
| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 261 | Main layout, external deps |
| `css/styles.css` | 741 | Full theming & responsive design |
| `js/app.js` | 123 | Init, toolbar, live update loops |
| `js/dashboard.js` | 145 | Analytics charts (mode/class) |
| `js/filters.js` | 281 | Search, filter, layer toggling |
| `js/map.js` | 303 | Leaflet map, markers, tracks, CEP circles |
| `js/mock-data.js` | 408 | 5 curated vessels with RF/AIS/imagery data |
| `js/utils.js` | 142 | Constants, formatters, helpers |
| `js/vessel-detail.js` | 651 | 4-tab dossier panel (Overview, RF, Imagery, History) |

## What's Complete
- Multi-source vessel tracking (AIS, RF, satellite imagery)
- Three tracking mode classification with distinct visual styles
- Simulated live position updates (10s interval, cooperative only)
- Leaflet map with class-specific SVG markers and tracking mode styling
- Layer toggling, search/filter by name/MMSI/IMO/callsign/RF fingerprint
- Detailed vessel dossier with 4 tabs
- RF fingerprint visualization (emitter cards, spectrum bar)
- Satellite imagery tasking UI
- Analytics dashboard with Chart.js
- Responsive design (desktop + mobile)
- Dark theme with uLook orange branding
- Pulsing glow animations for dark/gone-dark vessels

---

## Known Issues (from previous session)

### Critical
1. **Map Z-Index** - Map sometimes renders over slide panels
2. **Missing uLook Logo** - Using SVG radar placeholder, needs actual logo
3. **Floating Legend** - Element still in DOM, should be removed (legend is in sidebar now)

### Bugs
4. **Search Bug in `filters.js`** - RF fingerprint concatenation uses `+` instead of `+=`, so RF fingerprint IDs aren't searchable

---

## Planned Improvements

### High Priority
- [ ] Fix map z-index stacking (panels must always appear above map)
- [ ] Replace logo placeholder with actual uLook logo
- [ ] Remove floating legend element from HTML/CSS
- [ ] Fix RF fingerprint search bug in `filters.js`

### Medium Priority
- [ ] Ship-to-ship detection visualization on map (proximity lines/zones)
- [ ] Dynamic satellite pass prediction (replace hardcoded "Next SAR Pass")
- [ ] Persist filter/UI state with localStorage
- [ ] Real API integration (replace mock-data.js)

### Low Priority / Enhancements
- [ ] Marker clustering for large fleets
- [ ] Waterfall spectrogram for RF frequency monitoring
- [ ] Data export (CSV, GeoJSON)
- [ ] Improved accessibility (ARIA labels, keyboard nav, colorblind-friendly)
- [ ] Tablet-specific responsive layout
- [ ] Authentication & role-based access

---

## Git History
```
5b0d400 Fix vessel tracks to follow shipping lanes instead of crossing land
0f980ff Switch to light map tiles and fix slide panel visibility
0201704 Rebuild dashboard as uLook Space RF-first maritime intelligence platform
bc4d988 Update utils.js with uLook brand palette and RF emitter config
c301730 Build maritime domain awareness dashboard with multi-source vessel tracking
451a011 Initial commit
```
