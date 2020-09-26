const Sliwinski = require("sentiment");
const wink = require("@happyaccident/wink-sentiment");
// const w2v = require("word2vec");

module.exports = ({ preprocessedData, method }) =>
  new Promise((resolve, reject) => {
    let data = { tweets: preprocessedData };

    const sliwinskiMethod = {
      init: () => new Sliwinski(),
      forEachTweet: (i, initialized) =>
        (i.sentiment = initialized.analyze(i.tweet)),
      reduce: {
        cumulativeScore: (score, i) => (score = score + i.sentiment.score),
        cumulativeComparative: (comparative, i) =>
          (comparative = comparative + i.sentiment.comparative),
      },
    };

    const winkMethod = {
      forEachTweet: (i) => (i.sentiment = wink(i.tweet)),
      reduce: {
        cumulativeScore: (score, i) => (score = score + i.sentiment.score),
        cumulativeNormalizedScore: (normalizedScore, i) =>
          (normalizedScore = normalizedScore + i.sentiment.normalizedScore),
      },
    };

    const methods = {
      sliwinski: sliwinskiMethod,
      wink: winkMethod,
    };

    method = methods[method] || methods.sliwinski;

    const initialized = method.init && method.init();

    data.tweets.forEach((i) => method.forEachTweet(i, initialized));

    Object.keys(method.reduce).forEach(
      (i) => (data[i] = data.tweets.reduce(method.reduce[i], 0))
    );

    resolve(data);
  });
