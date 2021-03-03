import {
  Chart,
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';
Chart.register(
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  Legend,
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

// global settings
Chart.defaults.font.family = 'inherit';

// theme controller
const light = {
  fontColor: '#3f4551',
};
const dark = {
  fontColor: 'rgba(255, 255, 255, 0.75)',
};
function setLightChart() {
  Chart.defaults.color = light.fontColor;
}
function setDarkChart() {
  Chart.defaults.color = dark.fontColor;
}

export { Chart, topojson, setLightChart, setDarkChart };
