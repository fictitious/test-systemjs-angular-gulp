var gulp = require('gulp');
var typescript = require('typescript');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var systemjsBuilder = require('systemjs-builder');

gulp.task('tsc', function () {

  return gulp.src(['app/**/*.ts'], { base: 'app' })
    .pipe(sourcemaps.init())
    .pipe(tsc({
      "target": "es5",
      "lib": ["es6", "dom"],
      "module": "commonjs",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "removeComments": true,
      "noImplicitAny": false,
      "suppressImplicitAnyIndexErrors": true
    }))
    .pipe(sourcemaps.write({ sourceRoot: 'app' }))
    .pipe(gulp.dest('dist'));

});

gulp.task('dist-config', function() {
  return gulp.src('app/configs/systemjs.config.js')
    .pipe(gulp.dest('dist/configs'));
});

gulp.task('dist', gulp.series('dist-config', 'tsc'));

gulp.task('bundle-app', gulp.series('dist', function() {

  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');
  return builder
      .bundle('[dist/**/*]', 'production/app.bundle.min.js', {
          minify: true,
          mangle: true,
          sourceMaps: true
      })
      .then(function() {
          console.log('Build complete');
      })
      .catch(function(err) {
          console.log('Build error');
          console.log(err);
      });

}));

gulp.task('bundle-dependencies', gulp.series('dist', function() {

  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');
  return builder
      .bundle('dist/**/* - [dist/**/*.js]', 'production/dependencies.bundle.min.js', {
          minify: true,
          mangle: true,
          sourceMaps: true

      })
      .then(function() {
          console.log('Build complete');
      })
      .catch(function(err) {
          console.log('Build error');
          console.log(err);
      });

}));

gulp.task('production', gulp.series('bundle-app', 'bundle-dependencies'));
