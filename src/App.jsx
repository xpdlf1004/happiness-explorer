import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from './components/WorldMap';
import Globe3D from './components/Globe3D';
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
  const [activeView, setActiveView] = useState('region');
  const [mapView, setMapView] = useState('map');
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
        gridTemplateColumns: '320px 1fr 350px',
        gridTemplateRows: 'auto 1fr 1fr',
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
          style={{ gridRow: '1 / 4' }}
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
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => setActiveView('region')}
            style={{
              flex: 1,
              minWidth: '80px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              background: activeView === 'region' ? '#2196f3' : '#f0f0f0',
              color: activeView === 'region' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            🗺️ Region
          </button>
          <button
            onClick={() => setActiveView('scatter')}
            style={{
              flex: 1,
              minWidth: '80px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              background: activeView === 'scatter' ? '#2196f3' : '#f0f0f0',
              color: activeView === 'scatter' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            📊 Scatter
          </button>
          <button
            onClick={() => setActiveView('trends')}
            style={{
              flex: 1,
              minWidth: '80px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              background: activeView === 'trends' ? '#2196f3' : '#f0f0f0',
              color: activeView === 'trends' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            📈 Trends
          </button>
          <button
            onClick={() => setActiveView('distribution')}
            style={{
              flex: 1,
              minWidth: '80px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              background: activeView === 'distribution' ? '#2196f3' : '#f0f0f0',
              color: activeView === 'distribution' ? 'white' : '#666',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            📊 Distribution
          </button>
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
            overflow: 'hidden',
            position: 'relative',
            gridRow: '2 / 4'
          }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'region' && (
              <motion.div
                key="region"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                {/* 2D/3D Toggle inside map view */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  padding: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  display: 'flex',
                  gap: '6px'
                }}>
                  <button
                    onClick={() => setMapView('map')}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      background: mapView === 'map' ? '#2196f3' : '#f0f0f0',
                      color: mapView === 'map' ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => setMapView('globe')}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      background: mapView === 'globe' ? '#2196f3' : '#f0f0f0',
                      color: mapView === 'globe' ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    3D
                  </button>
                </div>

                {mapView === 'map' ? (
                  <WorldMap
                    data={processedData}
                    selectedYear={selectedYear}
                    onCountryClick={handleCountryClick}
                    usePersonalized={true}
                  />
                ) : (
                  <Globe3D
                    data={processedData}
                    selectedYear={selectedYear}
                    onCountryClick={handleCountryClick}
                    usePersonalized={true}
                  />
                )}
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
                  usePersonalized={true}
                />
              </motion.div>
            )}

            {activeView === 'trends' && (
              <motion.div
                key="trends"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}
              >
                Trends Chart - Coming Soon
              </motion.div>
            )}

            {activeView === 'distribution' && (
              <motion.div
                key="distribution"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}
              >
                Distribution Chart - Coming Soon
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Rankings - Right Bottom */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ gridRow: '2 / 4' }}
        >
          <RankingTable
            data={processedData}
            selectedYear={selectedYear}
            onCountryClick={handleCountryClick}
            usePersonalized={true}
          />
        </motion.div>
      </div>

      {/* Country Detail Drawer */}
      <CountryDrawer
        country={selectedCountry}
        data={processedData}
        selectedYear={selectedYear}
        isOpen={!!selectedCountry}
        onClose={handleCloseDrawer}
        usePersonalized={true}
      />
    </div>
  );
}

export default App;
