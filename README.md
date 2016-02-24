#### How to start

~~~
nodebrew use v4.0.0
npm install -g bower
npm init  # create package.json
npm install gulp --save-dev  # save gulp to package.json dev part
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del gulp-util gulp-htmlmin wiredep gulp-wiredep gulp-useref --save-dev gulp-connect connect-modrewrite --save-dev  # Install gulp-plugins
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
        connect = require('gulp-connect'),
        modRewrite = require('connect-modrewrite'),
        htmlmin = require('gulp-htmlmin'),
        del = require('del');

=> Add Content For Task Defination:
    gulp.task('styles', function() {
        return notify({ message: 'Styles task complete' })
            .pipe(autoprefixer('last 2 version'));  // combine task by pipe read output from last task.
    });

~~~
~~~
gulp
    or
gulp --gulpfile gulpfile_templates/gulpfile01.js
~~~


#### ref

~~~
https://987.tw/2014/07/09/gulpru-men-zhi-nan/
https://github.com/jackfranklin/gulp-load-plugins
https://www.npmjs.com/package/connect-modrewrite
https://www.npmjs.com/package/gulp-concat
https://www.npmjs.com/package/wiredep
https://www.npmjs.com/package/gulp-wiredep
https://github.com/klei/gulp-inject
~~~