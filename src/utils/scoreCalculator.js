// Factors used in happiness calculation
export const FACTORS = [
  'GDP_per_Capita',
  'Social_Support',
  'Healthy_Life_Expectancy',
  'Freedom',
  'Generosity',
  'Corruption_Perception'
];

// Default equal weights
export const DEFAULT_WEIGHTS = {
  GDP_per_Capita: 16.67,
  Social_Support: 16.67,
  Healthy_Life_Expectancy: 16.67,
  Freedom: 16.67,
  Generosity: 16.67,
  Corruption_Perception: 16.67
};

// Preset weight configurations
export const PRESETS = {
  equal: {
    GDP_per_Capita: 16.67,
    Social_Support: 16.67,
    Healthy_Life_Expectancy: 16.67,
    Freedom: 16.67,
    Generosity: 16.67,
    Corruption_Perception: 16.67
  },
  freedom: {
    GDP_per_Capita: 10,
    Social_Support: 15,
    Healthy_Life_Expectancy: 15,
    Freedom: 35,
    Generosity: 15,
    Corruption_Perception: 10
  },
  health: {
    GDP_per_Capita: 10,
    Social_Support: 20,
    Healthy_Life_Expectancy: 40,
    Freedom: 10,
    Generosity: 10,
    Corruption_Perception: 10
  },
  wealth: {
    GDP_per_Capita: 40,
    Social_Support: 15,
    Healthy_Life_Expectancy: 15,
    Freedom: 10,
    Generosity: 10,
    Corruption_Perception: 10
  },
  social: {
    GDP_per_Capita: 10,
    Social_Support: 40,
    Healthy_Life_Expectancy: 15,
    Freedom: 15,
    Generosity: 10,
    Corruption_Perception: 10
  },
  ethics: {
    GDP_per_Capita: 10,
    Social_Support: 15,
    Healthy_Life_Expectancy: 10,
    Freedom: 15,
    Generosity: 25,
    Corruption_Perception: 25
  },
  balanced: {
    GDP_per_Capita: 20,
    Social_Support: 20,
    Healthy_Life_Expectancy: 20,
    Freedom: 20,
    Generosity: 10,
    Corruption_Perception: 10
  }
};

// Normalize values to 0-1 range for each factor
export function normalizeData(data, factor) {
  const values = data.map(d => d[factor]).filter(v => !isNaN(v));
  const min = Math.min(...values);
  const max = Math.max(...values);

  return data.map(d => ({
    ...d,
    [`${factor}_normalized`]: max === min ? 0 : (d[factor] - min) / (max - min)
  }));
}

// Calculate personalized happiness score
export function calculatePersonalizedScore(dataPoint, weights) {
  let weightedSum = 0;
  let totalWeight = 0;

  FACTORS.forEach(factor => {
    const normalizedFactor = `${factor}_normalized`;
    if (!isNaN(dataPoint[normalizedFactor])) {
      weightedSum += dataPoint[normalizedFactor] * (weights[factor] || 0);
      totalWeight += (weights[factor] || 0);
    }
  });

  // Scale to 0-10 range
  return totalWeight > 0 ? (weightedSum / totalWeight) * 10 : 0;
}

// Process all data with personalized scores
export function processDataWithWeights(data, weights) {
  // First normalize all factors
  let processedData = [...data];
  FACTORS.forEach(factor => {
    processedData = normalizeData(processedData, factor);
  });

  // Calculate personalized scores
  processedData = processedData.map(d => ({
    ...d,
    Personalized_Score: calculatePersonalizedScore(d, weights)
  }));

  return processedData;
}

// Get rankings for a specific year
export function getRankings(data, year, usePersonalized = false) {
  const yearData = data.filter(d => d.Year === year);
  const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';

  return yearData
    .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0))
    .map((d, index) => ({
      ...d,
      rank: index + 1
    }));
}

// Calculate year-over-year change
export function calculateYOYChange(data, country, year, usePersonalized = false) {
  const scoreField = usePersonalized ? 'Personalized_Score' : 'Happiness_Score';
  const currentYear = data.find(d => d.Country === country && d.Year === year);
  const previousYear = data.find(d => d.Country === country && d.Year === year - 1);

  if (currentYear && previousYear) {
    return currentYear[scoreField] - previousYear[scoreField];
  }

  return null;
}
