import gulp from 'gulp';
import browserSync from 'browser-sync';
import GulpPug from 'gulp-pug';
import { deleteAsync } from 'del';
import htmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import dotenv from 'dotenv';
import uglify from 'gulp-terser';

dotenv.config();

const sass = gulpSass(dartSass);

const isProduction = () => {
  return process.env.ENVIRONMENT === 'production';
};

const html = () => {
  return gulp
    .src('./src/**/*.html')
    .pipe(gulpIf(isProduction(), htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
};

const pug = () => {
  return gulp
    .src('./src/**/*.pug')
    .pipe(GulpPug({ pretty: true }))
    .pipe(gulpIf(isProduction(), htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
};

const scss = () => {
  return gulp
    .src('./src/scss/index.scss')
    .pipe(sass({ outputStyle: isProduction() ? 'compressed' : 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
};

const js = () => {
  return gulp
    .src('./src/js/**/*.js')
    .pipe(gulpIf(isProduction(), uglify()))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
};

const assets = () => {
  return gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest('./dist/assets'))
    .pipe(browserSync.reload({ stream: true }));
};

const clean = () => {
  return deleteAsync(['./dist']);
};

const autoreload = () => {
  browserSync.init({
    open: false,
    server: {
      baseDir: './dist',
    },
  });
};

const watchers = () => {
  autoreload();

  gulp.watch('./src/**/*.html', html);
  gulp.watch('./src/**/*.pug', pug);
  gulp.watch('./src/scss/**/*.scss', scss);
  gulp.watch('./src/assets/**/*', assets);
  gulp.watch('./src/js/**/*.js', js);
};

const tasks = {
  clean,
  html,
  pug,
  scss,
  assets,
  js,
  watchers,
};

gulp.task('default', gulp.series(Object.values(tasks)));
