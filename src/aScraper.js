const { time: simpulTime } = require("simpul");
const scrapefrom = require("scrapefrom");

module.exports = ({ search, until, since, pages }) =>
  new Promise((resolve, reject) => {
    !search && reject(new Error("Missing search term"));

    until = "until:" + simpulTime.formatted(until, "Y-M-D");

    const defaultSince = new Date(new Date().setDate(new Date().getDate() - 3));

    since = "since:" + simpulTime.formatted(since || defaultSince, "Y-M-D");

    const baseConfig = (nextCursor) => ({
      api: {
        url: "https://mobile.twitter.com/search?",
        params: {
          q: [search, "lang:en", until, since].join(" "),
          s: "typd",
          ...nextCursor,
        },
      },
    });

    const dataConfig = (nextCursor) => ({
      ...baseConfig(nextCursor),
      selector: {
        container: "table.tweet",
        text: {
          tweet: "div.tweet-text",
          user: "div.username",
          time: "td.timestamp a",
        },
        attr: {
          link: {
            selector: "span.metadata a",
            attr: "href",
          },
        },
      },
    });

    const nextCursorConfig = (nextCursor) => ({
      ...baseConfig(nextCursor),
      selector: {
        container: "div.w-button-more",
        attr: {
          link: {
            selector: "a",
            attr: "href",
          },
        },
      },
    });

    let page = pages || 5;

    let data = [];

    const scrapePage = (nextCursor) =>
      scrapefrom([dataConfig(nextCursor), nextCursorConfig(nextCursor)])
        .then((responseData) => {
          const next_cursor =
            responseData[1] &&
            responseData[1][0] &&
            responseData[1][0].link &&
            responseData[1][0].link.split("next_cursor=")[1];
          data.push(responseData[0]);
          page = page - 1;
          page > 0 && next_cursor
            ? scrapePage({ next_cursor })
            : resolve(data.flat());
        })
        .catch(reject);

    scrapePage();
  });
