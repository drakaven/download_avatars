
var fs = require('fs');
var https = require('https');

module.exports = {
  getWriteImage: function(userInfo) {
    var options = {
      host: 'www.google.com',
      path: '/images/logos/ps_logo2.png'
    }
    var callback = function(response) {
      var imagedata = ''
      response.setEncoding('binary')

      response.on('data', function(chunk) {
        imagedata += chunk
      });

      response.on('end', function() {
        fs.writeFile('logo.png', imagedata, 'binary', function(err) {
          if (err) throw err
          console.log('File saved.')
        });
      });
    }
    https.get(options, callback);
  }
}