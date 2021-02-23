/* deps */
import {
  Chart,
  ArcElement,
  // LineElement,
  BarElement,
  // PointElement,
  BarController,
  // BubbleController,
  DoughnutController,
  // LineController,
  // PieController,
  // PolarAreaController,
  // RadarController,
  // ScatterController,
  CategoryScale,
  // LinearScale,
  // LogarithmicScale,
  // RadialLinearScale,
  // TimeScale,
  // TimeSeriesScale,
  // Filler,
  Legend,
  // Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  // LineElement,
  BarElement,
  // PointElement,
  BarController,
  // BubbleController,
  DoughnutController,
  // LineController,
  // PieController,
  // PolarAreaController,
  // RadarController,
  // ScatterController,
  CategoryScale,
  // LinearScale,
  // LogarithmicScale,
  // RadialLinearScale,
  // TimeScale,
  // TimeSeriesScale,
  // Filler,
  Legend,
  // Title,
  Tooltip
);

import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
  topojson,
} from 'chartjs-chart-geo';
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

/* settings */
Chart.defaults.font.family = 'inherit';
Chart.defaults.color = 'var(--color-font)';

export { Chart, topojson };
