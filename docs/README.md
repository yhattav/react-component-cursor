# 📊 Performance Dashboard

This directory contains the automatically generated performance dashboard for the React Component Cursor library.

## 🌐 Live Dashboard

The dashboard is automatically deployed to GitHub Pages and updated on every push to the main branch:

**Live URL:** https://yhattav.github.io/react-component-cursor/performance/

## 📈 What's Included

The dashboard provides visual insights into:

### Key Metrics
- **Bundle Size**: Library size trends over time (target: <15KB)
- **Memory Usage**: Memory consumption during testing (target: <1MB)
- **Test Performance**: Percentage of tests passing (target: >95%)
- **Test Coverage**: Number of tests successfully executed

### Visual Charts
- **Line Charts**: Bundle size, memory usage, and performance trends over time
- **Bar Charts**: Test count progression
- **Color Coding**: Green (good), yellow (warning), red (critical)

## 🔄 Automatic Updates

The dashboard updates automatically via GitHub Actions:
- **Trigger**: Every push to main branch
- **Data Source**: Performance benchmark results from CI/CD
- **History**: Rolling 100 data points
- **Deployment**: GitHub Pages with zero-downtime updates

## 🛠️ Local Development

To generate the dashboard locally:

```bash
npm run perf:dashboard
```

Then open `docs/index.html` in your browser.

## 📊 Data Sources

The dashboard pulls data from:
- `performance-results/history.json` - Historical performance data
- `performance-results/latest.json` - Most recent benchmark results
- GitHub Actions cache - Persistent data storage

## 🔧 Customization

The dashboard generator is located at `scripts/generate-dashboard.js` and can be customized to:
- Add new metrics
- Modify chart types
- Adjust styling
- Change data visualization

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🎨 Technology Stack

- **Chart.js**: Interactive charts and visualizations
- **Pure HTML/CSS/JS**: No frameworks, fast loading
- **GitHub Actions**: Automated deployment
- **GitHub Pages**: Static hosting 