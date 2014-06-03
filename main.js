var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var start = 'http://www.foodmaster.com/prodBrowse?code=296',
    concurrency = 2;

expand(start, function(element) {
  console.log(element.attr('href'));
});

function expand(url, cb) {
  request(url, function (err, response, body) {
    if (err) {
      console.err('.');
      return
    }

    var $ = cheerio.load(body);

    async.eachLimit($('a'), concurrency, function (element, next) {
      cb($(element));
      next();
    });
  });
}
