import _ from 'lodash';
import { BallData, AnalysisResult } from '../types';

export const splitDataset = (data: number[][], testCount: number): [number[][], number[][]] => {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
};

export const minMax = (data: number[][], featureCount: number): number[][] => {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map((row) => row[i]);
    const min = _.min(column)!;
    const max = _.max(column)!;

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  return clonedData;
};

export const distance = (pointA: number[], pointB: number[]): number => {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => ((a || 0) - (b || 0)) ** 2)
      .sum()
      .value() ** 0.5
  );
};

export const knn = (data: number[][], point: number[], k: number): number => {
  return _.chain(data)
    .map((row) => {
      return [distance(_.initial(row), point), _.last(row)!];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
};

export const runAnalysis = (outputs: BallData[]): AnalysisResult[] => {
  const testSetSize = Math.min(100, Math.floor(outputs.length * 0.3));
  const k = 10;
  const featureNames = ['Drop Position', 'Bounciness', 'Ball Size'];
  const results: AnalysisResult[] = [];

  if (outputs.length < testSetSize + 10) {
    return results;
  }

  _.range(0, 3).forEach((feature) => {
    const data = _.map(outputs, (row) => [
      [row.dropPosition, row.bounciness, row.size][feature],
      row.bucketLabel,
    ]);
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    results.push({
      feature,
      featureName: featureNames[feature],
      accuracy: Math.round(accuracy * 100),
    });
  });

  return results;
};