'use strict';

var path    = require('path');
var gulp    = require('gulp');
var $       = require('gulp-load-plugins')();

var paths = {
    src : {
        js : path.join(__dirname, 'src/**.js')
    },
    dist : {
        js : path.join(__dirname, '/dist')
    }
};

/**
 * Tâche Useref
 * Compiles tous les assets décrit dans les views
 *
 */
gulp.task('js', function compileHtmlSources() {
    return gulp.src(paths.src.js)
        .pipe($.concat('roundify.js'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe($.uglify())
        .pipe($.rename('roundify.min.js'))
        .pipe(gulp.dest(paths.dist.js));
});

/**
 * Watch les fichiers sass
 * et les compiles automatiquement
 *
 */
gulp.task('watch', function watch() {
    gulp.watch(paths.src.scss, ['sass']);
});
