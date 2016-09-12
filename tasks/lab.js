const Gulp = require('gulp');
const Lab = require('gulp-lab');

// @TODO @speedingdeer: add all steps defined in package.json to run test from here
//                      it's easier to mange all dependency, paramters and test groups in gulp

Gulp.task('test', function () {
    return Gulp.src('test')
      .pipe(Lab('-v'));
});