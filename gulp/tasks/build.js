const gulp = require('gulp'),
  imgmin = require('gulp-imagemin'),
  del = require('del'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create();

gulp.task('delDist', ['sprite', 'cssProcess', 'jsProcess'], function() {
  return del('docs');
});
gulp.task('minifyImg', ['delDist'], function() {
  let paths = [
    'src/assets/img/**',
    '!src/assets/img/icons',
    '!src/assets/img/icons/**',
    '!src/assets/img/**/*-i.jpg'
  ];
  return gulp
    .src(paths)
    .pipe(imgmin())
    .pipe(gulp.dest('docs/assets/img'));
});
gulp.task('usemin', ['minifyImg'], function() {
  return gulp
    .src('src/index.html')
    .pipe(
      usemin({
        css: [cssnano, rev],
        js: [uglify, rev]
      })
    )
    .pipe(gulp.dest('docs'));
});
gulp.task('copyGeneralFiles', ['usemin'], function() {
  let paths = [
    'src/**',
    '!src/index.html',
    '!src/assets/img',
    '!src/assets/img/**',
    '!src/assets/css',
    '!src/assets/css/**',
    '!src/assets/js/**',
    '!src/assets/js/**',
    '!src/dev',
    '!src/dev/**'
  ];
  return gulp.src(paths).pipe(gulp.dest('docs'));
});
gulp.task('viewDist', ['copyGeneralFiles'], function() {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: 'docs'
    }
  });
});
gulp.task('build', [
  'delDist',
  'minifyImg',
  'usemin',
  'copyGeneralFiles'
  // "viewDist"
]);
