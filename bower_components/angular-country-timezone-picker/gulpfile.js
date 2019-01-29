var gulp = require('gulp'),
    uglifyjs = require('gulp-uglify'),
    rename = require('gulp-rename');

    gulp.task('js', function() {
        return gulp.src([
          './angular-country-timezone-picker.js'
        ])
        .pipe(uglifyjs({
            mangle: false
        }))
        .pipe(rename('angular-country-timezone-picker.min.js'))
        .pipe(gulp.dest('./'));
    });


    gulp.task('default', ['js']);
