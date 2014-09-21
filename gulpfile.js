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
        './node_modules/fries/dist/fries.js',
        './src/scripts/stores/localStore.js',
        './src/scripts/stores/sessionStore.js',
        './src/scripts/stores/db.js',
        './src/scripts/wisconsin/utils.js',
        './src/scripts/wisconsin/ui.js',
        './src/scripts/wisconsin/index.js',
        './src/scripts/wisconsin/repo.js'

    ],

    styles: [
        './node_modules/fries/dist/themes/holo-dark/holo-dark.min.css',
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

gulp.task('scripts', [], function () {
    del(['./www/files/scripts'], function () {
        gulp.src(paths.scripts)
            .pipe(concat('js.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./www/files/scripts'));
    });
});

gulp.task('styles', [], function () {
    del(['./www/files/styles/halo-dark'], function () {
        gulp.src(paths.styles)
            .pipe(concat('css.css'))
            .pipe(less())
            .pipe(minifyCSS({
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./www/files/styles/halo-dark'));
    });
});

gulp.task('fonts', [], function () {
    del(['./public/files/fonts'], function () {
        gulp.src(paths.fonts)
            .pipe(gulp.dest('./www/files/fonts'));
    });
});

gulp.task('html', [], function () {
    del(['./www/*.html'], function () {
        gulp.src(paths.html)
            .pipe(fileInclude())
            .pipe(minifyHTML({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(replace(/\r\n|\n/g, ''))
            .pipe(gulp.dest('./www'));
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch((paths.html).concat(paths.htmlPartials), ['html']);
});

gulp.task('default', ['scripts', 'styles', 'fonts', 'html']);