import { useMemo } from 'react';
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FACTORS } from '../utils/scoreCalculator';

const FACTOR_LABELS = {
  GDP_per_Capita: 'GDP',
  Social_Support: 'Social',
  Healthy_Life_Expectancy: 'Health',
  Freedom: 'Freedom',
  Generosity: 'Generous',
  Corruption_Perception: 'Low Corrupt'
};

const CountryDrawer = ({ country, data, selectedYear, isOpen, onClose, usePersonalized }) => {
  const countryData = useMemo(() => {
    return data
      .filter(d => d.Country === country)
      .sort((a, b) => a.Year - b.Year);
  }, [data, country]);

  const currentYearData = useMemo(() => {
    return countryData.find(d => d.Year === selectedYear);
  }, [countryData, selectedYear]);

  const radarData = useMemo(() => {
    if (!currentYearData) return [];
    return FACTORS.map(factor => ({
      factor: FACTOR_LABELS[factor],
      value: currentYearData[`${factor}_normalized`] * 100 || 0
    }));
  }, [currentYearData]);

  const lineChartData = useMemo(() => {
    return countryData.map(d => ({
      year: d.Year,
      happiness: d.Happiness_Score,
      personalized: d.Personalized_Score
    }));
  }, [countryData]);

  if (!isOpen) return null;

  const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
  const currentScore = currentYearData?.[scoreField] || 0;

  // Calculate previous year change
  const prevYearData = countryData.find(d => d.Year === selectedYear - 1);
  const change = prevYearData ? currentScore - prevYearData[scoreField] : 0;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.24s ease'
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '500px',
          maxWidth: '90vw',
          background: 'white',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideIn 0.24s ease',
          overflowY: 'auto'
        }}
      >
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                {country}
              </h2>
              <div style={{
                fontSize: '16px',
                color: '#666'
              }}>
                Year: {selectedYear}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#f0f0f0',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
              {usePersonalized ? 'Personalized Score' : 'Happiness Score'}
            </div>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {currentScore.toFixed(2)}
              {change !== 0 && (
                <span style={{
                  fontSize: '20px',
                  color: change > 0 ? '#4caf50' : '#f44336',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Score History (2005-2024)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="happiness"
                  stroke="#8884d8"
                  name="Original Score"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="personalized"
                  stroke="#82ca9d"
                  name="Personalized Score"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Factor Breakdown ({selectedYear})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Normalized Values"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default CountryDrawer;
