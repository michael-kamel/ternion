const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const replace = require('gulp-replace');

gulp.task('es5', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(
      gulpBabel({
        presets: ['env'],
        plugins: ['transform-runtime']
      })
    )
    .pipe(gulp.dest('./src5'));
});
gulp.task('es6', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(
      gulpBabel({
        plugins: ['transform-async-to-generator']
      })
    )
    .pipe(gulp.dest('./src6'));
});
gulp.task('es6index', () => {
  return gulp
    .src(['./index.js', './tests/**/*.js'], { base: './' })
    .pipe(replace('src/', 'src6/'))
    .pipe(gulp.dest('./'));
});
gulp.task('es5index', () => {
  return gulp
    .src(['./index.js', './tests/**/*.js'], { base: './' })
    .pipe(replace('src/', 'src5/'))
    .pipe(gulp.dest('./'));
});
gulp.task('es7index', () => {
  return gulp
    .src(['./index.js', './tests/**/*.js'], { base: './' })
    .pipe(replace('src6/', 'src/'))
    .pipe(replace('src5/', 'src/'))
    .pipe(gulp.dest('./'));
});

gulp.task('es6p', gulp.series(['es6', 'es6index']));
gulp.task('es5p', gulp.series(['es5', 'es5index']));
