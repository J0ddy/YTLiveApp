import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import fetch from 'node-fetch';

// Webpack task
gulp.task('webpack', () =>
  gulp.src('src/js/*.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())
);

// Sass task
gulp.task('sass', () =>
  gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
);

// Html task
gulp.task('html', () =>
  gulp.src('src/html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
);

// Images task
gulp.task('images', () =>
  gulp.src('src/img/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(changed('dist/img'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream())
);

// Watch task
gulp.task('watch', () => {
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
});

// Dev task
gulp.task('dev', gulp.series('sass', 'webpack', 'html', 'images', 'watch'));

// Build task
gulp.task('build', gulp.series('sass', 'webpack', 'html', 'images'));

// Default task
gulp.task('default', gulp.series('dev'));