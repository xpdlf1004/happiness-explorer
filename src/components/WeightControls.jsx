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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { key: 'equal', label: 'Equal' },
            { key: 'balanced', label: 'Balanced' },
            { key: 'wealth', label: 'Wealth' },
            { key: 'health', label: 'Health' },
            { key: 'freedom', label: 'Freedom' },
            { key: 'social', label: 'Social' },
            { key: 'ethics', label: 'Ethics' }
          ].map(preset => (
            <button
              key={preset.key}
              onClick={() => handlePresetClick(preset.key)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseOut={e => e.currentTarget.style.background = 'white'}
            >
              {preset.label}
            </button>
          ))}
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
    </div>
  );
};

export default WeightControls;
