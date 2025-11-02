import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from './components/WorldMap';
import WeightControls from './components/WeightControls';
import Timeline from './components/Timeline';
import CountryDrawer from './components/CountryDrawer';
import RankingTable from './components/RankingTable';
import ScatterPlot from './components/ScatterPlot';
import { loadCSVData, getUniqueYears } from './utils/dataLoader';
import { DEFAULT_WEIGHTS, processDataWithWeights } from './utils/scoreCalculator';

function App() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [years, setYears] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeView, setActiveView] = useState('map');
  const [usePersonalized, setUsePersonalized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    loadCSVData()
      .then(data => {
        setRawData(data);
        const uniqueYears = getUniqueYears(data);
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[uniqueYears.length - 1]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Process data with weights
  useEffect(() => {
    if (rawData.length > 0) {
      const processed = processDataWithWeights(rawData, weights);
      setProcessedData(processed);
    }
  }, [rawData, weights]);

  const handleWeightsChange = useCallback((newWeights) => {
    setWeights(newWeights);
    setUsePersonalized(true);
  }, []);

  const handleCountryClick = useCallback((country) => {
    setSelectedCountry(country);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#666'
      }}>
        Loading Global Happiness Data...
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <h1 style={{
          margin: '0 0 4px 0',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Global Happiness Explorer
        </h1>
        <p style={{
          margin: 0,
          fontSize: '14px',
          opacity: 0.9
        }}>
          Redefine happiness based on your personal values • World Happiness Report 2005-2024
        </p>
      </motion.header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 400px',
        gridTemplateRows: 'auto 1fr',
        gap: '16px',
        padding: '16px',
        height: 'calc(100vh - 90px)',
        overflow: 'hidden'
      }}>
        {/* Weight Controls - Left Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ gridRow: '1 / 3' }}
        >
          <WeightControls
            weights={weights}
            onWeightsChange={handleWeightsChange}
          />
        </motion.div>

        {/* Timeline - Top Center */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Timeline
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </motion.div>

        {/* View Tabs - Top Right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveView('map')}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeView === 'map' ? '#2196f3' : '#f0f0f0',
                color: activeView === 'map' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              🗺️ Map
            </button>
            <button
              onClick={() => setActiveView('ranking')}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeView === 'ranking' ? '#2196f3' : '#f0f0f0',
                color: activeView === 'ranking' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              📊 Rankings
            </button>
            <button
              onClick={() => setActiveView('scatter')}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeView === 'scatter' ? '#2196f3' : '#f0f0f0',
                color: activeView === 'scatter' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              📈 GDP vs Happiness
            </button>
          </div>

          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={usePersonalized}
                onChange={(e) => setUsePersonalized(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Use Personalized Scores</span>
            </label>
          </div>
        </motion.div>

        {/* Main View - Center */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                <WorldMap
                  data={processedData}
                  selectedYear={selectedYear}
                  onCountryClick={handleCountryClick}
                  usePersonalized={usePersonalized}
                />
              </motion.div>
            )}

            {activeView === 'ranking' && (
              <motion.div
                key="ranking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                <RankingTable
                  data={processedData}
                  selectedYear={selectedYear}
                  onCountryClick={handleCountryClick}
                  usePersonalized={usePersonalized}
                />
              </motion.div>
            )}

            {activeView === 'scatter' && (
              <motion.div
                key="scatter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ScatterPlot
                  data={processedData}
                  selectedYear={selectedYear}
                  onCountryClick={handleCountryClick}
                  usePersonalized={usePersonalized}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Panel - Right Sidebar */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }}
        >
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            About This Project
          </h3>

          <div style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#666',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Core Insight:</strong> There is no universal definition of happiness. This interactive dashboard lets you redefine happiness based on your personal values.
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>6 Happiness Factors:</strong> GDP per Capita, Social Support, Healthy Life Expectancy, Freedom, Generosity, and Corruption Perception.
            </p>
            <p style={{ margin: 0 }}>
              Adjust the weight sliders to see how country rankings change based on what matters most to you.
            </p>
          </div>

          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🎯 Key Questions
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#666'
            }}>
              <li>How do rankings change with different value priorities?</li>
              <li>Which countries achieve high happiness with moderate GDP?</li>
              <li>How has global happiness evolved from 2005-2024?</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Country Detail Drawer */}
      <CountryDrawer
        country={selectedCountry}
        data={processedData}
        selectedYear={selectedYear}
        isOpen={!!selectedCountry}
        onClose={handleCloseDrawer}
        usePersonalized={usePersonalized}
      />
    </div>
  );
}

export default App;
