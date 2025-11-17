import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const TrendsChart = ({ data, selectedYear, onCountryClick, usePersonalized }) => {
  const [selectedCountries, setSelectedCountries] = useState(['USA', 'China', 'Germany', 'Brazil', 'South Korea']);

  // Get top countries by current year score
  const topCountries = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const currentYearData = data.filter(d => d.Year === selectedYear);
    return currentYearData
      .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0))
      .slice(0, 20)
      .map(d => d.Country);
  }, [data, selectedYear, usePersonalized]);

  // All unique countries
  const allCountries = useMemo(() => {
    const countries = [...new Set(data.map(d => d.Country))];
    return countries.sort();
  }, [data]);

  // Prepare trend data
  const trendData = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const years = [...new Set(data.map(d => d.Year))].sort();

    return years.map(year => {
      const yearData = { year };
      selectedCountries.forEach(country => {
        const countryData = data.find(d => d.Country === country && d.Year === year);
        if (countryData) {
          yearData[country] = countryData[scoreField];
        }
      });
      return yearData;
    });
  }, [data, selectedCountries, usePersonalized]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

  const handleCountryToggle = (country) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #ddd',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            Year: {label}
          </div>
          {payload.map((entry, index) => (
            <div key={index} style={{
              color: entry.color,
              fontSize: '13px',
              marginBottom: '4px'
            }}>
              <strong>{entry.name}:</strong> {entry.value?.toFixed(2)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Happiness Trends Over Time (2015-2023)
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          Compare how happiness scores have evolved across different countries
        </p>
      </div>

      <div style={{
        marginBottom: '16px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        maxHeight: '120px',
        overflowY: 'auto',
        padding: '8px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ width: '100%', marginBottom: '4px' }}>
          <strong style={{ fontSize: '13px', color: '#666' }}>Select Countries:</strong>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => setSelectedCountries(topCountries.slice(0, 5))}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Top 5
            </button>
            <button
              onClick={() => setSelectedCountries([])}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
        </div>
        {allCountries.map(country => (
          <button
            key={country}
            onClick={() => handleCountryToggle(country)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: selectedCountries.includes(country) ? '#2196f3' : 'white',
              color: selectedCountries.includes(country) ? 'white' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {country}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Happiness Score', angle: -90, position: 'insideLeft', style: { fontSize: '14px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              onClick={(e) => handleCountryToggle(e.value)}
            />
            {/* Current Year Indicator */}
            <ReferenceLine
              x={selectedYear}
              stroke="#ff6b6b"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `${selectedYear}`,
                position: 'top',
                fill: '#ff6b6b',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            />
            {selectedCountries.map((country, index) => (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;
