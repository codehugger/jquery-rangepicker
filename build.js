var compressor = require('node-minify');
var fs = require('fs');

fs.exists('./build', function (exists) {
  if (!exists) {
    fs.mkdirSync('./build');
  }
});

// Using UglifyJS for JS
new compressor.minify({
    type: 'yui-js',
    fileIn: ['./vendor/strftime.js', './jquery-rangepicker.js'],
    fileOut: './build/rangepicker.min.js',
    callback: function(err){
        console.log(err);
    }
});

new compressor.minify({
    type: 'yui-js',
    fileIn: ['./vendor/strftime.js', './jquery-rangepicker.js', './jquery-rangepicker-ko.js'],
    fileOut: './build/rangepicker-ko.min.js',
    callback: function(err){
        console.log(err);
    }
});

console.log('build completed');
