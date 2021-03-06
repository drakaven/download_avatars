//REQUIRED
//files extension

//OPTIONS
//fix options declarations
//find out how to only return required values from gituhb
//error handling

const request = require('request');
const fs = require('fs');
//var path = "https://api.github.com/repos/jquery/jquery/contributors?per_page=100";
const path = `https://api.github.com/repos/${process.argv[2]}/${process.argv[3]}/contributors?per_page=100`;
const folder = './avatars/';
const options = {
  url: path,
  headers: {
    'User-Agent': 'drakaven'
  }
};

const rateLimitCheck = function(response) {
  console.log(response.headers['x-ratelimit-remaining'], 'remaining requests');
  if (response.headers.status === '403 Forbidden' && response.headers['x-ratelimit-remaining'] == 0) {
    var timeDiff = new Date(response.headers['x-ratelimit-reset'] * 1000).getTime() - new Date().getTime();
    console.log("API Rate limit met, please try again in", Math.round(timeDiff / 1000 / 60) + 1, "minutes.");
    return false;
  }
}

const getHead = function(login, url){
  opt = options;
  opt.url = url;
  opt.method = 'head';
  return request(opt, function(error, response){
    console.log(response.headers);
    login += '.' + response.headers['content-type'].match(/\/.*/)[0].slice(1);
    console.log(login);
    return login;
  });
}


const getImage = function(url, login, folder) {
  opt = options;
  opt.url = url;
  request(opt, function(error, response, body) {
  }).pipe(fs.createWriteStream(folder + login));
}

const getPages = function() {
  var counter = 0;
  return function(options) {
    request(options, function(error, response, body) {
      if (rateLimitCheck(response) === false) return;
      var parseBody = JSON.parse(body);
      if (!fs.existsSync("./avatars")) {
        fs.mkdirSync("./avatars");
      }
      parseBody.forEach((user) => {
        counter++;

        getImage(user.avatar_url, user.login, folder);
      });

      if (response.headers.link && response.headers.link.indexOf("next") !== -1) {
        opt = options;
        opt.url = response.headers.link.match(/http.*?>/)[0].slice(0, -1);
        getPages(opt);
      }
      console.log(counter + " File(s) Downloaded");
    });
  }
}();
getPages(options);