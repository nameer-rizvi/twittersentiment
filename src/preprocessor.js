const emoji_strip = require("emoji-strip");

// https://github.com/lilia-simeonova/preprocessing-tweets/blob/master/app/index.js
// https://blog.logrocket.com/natural-language-processing-for-node-js/

module.exports = ({ rawData, preprocess = [] }) =>
  new Promise((resolve, reject) => {
    const linksR = [
      /(?:https?):\/\/[\n\S]+/g,
      /(?:https?|ftp):\/\/[\n\S]+/g,
      /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,
    ];

    const preprocessors = {
      mentions: (tweet) => tweet.replace(/(@)[\n\S]+/g, ""),
      //
      emojis: (tweet) => {
        tweet = emoji_strip(tweet);
        tweet = tweet.replace(
          /(^|\s)(:D|:\/|:\)+|;\)|:-\))(?=\s|[^[:alnum:]+-]|$)/g,
          ""
        );
        return tweet;
      },
      //
      links: (tweet) => tweet.replace(r[0], ""),
      linksROne: (tweet) => tweet.replace(r[0], ""),
      linksRTwo: (tweet) => tweet.replace(r[1], ""),
      linksRThree: (tweet) => tweet.replace(r[2], ""),
      //
      cleaner: (tweet) =>
        tweet
          .replace("\r", "")
          .replace(/RT\s+/g, "")
          .replace("&amp;", "")
          .replace("&lt;", "")
          .replace("&gt;", "")
          .replace(/&gt;+/g, "")
          .replace(/#/g, "")
          .replace(/\s+/g, " ")
          .trim(),
    };

    !preprocess.includes("persistDupes") &&
      (rawData = rawData.filter(
        (tweet, index, self) =>
          index === self.findIndex((_tweet) => _tweet.tweet === tweet.tweet)
      ));

    for (var i = rawData.length - 1; i >= 0; i--) {
      for (var j = preprocess.length - 1; j >= 0; j--) {
        preprocessors[preprocess[j]] &&
          (rawData[i].tweet = preprocessors[preprocess[j]](rawData[i].tweet));
      }
    }

    resolve(rawData);
  });
