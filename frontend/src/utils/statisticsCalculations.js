import { keysConfig } from '../config/config';

/**
 * Creates mapping objects from keysConfig for different data transformations
 */
export const createMappings = () => {
  const substatKeyToMainStat = {};
  const levelingSubstatKeyToMainStat = {};
  const substatToLevelingKeys = {};
  const addedToMainStatKey = {};

  keysConfig.forEach(mapping => {
    const [subKey, rollKey, addedKey, value] = mapping;
    if (subKey) substatKeyToMainStat[subKey] = value;
    if (rollKey) levelingSubstatKeyToMainStat[rollKey] = value;
    if (subKey && rollKey) substatToLevelingKeys[subKey] = rollKey;
    if (addedKey) addedToMainStatKey[addedKey] = value;
  });

  return {
    substatKeyToMainStat,
    levelingSubstatKeyToMainStat,
    substatToLevelingKeys,
    addedToMainStatKey,
  };
};

/**
 * Calculates overall leveling statistics
 */
export const calculateLevelingOverall = (levelingData) => {
  const mappings = createMappings();
  const {
    substatKeyToMainStat,
    levelingSubstatKeyToMainStat,
    substatToLevelingKeys,
    addedToMainStatKey,
  } = mappings;

  // Calculate substat totals
  const substatTotals = levelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('sub_') && item.main_stat !== substatKeyToMainStat[key]) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  // Calculate total substat counts
  const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
    acc[key] = levelingData.reduce((sum, item) => {
      if (item.main_stat !== substatKeyToMainStat[key]) {
        return sum + item.substatCount;
      }
      return sum;
    }, 0);
    return acc;
  }, {});

  // Calculate leveling counts
  const levelingCount = levelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('roll_') && item.main_stat !== levelingSubstatKeyToMainStat[key]) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  // Calculate total leveling counts
  const totalLevelingCount = Object.keys(levelingSubstatKeyToMainStat).reduce((acc, key) => {
    acc[key] = levelingData.reduce((sum, item) => {
      if (item.main_stat !== levelingSubstatKeyToMainStat[key]) {
        return sum + item.TotalRoll;
      }
      return sum;
    }, 0);
    return acc;
  }, {});

  // Create substat distribution
  const substatDistribution = Object.keys(substatTotals).map(key => ({
    substat: substatKeyToMainStat[key],
    appearancePercentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
    rollPercentage: (levelingCount[substatToLevelingKeys[key]] / totalLevelingCount[substatToLevelingKeys[key]]) * 100,
    substatcount: substatTotals[key],
    rollcount: levelingCount[substatToLevelingKeys[key]],
  }));

  // Calculate added substat distribution
  const addedSubstatDistribution = levelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('added_')) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  const totalAdded = levelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('added_') && item.main_stat !== addedToMainStatKey[key]) {
        acc = (acc || 0) + item[key];
      }
    });
    return acc;
  }, 0);

  const addedSubstatData = Object.keys(addedSubstatDistribution).map(key => ({
    substat: addedToMainStatKey[key],
    percentage: (addedSubstatDistribution[key] / totalAdded) * 100,
    count: addedSubstatDistribution[key],
  }));

  return {
    substatDistribution,
    addedSubstatData,
  };
};

/**
 * Calculates specific leveling statistics for filtered data
 */
export const calculateLevelingSpecific = (levelingData, selectedType, selectedMainStat) => {
  const mappings = createMappings();
  const {
    substatKeyToMainStat,
    levelingSubstatKeyToMainStat,
    substatToLevelingKeys,
    addedToMainStatKey,
  } = mappings;

  const filteredLevelingData = levelingData.filter(
    item => item.type === selectedType && item.main_stat === selectedMainStat
  );

  // Calculate substat totals for filtered data
  const substatTotals = filteredLevelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('sub_')) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  // Calculate total substat counts for filtered data
  const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
    acc[key] = filteredLevelingData.reduce((sum, item) => {
      return sum + item.substatCount;
    }, 0);
    return acc;
  }, {});

  // Calculate leveling counts for filtered data
  const levelingCount = filteredLevelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('roll_')) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  // Calculate total leveling counts for filtered data
  const totalLevelingCount = Object.keys(levelingSubstatKeyToMainStat).reduce((acc, key) => {
    acc[key] = filteredLevelingData.reduce((sum, item) => {
      return sum + item.TotalRoll;
    }, 0);
    return acc;
  }, {});

  // Create substat distribution for filtered data
  const substatDistribution = Object.keys(substatTotals).map(key => ({
    substat: substatKeyToMainStat[key],
    appearancePercentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
    rollPercentage: (levelingCount[substatToLevelingKeys[key]] / totalLevelingCount[substatToLevelingKeys[key]]) * 100,
    substatcount: substatTotals[key],
    rollcount: levelingCount[substatToLevelingKeys[key]],
  }));

  // Calculate added substat distribution for filtered data
  const addedSubstatDistribution = filteredLevelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('added_')) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  const totalAdded = filteredLevelingData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('added_') && item.main_stat !== addedToMainStatKey[key]) {
        acc = (acc || 0) + item[key];
      }
    });
    return acc;
  }, 0);

  const addedSubstatData = Object.keys(addedSubstatDistribution).map(key => ({
    substat: addedToMainStatKey[key],
    percentage: (addedSubstatDistribution[key] / totalAdded) * 100,
    count: addedSubstatDistribution[key],
  }));

  return {
    substatDistribution,
    addedSubstatData,
  };
};

/**
 * Calculates overall substat statistics
 */
export const calculateSubstatOverall = (substatData) => {
  const { substatKeyToMainStat } = createMappings();

  const substatTotals = substatData.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key.startsWith('sub_') && item.main_stat !== substatKeyToMainStat[key]) {
        acc[key] = (acc[key] || 0) + item[key];
      }
    });
    return acc;
  }, {});

  const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
    acc[key] = substatData.reduce((sum, item) => {
      if (item.main_stat !== substatKeyToMainStat[key]) {
        return sum + item.ArtifactCount;
      }
      return sum;
    }, 0);
    return acc;
  }, {});

  const substatDistribution = Object.keys(substatTotals).map(key => ({
    substat: substatKeyToMainStat[key],
    percentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
    count: substatTotals[key],
  }));

  return substatDistribution;
};

/**
 * Calculates specific substat statistics for selected type and main stat
 */
export const calculateSubstatSpecific = (substatData, selectedType, selectedMainStat) => {
  const { substatKeyToMainStat } = createMappings();

  const data = substatData.find(
    item => item.type === selectedType && item.main_stat === selectedMainStat
  );

  if (!data) {
    return [];
  }

  const substatDistribution = Object.keys(data)
    .filter(key => key.startsWith('sub_'))
    .map(key => ({
      substat: substatKeyToMainStat[key],
      percentage: (data[key] / data.substatCount) * 100,
      count: data[key],
    }));

  return substatDistribution;
};

/**
 * Gets unique types from leveling data
 */
export const getUniqueTypes = (levelingData) => {
  return levelingData
    .map(item => item.type)
    .filter((value, index, self) => self.indexOf(value) === index);
};

/**
 * Gets unique main stats for a specific type from leveling data
 */
export const getUniqueMainStats = (levelingData, selectedType) => {
  return levelingData
    .filter(item => item.type === selectedType)
    .map(item => item.main_stat)
    .filter((value, index, self) => self.indexOf(value) === index);
};
