export async function loadCSVData() {
  const response = await fetch('/data.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  // Map CSV headers to component-expected field names
  const headerMapping = {
    'year': 'Year',
    'country': 'Country',
    'region': 'Region',
    'happiness_score': 'Happiness_Score',
    'gdp_per_capita': 'GDP_per_Capita',
    'social_support': 'Social_Support',
    'healthy_life_expectancy': 'Healthy_Life_Expectancy',
    'freedom_to_make_life_choices': 'Freedom',
    'generosity': 'Generosity',
    'perceptions_of_corruption': 'Corruption_Perception'
  };

  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      const value = values[i];
      const mappedHeader = headerMapping[header] || header;
      obj[mappedHeader] = isNaN(value) ? value : parseFloat(value);
    });
    return obj;
  });

  return data;
}

export function getUniqueYears(data) {
  return [...new Set(data.map(d => d.Year))].sort((a, b) => a - b);
}

export function getUniqueCountries(data) {
  return [...new Set(data.map(d => d.Country))].sort();
}

export function getDataForYear(data, year) {
  return data.filter(d => d.Year === year);
}

export function getDataForCountry(data, country) {
  return data.filter(d => d.Country === country).sort((a, b) => a.Year - b.Year);
}
