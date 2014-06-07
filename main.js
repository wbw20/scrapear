var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var concurrency = 2,
    counter = 0,
    map = {};

function done() {
  console.log(map);
}

module.exports = {
  map: function() {
    return map;
  },
  expand: function(url, select, cb) {
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
};
