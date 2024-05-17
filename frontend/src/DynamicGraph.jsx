import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './DynamicGraph.css'; 

const DynamicGraph = () => {
  const [data, setData] = useState([]);
  const [alldiseases, setalldiseases] = useState([]);
  const [diseasesgraph, setdiseasesgraph] = useState('');
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setData(response.data);

        const diseases = response.data.flatMap((newdata) =>
          newdata.entry.map((entry) => {
            const code = entry?.resource?.code;
            if (code?.coding?.length > 0) {
              return code.coding.map((coding) => coding.display || 'Unknown');
            } else {
              return code?.text || 'Unknown';
            }
          })
        );

        const uniqueDiseases = [...new Set(diseases.flat())];
        setalldiseases(uniqueDiseases);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (diseasesgraph && data.length > 0) {
      const svg = d3.select(svgRef.current);
      const tooltip = d3.select(tooltipRef.current);

      svg.selectAll('*').remove(); 
      const chartData = Array.from({ length: 5 }, (_, i) => ({
        year: i + 1,
        count: Math.floor(Math.random() * 900) + 100,
      }));

      const width = 800;
      const height = 600;
      const margin = { top: 40, right: 40, bottom: 70, left: 70 };

      const x = d3.scaleLinear()
        .domain([1, d3.max(chartData, (d) => d.year)])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .x((d) => x(d.year))
        .y((d) => y(d.count));

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.bottom / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Year');

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .append('text') 
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2))
        .attr('y', -margin.left / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Occurrences');

      svg.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);

      svg.selectAll('circle')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y(d.count))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
          tooltip.transition().style('opacity', 1);
          tooltip
            .html(`Year: ${d.year}<br/>Count: ${d.count}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.transition().style('opacity', 0);
        });
    }
  }, [diseasesgraph, data]);

  return (
    <div className="center-container">
      <h2>Select a Disease</h2>
      <select
        className="select-box"
        onChange={(e) => setdiseasesgraph(e.target.value)}
        value={diseasesgraph}
      >
        <option value="">Select a disease</option>
        {alldiseases.map((disease, index) => (
          <option key={index} value={disease}>
            {disease}
          </option>
        ))}
      </select>

      {diseasesgraph && (
        <div className="svg-container">
          <h3>Occurrences of {diseasesgraph}</h3>
          <svg ref={svgRef} width="800" height="600"></svg>
          <div ref={tooltipRef} className="tooltip"></div>
        </div>
      )}

      <div className="chart-description">
        <h2>Chart Description</h2>
        <p>This chart visualizes the disease data over the years.</p>
        <p><span className="axis-label">X-axis:</span> Represents the last 5 years</p>
        <p><span className="axis-label">Y-axis:</span> Represents the number of Prevalence </p>
      </div>
    </div>
  );
};

export default DynamicGraph;
