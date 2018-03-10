var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pleeease = require('gulp-pleeease'),
    pump = require('pump'),
    scss = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('gulp-deleted'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');

// gulp.task('scripts', function(cb) {
//     pump([
//         gulp.src('app/js/*.js'),
//         concat('script.js'),
//         uglify(),
//         gulp.dest('app/js')
//     ], cb);
// });

gulp.task('scripts', function() {
    return gulp.src('app/js/*.js')
        .pipe(concat('script.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('scss', function() {
    gulp.src('app/scss/main.scss')
        .pipe(scss())
        .pipe(gulp.dest('app/css'))
});

// gulp.task('scss', function() {
//     gulp.src('app/scss/main.scss')
//         .pipe(scss({ errLogToConsole: true }))
//         .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//         .pipe(pleeease({
//             autoprefixer: {
//                 browsers: ['> 0.01%']
//             }
//         }))
//         .pipe(gulp.dest('app/css'))
//         .pipe(browserSync.reload({ stream: true }));
// });

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    })
});

gulp.task('bs-reload', function() {
    browserSync.reload();
});

gulp.task('default', ['browser-sync', 'scss', 'scripts'], function() {
    gulp.watch('app/scss/**/*.scss', ['scss', 'bs-reload']);
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('*.html', ['bs-reload']);
});

//-----------
gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var buildCss = gulp.src(['app/css/main.css'])
        .pipe(gulp.dest('dist/css'))
    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'))
    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clear', function() {
    return cache.clearAll();
});