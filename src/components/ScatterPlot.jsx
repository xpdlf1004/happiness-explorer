import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ScatterPlot = ({ data, selectedYear, onCountryClick, usePersonalized }) => {
  const plotData = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    return data
      .filter(d => d.Year === selectedYear)
      .map(d => ({
        country: d.Country,
        gdp: d.GDP_per_Capita,
        happiness: d[scoreField],
        population: d.Population
      }));
  }, [data, selectedYear, usePersonalized]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            <strong>GDP per Capita:</strong> ${data.gdp.toFixed(0)}
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
        <h2 style={{
          margin: '0 0 4px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          GDP vs Happiness ({selectedYear})
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          Exploring the relationship between economic prosperity and happiness
        </p>
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="gdp"
              name="GDP per Capita"
              label={{
                value: 'GDP per Capita ($)',
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

      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#666'
      }}>
        <strong>💡 Insight:</strong> While GDP correlates with happiness, the relationship isn't perfectly linear. Some countries achieve high happiness with moderate GDP, while others with high GDP show lower happiness levels.
      </div>
    </div>
  );
};

export default ScatterPlot;
