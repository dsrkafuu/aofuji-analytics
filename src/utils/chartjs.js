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
  primaryColor: 'rgba(138, 162, 211, 0.8)',
  primaryActiveColor: 'rgba(138, 162, 211, 1)',
  secondaryColor: 'rgba(139, 129, 195, 0.8)',
  secondaryActiveColor: 'rgba(139, 129, 195, 1)',
  baseColor: 'rgba(211, 211, 211, 0.8)',
  baseActiveColor: 'rgba(211, 211, 211, 1)',
  nullColor: 'rgba(211, 211, 211, 0.5)',
};
const dark = {
  fontColor: 'rgba(255, 255, 255, 0.75)',
  primaryColor: 'rgba(138, 162, 211, 0.8)',
  primaryActiveColor: 'rgba(138, 162, 211, 1)',
  secondaryColor: 'rgba(139, 129, 195, 0.8)',
  secondaryActiveColor: 'rgba(139, 129, 195, 1)',
  baseColor: 'rgba(211, 211, 211, 0.8)',
  baseActiveColor: 'rgba(211, 211, 211, 1)',
  nullColor: 'rgba(211, 211, 211, 0.5)',
};
let theme = {};

function setLightChart() {
  theme = { ...light };
  Chart.defaults.color = light.fontColor;
}
function setDarkChart() {
  theme = { ...dark };
  Chart.defaults.color = dark.fontColor;
}

export { Chart, topojson, setLightChart, setDarkChart, theme };
