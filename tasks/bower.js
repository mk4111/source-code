const Bower = require('gulp-bower');
const Gulp = require('gulp');

Gulp.task('bower', function() {
  return Bower();
});

Gulp.task('bower-files', function() {
    /** copy over semantic-ui build **/
    Gulp.src([
        './bower_components/recruitment-form-samantic-ui-build/semantic/dist/**/*',
    ])
    .pipe(Gulp.dest('./assets/vendor/semantic-ui'));

    Gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

    Gulp.src([
        './bower_components/animate.css/animate.min.css',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

    Gulp.src([
        './bower_components/reset-css/reset.css',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));
});