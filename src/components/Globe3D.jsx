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

    const countryCenters = {
      'USA': [-95, 37],
      'UK': [-3, 54],
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
      'Spain': [-4, 40]
    };

    const labels = [];
    const meshes = [];

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
