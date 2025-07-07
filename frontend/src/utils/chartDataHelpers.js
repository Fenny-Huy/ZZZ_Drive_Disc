/**
 * Modern color palette for charts
 */
const CHART_COLORS = [
  '#667eea',  // Primary blue
  '#764ba2',  // Primary purple
  '#f093fb',  // Light pink
  '#f5576c',  // Coral red
  '#4facfe',  // Sky blue
  '#00f2fe',  // Cyan
  '#43e97b',  // Green
  '#38f9d7',  // Mint
  '#ffecd2',  // Peach
  '#fcb69f',  // Light orange
  '#a8edea',  // Aqua
  '#fed6e3',  // Light pink
  '#d299c2',  // Lavender
  '#fef9d7',  // Light yellow
  '#edf4ff',  // Very light blue
];

const LEVELING_CHART_COLORS = [
  '#667eea',  // Primary blue
  '#764ba2',  // Primary purple
  '#f093fb',  // Light pink
  '#f5576c',  // Coral red
  '#4facfe',  // Sky blue
  '#00f2fe',  // Cyan
  '#43e97b',  // Green
  '#38f9d7',  // Mint
];

/**
 * Prepares chart data for pie and bar charts
 */
export const prepareChartData = (data, labelKey, valueKey) => {
  // Sort data in descending order based on the value
  const sortedData = data.sort((a, b) => b[valueKey] - a[valueKey]);

  return {
    labels: sortedData.map(item => item[labelKey]),
    datasets: [
      {
        data: sortedData.map(item => item[valueKey]),
        backgroundColor: CHART_COLORS.slice(0, sortedData.length),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff',
      },
    ],
  };
};

/**
 * Prepares chart data for leveling statistics with multiple value keys
 */
export const prepareLevelingChartData = (data, labelKey, valueKeys) => {
  // Sort data in descending order based on the first value key
  const sortedData = data.sort((a, b) => b[valueKeys[0]] - a[valueKeys[0]]);

  return {
    labels: sortedData.map(item => item[labelKey]),
    datasets: valueKeys.map((key, index) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      data: sortedData.map(item => item[key]),
      backgroundColor: LEVELING_CHART_COLORS[index % LEVELING_CHART_COLORS.length],
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#fff',
    })),
  };
};

/**
 * Transforms type data for chart display
 */
export const transformMainStatData = (typeData, mainStatData, selectedChart) => {
  if (selectedChart === 'Types') {
    return typeData.map(item => ({ 
      substat: item[0], 
      percentage: item[1], 
      count: item[2] 
    }));
  }
  
  return mainStatData
    .filter(item => item[0] === selectedChart)
    .map(item => ({ 
      substat: item[1], 
      percentage: item[2], 
      count: item[3] 
    }));
};
