var gulp = require('gulp');
var tsc = require('gulp-tsc');

var systemjsBuilder = require('systemjs-builder');

gulp.task('bundle-app', function() {



  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');

  process.chdir('dist');
  return builder
      .bundle('[app/**/*]', '../production/app.bundle.min.js', {
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

gulp.task('bundle-dependencies', function() {

  var builder = new systemjsBuilder('', 'app/configs/systemjs.config.js');

  process.chdir('dist');
  return builder
      .bundle('app/**/* - [app/**/*.js]', '../production/dependencies.bundle.min.js', {
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
