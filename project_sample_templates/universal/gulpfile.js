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
    // ngmin = require('gulp-ngmin'),
    strip = require('gulp-strip-comments'), // remove comment
    // ngAnnotate = require('gulp-ng-annotate'),
    inject = require('gulp-inject'),
    gutil = require('gulp-util'); // log util


// To do your clean task here.
gulp.task('before', function() {
    gutil.log('Do Clean Task!');
});


// You can concat you plugin task here.
gulp.task('recompile', function() {
    // // gulp.src('src/**/*.js').pipe(uglify()).pipe(gulp.dest('dist'));
    // // gulp.src('src/**/*.js').pipe(concat('all.js')).pipe(gulp.dest('dist'));
    // // by order
    // // gulp.src(['src/scripts/**/*.js', 'src/*.js']).pipe(concat('all.js')).pipe(gulp.dest('dist'));
    // gulp.src([
    //     'node_modules/angular/angular.js',
    //     'node_modules/angular-animate/angular-animate.js',
    //     'node_modules/angular-aria/angular-aria.js',
    //     'node_modules/angular-material/angular-material.js'
    // ]).pipe(gulp.dest('dist/node_modules'))
    // gulp.src(['app/**/*.js']).pipe(strip()).pipe(ngmin()).pipe(gulp.dest('dist'));  // .src 順序決定組合檔案的內容排列順序
    // // ]).pipe(strip()).pipe(concat('app.js')).pipe(ngAnnotate()).pipe(gulp.dest('dist'));  // .src 順序決定組合檔案的內容排列順序
    // // ]).pipe(concat('app.js')).pipe(gulp.dest('dist'));  // .src 順序決定組合檔案的內容排列順序
    // // gulp.src('src/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('dist'))
    // // gulp.src('src/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(wiredep({
    // //     optional: 'configuration',
    // //     goes: 'here'
    // // })).pipe(gulp.dest('./dist'));
    // gulp.src('app/**/*.html').pipe(useref()).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('./dist'));
    // gulp.src('app/**/*.css').pipe(minifycss({compatibility: 'ie8'})).pipe(gulp.dest('dist'));

    // var target = gulp.src('./app/index.html');
    // var sources = gulp.src(['./**/*.js'], {read: false});
    // target.pipe(inject(sources)).pipe(gulp.dest('./src'));

    // return;
    // Minify This Project
    gulp.src('app/index.html').pipe(useref()).on('error', gutil.log).pipe(gulp.dest('./dist'));
    gulp.src('app/assets/**').pipe(gulp.dest('dist/assets'));
    gulp.src('app/src/**/*.html').pipe(gulp.dest('dist/src'));
    // For jQuery-UI Image
    gulp.src('app/components/jquery-ui/themes/base/images/*.png').pipe(gulp.dest('dist/images'));
});
gulp.task('connect', function() {
    // demo
    // connect.server({
    //     host: '0.0.0.0',
    //     root: 'app',
    //     livereload: false,
    //     port: 7777,
    //     // by rewrite Module
    //     middleware: function() {
    //         return [
    //             modRewrite([
    //                 // '^/api/(.*)$ http://dev.gslssd.com/api/$1 [P]',
    //                 '^/api/(.*)$ http://192.168.1.55:8088/api/$1 [P]',
    //                 '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
    //                 // '^/(.*)$ http://127.0.0.1:3333/$1 [P]',
    //             ])
    //         ];
    //     }
    // });

    // dev
    connect.server({
        root: 'app',
        livereload: false,
        port: 8888,
        // by rewrite Module
        middleware: function() {
            return [
                modRewrite([
                    // '^/api/(.*)$ http://dev.gslssd.com/api/$1 [P]',
                    // '^/api/(.*)$ http://192.168.1.55:8088/api/$1 [P]',
                    // '^/api/(.*)$ http://192.168.1.55/api/$1 [P]',
                    '^/api/(.*)$ http://127.0.0.1:8080/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                    // '^/(.*)$ http://127.0.0.1:3333/$1 [P]',
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
                    '^/api/(.*)$ http://192.168.1.55:8088/api/$1 [P]',
                    '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /index.html [L]'
                    // '^/(.*)$ http://127.0.0.1:3333/$1 [P]',
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
