var gulp = require('gulp'),
  babel = require('gulp-babel'),
  watch = require('gulp-watch');


/** Babel **/
gulp.task('babel', function() {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/javascripts'));
});
/** Watch **/
gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['babel']);
});

/** Default task **/
gulp.task('default', ['babel', 'watch']);