var gulp = require('gulp');
var typescript = require('typescript');
var tsc = require('gulp-typescript');

var systemjsBuilder = require('systemjs-builder');

gulp.task('tsc', function () {

  return gulp.src(['app/**' + '/*.ts', 'typings/index.d.ts'])
    .pipe(tsc({
      "target": "es5",
      "module": "commonjs",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "removeComments": true,
      "noImplicitAny": false,
      "suppressImplicitAnyIndexErrors": true
    }))
    .js.pipe(gulp.dest('dist'));

});

gulp.task('bundle-config', function() {
  return gulp.src('app/configs/systemjs.config.js')
    .pipe(gulp.dest('dist/configs'));
});


gulp.task('bundle-app', ['bundle-config', 'tsc'], function() {

  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');
  return builder
      .bundle('[dist/**/*]', 'production/app.bundle.min.js', {
          minify: true,
          mangle: true
      })
      .then(function() {
          console.log('Build complete');
      })
      .catch(function(err) {
          console.log('Build error');
          console.log(err);
      });

});

gulp.task('bundle-dependencies', ['bundle-config', 'tsc'], function() {

  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');
  return builder
      .bundle('dist/**/* - [dist/**/*.js]', 'production/dependencies.bundle.min.js', {
          minify: true,
          mangle: true
      })
      .then(function() {
          console.log('Build complete');
      })
      .catch(function(err) {
          console.log('Build error');
          console.log(err);
      });

  });

gulp.task('production', ['bundle-app', 'bundle-dependencies'], function(){});
