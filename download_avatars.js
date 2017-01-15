// REQUIRED
//create url spliter of getWrite image
// OPTIONAL
//make it async
//need to make sure the extension is correct
//try to set request size to 100
//add 200 status check
//return when repo not found

var https = require('https');
var fs = require('fs');
var userInfo = [];

var options = {
  host: 'api.github.com',
  //path: `/repos/${process.argv[2]}/${process.argv[3]}/contributors`,
  path: '/repos/drakaven/ejs/contributors',
  headers: {
    'User-Agent': 'drakaven'
  }
};

const getWriteImage = function() {
  //self executes to pass the returned function
  //closure variable
  var fileCounter = 0;
  return function(user, url) {
    console.log(url);
    var options = {
      host: 'www.google.com',
      path: '/images/logos/ps_logo2.png'
    }
    var callback = function(response) {
      var imagedata = ''
      response.setEncoding('binary');
      response.on('data', function(chunk) {
        imagedata += chunk
      });

      response.on('end', function() {
        fs.writeFile('./avatars/' + user + '.png', imagedata, 'binary', function(err) {
          if (err) throw err
          fileCounter++;
          console.log('File saved:', user + '.png', fileCounter);
        });
      });
    }
    https.get(options, callback);
  };
}();



const rateLimitCheck = function(response) {
  if (response.headers.status === '403 Forbidden' && response.headers['x-ratelimit-remaining'] == 0) {
    var timeDiff = new Date(response.headers['x-ratelimit-reset'] * 1000 + 60).getTime() - new Date().getTime();
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

const callback = function(response) {
  var resp = '';
  //add a check for status 200
  if (rateLimitCheck(response) === false) return;
  var i = 0;
  var newLink = response.headers.link;

  response.on('data', function(chunk) {
    resp += chunk;
  });

  response.on('end', function() {
    if (response.headers.link && newLink.indexOf("next") !== -1) {
      options.path = newLink.match(/\/repositories.*?>/)[0].slice(0, -1);
      pushUserInfo(resp);
      console.log("Page returned");
      resp = '';
      https.request(options, callback).end();
    } else {
      pushUserInfo(resp);
      if (!fs.existsSync("./avatars")) {
        fs.mkdirSync(dir);
      }
      userInfo.forEach((item) => {
        getWriteImage(item.user, item.avatarUrl);
      });
    }
  });
}

https.request(options, callback).end();

console.log("Request sent");