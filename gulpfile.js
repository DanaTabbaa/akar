var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Basic Gulp task syntax
gulp.task('hello', function() {
  'Hello Zell!');
})

// Development Tasks
// -----------------

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer({
      browsers: ['last 99 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
})

// Gulp task to minify CSS files
gulp.task('minifycss', function () {
  return gulp.src('app/css/style.css')
    // Compile SASS files
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(concat('style-min-new.css'))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('app/css'))
});

// Gulp task to minify JavaScript files
gulp.task('minifyjs', function() {
  return gulp.src('app/js/**/*.js')
    // Minify the file
    .pipe(concat('main-min.js'))
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('app/js'))
});
