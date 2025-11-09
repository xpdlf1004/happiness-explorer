import { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const FACTORS = [
  { key: 'GDP_per_Capita', label: 'GDP per Capita', unit: '$' },
  { key: 'Social_Support', label: 'Social Support', unit: '' },
  { key: 'Healthy_Life_Expectancy', label: 'Life Expectancy', unit: 'years' },
  { key: 'Freedom', label: 'Freedom', unit: '' },
  { key: 'Generosity', label: 'Generosity', unit: '' },
  { key: 'Corruption_Perception', label: 'Corruption Perception', unit: '' },
  { key: 'Education_Index', label: 'Education Index', unit: '' },
  { key: 'Mental_Health_Index', label: 'Mental Health Index', unit: '' },
  { key: 'Work_Life_Balance', label: 'Work-Life Balance', unit: '' },
  { key: 'Political_Stability', label: 'Political Stability', unit: '' },
  { key: 'Internet_Access', label: 'Internet Access', unit: '%' },
  { key: 'Public_Health_Expenditure', label: 'Health Expenditure', unit: '%' },
  { key: 'Income_Inequality', label: 'Income Inequality', unit: '' },
  { key: 'Crime_Rate', label: 'Crime Rate', unit: '' },
  { key: 'Climate_Index', label: 'Climate Index', unit: '' }
];

const ScatterPlot = ({ data, selectedYear, onCountryClick, usePersonalized }) => {
  const [selectedFactor, setSelectedFactor] = useState(FACTORS[0]);

  const plotData = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    return data
      .filter(d => d.Year === selectedYear)
      .map(d => ({
        country: d.Country,
        factor: d[selectedFactor.key],
        happiness: d[scoreField],
        population: d.Population
      }));
  }, [data, selectedYear, usePersonalized, selectedFactor]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const factorValue = selectedFactor.unit === '$'
        ? `$${data.factor.toFixed(0)}`
        : selectedFactor.unit
        ? `${data.factor.toFixed(1)}${selectedFactor.unit}`
        : data.factor.toFixed(2);

      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {data.country}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>{selectedFactor.label}:</strong> {factorValue}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Happiness Score:</strong> {data.happiness.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
            Click for details
          </div>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {selectedFactor.label} vs Happiness ({selectedYear})
          </h2>
          <select
            value={selectedFactor.key}
            onChange={(e) => {
              const factor = FACTORS.find(f => f.key === e.target.value);
              setSelectedFactor(factor);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {FACTORS.map(factor => (
              <option key={factor.key} value={factor.key}>
                {factor.label}
              </option>
            ))}
          </select>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          Exploring the relationship between {selectedFactor.label.toLowerCase()} and happiness
        </p>
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="factor"
              name={selectedFactor.label}
              label={{
                value: `${selectedFactor.label} ${selectedFactor.unit ? `(${selectedFactor.unit})` : ''}`,
                position: 'insideBottom',
                offset: -10,
                style: { fontSize: '14px' }
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="happiness"
              name="Happiness Score"
              domain={[0, 10]}
              label={{
                value: 'Happiness Score',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '14px' }
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <ReferenceLine y={5} stroke="#666" strokeDasharray="3 3" />
            <Scatter
              data={plotData}
              fill="#2196f3"
              fillOpacity={0.6}
              onClick={(data) => {
                if (data && data.country) {
                  onCountryClick(data.country);
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;
