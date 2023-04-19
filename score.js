const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
};

const runAnalysis = () => {
  const testSetSize = 10;
  const [testSet, trainngSet] = splitDataset(outputs, 10);

  _.range(1, 15).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter((testPoint) => knn(trainngSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log("For k of", k, "accuracy is:", accuracy);
  });
};

const distance = (pointA, pointB) => Math.abs(pointA - pointB);

const knn = (data, point, k) => {
  return _.chain(data)
    .map((row) => [distance(row[0], point), row[3]])
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