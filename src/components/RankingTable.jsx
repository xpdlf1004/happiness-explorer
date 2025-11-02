import { useMemo } from 'react';

const RankingTable = ({ data, selectedYear, onCountryClick, usePersonalized }) => {
  const rankings = useMemo(() => {
    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const yearData = data.filter(d => d.Year === selectedYear);

    return yearData
      .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0))
      .map((d, index) => {
        // Calculate previous year rank
        const prevYearData = data.filter(d => d.Year === selectedYear - 1);
        const prevYearRanking = prevYearData
          .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0));
        const prevRank = prevYearRanking.findIndex(item => item.Country === d.Country) + 1;
        const rankChange = prevRank > 0 ? prevRank - (index + 1) : null;

        // Calculate score change
        const prevScore = prevYearData.find(item => item.Country === d.Country)?.[scoreField];
        const scoreChange = prevScore ? d[scoreField] - prevScore : null;

        return {
          rank: index + 1,
          country: d.Country,
          score: d[scoreField],
          rankChange,
          scoreChange
        };
      });
  }, [data, selectedYear, usePersonalized]);

  const getRankChangeIcon = (change) => {
    if (!change || change === 0) return '—';
    if (change > 0) return `↑ ${change}`;
    return `↓ ${Math.abs(change)}`;
  };

  const getRankChangeColor = (change) => {
    if (!change || change === 0) return '#999';
    return change > 0 ? '#4caf50' : '#f44336';
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Country Rankings ({selectedYear})
        </h2>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '14px',
          color: '#666'
        }}>
          {usePersonalized ? 'Based on your personalized weights' : 'Based on original happiness scores'}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            background: '#f5f5f5',
            zIndex: 1
          }}>
            <tr>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#666',
                width: '60px'
              }}>
                Rank
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: '#666'
              }}>
                Country
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontSize: '13px',
                fontWeight: '600',
                color: '#666',
                width: '100px'
              }}>
                Score
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: '#666',
                width: '80px'
              }}>
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((item, index) => (
              <tr
                key={item.country}
                onClick={() => onCountryClick(item.country)}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.15s',
                  background: index % 2 === 0 ? 'white' : '#fafafa'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                onMouseOut={e => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafafa'}
              >
                <td style={{
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: item.rank <= 3 ? '#ffc107' : '#666'
                }}>
                  {item.rank <= 3 && '🏆'} {item.rank}
                </td>
                <td style={{
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  {item.country}
                </td>
                <td style={{
                  padding: '16px',
                  textAlign: 'right',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#2196f3'
                }}>
                  {item.score.toFixed(2)}
                  {item.scoreChange !== null && (
                    <div style={{
                      fontSize: '11px',
                      color: item.scoreChange >= 0 ? '#4caf50' : '#f44336',
                      marginTop: '2px'
                    }}>
                      {item.scoreChange >= 0 ? '+' : ''}{item.scoreChange.toFixed(2)}
                    </div>
                  )}
                </td>
                <td style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: getRankChangeColor(item.rankChange)
                }}>
                  {getRankChangeIcon(item.rankChange)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
