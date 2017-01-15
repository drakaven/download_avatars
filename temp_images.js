var https = require('https')
var fs = require('fs')
var options = {
    host: 'www.google.com',
    path: '/images/logos/ps_logo2.png'
}


var callback = function(response){
  var imagedata = ''
    response.setEncoding('binary')

    response.on('data', function(chunk){
        imagedata += chunk
    });

}

https.get(options, callback);



    // res.on('end', function(){
    //     fs.writeFile('logo.png', imagedata, 'binary', function(err){
    //         if (err) throw err
    //         console.log('File saved.')
    //     })
    // })


