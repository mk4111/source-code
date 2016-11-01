const Bower = require('gulp-bower');
const Gulp = require('gulp');

Gulp.task('bower', function() {
  return Bower();
});

Gulp.task('bower-files', function() {
    /** copy over semantic-ui build **/
    Gulp.src([
        './bower_components/semantic/dist/**/*',
    ])
    .pipe(Gulp.dest('./assets/vendor/semantic-ui'));

    Gulp.src([
        './bower_components/semantic-ui-calendar/dist/calendar.min.*',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

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

    Gulp.src([
        './bower_components/urijs/src/URI.min.js',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

    Gulp.src([
        './bower_components/animsition/dist/js/animsition.min.*',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

    Gulp.src([
        './bower_components/underscore/underscore-min.js',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

    Gulp.src([
        './bower_components/numbers2words/build/numbers2words.min.js',
    ])
    .pipe(Gulp.dest('./assets/vendor/'));

});