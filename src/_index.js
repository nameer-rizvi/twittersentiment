const scraper = require("./aScraper");
const preprocessor = require("./bPreprocessor");
const analyzer = require("./cAnalyzer");

module.exports = (options) =>
  new Promise((resolve, reject) =>
    scraper(options)
      .then(preprocessor)
      .then((preprocessedData) => analyzer({ preprocessedData, ...options }))
      .then(resolve)
      .catch(reject)
  );

module
  .exports({ search: "cricket", pages: 1, method: "wink" })
  .then((data) => console.log(data))
  .catch((e) => require("simpul").logger({ e }));
