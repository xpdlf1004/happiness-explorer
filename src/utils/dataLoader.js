export async function loadCSVData() {
  const response = await fetch('/data.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      const value = values[i];
      obj[header] = isNaN(value) ? value : parseFloat(value);
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
