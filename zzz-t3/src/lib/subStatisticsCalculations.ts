// SubStatistics calculation utilities

interface SetData {
  set: string | null;
  count: number;
}

interface SourceData {
  where: string | null;
  count: number;
}

interface SetSourceComboData {
  set: string | null;
  where: string | null;
  count: number;
}

interface ChartData {
  label: string;
  substat?: string;
  percentage: number;
  count: number;
}

interface TableData {
  substat: string;
  percentage: number;
  count: number;
}

// Set/Source calculations
export const calculateSetSourceData = (combineCap = 3.5) => {
  const prepareTableSetData = (data: SetData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetData = (data: SetData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
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

  const prepareSourceData = (data: SourceData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where ?? 'Unknown',
      substat: item.where ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetSpecificData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: item.set ?? 'Unknown',
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
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
      filteredData.push(other as { label: string; substat: string; percentage: number; count: number });
    }

    return filteredData;
  };

  const prepareTableSetSpecificData = (data: SetSourceComboData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.set ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareSourceSpecificData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.where ?? 'Unknown',
      substat: item.where ?? 'Unknown',
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareTableSetSourceComboData = (data: SetSourceComboData[]): TableData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.set ?? 'Unknown'} - ${item.where ?? 'Unknown'}`,
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));
  };

  const prepareChartSetSourceComboData = (data: SetSourceComboData[]): ChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const processedData = data.map(item => ({
      label: `${item.set ?? 'Unknown'} - ${item.where ?? 'Unknown'}`,
      percentage: total ? (item.count / total) * 100 : 0,
      count: item.count,
    }));

    const other: ChartData = {
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

export const calculateScoreData = (combineCap = 4) => {
  const prepareTableScoreData = (data: { score: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreData = (data: { score: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareTableScoreSetData = (data: { score: string; set: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.set} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreSetData = (data: { score: string; set: string; count: number }[]) => {
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

  const prepareTableScoreSourceData = (data: { score: string; where: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      substat: `${item.where} - ${item.score}`,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareChartScoreSourceData = (data: { score: string; where: string; count: number }[]) => {
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

  const prepareScoreSetSpecificData = (data: { score: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const prepareScoreSourceSpecificData = (data: { score: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map(item => ({
      label: item.score,
      substat: item.score,
      percentage: (item.count / total) * 100,
      count: item.count,
    }));
  };

  const separateDataOfScoreSet = (data: { score: string; set: string; where: string; count: number }[], source: string) => {
    if (source) {
      const filteredData = data.filter(item => item.where === source);
      const aggregatedData = filteredData.reduce((acc, item) => {
        const existing = acc.find(i => i.score === item.score);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ score: item.score, count: item.count });
        }
        return acc;
      }, [] as { score: string; count: number }[]);
      return aggregatedData;
    }
    return [];
  };

  const separateDataOfScoreSource = (data: { score: string; set: string; where: string; count: number }[], set: string) => {
    if (set) {
      const filteredData = data.filter(item => item.set === set);
      const aggregatedData = filteredData.reduce((acc, item) => {
        const existing = acc.find(i => i.score === item.score);
        if (existing) {
          existing.count += item.count;
        } else {
          acc.push({ score: item.score, count: item.count });
        }
        return acc;
      }, [] as { score: string; count: number }[]);
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
export const calculateLevelingInvestmentData = (levelingInvestmentData: { type: string | null; set: string | null; artifactCount: number; totalRolls: number }[]) => {
  const getUniqueTypes = () => {
    const types = [...new Set(levelingInvestmentData.map(item => item.type))].filter(Boolean) as string[];
    return types;
  };

  const getUniqueSets = () => {
    const sets = [...new Set(levelingInvestmentData.map(item => item.set))].filter(Boolean) as string[];
    return sets.sort();
  };

  const getTypeData = (type: string) => {
    const filteredData = levelingInvestmentData.filter(item => item.type === type);
    const total = filteredData.reduce((sum, item) => sum + item.totalRolls, 0);
    return filteredData.map(item => ({
      substat: item.set,
      label: item.set,
      percentage: (item.totalRolls / total) * 100,
      count: item.totalRolls,
      artifactCount: item.artifactCount
    })).sort((a, b) => b.count - a.count);
  };

  const getAllTypeData = () => {
    // Group all data by set, summing up total rolls across all types
    const groupedData = levelingInvestmentData.reduce((acc, item) => {
      const existing = acc.find(i => i.set === item.set);
      if (existing) {
        existing.totalRolls += item.totalRolls;
        existing.artifactCount += item.artifactCount;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [] as typeof levelingInvestmentData);

    const total = groupedData.reduce((sum, item) => sum + item.totalRolls, 0);
    return groupedData.map(item => ({
      substat: item.set,
      label: item.set,
      percentage: (item.totalRolls / total) * 100,
      count: item.totalRolls,
      artifactCount: item.artifactCount
    })).sort((a, b) => b.count - a.count);
  };

  const getSetData = (set: string) => {
    const filteredData = levelingInvestmentData.filter(item => item.set === set);
    const total = filteredData.reduce((sum, item) => sum + item.totalRolls, 0);
    return filteredData.map(item => ({
      substat: item.type,
      label: item.type,
      percentage: (item.totalRolls / total) * 100,
      count: item.totalRolls,
      artifactCount: item.artifactCount
    })).sort((a, b) => b.count - a.count);
  };

  return {
    getUniqueTypes,
    getUniqueSets,
    getTypeData,
    getAllTypeData,
    getSetData,
  };
};
