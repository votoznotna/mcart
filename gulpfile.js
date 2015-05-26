/**
 * Created by User on 5/7/2015.
 */
// Import gulp & plugins
var gulp = require("gulp");
var clean = require("gulp-clean");
var uglify = require("gulp-uglify");
var minifyCSS = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var csslint = require("gulp-csslint");
var newer = require("gulp-newer");
var gulpif = require("gulp-if");
var eventStream = require("event-stream");
var connect = require("gulp-connect");
var html2js = require("gulp-ng-html2js");
var exec = require('child_process').exec;
var karma = require("karma").server;
var path = require("path");

var root = "app/";

// file paths
var prodPath = root + "production/"
var prodHtml = prodPath + "index.html";
var srcHtml = [
    root + "home/**/*.html",
    root + "partials/**/*.html",
    root + "template/**/*.html"
];
var srcCss = root + "css/*.css";
var srcJs = [
    root + "production/*.js",
    root + "app.js",
    root + "routes.js",
    root + "common/filters/**/*.js",
    root + "common/services/**/*.js",
    root + "common/directives/**/*.js",
    root + "partials/**/*.js"
];

var srcNgCartJs = [
    root + "template/ngCart/*.html",
    root + "bower_components/ngcart/dist/ngCart.js"
];

var distDirectory = "dist";
var vendorDistDirectory = distDirectory + "/vendor";
var vendorSrcJs = [
    root + "bower_components/jquery/dist/jquery.js",
    root + "bower_components/angular/angular.js",
    root + "bower_components/angular-resource/angular-resource.js",
    root + "bower_components/angular-animate/angular-animate.js",
    root + "bower_components/angular-sanitize/angular-sanitize.js",
    root + "bower_components/angular-mocks/angular-mocks.js",
    root + "bower_components/angular-ui-router/release/angular-ui-router.js",
    root + "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    root + "bower_components/re-tree/re-tree.js",
    root + "bower_components/ng-device-detector/ng-device-detector.js",
    root + "bower_components/ui-utils/ui-utils.js",
    //root + "bower_components/ngcart/dist/ngCart.js",
    root + "bower_components/bootstrap/dist/js/bootstrap.js"
];
var vendorSrcCss = [
    root + "bower_components/bootstrap/dist/css/bootstrap.css",
    root + "bower_components/font-awesome/css/font-awesome.css",
    root + "bower_components/animate.css/animate.css"
];
var font = [
    root + "bower_components/font-awesome/fonts/*",
    root + "bower_components/bootstrap/fonts/*"
];
var imgDirectory = [root + "images/**/*"];

var dataDirectory = [root + "data/*"];

// Tasks
gulp.task("default", ["watch"]);

gulp.task("watch", ["build"], function() {
    gulp.watch([srcHtml], ["html"]);
    gulp.watch([srcCss], ["css"]);
    gulp.watch([srcJs], ["js"]);
    gulp.watch(imgDirectory, ["img"]);
    //gulp.watch(dataDirectory, ["data"]);
});

gulp.task("build", ["css", "ngcart", "js", "html", "img", "vendor", "font"]);

gulp.task("clean", function() {
    return gulp.src(distDirectory, {read: false})
        .pipe(clean());
});

gulp.task("html", function() {
    return eventStream.merge(
        compileHtml(srcHtml, distDirectory, root),
        compileHtml(prodHtml, distDirectory)
    );
});

gulp.task("css", function() {
    return eventStream.merge(
        compileCss(srcCss, distDirectory, "application.css", true)
    );
});

gulp.task("js", function() {
    return eventStream.merge(
        compileJsAndMaybeHtml(
            srcJs,
            distDirectory,
            "application.js",
            true
        )
    );
});

gulp.task("ngcart", function() {
    return eventStream.merge(
        compileJsAndMaybeHtmlNgCart(
            srcNgCartJs,
            prodPath,
            "ngcart.js",
            false,
            true
        )
    );
});

gulp.task("img", function() {
    return gulp.src(imgDirectory, {base: root})
        .pipe(gulp.dest(distDirectory));
});

gulp.task("data", function() {
    return gulp.src(dataDirectory, {base: root})
        .pipe(gulp.dest(distDirectory));
});

gulp.task("font", function() {
    return gulp.src(font)
        .pipe(gulp.dest(distDirectory + "/vendor/fonts"));
});

gulp.task("vendor", function() {
    return eventStream.merge(
        compileJsAndMaybeHtml(vendorSrcJs, vendorDistDirectory, "vendor.js", true),
        gulp.src(vendorSrcCss)
            .pipe(concat("vendor.css"))
            .pipe(minifyCSS(
                {
                    keepBreaks: true,
                    relativeTo: path.join(process.cwd(), vendorDistDirectory, '', '', 'css'),
                    target: path.join(process.cwd(), vendorDistDirectory, '')
                }
            ))
            .pipe(gulp.dest(vendorDistDirectory))
    );
});

//common functions
function compileHtml(source, destination, base) {
    //we will always minify html because the dev console will prettify it
    return gulp.src(source,{base: base})
        .pipe(newer(distDirectory))
        .pipe(minifyHTML({empty: true, spare: true}))
        .pipe(gulp.dest(destination));
}

function compileCss(source, destination, concatName, minify, hideErrors) {
    return gulp.src(source)
        .pipe(csslint("csslintrc.json"))
        .pipe(gulpif(hideErrors, csslint.reporter()))
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}

function compileJsAndMaybeHtml(source, destination, concatName, minify, showErrors) {
    return gulp.src(source)
        .pipe(gulpif(/[.]js$/, jshint()))
        .pipe(gulpif(showErrors, jshint.reporter("jshint-stylish", {verbose: true})))
        .pipe(gulpif(showErrors, jshint.reporter("fail")))
        .pipe(gulpif(/[.]html$/, minifyHTML({
            empty: true,
            quotes: true,
            spare: true
        })))
/*        .pipe(gulpif(/[.]html$/, html2js({
            moduleName: "app.templates",
            prefix: ""
        })))*/
        .pipe(gulpif(minify, uglify({mangle: false})))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}

function compileJsAndMaybeHtmlNgCart(source, destination, concatName, minify, showErrors) {
    return gulp.src(source)
        .pipe(gulpif(/[.]html$/, minifyHTML({
            empty: true,
            quotes: true,
            spare: true
        })))
        .pipe(gulpif(/[.]html$/, html2js({
            moduleName: "ngcart.templates",
            prefix: "template/ngCart/"
        })))
        .pipe(gulpif(minify, uglify({mangle: false})))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}


//development server for debugging
gulp.task("dev", function() {
    connect.server({
        port: 4000,
        root: "./app"
    });
});

//production server
gulp.task("prod", function() {
    connect.server({
        port: 3000,
        root: "./dist"
    });
});

gulp.task("e2e-test", ["server"], function(done) {
    exec("protractor protractor.conf.js", function(err, stdout) {
        console.log(stdout);
        connect.serverClose();
        done();
    });
});

gulp.task("unit-test", function(done) {
    return karma.start({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done);
});

