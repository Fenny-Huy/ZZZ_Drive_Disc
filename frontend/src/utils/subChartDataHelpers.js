// Chart data preparation utilities for SubStatistics

export const prepareSubChartData = (data, labelKey, valueKey) => {
  // Sort data in descending order based on the value
  const sortedData = data.sort((a, b) => b[valueKey] - a[valueKey]);

  const colors = [
    '#FF0000',  // Bright red  
    '#00FF00',  // Bright green  
    '#0000FF',  // Bright blue  
    '#FFFF00',  // Bright yellow  
    '#FF00FF',  // Magenta  
    '#00FFFF',  // Cyan  
    '#FFA500',  // Orange  
    '#800080',  // Purple  
    '#008000',  // Dark green  
    '#000080',  // Navy blue  
    '#A52A2A',  // Brown  
    '#808080',  // Gray  
    '#FFC0CB',  // Pink  
    '#FFD700',  // Gold  
    '#008080',  // Teal  
  ];

  return {
    labels: sortedData.map(item => item[labelKey]),
    datasets: [
      {
        data: sortedData.map(item => item[valueKey]),
        backgroundColor: colors.slice(0, sortedData.length),
      },
    ],
  };
};
