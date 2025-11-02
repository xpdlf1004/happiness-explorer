import { FACTORS, PRESETS } from '../utils/scoreCalculator';

const FACTOR_LABELS = {
  GDP_per_Capita: 'GDP per Capita',
  Social_Support: 'Social Support',
  Healthy_Life_Expectancy: 'Healthy Life',
  Freedom: 'Freedom',
  Generosity: 'Generosity',
  Corruption_Perception: 'Low Corruption'
};

const WeightControls = ({ weights, onWeightsChange }) => {
  const handleSliderChange = (factor, value) => {
    onWeightsChange({
      ...weights,
      [factor]: parseFloat(value)
    });
  };

  const handlePresetClick = (presetName) => {
    onWeightsChange(PRESETS[presetName]);
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div style={{
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold' }}>
        Happiness Factors
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#666' }}>
          Presets
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handlePresetClick('equal')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            Equal Weights
          </button>
          <button
            onClick={() => handlePresetClick('freedom')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            Freedom-Heavy
          </button>
          <button
            onClick={() => handlePresetClick('health')}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            Health-Heavy
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#666',
          marginBottom: '8px'
        }}>
          <span>Total Weight</span>
          <span style={{ fontWeight: 'bold' }}>{totalWeight.toFixed(1)}%</span>
        </div>
        <div style={{
          height: '6px',
          background: '#e0e0e0',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: totalWeight === 100 ? '#4caf50' : '#ff9800',
            width: `${Math.min(totalWeight, 100)}%`,
            transition: 'all 0.3s'
          }} />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        {FACTORS.map(factor => (
          <div key={factor} style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              alignItems: 'center'
            }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>
                {FACTOR_LABELS[factor]}
              </label>
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#2196f3',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {weights[factor].toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={weights[factor]}
              onChange={(e) => handleSliderChange(factor, e.target.value)}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                outline: 'none',
                background: `linear-gradient(to right, #2196f3 0%, #2196f3 ${weights[factor]}%, #e0e0e0 ${weights[factor]}%, #e0e0e0 100%)`,
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
          💡 How it works
        </p>
        <p style={{ margin: 0, color: '#666' }}>
          Adjust the sliders to reflect what matters most to you. The map and rankings will update in real-time to show how countries score based on your personal happiness criteria.
        </p>
      </div>
    </div>
  );
};

export default WeightControls;
