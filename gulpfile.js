const Gulp = require('gulp');
const RequireDir = require('require-dir');
const RunSequence = require('run-sequence');

// Load tasks

RequireDir('./tasks');

Gulp.task('build', () => { RunSequence('bower', 'bower-files', 'styles', 'js'); });
Gulp.task('serve', () => { RunSequence('build', 'watch', 'nodemon'); });
