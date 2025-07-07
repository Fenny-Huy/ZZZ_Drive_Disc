// SubStatistics calculation utilities

// Set/Source calculations
export const calculateSetSourceData = (data, combineCap = 3.5) => {
  const prepareTableSetData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.set,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartSetData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));

    const other = {
      label: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareSourceData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where,
      substat: item.where,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartSetSpecificData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set,
      substat: item.set,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));

    const other = {
      label: 'Other',
      substat: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareTableSetSpecificData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.set,
      substat: item.set,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareSourceSpecificData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where,
      substat: item.where,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareTableSetSourceComboData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.set} - ${item.where}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartSetSourceComboData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: `${item.set} - ${item.where}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));

    const other = {
      label: 'Other',
      substat: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  return {
    prepareTableSetData,
    prepareChartSetData,
    prepareSourceData,
    prepareChartSetSpecificData,
    prepareTableSetSpecificData,
    prepareSourceSpecificData,
    prepareTableSetSourceComboData,
    prepareChartSetSourceComboData,
  };
};

// Score calculations
export const calculateScoreData = (combineCap = 4) => {
  const prepareTableScoreData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareTableScoreSetData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.set} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreSetData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: `${item.set} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));

    const other = {
      label: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareTableScoreSourceData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.where} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreSourceData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: `${item.where} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));

    const other = {
      label: 'Other',
      percentage: 0,
      count: 0,
    };

    const filteredData = processedData.filter(item => {
      if (item.percentage < combineCap) {
        other.percentage += item.percentage;
        other.count += item.count;
        return false;
      }
      return true;
    });

    if (other.count > 0) {
      filteredData.push(other);
    }

    return filteredData;
  };

  const prepareScoreSetSpecificData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareScoreSourceSpecificData = (data) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const separateDataOfScoreSet = (data, string) => {
    if (string) {
      const filteredData = data.filter(item => item.where === string);
      const aggregatedData = filteredData.reduce((acc, item) => {
        const existing = acc.find(i => i.score === item.score);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ score: item.score, count: item.count });
        }
        return acc;
      }, []);
      return aggregatedData;
    }
    return [];
  };

  const separateDataOfScoreSource = (data, string) => {
    if (string) {
      const filteredData = data.filter(item => item.set === string);
      const aggregatedData = filteredData.reduce((acc, item) => {
        const existing = acc.find(i => i.score === item.score);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ score: item.score, count: item.count });
        }
        return acc;
      }, []);
      return aggregatedData;
    }
    return [];
  };

  return {
    prepareTableScoreData,
    prepareChartScoreData,
    prepareTableScoreSetData,
    prepareChartScoreSetData,
    prepareTableScoreSourceData,
    prepareChartScoreSourceData,
    prepareScoreSetSpecificData,
    prepareScoreSourceSpecificData,
    separateDataOfScoreSet,
    separateDataOfScoreSource,
  };
};

// Leveling Investment calculations
export const calculateLevelingInvestmentData = (levelingInvestmentData) => {
  const getUniqueTypes = () => {
    const types = [...new Set(levelingInvestmentData.map(item => item.type))];
    return types;
  };

  const getUniqueSets = () => {
    const sets = [...new Set(levelingInvestmentData.map(item => item.set))];
    return sets.sort();
  };

  const getTypeData = (type) => {
    const filteredData = levelingInvestmentData.filter(item => item.type === type);
    const total = filteredData.reduce((sum, item) => sum + item.TotalRoll, 0);
    return filteredData.map(item => ({
      substat: item.set,
      label: item.set,
      percentage: (item.TotalRoll / total) * 100,
      count: item.TotalRoll,
      artifactCount: item.ArtifactCount
    }));
  };

  const getAllTypeData = () => {
    // Group all data by set, summing up total rolls across all types
    const groupedData = levelingInvestmentData.reduce((acc, item) => {
      const existing = acc.find(i => i.set === item.set);
      if (existing) {
        existing.TotalRoll += item.TotalRoll;
        existing.ArtifactCount += item.ArtifactCount;
      } else {
        acc.push({
          set: item.set,
          TotalRoll: item.TotalRoll,
          ArtifactCount: item.ArtifactCount
        });
      }
      return acc;
    }, []);

    const total = groupedData.reduce((sum, item) => sum + item.TotalRoll, 0);
    return groupedData.map(item => ({
      substat: item.set,
      label: item.set,
      percentage: (item.TotalRoll / total) * 100,
      count: item.TotalRoll,
      artifactCount: item.ArtifactCount
    }));
  };

  const getSetData = (set) => {
    const filteredData = levelingInvestmentData.filter(item => item.set === set);
    const total = filteredData.reduce((sum, item) => sum + item.TotalRoll, 0);
    return filteredData.map(item => ({
      substat: item.type,
      label: item.type,
      percentage: (item.TotalRoll / total) * 100,
      count: item.TotalRoll,
      artifactCount: item.ArtifactCount
    }));
  };

  return {
    getUniqueTypes,
    getUniqueSets,
    getTypeData,
    getAllTypeData,
    getSetData,
  };
};
