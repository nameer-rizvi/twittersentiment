const Sliwinski = require("sentiment");
const wink = require("wink-sentiment");
const { isArray, isNumber } = require("simpul");

module.exports = ({ preprocessedData, method }) =>
  new Promise((resolve, reject) => {
    let data = { tweets: preprocessedData, cumulative: {} };

    const methods = {
      sliwinski: {
        init: () => new Sliwinski(),
        forEachTweet: (tweet, initializedMethod) =>
          (tweet.sentiment = initializedMethod.analyze(tweet.tweet)),
      },
      wink: {
        forEachTweet: (tweet) => (tweet.sentiment = wink(tweet.tweet)),
      },
    };

    method = methods[method] || methods.wink;

    const initializedMethod = method.init && method.init();

    const cumulativeSentimentKeyConfigs = [
      {
        test: isArray,
        accumulator: (sentimentKey, tweetSentiment) =>
          (data.cumulative[sentimentKey] || []).concat(
            tweetSentiment[sentimentKey]
          ),
      },
      {
        test: isNumber,
        accumulator: (sentimentKey, tweetSentiment) =>
          (data.cumulative[sentimentKey] || 0) + tweetSentiment[sentimentKey],
      },
      {
        test: () => true,
        accumulator: () => null,
      },
    ];

    for (var i = data.tweets.length - 1; i >= 0; i--) {
      method.forEachTweet(data.tweets[i], initializedMethod);
      const sentimentKeys = Object.keys(data.tweets[i].sentiment);
      for (var j = sentimentKeys.length - 1; j >= 0; j--) {
        const sentimentKey = sentimentKeys[j];
        const cumulativeSentimentKeyConfig = cumulativeSentimentKeyConfigs.find(
          (_config) => _config.test(data.tweets[i].sentiment[sentimentKey])
        );
        data.cumulative[
          sentimentKey
        ] = cumulativeSentimentKeyConfig.accumulator(
          sentimentKey,
          data.tweets[i].sentiment
        );
      }
    }

    resolve(data);
  });
