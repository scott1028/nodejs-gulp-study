'use strict';


// load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    connect = require('gulp-connect'), // Gulp plugin to run a webserver (with LiveReload)
    modRewrite = require('connect-modrewrite'),
    htmlmin = require('gulp-htmlmin'),
    // wiredep = require('gulp-wiredep'), // 使用 wiredep 會需要 bower
    useref = require('gulp-useref'),
    strip = require('gulp-strip-comments'), // remove comment
    inject = require('gulp-inject'),
    gutil = require('gulp-util'); // log util


// To do your clean task here.
gulp.task('before', function() {
    gutil.log('Do Clean Task!');
});


// You can concat you plugin task here.
gulp.task('recompile', function() {
    // Minify This Project
    gulp.src('app/index.html').pipe(useref()).on('error', gutil.log).pipe(gulp.dest('./dist'));
    gulp.src('app/assets/**').pipe(gulp.dest('dist/assets'));
    gulp.src('app/src/**/*.html').pipe(gulp.dest('dist/src'));
    // For jQuery-UI Image
    gulp.src('app/components/jquery-ui/themes/base/images/*.png').pipe(gulp.dest('dist/images'));
});
gulp.task('connect', function() {
    // dev
    connect.server({
        root: 'app',
        livereload: false,
        port: 8888,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    '^/api/(.*)$ http://127.0.0.1:8080/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                ])
            ];
        }
    });

    // dist
    connect.server({
        root: 'dist',
        livereload: false,
        port: 9999,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    '^/api/(.*)$ http://127.0.0.1:8080/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                ])
            ];
        }
    });
});

gulp.task('watch', function() {
    // By Watch files changed to recompile
    gulp.watch(['app/index.html', 'app/src/**/*.js', 'app/assets/**', 'app/src/**/*.html'], ['recompile']);
});


// main
gulp.task('default', ['before', 'watch'], function() {
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('recompile', 'connect');
});
