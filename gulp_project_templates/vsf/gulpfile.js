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
    execSync = require('child_process').execSync,
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
        "transform-remove-console"
    ],
    presets: [
        [
            "latest", {
                "es2015": {
                    "modules": false
                }
            }
        ]
    ]
};

var isWindows = function(){
    try{
        return execSync('cat /proc/version').includes('Microsoft');
    }
    catch(e){
        return true;
    }
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

var autoprefixerPattern = function(){
    return autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    });
};

var replacePattern1 = function(){
    if(getEnv() === 'dev')
        return sourcemaps.init();
    return emptyPipe();
};

var replacePattern2 = function(){
    if(getEnv() === 'dev')
        return sourcemaps.write('.');
    return emptyPipe();
};

var sourcemapsPattern = {
    init: function(){
        if(getEnv() === 'dev')
            return sourcemaps.init();
        return emptyPipe();
    },
    write: function(){
        if(getEnv() === 'dev')
            return sourcemaps.write('.');
        return emptyPipe();
    }
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
        // CSS
        gulp.src('./dist/**/*/*.css', {base: './'})
            .pipe(csso({debug: true, comments: false}))
            .pipe(autoprefixerPattern())
            .pipe(gulp.dest('./')),
        gulp.src(['app/views/**/*.css'])
            .pipe(csso({debug: true, comments: false}))
            .pipe(autoprefixerPattern())
            .pipe(gulp.dest('dist/views')),
        // JS
        gulp.src('./dist/scripts/app.js', {base: './'})
            .pipe(replace(`window.CONFIG.prefixPath = '/taisysdev';`, replacePattern()))
            .pipe(sourcemapsPattern.init())
            .pipe(babel(babelConfig))
            .pipe(sourcemapsPattern.write())
            .pipe(gulp.dest('./')),
        // HTML
        gulp.src('./dist/index.html', {base: './'})
            .pipe(htmlmin(htmlminConfig))
            .pipe(gulp.dest('./')),
        gulp.src(['app/views/**/*.html'])
            .pipe(htmlmin(htmlminConfig))
            .pipe(gulp.dest('dist/views')),
        // Asset
        gulp.src(['app/**/*.{ico,png,txt,json,png,svn,gif,eot,svg,woff,tff}', '!app/components/**/*', '!app/tests/**/*'])
            .pipe(gulp.dest('dist')),
        // Others
        gulp.src('app/components/jquery-ui/themes/base/images/*.{png,gif}')
            .pipe(gulp.dest('dist/images'))
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

gulp.task('lift', ['sass'], function() {
    devServer('app')();

    // skip watch if OS is windows
    if(isWindows())
        return;

    // By Watch files changed to recompile
    gulp.watch(['app/views/**/*.scss', 'app/styles/**/*.scss'], ['sass']);
});

// main
gulp.task('default', devServer('dist'));
