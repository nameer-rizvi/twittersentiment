# twentiment

Sentiment analyzer for twitter.

Input must be an object with any of the following keys (the only required key being "search"):

1. search: string, tweets to search & analyze.
2. since: string, date of earliest tweets (default: 3 days ago).
3. until: string, date of latest tweets (default: today).
4. pages: number, how many pages of tweets to analyze, with each page consisting of 20 tweets (default: 1).
5. preprocess: array of strings, each string being a preprocessor to run on each tweet. Preprocessors include:
   - mentions: removes mentions from tweet.
   - emojis: removes emojis from tweet.
   - links || linksROne || linksRTwo || linksRThree: removes links from tweet. Each link option is a different regex.
   - cleaner: improves spacing and sentence structure.
6. method: string, which sentiment analyzer to use (default: wink). Sentiment analyzers include:
   - [sliwinski](https://www.npmjs.com/package/sentiment)
   - [wink](https://www.npmjs.com/package/@happyaccident/wink-sentiment)

Output will be an object with the list of tweets (sentiments included) under "tweets" and cumulative results under "cumulative".
