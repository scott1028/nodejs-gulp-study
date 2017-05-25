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
    os = require('os'),
    sourcemaps = require('gulp-sourcemaps'),
    transform = require('stream').Transform,
    es = require('event-stream');  // `async` is an options lib.


var htmlminConfig = {
    jsmin: true,
    cssmin: true,
    collapseWhitespace: true,
    removeComments: true
};

// Ref: https://github.com/babel/gulp-babel, commend: sourceMap no work, please use extra-plugin.
var babelConfig = {
    comments: false,
    minified: true,
    plugins: [
        "transform-remove-console",
        "transform-es2015-template-literals"
    ],
    presets: []
};

var getEnv = function(){
    return process.env.ENV || 'dev';
};

var devServer = function(path){
    return function(){
        var originRule = require('./.htaccess.js');
        connect.server({
            root: path,
            livereload: false,
            port: originRule.port,
            // by rewrite Module
            middleware: function() {
                return [
                    modRewrite(originRule.rewrite)
                ];
            }
        });
    };
};

var emptyPipe = function(){
    var stream = new transform({ objectMode: true });
    stream._transform = function(file, encoding, cb) {
        return cb(null, file);
    };
    return stream;
};

var replacePattern = function(){
    var target = getEnv();
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
    map.china_demo = `window.CONFIG.prefixPath = '/taiuat';`;
    return map[target];
};

// To do your clean task here.
gulp.task('before', function() {
    gutil.log('Do Clean Task!');
});

// You can concat you plugin task here.
gulp.task('recompile', ['prepare'], function() {
    // merge all event-stream
    var all = [
        // use csso for minify
        gulp.src('./dist/styles/app.css', {base: './'}).pipe(csso({debug: true})).pipe(gulp.dest('./')),
        gulp.src('./dist/scripts/app.js', {base: './'}).pipe(replace(`window.CONFIG.prefixPath = '/taisysdev';`, replacePattern())).pipe((function(){
                if(getEnv() === 'dev')
                    return sourcemaps.init();
                return emptyPipe();
            })()).pipe(babel(babelConfig)).pipe((function(){
                if(getEnv() === 'dev')
                    return sourcemaps.write('.');
                return emptyPipe();
            })()).pipe(gulp.dest('./')),
        gulp.src('./dist/index.html', {base: './'}).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('./')),

        gulp.src(['app/views/**/*.html', 'app/views/**/*.css']).pipe(htmlmin(htmlminConfig)).pipe(gulp.dest('dist/views')),
        gulp.src(['app/**/*.{ico,png,txt,json,png,svn,gif,eot,svg,woff,tff}', '!app/components/**/*', '!app/tests/**/*']).pipe(gulp.dest('dist')),

        // For jQuery-UI Image
        gulp.src('app/components/jquery-ui/themes/base/images/*.{png,gif}').pipe(gulp.dest('dist/images'))
    ];
    return es.merge(all);
});

// Ref: https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
gulp.task('prepare', ['sass'], function(cb){
    gulp.src('app/index.html').pipe(useref()).on('error', gutil.log).pipe(gulp.dest('./dist')).on('end', cb);
});

// Minify This Project
gulp.task('sass', shell.task([
        'sass --update ./app/styles/:./app/styles',
        'sass --update ./app/views/:./app/views',
        'mkdir -p dist && git rev-parse HEAD > dist/head.json',
]));

gulp.task('sassWatch', shell.task([
    'sass --update ./app/views/:./app/views/',
]));

gulp.task('lift', ['sass'], function() {
    devServer('app')();

    // skip watch if OS is windows
    if(os.platform().match(/win32/) === null)
        return;

    // By Watch files changed to recompile
    gulp.watch(['app/views/**/*.scss'], ['sassWatch']);
});

// main
gulp.task('default', devServer('dist'));
