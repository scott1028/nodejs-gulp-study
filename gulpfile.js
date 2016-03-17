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
    gutil = require('gulp-util');  // log util


// To do your clean task here.
gulp.task('before', function() {
    // console.log('Do something before#1.');
    gutil.log('Do something before#1.');
    return 'this plugin output data.';
});


// You can concat you plugin task here.
gulp.task('main', function() {
    gutil.log('Do something before#2.');
    return gulp.src('*.js').pipe(notify({ message: 'Styles task complete' }));
    // .pipe(autoprefixer('last 2 version'));  // combine CSS Autoprefixer task by pipe read output from last task.
    // use .pipe( ... ) to load output from last task and input to next one.
    // You can remote 'return' syntax, it's not necessary.
});


// Testing plugin sample, you can remove the 'return' syntax.
gulp.task('testUglifyPlugin', function() {
    gutil.log('Do something before#3.');
    gulp.src('*.js').pipe(uglify())
        .pipe(gulp.dest('dist/output'));
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
                    '^/test$ /index.html',
                    '^/api/(.*)$ http://localhost:8080/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]',  // for AngularJS HTML5Mode Support for removing Hash(#)
                    '^/test/\\d*/\\d*$ /flag.html [L]'
                ])
            ];
        }
    });
});
gulp.task('recompile', function(){
    // connect.reload();
    gulp.src('*.js').pipe(uglify()).pipe(gulp.dest('dist/output'));
});
gulp.task('watch', function(){
    gulp.watch(['*.js'], ['recompile']);
  // gulp.watch(['./sass/*.scss'], ['sass']);
  // gulp.watch(['./scripts/*.js'], ['traceur']);
  // gulp.watch(['./dist/**/*.*'], ['reload']);
});


// main
gulp.task('default', ['before', 'watch'], function() {  
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('main', 'testUglifyPlugin', 'connect');
});
