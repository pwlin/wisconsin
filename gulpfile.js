var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var fileInclude = require('gulp-file-include');
//var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {

  scripts: [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery_lazyload/jquery.lazyload.js',
    './node_modules/fries/dist/fries.js',
    './node_modules/fingerblast/dist/fingerblast.js',
    './src/scripts/stores/localStore.js',
    './src/scripts/stores/sessionStore.js',
    './src/scripts/stores/db.js',
    './src/scripts/wisconsin/index.js'
  ],

  styles: [
    './node_modules/fries/dist/themes/holo-dark/holo-dark.min.css',
    './src/styles/basic.less'
  ],

  fonts : [
    './node_modules/fries/dist/fonts/*'
  ],

  html: [
    './src/html/index.html'
  ],

  htmlPartials: [
    './src/html/partials/*.html'
  ]


};

gulp.task('clean-scripts', function(cb) {
  del(['./www/files/scripts'], cb);
});

gulp.task('clean-styles', function(cb) {
  del(['./www/files/styles/halo-dark'], cb);
});

gulp.task('clean-fonts', function(cb) {
  del(['./public/files/fonts'], cb);
});

gulp.task('clean-html', function(cb) {
  del(['./www/*.html'], cb);
});

gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src(paths.scripts)
    //.pipe(sourcemaps.init())
    .pipe(concat('js.js'))
    .pipe(uglify())
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/files/scripts'));
});

gulp.task('styles', ['clean-styles'], function() {
  return gulp.src(paths.styles)
    //.pipe(sourcemaps.init())
    .pipe(concat('css.css'))
    .pipe(less())
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/files/styles/halo-dark'));
});

gulp.task('fonts', ['clean-fonts'], function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./www/files/fonts'));
});

gulp.task('html', ['clean-html'], function() {
  return gulp.src(paths.html)
    //.pipe(concat('index.html'))
    .pipe(fileInclude())
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch((paths.html).concat(paths.htmlPartials), ['html']);
});

gulp.task('default', ['scripts', 'styles', 'fonts', 'html']);