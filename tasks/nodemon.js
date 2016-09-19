'use strict';
const Gulp = require('gulp');
const Nodemon = require('gulp-nodemon');

Gulp.task('nodemon', function() {
  const nodeArgs = [];
  if (process.env.DEBUGGER) {
    nodeArgs.push('--debug');
  }
  Nodemon({
    script: 'lib/start.js',
    ext: 'hbs js',
    ignore: [
      'assets/cofee',
      'assets/sass',
      'assets/build',
      'assets/vendor',
      'node_modules/',
      '.build/',
      'test/'
    ],
    nodeArgs: nodeArgs
  })
  .on('restart', function(files) {
    console.log('change detected:', files);
  });
});
