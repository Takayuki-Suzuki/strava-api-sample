var gulp 		= require("gulp"),
    path        = require('./path-info'),
    settings    = require('./settings'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    $           = require('gulp-load-plugins')();

gulp.task('default', ['serve', 'build', 'watch']);
gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('build', ['build:css', 'build:js', 'build:views', 'build:fonts', 'build:images']);

gulp.task('nodemon', function () {
    var called = false;
    $.nodemon({
        script: './server/app.js',
        env: {
          'NODE_ENV': 'development',
          'REDIRECT_URI': settings.REDIRECT_URI,
          'CLIENT_ID': settings.CLIENT_ID,
          'CLIENT_SECRET': settings.CLIENT_SECRET,
          'ACCESS_TOKEN': settings.ACCESS_TOKEN
        }
    }).on('start', function() {
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function() {
        setTimeout(function() {
            reload();
        }, 500);
    });;
});
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        port: 7000
    });
});

gulp.task('watch', function(){
  gulp.watch(['source/views/**', 'source/views/index.ejs'], ['build:views']);
  gulp.watch(['source/scss/**'], ['build:css']);
  gulp.watch(['source/js/**'], ['build:js']);
  gulp.watch(['source/fonts/**'], ['build:fonts']);
  gulp.watch(['source/images/**'], ['build:images']);
});

gulp.task('build:css', function () {
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
    reload();
});

gulp.task('build:js', function () {
	var compileFileName = 'application.js'
    gulp.src([path.src.js, '!' + path.dest.js + compileFileName])
        .pipe($.plumber())
        .pipe($.concat(compileFileName))
        // .pipe($.uglify({preserveComments:'some'}))
        .pipe(gulp.dest(path.dest.js));
    reload();
});

gulp.task('build:views', function() {
    gulp.src(
        [ 'source/*.ejs' ],
        { base: 'source' }
    )
    .pipe( gulp.dest( 'public' ) );
    gulp.src(
        [ 'source/views/**' ],
        { base: 'source/views' }
    )
    .pipe(gulp.dest('public/views'));
    reload();
});
gulp.task('build:fonts', function() {
    gulp.src(
        [ 'source/fonts/**' ],
        { base: 'source/fonts' }
    )
    .pipe(gulp.dest('public/fonts'));
    reload();
});
gulp.task('build:images', function() {
    gulp.src(
        [ 'source/images/**' ],
        { base: 'source/images' }
    )
    .pipe(gulp.dest('public/images'));
    reload();
});