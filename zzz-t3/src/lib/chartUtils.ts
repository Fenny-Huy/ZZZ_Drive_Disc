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
export const prepareChartData = (data: any[], labelKey: string, valueKey: string) => {
  // Sort data in descending order based on the value
  const sortedData = [...data].sort((a, b) => b[valueKey] - a[valueKey]);

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
export const prepareLevelingChartData = (data: any[], labelKey: string, valueKeys: string[]) => {
  // Sort data in descending order based on the first value key
  const sortKey = valueKeys[0];
  const sortedData = sortKey 
    ? [...data].sort((a, b) => b[sortKey] - a[sortKey])
    : [...data];

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
export const transformMainStatData = (typeData: any[], mainStatData: any[], selectedChart: string) => {
  if (selectedChart === 'Types') {
    // typeData is already in the format { substat, percentage, count } from our new API
    return typeData;
  }
  
  // mainStatData is array of { type, substat, percentage, count }
  return mainStatData.filter(item => item.type === selectedChart);
};
