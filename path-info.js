/* ========================================
//
//   path-info.js
//
// ======================================== */

var src  = './source';
var dest = './public';
var join = require('path').join;

module.exports = {
    src: {
        dir:  src,
        html: src + '/views/*.html',
        scss: src + '/scss/**/*.scss',
        js:   src + '/js/**/*.js'
    },
    dest: {
        dir:  dest,
        html: dest + '/views/',
        css:  dest + '/css/',
        js:   dest + '/js/'
    }
};
