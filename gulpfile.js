var gulp 	= require('gulp'),
	uglify 	= require('gulp-uglify'),
	sass 	= require('gulp-sass'),
	connect = require('gulp-connect'),
	minifyCSS = require('gulp-minify-css');

gulp.task('script', function(){
	gulp.src('resource/js/*.js')
		.pipe(uglify())
		.on('error', console.error.bind(console))
		.pipe(gulp.dest('public/js'))
		.pipe(connect.reload());
});

gulp.task('styles', function(){
	gulp.src('resource/css/*.scss')
		.pipe(sass())
		.on('error', console.error.bind(console))
		.pipe(gulp.dest('public/css/'))
		.pipe(connect.reload());
});

gulp.task('minify-css', function(){
	gulp.src('public/css/style.css')
		.pipe(minifyCSS({keepSpecialComments: 1}))
		.pipe(gulp.dest('public/css/'))
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('watch', function(){
	gulp.watch('resource/js/*.js', ['script']);
	gulp.watch('resource/css/*.scss', ['styles']);
	gulp.watch('public/css/style.css', ['minify-css']);
});

gulp.task('default', ['script', 'watch', 'connect']);