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
    gutil = require('gulp-util');  // log util


// To do your clean task here.
gulp.task('before', function() {
    gutil.log('Do Clean Task!');
});


// You can concat you plugin task here.
gulp.task('recompile', function() {
    // gulp.src('src/**/*.js').pipe(uglify()).pipe(gulp.dest('dist'));
    // gulp.src('src/**/*.js').pipe(concat('all.js')).pipe(gulp.dest('dist'));
    // by order
    // gulp.src(['src/scripts/**/*.js', 'src/*.js']).pipe(concat('all.js')).pipe(gulp.dest('dist'));
    gulp.src(['src/*.js', 'src/scripts/**/*.js']).pipe(concat('all.js')).pipe(gulp.dest('dist'));  // .src 順序決定組合檔案的內容排列順序
    // gulp.src('src/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('dist'))
    // gulp.src('src/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(wiredep({
    //     optional: 'configuration',
    //     goes: 'here'
    // })).pipe(gulp.dest('./dist'));
    gulp.src('src/**/*.html').pipe(useref()).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('./dist'));
    gulp.src('src/**/*.css').pipe(minifycss({compatibility: 'ie8'})).pipe(gulp.dest('dist'))
});
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8888,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    '^/api/(.*)$ http://127.0.0.1:8080/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]',
                    '^/(.*)$ http://127.0.0.1:3333/$1 [P]',
                ])
            ];
        }
    });
});
gulp.task('watch', function(){
    gulp.watch(['src/**/*.js', 'src/**/*.html', 'src/**/*.css'], ['recompile']);
  // gulp.watch(['./sass/*.scss'], ['sass']);
  // gulp.watch(['./scripts/*.js'], ['traceur']);
  // gulp.watch(['./dist/**/*.*'], ['reload']);
});


// main
gulp.task('default', ['before', 'watch'], function() {  
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('recompile', 'connect');
});
