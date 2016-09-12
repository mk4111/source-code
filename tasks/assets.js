'use strict';

const Gulp = require('gulp');
const Debug = require('gulp-debug');
const Sass = require('gulp-sass');
const coffee = require('gulp-coffee');
const Gutil = require('gulp-util');

// Build styles
// @TODO: versioning for production build

Gulp.task('styles', function() {
  Gulp.src('./assets/sass/app.scss')
    .pipe(Debug())
    .pipe(Sass().on('error', Sass.logError))
    .pipe(Gulp.dest('./assets/build/css'))
});

Gulp.task('js', function() {
  Gulp.src('./assets/coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', Gutil.log))
    .pipe(Gulp.dest('./assets/build/js'));
});