'use strict';


const http = require('http'),
    connect = require('connect'),
    gulp = require('gulp'),
    modRewrite = require('connect-modrewrite'),
    shell = require('gulp-shell'),
    env = process.env.ENV,
    fs = require('fs'),
    gutil = require('gulp-util'),
    cwd = process.cwd();

var devServer = function(){
    var url, qs;
    return function(){
        var app = connect()
        .use(function(req, res, next){
            url = req.url.split('?')[0];
            qs = req.url.split('?')[1] || '';
            if(qs.length > 0)
                qs = `?${qs}`;

            //
            if(url.endsWith('/')){
                // endsWith /
                if(fs.existsSync(`${cwd}/app${url}`) && fs.statSync(`${cwd}/app${url}`).isDirectory()){
                    console.log(1, [url, qs]);
                    if(qs){
                        req.url = `${url}index.php${qs}`;
                    }
                    else{
                        req.url = `${url}index.php`;   
                    }
                    modRewrite([
                        '^(.*)$ http://127.0.0.1:13334$1 [P]',
                    ])(req, res, next);
                    return;
                }

                // others
                res.write('Not fould');
                res.end();
                return;
            }
            else{
                // ! endsWith /
                if(fs.existsSync(`${cwd}/app${url}`) && fs.statSync(`${cwd}/app${url}`).isDirectory()){
                    console.log(3, [url, qs]);
                    if(qs){
                        modRewrite([
                            `^(.*)$ $1/ [R]`,
                        ])(req, res, next);
                        return;
                    }
                    else{
                        modRewrite([
                            `^(.*)$ $1/${qs} [R]`,
                        ])(req, res, next);
                        return;
                    }
                }

                // is a file
                if(fs.existsSync(`${cwd}/app${url}`) && !fs.statSync(`${cwd}/app${url}`).isDirectory()){
                    console.log(4, [url, qs]);
                    req.url = `${url}${qs}`;
                    modRewrite([
                        '^(.*)$ http://127.0.0.1:13334$1 [P]',
                    ])(req, res, next);
                    return;
                }
                
                // is a file, after append `.php`.
                if(fs.existsSync(`${cwd}/app${url}.php`)){
                    console.log(5, [url, qs]);
                    req.url = `${url}.php${qs}`;
                    modRewrite([
                        '^(.*)$ http://127.0.0.1:13334$1 [P]',
                    ])(req, res, next);
                    return;
                }

                // others
                res.write('Not fould');
                res.end();
                return;
            }
        });
        var server = http.createServer(app).listen(3333);
    };
};

gulp.task('lift', [], function(){
    devServer()();
    shell.task([
        `cd app && ENV=DEV php5.6 -t . -S 127.0.0.1:13334`  // change ui server here
    ])();
});
