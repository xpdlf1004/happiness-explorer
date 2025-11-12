import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, GradientTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

function Globe({ data, selectedYear, usePersonalized }) {
  const meshRef = useRef();
  const [worldData, setWorldData] = useState(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      });
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const countryMeshes = useRef([]);

  const [countryLabels, setCountryLabels] = useState([]);

  useEffect(() => {
    if (!worldData || !data) return;

    const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
    const scores = data.filter(d => d.Year === selectedYear).map(d => d[scoreField]);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.min(...scores), Math.max(...scores)]);

    // Comprehensive country name mapping from World Atlas to CSV data
    const countryNameMap = {
      'United States of America': 'United States',
      'United Kingdom': 'United Kingdom',
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
      'Spain': 'Spain',
      'Argentina': 'Argentina',
      'Chile': 'Chile',
      'Colombia': 'Colombia',
      'Peru': 'Peru',
      'Venezuela': 'Venezuela',
      'Netherlands': 'Netherlands',
      'Belgium': 'Belgium',
      'Switzerland': 'Switzerland',
      'Austria': 'Austria',
      'Sweden': 'Sweden',
      'Norway': 'Norway',
      'Denmark': 'Denmark',
      'Finland': 'Finland',
      'Poland': 'Poland',
      'Czech Republic': 'Czech Republic',
      'Czechia': 'Czech Republic',
      'Hungary': 'Hungary',
      'Romania': 'Romania',
      'Greece': 'Greece',
      'Portugal': 'Portugal',
      'Turkey': 'Turkey',
      'Egypt': 'Egypt',
      'Nigeria': 'Nigeria',
      'Kenya': 'Kenya',
      'Ethiopia': 'Ethiopia',
      'Tanzania': 'Tanzania',
      'Uganda': 'Uganda',
      'Morocco': 'Morocco',
      'Algeria': 'Algeria',
      'Saudi Arabia': 'Saudi Arabia',
      'United Arab Emirates': 'United Arab Emirates',
      'Israel': 'Israel',
      'Jordan': 'Jordan',
      'Lebanon': 'Lebanon',
      'Iraq': 'Iraq',
      'Iran': 'Iran',
      'Pakistan': 'Pakistan',
      'Bangladesh': 'Bangladesh',
      'Thailand': 'Thailand',
      'Vietnam': 'Vietnam',
      'Malaysia': 'Malaysia',
      'Singapore': 'Singapore',
      'Philippines': 'Philippines',
      'Indonesia': 'Indonesia',
      'New Zealand': 'New Zealand',
      'Ireland': 'Ireland',
      'Iceland': 'Iceland'
    };

    // Fallback: try direct name match if not in mapping
    const getCountryName = (atlasName) => {
      if (countryNameMap[atlasName]) {
        return countryNameMap[atlasName];
      }
      // Try to find exact match in data
      const exactMatch = data.find(d => d.Country === atlasName && d.Year === selectedYear);
      return exactMatch ? atlasName : null;
    };

    const countryCenters = {
      'United States': [-95, 37],
      'United Kingdom': [-3, 54],
      'South Africa': [24, -29],
      'China': [104, 35],
      'India': [78, 20],
      'Brazil': [-47, -14],
      'France': [2, 46],
      'Germany': [10, 51],
      'Canada': [-106, 56],
      'Australia': [133, -27],
      'Japan': [138, 36],
      'South Korea': [127, 37],
      'Mexico': [-102, 23],
      'Russia': [105, 61],
      'Italy': [12, 42],
      'Spain': [-4, 40],
      'Argentina': [-63, -38],
      'Chile': [-71, -30],
      'Colombia': [-74, 4],
      'Peru': [-75, -9],
      'Venezuela': [-66, 6],
      'Netherlands': [5, 52],
      'Belgium': [4, 50],
      'Switzerland': [8, 46],
      'Austria': [14, 47],
      'Sweden': [18, 60],
      'Norway': [8, 60],
      'Denmark': [9, 56],
      'Finland': [25, 61],
      'Poland': [19, 51],
      'Czech Republic': [15, 49],
      'Hungary': [19, 47],
      'Romania': [24, 45],
      'Greece': [21, 39],
      'Portugal': [-8, 39],
      'Turkey': [35, 38],
      'Egypt': [30, 26],
      'Nigeria': [8, 9],
      'Kenya': [37, -0],
      'Ethiopia': [40, 9],
      'Tanzania': [34, -6],
      'Uganda': [32, 1],
      'Morocco': [-7, 31],
      'Algeria': [1, 28],
      'Saudi Arabia': [45, 23],
      'United Arab Emirates': [53, 23],
      'Israel': [34, 31],
      'Jordan': [36, 30],
      'Lebanon': [35, 33],
      'Iraq': [43, 33],
      'Iran': [53, 32],
      'Pakistan': [69, 30],
      'Bangladesh': [90, 23],
      'Thailand': [100, 15],
      'Vietnam': [108, 14],
      'Malaysia': [101, 4],
      'Singapore': [103, 1],
      'Philippines': [121, 12],
      'Indonesia': [113, -0],
      'New Zealand': [174, -40],
      'Ireland': [-8, 53],
      'Iceland': [-19, 64]
    };

    const labels = [];
    const meshes = [];

    worldData.features.forEach(feature => {
      const countryName = getCountryName(feature.properties.name);
      if (!countryName) return;

      const countryData = data.find(item =>
        item.Country === countryName && item.Year === selectedYear
      );

      if (!countryData) return;

      const color = colorScale(countryData[scoreField]);

      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(coords => {
          const points = coords.map(([lon, lat]) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const radius = 2.01;
            return new THREE.Vector3(
              -radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.cos(phi),
              radius * Math.sin(phi) * Math.sin(theta)
            );
          });

          if (points.length >= 3) {
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
              color: color,
              linewidth: 2,
              transparent: true,
              opacity: 0.8
            });
            const line = new THREE.Line(geometry, material);
            meshes.push(line);
          }
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          polygon.forEach(coords => {
            const points = coords.map(([lon, lat]) => {
              const phi = (90 - lat) * (Math.PI / 180);
              const theta = (lon + 180) * (Math.PI / 180);
              const radius = 2.01;
              return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
              );
            });

            if (points.length >= 3) {
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 2,
                transparent: true,
                opacity: 0.8
              });
              const line = new THREE.Line(geometry, material);
              meshes.push(line);
            }
          });
        });
      }

      const center = countryCenters[countryName];
      if (center) {
        const [lon, lat] = center;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const radius = 2.15;
        const position = [
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ];
        labels.push({ name: countryName, position });
      }
    });

    countryMeshes.current.forEach(mesh => {
      if (mesh.parent) mesh.parent.remove(mesh);
    });
    countryMeshes.current = meshes;

    if (meshRef.current) {
      meshes.forEach(mesh => meshRef.current.add(mesh));
    }

    setCountryLabels(labels);

  }, [worldData, data, selectedYear, usePersonalized]);

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

      {countryLabels.map((label, index) => (
        <Text
          key={index}
          position={label.position}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label.name}
        </Text>
      ))}
    </group>
  );
}

const Globe3D = ({ data, selectedYear, usePersonalized = false }) => {
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
