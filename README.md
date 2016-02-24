#### How to start

~~~
nodebrew use v4.0.0
npm init  # create package.json
npm install gulp --save-dev  # save gulp to package.json dev part
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del gulp-util gulp-connect --save-dev  # Install gulp-plugins
touch gulpfile.js  # create a gulp settings file
=> Add Content For Plugins:
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
        del = require('del');

=> Add Content For Task Defination:
    gulp.task('styles', function() {
        return notify({ message: 'Styles task complete' })
            .pipe(autoprefixer('last 2 version'));  // combine task by pipe read output from last task.
    });

~~~


#### ref

~~~
https://987.tw/2014/07/09/gulpru-men-zhi-nan/
https://github.com/jackfranklin/gulp-load-plugins
~~~