var request = require('request');
var fs = require('fs');
var path = 'https://api.github.com/repos/jquery/jquery/contributors';
var options = {
  url: path,
  headers: {
    'User-Agent': 'drakaven'
  }
};

getImage = function(url, login) {
  opt = options;
  opt.url = url;
  request(opt, function(error, response, body) {}).pipe(fs.createWriteStream('./avatars/' + login));
}

request(options, function(error, response, body) {
  //test the header if it has next call again
  var parseBody = JSON.parse(body);
  parseBody.forEach((user) => {
    getImage(user['avatar_url'], user.login);
  });
});