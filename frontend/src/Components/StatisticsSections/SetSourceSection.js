import React from 'react';
import Select from 'react-select';
import ChartTable from '../ChartTable';
import { calculateSetSourceData } from '../../utils/subStatisticsCalculations';
import { prepareSubChartData } from '../../utils/subChartDataHelpers';
import styles from '../../Styles/Pages/SubStatisticsPage.module.css';

const SetSourceSection = ({
  setData,
  sourceData,
  setSourceComboData,
  isSetSelected,
  isSourceSelected,
  isSpecificSelected,
  selectedSource,
  selectedSet,
  setSelectedSource,
  setSelectedSet,
}) => {
  const calculations = calculateSetSourceData(null, 3.5);

  const renderDropdown = () => {
    if (isSpecificSelected) {
      if (isSetSelected) {
        const sources = [...new Set(setSourceComboData.map(item => item.where))].map(source => ({
          value: source,
          label: source,
        }));
        return (
          <div className={styles.select_container}>
            <Select
              value={sources.find(option => option.value === selectedSource)}
              onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : '')}
              options={sources}
              placeholder="Select or type to search Source"
              isClearable
              classNamePrefix="select"
            />
          </div>
        );
      } else if (isSourceSelected) {
        const sets = [...new Set(setSourceComboData.map(item => item.set))].map(set => ({
          value: set,
          label: set,
        }));
        return (
          <div className={styles.select_container}>
            <Select
              value={sets.find(option => option.value === selectedSet)}
              onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : '')}
              options={sets}
              placeholder="Select or type to search Set"
              isClearable
              classNamePrefix="select"
            />
          </div>
        );
      }
    }
    return null;
  };

  let chartdata = [];
  let tabledata = [];
  let title = '';

  if (isSpecificSelected) {
    if (isSetSelected && selectedSource) {
      chartdata = calculations.prepareChartSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
      tabledata = calculations.prepareTableSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
      title = `Set Distribution for Source: ${selectedSource}`;
    } else if (isSourceSelected && selectedSet) {
      chartdata = calculations.prepareSourceSpecificData(setSourceComboData.filter(item => item.set === selectedSet));
      tabledata = calculations.prepareSourceSpecificData(setSourceComboData.filter(item => item.set === selectedSet));
      title = `Source Distribution for Set: ${selectedSet}`;
    }
  } else {
    if (isSetSelected && isSourceSelected) {
      tabledata = calculations.prepareTableSetSourceComboData(setSourceComboData);
      chartdata = calculations.prepareChartSetSourceComboData(setSourceComboData);
      title = 'Set and Source Distribution';
    } else if (isSetSelected) {
      chartdata = calculations.prepareChartSetData(setData);
      tabledata = calculations.prepareTableSetData(setData);
      title = 'Set Distribution';
    } else if (isSourceSelected) {
      chartdata = calculations.prepareSourceData(sourceData);
      tabledata = calculations.prepareSourceData(sourceData);
      title = 'Source Distribution';
    }
  }

  return (
    <>
      {renderDropdown()}
      {(isSetSelected || isSourceSelected) && (
        <ChartTable
          chartType="pie"
          chartData={prepareSubChartData(chartdata, 'label', 'percentage')}
          tableData={tabledata}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      )}
    </>
  );
};

export default SetSourceSection;
