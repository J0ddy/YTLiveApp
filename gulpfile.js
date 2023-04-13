const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const htmlmin = require('gulp-htmlmin');

// Webpack task
gulp.task('webpack', function() {
  return gulp.src('src/js/*.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// Sass task
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

// Html task
gulp.task('html', function() {
  return gulp.src('src/html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});
  
// Watch task
gulp.task('watch', function() {
    browserSync.init({
        server: {
          baseDir: './dist',
          index: 'index.html',
          middleware: [
            function(req, res, next) {
              if (/\.js$/.test(req.url)) {
                res.setHeader('Content-Type', 'application/javascript');
              } else if (/\.css$/.test(req.url)) {
                res.setHeader('Content-Type', 'text/css');
              }
              next();
            }
          ],
          open: false
        }
      });

  gulp.watch('src/scss/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('webpack'));
  gulp.watch('src/html/*.html', gulp.series('html'));
  gulp.watch('.env', gulp.series('webpack'));
  //gulp.watch('dist/*.html').on('change', browserSync.reload);
});


// Dev task
gulp.task('dev', gulp.series('sass', 'webpack', 'html', 'watch'));

// Build task
gulp.task('build', gulp.series('sass', 'webpack', 'html'));

// Default task
gulp.task('default', gulp.series('dev'));