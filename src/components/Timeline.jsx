import { useState, useEffect } from 'react';

const Timeline = ({ years, selectedYear, onYearChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const currentIndex = years.indexOf(selectedYear);
    if (currentIndex >= years.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      onYearChange(years[currentIndex + 1]);
    }, 900);

    return () => clearTimeout(timer);
  }, [isPlaying, selectedYear, years, onYearChange]);

  const handlePlayPause = () => {
    if (selectedYear === years[years.length - 1]) {
      onYearChange(years[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value);
    onYearChange(years[index]);
    setIsPlaying(false);
  };

  const currentIndex = years.indexOf(selectedYear);

  return (
    <div style={{
      padding: '20px 24px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={handlePlayPause}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: '#2196f3',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#1976d2'}
          onMouseOut={e => e.currentTarget.style.background = '#2196f3'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {years[0]}
            </span>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2196f3'
            }}>
              {selectedYear}
            </span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {years[years.length - 1]}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={years.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              background: `linear-gradient(to right, #2196f3 0%, #2196f3 ${(currentIndex / (years.length - 1)) * 100}%, #e0e0e0 ${(currentIndex / (years.length - 1)) * 100}%, #e0e0e0 100%)`,
              WebkitAppearance: 'none',
              cursor: 'pointer'
            }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '12px',
            color: '#999'
          }}>
            {years.filter((_, i) => i % 5 === 0).map(year => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2196f3;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2196f3;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Timeline;
