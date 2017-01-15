//image read test;
var image = 'http://www.planwallpaper.com/static/images/9-credit-1.jpg'

var fs = require("fs");

// Asynchronous read
fs.readFile(process.argv[2], function(err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("Asynchronous read: " + data.toString());
  fs.writeFile("tmp/test.txt", data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});