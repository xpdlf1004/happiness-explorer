import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DistributionChart = ({ data, selectedYear, usePersonalized }) => {
  const distributionData = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const yearData = data.filter(d => d.Year === selectedYear);

    // Create bins for distribution
    const bins = [
      { range: '0-2', min: 0, max: 2, count: 0, countries: [] },
      { range: '2-3', min: 2, max: 3, count: 0, countries: [] },
      { range: '3-4', min: 3, max: 4, count: 0, countries: [] },
      { range: '4-5', min: 4, max: 5, count: 0, countries: [] },
      { range: '5-6', min: 5, max: 6, count: 0, countries: [] },
      { range: '6-7', min: 6, max: 7, count: 0, countries: [] },
      { range: '7-8', min: 7, max: 8, count: 0, countries: [] },
      { range: '8-9', min: 8, max: 9, count: 0, countries: [] },
      { range: '9-10', min: 9, max: 10, count: 0, countries: [] }
    ];

    yearData.forEach(country => {
      const score = country[scoreField];
      if (score !== undefined && score !== null) {
        const bin = bins.find(b => score >= b.min && score < b.max) || bins[bins.length - 1];
        bin.count++;
        bin.countries.push(country.Country);
      }
    });

    return bins;
  }, [data, selectedYear, usePersonalized]);

  const stats = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const yearData = data.filter(d => d.Year === selectedYear);
    const scores = yearData.map(d => d[scoreField]).filter(s => s !== undefined && s !== null);

    if (scores.length === 0) return { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 };

    const sorted = [...scores].sort((a, b) => a - b);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    return { mean, median, min, max, stdDev };
  }, [data, selectedYear, usePersonalized]);

  const getColor = (count) => {
    const maxCount = Math.max(...distributionData.map(d => d.count));
    const intensity = count / maxCount;
    return `rgba(33, 150, 243, ${0.3 + intensity * 0.7})`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #ddd',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          maxWidth: '300px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            Score Range: {data.range}
          </div>
          <div style={{ fontSize: '13px', marginBottom: '8px', color: '#666' }}>
            <strong>Countries:</strong> {data.count}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#888',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {data.countries.slice(0, 10).join(', ')}
            {data.countries.length > 10 && ` +${data.countries.length - 10} more`}
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
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Happiness Score Distribution ({selectedYear})
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          How happiness scores are distributed across all countries
        </p>
      </div>

      {/* Statistics Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Mean</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196f3' }}>
            {stats.mean.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Median</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196f3' }}>
            {stats.median.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Min</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
            {stats.min.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Max</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
            {stats.max.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Std Dev</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff9800' }}>
            {stats.stdDev.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12 }}
              label={{ value: 'Happiness Score Range', position: 'insideBottom', offset: -5, style: { fontSize: '14px' } }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Number of Countries', angle: -90, position: 'insideLeft', style: { fontSize: '14px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;
