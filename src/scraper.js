const { time: simpulTime } = require("simpul");
const chrono = require("chrono-node");
const scrapefrom = require("scrapefrom");

module.exports = ({ search, until, since, pages }) =>
  new Promise((resolve, reject) => {
    !search && reject(new Error("Missing search term"));

    until =
      until &&
      "until:" + simpulTime.formatted(chrono.parseDate(until), "Y-M-D");

    since =
      since &&
      "since:" +
        simpulTime.formatted(
          since ? chrono.parseDate(since) : chrono.parseDate("3 days ago"),
          "Y-M-D"
        );

    const baseConfig = (nextCursor) => ({
      api: {
        url: "https://mobile.twitter.com/search?",
        params: {
          q: [search, "lang:en", until, since].filter(Boolean).join(" "),
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

    let page = pages || 1;

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
