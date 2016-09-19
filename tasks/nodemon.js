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
    ext: 'html js',
    ignore: [
      'assets/',
      'bower_components/',
      'node_modules/',
      'tasks/',
      'test/'
    ],
    nodeArgs: nodeArgs
  })
  .on('restart', function(files) {
    console.log('change detected:', files);
  });
});
