'use strict';


const http = require('http'),
    connect = require('connect'),
    gulp = require('gulp'),
    modRewrite = require('connect-modrewrite'),
    shell = require('gulp-shell'),
    env = process.env.ENV,
    fs = require('fs'),
    gutil = require('gulp-util'),
    colors = require('colors'),
    cwd = process.cwd();

var isWindows = function(){
    try{
        return execSync('cat /proc/version').indexOf('Microsoft') > -1;
    }
    catch(e){
        return true;
    }
};

var getEnv = function(){
    return process.env.ENV || 'dev';
};

const CMD = isWindows() ? 'MKDIR 2> NUL' : 'mkdir -p';
const CT = isWindows() ? '&' : '&&';
const PORT = 3333;

var devServer = function(){
    var url, qs;
    return function(){
        var app = connect()
        .use(function(req, res, next){
            url = req.url.split('?')[0];
            qs = req.url.split('?')[1] || '';
            if(qs.length > 0)
                qs = `?${qs}`;

            if(url.endsWith('/') && fs.existsSync(`${cwd}/app${url}greet.html`)){
                console.log(`[INFO]`.cyan, url, qs);
                // make rewrite manually, this is modify by function
                //
                // equal only rewrite with [L]:
                // => '!\\.js|\\.html|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.ttf|\\.woff|\\.ico$ /greet.html [L]'
                req.url = `${url}greet.html${qs}`;
            }

            modRewrite([
                `^/api/(.*?)$ http://graph.facebook.com/api/test/$1 [P]`,
                `^(.*)$ http://127.0.0.1:1${PORT}$1 [P]`,
            ])(req, res, next);
        });
        var server = http.createServer(app).listen(PORT);
    };
};

gulp.task('lift', [], function(){
    devServer()();
    shell.task([
        `cd app ${CT} http-server -p 1${PORT}`  // change ui server here
    ])();
});
