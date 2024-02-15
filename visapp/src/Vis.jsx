import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { csv } from 'd3-fetch'; // Import csv function from d3-fetch

const EmissionsPerCapitaChart = ({ countriesData }) => {
  const chartRef = useRef();

  useEffect(() => {
    drawChart();
  }, [countriesData]);

  const drawChart = () => {
    if (!countriesData.length) return; // Return if data is empty

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Sort the countries data based on the latest emissionsPerCapita value
    const sortedData = countriesData.sort((a, b) => b['2021'] - a['2021']);

    // Use only the top 10 countries with the highest emissionsPerCapita values
    const topCountriesData = sortedData.slice(0, 10);

    const svg = d3.select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(topCountriesData.map(d => d.country))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(topCountriesData, d => d['2021'])])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5));

    svg.selectAll('.bar')
      .data(topCountriesData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.country))
      .attr('y', d => y(d['2021']))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d['2021']))
      .attr('fill', 'steelblue');
  };

  return <svg ref={chartRef}></svg>;
};

const Visualization = () => {
  const [countriesData, setCountriesData] = useState([]);

  useEffect(() => {
    csv('src/Data/co2_pcap_cons.csv').then(data => {
      console.log('CSV Data:', data); // Check if data is loaded
      // Extract the latest value for each country
      const countriesData = data.map(d => ({
        country: d.country,
        '2021': +d['2021'] // Convert to number
      }));
      // Set the fetched data to state
      setCountriesData(countriesData);
    });
  }, []);

  return (
    <div>
      <h2>Emissions Per Capita</h2>
      <div><EmissionsPerCapitaChart countriesData={countriesData} /></div>
    </div>
  );
};

export default Visualization;

