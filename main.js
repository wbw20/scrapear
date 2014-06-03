var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var start = 'http://www.foodmaster.com/prodBrowse?code=296',
    concurrency = 2,
    counter = 0,
    map = {};

function done() {
  console.log(map);
}

function expand(url, select, cb) {
  counter++;

  request(url, function (err, response, body) {
    if (err) {
      console.err('X');
      return
    }

    var $ = cheerio.load(body);

    async.eachLimit($(select), concurrency, function (element, next) {
      cb($(element));
      next();
    });

    counter--;

    /* finished spidering */
    if (counter === 0) {
      done();
    }
  });
}

process.stdout.write('Spidering');

expand(start, 'a', function(element) {
  process.stdout.write('.');
  var link = element.attr('href');
  map[element.text()] = [];

  if (link.indexOf('companies') != -1) {
    expand(link, 'ul.DIRECTORIES-CHILDPRODUCTS > li > a', function(el) {
      process.stdout.write('.');
      map[element.text()].push(el.text());
    });
  }
});
