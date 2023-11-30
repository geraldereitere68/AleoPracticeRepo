/**
 *  Filename: SophisticatedCode.js
 * 
 *  Description: This code demonstrates a sophisticated web app that fetches data from an API,
 *               performs complex calculations, and generates an interactive visualization.
 */

// Import required libraries
const axios = require('axios');
const d3 = require('d3');
const lodash = require('lodash');

// Global variables
let data = [];
let filteredData = [];
let processedData = [];
let chart = null;
let selectedOption = 'all';

// Fetch data from API
axios.get('https://api.example.com/data')
  .then(response => {
    data = response.data;
    processAndFilterData();
    renderChart();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Process and filter data
function processAndFilterData() {
  filteredData = lodash.filter(data, ['category', selectedOption]);
  processedData = lodash.map(filteredData, item => ({
    ...item,
    calculatedValue: item.value * 2,
  }));
}

// Render chart using D3.js
function renderChart() {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(lodash.map(processedData, 'name'))
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(processedData, 'calculatedValue')])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  svg.selectAll('rect')
    .data(processedData)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.name))
    .attr('y', d => yScale(d.calculatedValue))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.calculatedValue))
    .attr('fill', 'steelblue');

  svg.selectAll('text')
    .data(processedData)
    .enter()
    .append('text')
    .text(d => d.calculatedValue)
    .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.calculatedValue) - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white');
}

// Event listener for option select
document.getElementById('option-select').addEventListener('change', event => {
  selectedOption = event.target.value;
  processAndFilterData();
  chart.selectAll('rect')
    .data(processedData)
    .attr('x', d => xScale(d.name))
    .attr('y', d => yScale(d.calculatedValue))
    .attr('height', d => height - yScale(d.calculatedValue));

  chart.selectAll('text')
    .data(processedData)
    .text(d => d.calculatedValue)
    .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.calculatedValue) - 5);
});

// Additional complex functionality...
// ...
// ...
// ...

// Finally, perform an operation on the processed data
const sum = lodash.sumBy(processedData, 'calculatedValue');
console.log('Sum of calculated values:', sum);
