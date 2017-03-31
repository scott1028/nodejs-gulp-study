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
    useref = require('gulp-useref'),
    strip = require('gulp-strip-comments'), // remove comment
    inject = require('gulp-inject'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'), // log util
    babel = require('gulp-babel'),
    replace = require('gulp-replace');


var htmlminConfig = {
    jsmin: true,
    cssmin: true,
    collapseWhitespace: true,
    removeComments: true
};

var babelConfig = {
    sourceMap: false,
    comments: false,
    minified: true,
    plugins: [
        "transform-remove-console",
        "transform-es2015-template-literals"
    ],
    presets: []
};

var replacePattern = function(){
    var target = process.env.ENV || 'dev';
    var map = {};
    map.dev = `window.CONFIG.prefixPath = '/taidev';`;
    map.stg = `window.CONFIG.prefixPath = '/taistg';`;
    map.uat = `window.CONFIG.prefixPath = '/taiuat';`;
    map.global = `window.CONFIG.prefixPath = '/taiprd';`;
    map.india = `window.CONFIG.prefixPath = '/taiprd';`;
    map.india_uat = `window.CONFIG.prefixPath = '/taiuat';`;
    map.china = `window.CONFIG.prefixPath = '/taiprd';`;
    map.china_qcloud = `window.CONFIG.prefixPath = '/taiprd';`;
    map.china_uat = `window.CONFIG.prefixPath = '/taiuat';`;
    map.china_demo = `window.CONFIG.prefixPath = '/taiauto';`;
    return map[target];
};

// To do your clean task here.
gulp.task('before', function() {
    gutil.log('Do Clean Task!');
});


// You can concat you plugin task here.
gulp.task('recompile', ['minifyPrepare'], function() {
    // Minify This Project
    shell.task([
        'sass --update ./app/styles/:./app/styles',
        'git rev-parse HEAD > dist/head.txt',
    ])();

    gulp.src('./dist/scripts/app.js', {base: './'}).pipe(replace(`window.CONFIG.prefixPath = '/taidev';`, replacePattern())).pipe(babel(babelConfig)).pipe(gulp.dest('./'));
    gulp.src('./dist/index.html', {base: './'}).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('./'));

    gulp.src(['app/views/**/*.html']).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('dist/views'));
    gulp.src(['app/**/*.{ico,png,txt,json,png,svn,gif,eot,svg,woff,tff}', '!app/components/**/*', '!app/tests/**/*']).pipe(gulp.dest('dist'));

    // For jQuery-UI Image
    gulp.src('app/components/jquery-ui/themes/base/images/*.{png,gif}').pipe(gulp.dest('dist/images'));
});
// Ref: https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
gulp.task('minifyPrepare', function(cb){
    gulp.src('app/index.html').pipe(useref()).on('error', gutil.log).pipe(gulp.dest('./dist')).on('end', cb);
});
gulp.task('connect', function() {
    // dev
    connect.server({
        root: 'app',
        livereload: false,
        port: 3333,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    '^/api/(.*)$ http://aaa.com/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                ])
            ];
        }
    });

    // dist
    connect.server({
        root: 'dist',
        livereload: false,
        port: 4444,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    '^/api/(.*)$ http://aaa.com/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                ])
            ];
        }
    });
});

gulp.task('watch', function() {
    // By Watch files changed to recompile
    gulp.watch(['app/index.html', 'app/**/*.js', 'app/**/*.{sass,scss,css}', 'app/**/*.html'], ['recompile']);
});


// main
gulp.task('default', ['before', 'watch'], function() {
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('recompile', 'connect');
});
