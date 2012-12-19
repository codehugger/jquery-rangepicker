var compressor = require('node-minify');
var fs = require('fs');

/*
 * jquery-rangepicker.min.js
 */
new compressor.minify({
    type: 'yui-js',
    fileIn: './src/jquery-rangepicker.js',
    fileOut: './jquery-rangepicker.min.js',
    callback: function(err) {
        if (err) { console.log(err); }
        else {
            // include LICENSE
            new compressor.minify({
                type: 'no-compress',
                fileIn: [
                    'LICENSE',
                    './jquery-rangepicker.min.js'],
                fileOut: './jquery-rangepicker.min.js',
                callback: function(err) {
                    console.log(this.fileOut);
                }
            });
        }
    }
});

/*
 * jquery-rangepicker-ko.min.js
 */
new compressor.minify({
    type: 'yui-js',
    fileIn: './src/jquery-rangepicker-ko.js',
    fileOut: './jquery-rangepicker-ko.min.js',
    callback: function(err) {
        if (err) { console.log(err); }
        else {
            // include LICENSE
            new compressor.minify({
                type: 'no-compress',
                fileIn: ['LICENSE', './jquery-rangepicker-ko.min.js'],
                fileOut: './jquery-rangepicker-ko.min.js',
                callback: function(err) {
                    console.log(this.fileOut);
                }
            });
        }
    }
});
