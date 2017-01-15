//add process argv
var https = require('https');
var userInfo = [];

var options = {
  host: 'api.github.com',
  path: '/repos/jquery/jquery/contributors',
  headers: {
    'User-Agent': 'drakaven'
  }
};

const rateLimitCheck = function(response) {
  if (response.headers.status === '403 Forbidden' && response.headers['x-ratelimit-remaining'] == 0) {
    var timeDiff = new Date(response.headers['x-ratelimit-reset'] * 1000).getTime() - new Date().getTime();
    console.log("API Rate limit met, please try again in", Math.round(timeDiff / 1000 / 60), "minutes.");
    return false;
  }
}

const pushUserInfo = function(resp) {
  JSON.parse(resp).forEach((user) => {
    userInfo.push({
      user: user.login,
      avatarUrl: user.avatar_url
    });
  });
}

var callback = function(response) {
  var resp = '';
  //add a check for status 200
  if (rateLimitCheck(response) === false) return;
  //console.log(response.headers);
  var i = 0;
  var newLink = response.headers.link;

  response.on('data', function(chunk) {
    resp += chunk;
  });

  response.on('end', function() {
    if (response.headers.link && newLink.indexOf("next") !== -1) {
      options.path = newLink.match(/\/repositories.*?>/)[0].slice(0, -1);;
      pushUserInfo(resp);
      resp = '';
      https.request(options, callback).end();
    } else {
      pushUserInfo(resp);
      console.log(userInfo);
    }
  });
}

https.request(options, callback).end();

console.log("Request sent");