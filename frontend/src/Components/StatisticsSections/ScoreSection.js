import React from 'react';
import Select from 'react-select';
import ChartTable from '../ChartTable';
import { calculateScoreData } from '../../utils/subStatisticsCalculations';
import { prepareSubChartData } from '../../utils/subChartDataHelpers';
import styles from '../../Styles/Pages/SubStatisticsPage.module.css';

const ScoreSection = ({
  scoreData,
  scoreSetData,
  scoreSourceData,
  scoreSetSourceData,
  isSetSelected,
  isSourceSelected,
  isSpecificSelected,
  selectedSource,
  selectedSet,
  setSelectedSource,
  setSelectedSet,
}) => {
  const calculations = calculateScoreData(4);

  const renderDropdown = () => {
    if (isSpecificSelected) {
      if (isSetSelected && !isSourceSelected) {
        const sources = [...new Set(scoreSourceData.map(item => item.where))].map(source => ({
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
      } else if (isSourceSelected && !isSetSelected) {
        const sets = [...new Set(scoreSetData.map(item => item.set))].map(set => ({
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
      } else if (isSetSelected && isSourceSelected) {
        const sources = [...new Set(scoreSourceData.map(item => item.where))].map(source => ({
          value: source,
          label: source,
        }));
        const sets = [...new Set(scoreSetData.map(item => item.set))].map(set => ({
          value: set,
          label: set,
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
    if (isSetSelected && selectedSource && !isSourceSelected) {
      chartdata = calculations.prepareScoreSetSpecificData(calculations.separateDataOfScoreSet(scoreSetSourceData, selectedSource));
      tabledata = calculations.prepareScoreSetSpecificData(calculations.separateDataOfScoreSet(scoreSetSourceData, selectedSource));
      title = `Score for Source: ${selectedSource}`;
    } else if (isSourceSelected && selectedSet && !isSetSelected) {
      chartdata = calculations.prepareScoreSourceSpecificData(calculations.separateDataOfScoreSource(scoreSetSourceData, selectedSet));
      tabledata = calculations.prepareScoreSourceSpecificData(calculations.separateDataOfScoreSource(scoreSetSourceData, selectedSet));
      title = `Score for Set: ${selectedSet}`;
    } else if (isSetSelected && selectedSource && isSourceSelected && selectedSet) {
      chartdata = calculations.prepareScoreSetSpecificData(scoreSetSourceData.filter(item => item.where === selectedSource && item.set === selectedSet));
      tabledata = calculations.prepareScoreSetSpecificData(scoreSetSourceData.filter(item => item.where === selectedSource && item.set === selectedSet));
      title = `Score for Source: ${selectedSource} and Set: ${selectedSet}`;
    }
  } else {
    if (isSetSelected && isSourceSelected) {
      tabledata = calculations.prepareTableScoreData(scoreData);
      chartdata = calculations.prepareChartScoreData(scoreData);
      title = 'Score Distribution';
    } else if (isSetSelected) {
      chartdata = calculations.prepareChartScoreSetData(scoreSetData);
      tabledata = calculations.prepareTableScoreSetData(scoreSetData);
      title = 'Score and Set Distribution';
    } else if (isSourceSelected) {
      chartdata = calculations.prepareChartScoreSourceData(scoreSourceData);
      tabledata = calculations.prepareTableScoreSourceData(scoreSourceData);
      title = 'Score and Source Distribution';
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

export default ScoreSection;
