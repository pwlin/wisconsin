/*jslint browser: true, devel: true, node: true, sloppy: true*/
/*global require */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var fileInclude = require('gulp-file-include');
var replace = require('gulp-replace');
var del = require('del');

var paths = {

    scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/jquery_lazyload/jquery.lazyload.js',
        /*'./node_modules/fries/dist/fries.js',*/
        './node_modules/fries/lib/js/dialog.js',
        './node_modules/fries/lib/js/forms.js',
        './node_modules/fries/lib/js/spinners.js',
        './node_modules/fries/lib/js/stack.js',
        './node_modules/fries/lib/js/tabs.js',
        './node_modules/fries/lib/js/utils.js',
        './src/scripts/stores/localStore.js',
        /*'./src/scripts/stores/sessionStore.js',
        './src/scripts/stores/db.js',*/
        './src/scripts/wisconsin/utils.js',
        './src/scripts/wisconsin/ui.js',
        './src/scripts/wisconsin/index.js',
        './src/scripts/wisconsin/repo.js'
    ],

    styles: [
        //'./node_modules/fries/dist/themes/holo-dark/holo-dark.min.css',
        './node_modules/fries/dist/css/holo-dark/*.css',
        './src/styles/basic.less'
    ],

    fonts: [
        './node_modules/fries/dist/fonts/*'
    ],

    html: [
        './src/html/*.html'
    ],

    htmlPartials: [
        './src/html-partials/*.html'
    ]

};

gulp.task('all', [], function () {
    var tsJS = require('crypto').createHash('md5').update('js-' + new Date().valueOf()).digest('hex'),
        tsCSS = require('crypto').createHash('md5').update('css-' + new Date().valueOf()).digest('hex');

    del(['./www/files/scripts',
         './www/files/styles/halo-dark',
         './public/files/fonts',
         './www/*.html'
        ], function () {
        gulp.src(paths.scripts)
            .pipe(concat(tsJS + '.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./www/files/scripts'));

        gulp.src(paths.styles)
            .pipe(concat(tsCSS + '.css'))
            .pipe(less())
            .pipe(minifyCSS({
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./www/files/styles/halo-dark'));

        gulp.src(paths.fonts)
            .pipe(gulp.dest('./www/files/fonts'));

        gulp.src(paths.html)
            .pipe(fileInclude())
            .pipe(minifyHTML({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(replace('$$JS_OUT$$', tsJS))
            .pipe(replace('$$CSS_OUT$$', tsCSS))
            .pipe(replace(/\r\n|\n/g, ''))
            .pipe(replace(/\s{2,}/g, ' '))
            .pipe(gulp.dest('./www'));
    });

});


gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['all']);
    gulp.watch(paths.styles, ['all']);
    gulp.watch(paths.fonts, ['all']);
    gulp.watch((paths.html).concat(paths.htmlPartials), ['all']);
});

gulp.task('default', ['all']);