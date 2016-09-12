'use strict';

const Gulp = require('gulp');

Gulp.task('watch', ['build'], function() {
  Gulp.watch('./assets/sass/**/*.scss', ['styles']);
  Gulp.watch('./assets/coffee/**/*.coffee', ['js']);
});
