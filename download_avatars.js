var https = require('https');
var resp = "";

var options = {
  host: 'api.github.com',
  path: '/repos/jquery/jquery/contributors',
  headers: {
    'User-Agent': 'drakaven'
  }
};


var callback = function(response) {
  if (response.headers.status === '403 Forbidden' && response.headers['x-ratelimit-remaining'] == 0)
  {
    var timeDiff = new Date(response.headers['x-ratelimit-reset'] * 1000).getTime() - new Date().getTime();
    console.log("API Rate limit met, please try again in" , Math.round(timeDiff / 1000 / 60), "minutes.");
    return;
  }
  var i = 0;
  var newLink = response.headers.link;

  response.on('data', function(chunk) {
    resp += chunk;
  });

  // This never happens
  response.on('end', function() {
    console.log("End received!");
    if (newLink.indexOf("next") !== -1) {
      options.path = newLink.match(/\/repositories.*?>/)[0].slice(0, -1);;
      https.request(options, callback).end();
    } else {
      var parsed = JSON.parse(resp);
      parsed.forEach((item) => {
        i++
        console.log(item);
      });
    }
  });
}

https.request(options, callback).end();

console.log("Request sent");