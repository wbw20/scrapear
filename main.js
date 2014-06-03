var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var start = 'http://www.foodmaster.com/prodBrowse?code=296',
    concurrency = 2;

expand(start, 'a', function(element) {
  var link = element.attr('href');

  console.log(element.text() + '==>');

  if (link.indexOf('companies') != -1) {
    expand(link, 'ul.DIRECTORIES-CHILDPRODUCTS > li > a', function(element) {
      console.log('  ' + element.text());
    });
  }

  console.log('\n\n');

});

function expand(url, select, cb) {
  request(url, function (err, response, body) {
    if (err) {
      console.err('.');
      return
    }

    var $ = cheerio.load(body);

    async.eachLimit($(select), concurrency, function (element, next) {
      cb($(element));
      next();
    });
  });
}
