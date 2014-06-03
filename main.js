var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var start = 'http://www.foodmaster.com/prodBrowse?code=296',
    concurrency = 2;

request(start, function (err, response, body) {
  if (err) throw err;
  var $ = cheerio.load(body);
  async.eachLimit($('a'), concurrency, function (element, next) {


    console.log('%s (%s)', $(element).text(), $(element).attr('href'));

    next();
  });
});
