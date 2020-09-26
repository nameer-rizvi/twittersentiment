// Todo...

module.exports = (rawData) =>
  new Promise((resolve, reject) => {
    let preprocessedData = [];
    for (var i = rawData.length - 1; i >= 0; i--) {
      preprocessedData.push({ tweet: rawData[i].tweet });
    }
    resolve(preprocessedData);
  });
