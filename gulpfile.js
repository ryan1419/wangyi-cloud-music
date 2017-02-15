var gulp = require('gulp');
var minihtml = require('gulp-html-minify');
var minicss = require('gulp-minify-css');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var uglify =require('gulp-uglify');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var del = require('del');

var reload = browserSync.reload;

// 处理html
gulp.task('html',function(){
    return gulp.src('src/**/*.html')
                .pipe(minihtml())
                .pipe(gulp.dest('temp'))
                .pipe(reload({stream: true}));
});

gulp.task('less', function() {
    return gulp.src("src/less/*.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(minicss())
        .pipe(gulp.dest("temp/css"))
        .pipe(reload({stream: true}));
});

gulp.task('script',function(){
    return gulp.src('src/javascript/**/*.js')
                .pipe(uglify())
                .pipe(gulp.dest('temp/javascript'))
                .pipe(reload({stream: true}));
});

// move libs folder
gulp.task('libs',function(){
    return gulp.src('src/libs/**')
                .pipe(gulp.dest('temp/libs/'));
});

// 静态服务器 + 监听 less/html/js 文件
gulp.task('serve', ['clean','font','less','html','script','libs','image','music'], function() {

    browserSync.init({
        server: "./temp"
    });

    gulp.watch("src/less/**/*.less", ['less']);
    gulp.watch("src/*.html", ['html']);
    gulp.watch("src/javascript/**/*.js", ['script']);
});



gulp.task('image',function(){
    return gulp.src('src/images/**')
                .pipe(gulp.dest('temp/images/'));
});

gulp.task('music',function(){
    return gulp.src('src/music/**')
                .pipe(gulp.dest('temp/music/'));
});

gulp.task('font',function(){
    return gulp.src(['src/font/*.css','src/font/*.eot','src/font/*.js','src/font/*.svg','src/font/*.ttf','src/font/*.woff'])
        .pipe(gulp.dest('temp/font/'));
});

gulp.task('pc',function(){
    return gulp.src('src/pc/**')
        .pipe(gulp.dest('temp/pc/'));
});

gulp.task('clean',function(){
    del.sync(['temp/**','public/**']);
});

gulp.task('default',['clean','pc','font','less','html','script','libs','image','music'],function(){
    return gulp.src('temp/**')
                .pipe(gulp.dest('public/'));
});
