'use strict';


// load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    // minifycss = require('gulp-minify-css'),
    csso = require('gulp-csso'),
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
    replace = require('gulp-replace'),
    os = require('os');


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
    map.dev = `window.CONFIG.prefixPath = '/taisysdev';`;
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
gulp.task('recompile', ['prepare'], function() {
    // use sass for minify
    // gulp.src('./dist/style/app.css', {base: './'}).pipe(csso({debug: true})).pipe(gulp.dest('./'));
    gulp.src('./dist/scripts/app.js', {base: './'}).pipe(replace(`window.CONFIG.prefixPath = '/taisysdev';`, replacePattern())).pipe(babel(babelConfig)).pipe(gulp.dest('./'));
    gulp.src('./dist/index.html', {base: './'}).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('./'));

    gulp.src(['app/views/**/*.html']).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('dist/views'));
    gulp.src(['app/**/*.{ico,png,txt,json,png,svn,gif,eot,svg,woff,tff}', '!app/components/**/*', '!app/tests/**/*']).pipe(gulp.dest('dist'));

    // For jQuery-UI Image
    gulp.src('app/components/jquery-ui/themes/base/images/*.{png,gif}').pipe(gulp.dest('dist/images'));
});

// Ref: https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
gulp.task('prepare', ['sass'], function(cb){
    gulp.src('app/index.html').pipe(useref()).on('error', gutil.log).pipe(gulp.dest('./dist')).on('end', cb);
});

// Minify This Project
gulp.task('sass', shell.task([
        'sass --update ./app/styles/:./app/styles',
        'mkdir -p dist && git rev-parse HEAD > dist/head.txt'
]));

gulp.task('connect', function() {
    var originRule = require('./.htaccess.js');

    // dev
    connect.server({
        root: 'app',
        livereload: false,
        port: originRule.port,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite(originRule.rewrite)
            ];
        }
    });

    // dist
    connect.server({
        root: 'dist',
        livereload: false,
        port: originRule.port + 1,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite(originRule.rewrite)
            ];
        }
    });
});

gulp.task('watch', function() {
    // skip watch if OS is windows
    if(os.platform().match(/win32/) === null)
        return;

    // By Watch files changed to recompile
    gulp.watch(['app/index.html', 'app/**/*.js', 'app/**/*.{sass,scss,css}', 'app/**/*.html'], ['recompile']);
});


// main
gulp.task('default', ['before', 'watch'], function() {
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('recompile', 'connect');
});
