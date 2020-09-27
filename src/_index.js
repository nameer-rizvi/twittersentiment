const scraper = require("./scraper");
const preprocessor = require("./preprocessor");
const analyzer = require("./analyzer");

module.exports = (options) =>
  new Promise((resolve, reject) =>
    scraper(options)
      .then((rawData) => preprocessor({ rawData, ...options }))
      .then((preprocessedData) => analyzer({ preprocessedData, ...options }))
      .then(resolve)
      .catch(reject)
  );
