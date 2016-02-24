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
    return notify({ message: 'Styles task complete' })
        .pipe(autoprefixer('last 2 version'));  // combine task by pipe read output from last task.
});


// Testing plugin sample
gulp.task('testUglifyPlugin', function() {
    gutil.log('Do something before#3.');
    return gulp.src('*.js').pipe(uglify())
        .pipe(gulp.dest('dist/output'));
});


// main
gulp.task('default', ['before'], function() {  
    // gulp.start('styles', 'scripts', 'images');
    gulp.start('main', 'testUglifyPlugin');
});
