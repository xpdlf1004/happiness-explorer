import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const WorldMap = ({ data, selectedYear, onCountryClick, usePersonalized = false }) => {
  const svgRef = useRef();
  const [worldData, setWorldData] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: {} });

  // Load world map data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      });
  }, []);

  // Render map
  useEffect(() => {
    if (!worldData || !data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3.geoNaturalEarth1()
      .fitSize([width, height], worldData);

    const pathGenerator = d3.geoPath().projection(projection);

    // Create color scale
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const scores = data.filter(d => d.Year === selectedYear).map(d => d[scoreField]);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.min(...scores), Math.max(...scores)]);

    // Country name mapping (simplified for main countries)
    const countryNameMap = {
      'United States of America': 'USA',
      'United Kingdom': 'UK',
      'South Africa': 'South Africa',
      'China': 'China',
      'India': 'India',
      'Brazil': 'Brazil',
      'France': 'France',
      'Germany': 'Germany',
      'Canada': 'Canada',
      'Australia': 'Australia'
    };

    // Draw countries
    const g = svg.append('g');

    g.selectAll('path')
      .data(worldData.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', d => {
        const countryName = countryNameMap[d.properties.name];
        if (!countryName) return '#e0e0e0';

        const countryData = data.find(item =>
          item.Country === countryName && item.Year === selectedYear
        );

        return countryData ? colorScale(countryData[scoreField]) : '#e0e0e0';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .style('transition', 'fill 0.5s ease')
      .on('mouseover', (event, d) => {
        const countryName = countryNameMap[d.properties.name];
        if (!countryName) return;

        const countryData = data.find(item =>
          item.Country === countryName && item.Year === selectedYear
        );

        if (countryData) {
          const rect = event.currentTarget.getBoundingClientRect();
          setTooltip({
            show: true,
            x: event.clientX,
            y: event.clientY,
            content: countryData
          });
        }

        d3.select(event.currentTarget)
          .attr('stroke', '#333')
          .attr('stroke-width', 1.5);
      })
      .on('mouseout', (event) => {
        setTooltip({ show: false, x: 0, y: 0, content: {} });
        d3.select(event.currentTarget)
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5);
      })
      .on('click', (event, d) => {
        const countryName = countryNameMap[d.properties.name];
        if (countryName) {
          onCountryClick(countryName);
        }
      });

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [worldData, data, selectedYear, usePersonalized, onCountryClick]);

  const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#f8f9fa'
        }}
      />

      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '300px'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            {tooltip.content.Country}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Score:</strong> {tooltip.content[scoreField]?.toFixed(2)}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Year:</strong> {tooltip.content.Year}
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
            Click for details
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
