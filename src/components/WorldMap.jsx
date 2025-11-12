import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const WorldMap = ({ data, selectedYear, onCountryClick, usePersonalized = false }) => {
  const svgRef = useRef();
  const [worldData, setWorldData] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: {} });

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      });
  }, []);

  useEffect(() => {
    if (!worldData || !data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3.geoNaturalEarth1()
      .fitSize([width, height], worldData);

    const pathGenerator = d3.geoPath().projection(projection);

    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const scores = data.filter(d => d.Year === selectedYear).map(d => d[scoreField]);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.min(...scores), Math.max(...scores)]);

    // Comprehensive country name mapping from World Atlas to CSV data
    const countryNameMap = {
      'United States of America': 'United States',
      'United Kingdom': 'United Kingdom',
      'South Africa': 'South Africa',
      'China': 'China',
      'India': 'India',
      'Brazil': 'Brazil',
      'France': 'France',
      'Germany': 'Germany',
      'Canada': 'Canada',
      'Australia': 'Australia',
      'Japan': 'Japan',
      'South Korea': 'South Korea',
      'Mexico': 'Mexico',
      'Russia': 'Russia',
      'Italy': 'Italy',
      'Spain': 'Spain',
      'Argentina': 'Argentina',
      'Chile': 'Chile',
      'Colombia': 'Colombia',
      'Peru': 'Peru',
      'Venezuela': 'Venezuela',
      'Netherlands': 'Netherlands',
      'Belgium': 'Belgium',
      'Switzerland': 'Switzerland',
      'Austria': 'Austria',
      'Sweden': 'Sweden',
      'Norway': 'Norway',
      'Denmark': 'Denmark',
      'Finland': 'Finland',
      'Poland': 'Poland',
      'Czech Republic': 'Czech Republic',
      'Czechia': 'Czech Republic',
      'Hungary': 'Hungary',
      'Romania': 'Romania',
      'Greece': 'Greece',
      'Portugal': 'Portugal',
      'Turkey': 'Turkey',
      'Egypt': 'Egypt',
      'Nigeria': 'Nigeria',
      'Kenya': 'Kenya',
      'Ethiopia': 'Ethiopia',
      'Tanzania': 'Tanzania',
      'Uganda': 'Uganda',
      'Morocco': 'Morocco',
      'Algeria': 'Algeria',
      'Saudi Arabia': 'Saudi Arabia',
      'United Arab Emirates': 'United Arab Emirates',
      'Israel': 'Israel',
      'Jordan': 'Jordan',
      'Lebanon': 'Lebanon',
      'Iraq': 'Iraq',
      'Iran': 'Iran',
      'Pakistan': 'Pakistan',
      'Bangladesh': 'Bangladesh',
      'Thailand': 'Thailand',
      'Vietnam': 'Vietnam',
      'Malaysia': 'Malaysia',
      'Singapore': 'Singapore',
      'Philippines': 'Philippines',
      'Indonesia': 'Indonesia',
      'New Zealand': 'New Zealand',
      'Ireland': 'Ireland',
      'Iceland': 'Iceland'
    };

    // Fallback: try direct name match if not in mapping
    const getCountryName = (atlasName) => {
      if (countryNameMap[atlasName]) {
        return countryNameMap[atlasName];
      }
      // Try to find exact match in data
      const exactMatch = data.find(d => d.Country === atlasName && d.Year === selectedYear);
      return exactMatch ? atlasName : null;
    };

    const g = svg.append('g');

    g.selectAll('path')
      .data(worldData.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', d => {
        const countryName = getCountryName(d.properties.name);
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
        const countryName = getCountryName(d.properties.name);
        if (!countryName) return;

        const countryData = data.find(item =>
          item.Country === countryName && item.Year === selectedYear
        );

        if (countryData) {
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
      .on('click', (_, d) => {
        const countryName = getCountryName(d.properties.name);
        if (countryName) {
          onCountryClick(countryName);
        }
      });

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

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          Happiness Score
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '100px',
            height: '10px',
            background: 'linear-gradient(to right, #ffffcc, #a1dab4, #41b6c4, #2c7fb8, #253494)',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '10px', color: '#666' }}>Low → High</span>
        </div>
        <div style={{ marginTop: '12px', fontSize: '10px', color: '#999' }}>
          🖱️ Click country • Scroll to zoom
        </div>
      </div>

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
