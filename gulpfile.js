var gulp 		= require("gulp"),
    path    = require('./path-info'),
    $       = require('gulp-load-plugins')();

gulp.task('default', ['serve', 'build', 'watch']);
gulp.task('serve', ['connect', 'watch']);

gulp.task('connect', function () {
  $.connect.server({
    root: 'public',
    livereload: true 
  });
});

gulp.task('watch', function(){
  gulp.watch(['source/**'], ['build'])
})

gulp.task('scss:dev', function () {
	var compileFileName = 'application.css'
    gulp.src([path.src.scss, '!' + path.dest.css + compileFileName])
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['ie >= 8', 'Android >= 2.3', 'last 2 versions']
        }))
        .pipe($.concat(compileFileName))
        .pipe($.minifyCss())
        .pipe(gulp.dest(path.dest.css));
});

gulp.task('js:dev', function () {
	var compileFileName = 'application.js'
    gulp.src([path.src.js, '!' + path.dest.js + compileFileName])
        .pipe($.plumber())
        .pipe($.concat(compileFileName))
        .pipe($.uglify({preserveComments:'some'}))
        .pipe(gulp.dest(path.dest.js));
});

gulp.task('html:dev', function() {
    gulp.src(
        [ 'source/*.html' ],
        { base: 'source' }
    )
    .pipe( gulp.dest( 'public' ) );
    gulp.src(
        [ 'source/views/**' ],
        { base: 'source/views' }
    )
    .pipe( gulp.dest( 'public/views' ) );
});
gulp.task('font:dev', function() {
    gulp.src(
        [ 'source/fonts/**' ],
        { base: 'source/fonts' }
    )
    .pipe( gulp.dest( 'public/fonts' ) );
});
gulp.task('img:dev', function() {
    gulp.src(
        [ 'source/images/**' ],
        { base: 'source/images' }
    )
    .pipe( gulp.dest( 'public/images' ) );
});

gulp.task('build', ['scss:dev', 'js:dev', 'html:dev', 'font:dev', 'img:dev']);