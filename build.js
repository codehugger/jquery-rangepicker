var compressor = require('node-minify');
var fs = require('fs');

fs.exists('./build', function (exists) {
  if (!exists) {
    fs.mkdirSync('./build');
  }
});

new compressor.minify({
    type: 'yui-js',
    fileIn: ['./vendor/strftime.js', './jquery-rangepicker.js'],
    fileOut: './build/rangepicker.min.js',
    callback: function(err){
        if (err) { console.log(err); }
        else { console.log(this.fileOut); }
    }
});

new compressor.minify({
    type: 'yui-js',
    fileIn: ['./vendor/strftime.js', './jquery-rangepicker.js', './jquery-rangepicker-ko.js'],
    fileOut: './build/rangepicker-ko.min.js',
    callback: function(err){
        if (err) { console.log(err); }
        else { console.log(this.fileOut); }
    }
});
