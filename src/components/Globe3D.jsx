import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

function Globe({ data, selectedYear, onCountryClick, usePersonalized }) {
  const meshRef = useRef();
  const [worldData, setWorldData] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const { camera, raycaster, gl } = useThree();

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      });
  }, []);

  useFrame(() => {
    if (meshRef.current && !hoveredCountry) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  const countryMeshes = useRef([]);

  useEffect(() => {
    if (!worldData || !data) return;

    countryMeshes.current.forEach(mesh => {
      if (mesh.parent) mesh.parent.remove(mesh);
    });
    countryMeshes.current = [];

    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const scores = data.filter(d => d.Year === selectedYear).map(d => d[scoreField]);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.min(...scores), Math.max(...scores)]);

    const countryNameMap = {
      'United States of America': 'USA',
      'United Kingdom': 'UK',
      'South Africa': 'South Africa',
      'China': 'China',
      'India': 'India',
      'Brazil': 'Brazil',
      'France': 'France',
      'Germany': 'Germany',
      'Canada': 'Canada',
      'Australia': 'Australia',
      'Japan': 'Japan',
      'South Korea': 'South Korea',
      'Mexico': 'Mexico',
      'Russia': 'Russia',
      'Italy': 'Italy',
      'Spain': 'Spain'
    };

    worldData.features.forEach(feature => {
      const countryName = countryNameMap[feature.properties.name];
      if (!countryName) return;

      const countryData = data.find(item =>
        item.Country === countryName && item.Year === selectedYear
      );

      if (!countryData) return;

      const color = colorScale(countryData[scoreField]);

      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(coords => {
          createCountryShape(coords, color, countryName, countryData);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          polygon.forEach(coords => {
            createCountryShape(coords, color, countryName, countryData);
          });
        });
      }
    });

  }, [worldData, data, selectedYear, usePersonalized]);

  const createCountryShape = (coordinates, color, countryName, countryData) => {
    const points = coordinates.map(([lon, lat]) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const radius = 2.01;

      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    });

    if (points.length < 3) return;

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });

    const line = new THREE.Line(geometry, material);
    line.userData = { countryName, countryData };

    if (meshRef.current) {
      meshRef.current.add(line);
      countryMeshes.current.push(line);
    }
  };

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#1a1a2e"
          emissive="#0f0f1e"
          emissiveIntensity={0.2}
          shininess={30}
        >
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={['#1a1a2e', '#16213e', '#0f3460']}
          />
        </meshPhongMaterial>
      </Sphere>

      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#4fa3d1"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

const Globe3D = ({ data, selectedYear, onCountryClick, usePersonalized = false }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: {} });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0a0a0a' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4fa3d1" />

        <Globe
          data={data}
          selectedYear={selectedYear}
          onCountryClick={onCountryClick}
          usePersonalized={usePersonalized}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          rotateSpeed={0.5}
        />

        <Stars />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '16px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Happiness Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '100px',
            height: '10px',
            background: 'linear-gradient(to right, #ffffcc, #a1dab4, #41b6c4, #2c7fb8, #253494)',
            borderRadius: '2px'
          }}></div>
          <span style={{ fontSize: '10px' }}>Low → High</span>
        </div>
        <div style={{ marginTop: '12px', fontSize: '10px', opacity: 0.7 }}>
          🖱️ Drag to rotate • Scroll to zoom
        </div>
      </div>

      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            background: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            {tooltip.content.Country}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Score:</strong> {tooltip.content.score?.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
            Click for details
          </div>
        </div>
      )}
    </div>
  );
};

// Stars component for background
function Stars() {
  const count = 5000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}

export default Globe3D;
