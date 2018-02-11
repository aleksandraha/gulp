var gulp = require('gulp'),
    sass = require('gulp-sass'),
    twig = require('gulp-twig'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    babel = require('gulp-babel'),
    jsValidate = require('gulp-jsvalidate'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    image = require('gulp-image'),
    spritesmith = require('gulp.spritesmith'),
    del = require('del'),
    color = require('gulp-color');

var path = {
    src: 'app/',
    dist: 'web/',
    scssSrc: './app/assets/sass/**/*.scss',
    cssDist: './web/css/',
    cssInjectDist: './web/css/style.css',
    twigSrc: './app/view/*.twig',
    twigSrcAll: './app/view/**/*.twig',
    twigDist: './web/',
    jsSrc: ['./app/assets/js/vendor/jquery-3.3.1.min.js', './app/assets/js/app.js'],
    jsDist: './web/js/',
    jsInjectDist: './web/js/app.js',
    imagesSrc: ['./app/assets/images/**/*','!./app/assets/images/sprites/*.*'],
    imagesDist: './web/img',
    spritesSrc: './app/assets/images/sprites/*.png',
    spriteCssDist: './../img/sprite.png',
    spriteImgDist: './web/img/',
    spriteSassSrc: './app/assets/sass/global/',
    fontsSrc: './app/assets/fonts/**/*.{ttf,woff,woff2,eof,svg}',
    fontsDist: './web/fonts/'
};


gulp.task('sass', function(){
    return gulp.src(path.scssSrc)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(path.cssDist))
        // .pipe(browserSync.stream());
});

gulp.task('default', function () {
    function taskData( name, description) {
        console.log( color('gulp ' + name, 'GREEN') + ' - ' + color(description, 'BLUE'));
    }
    console.log(color('\n LIST OF TASKS:\n', 'RED'));
    taskData('watch',  'Verification of changes in the project and compiling them to the /web.');
    taskData('connect',  'Runing local server.');
    taskData('build',  'Removing and rebuilding the output files - /web.');
    console.log('');
    taskData('sass',  'Compiling SCSS in to the CSS.');
    taskData('js',  'Compiling js files in to the /web.');
    taskData('js:minify',  'Minification javascripts');
    taskData('twig',  'Compiling TWIG in to the HTML.');
    taskData('image',  'Compression of images in the /app and transfer them to the /web.');
    taskData('sprite',  'Processing images from /images/sprites to the one compressed image.');
    taskData('fonts',  'Font transfer.');
    taskData('clean',  'Removeing /web.');
    console.log('');
});

gulp.task('js', function() {
    return gulp.src(path.jsSrc)
        .pipe(jsValidate(path.jsSrc))
        .pipe(babel({presets: ['env']}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.jsDist));
        // .pipe(browserSync.stream());
});

gulp.task('js:minify', function() {
    return gulp.src(path.jsSrc)
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.jsDist))
});

gulp.task('image', function () {
    gulp.src(path.imagesSrc)
        .pipe(image())
        .pipe(gulp.dest(path.imagesDist));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src(path.spritesSrc).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        imgPath: path.spriteCssDist,
        padding: 2,
        cssVarMap: function(sprite) {
            sprite.name = 'icon-' + sprite.name
        }
    }));
    spriteData.img.pipe(gulp.dest(path.spriteImgDist));
    spriteData.css.pipe(gulp.dest(path.spriteSassSrc));
});

gulp.task('twig', function () {
    return gulp.src(path.twigSrc)
        .pipe(twig())
        .pipe(inject(gulp.src(path.cssInjectDist, {read: false}), {
            ignorePath : path.dist,
            addRootSlash: false}))
        .pipe(inject(gulp.src(path.jsInjectDist, {read: false}), {
            ignorePath : path.dist,
            addRootSlash : false}))
        .pipe(gulp.dest(path.twigDist));
});

gulp.task('fonts', function () {
   return gulp.src('./app/assets/fonts/**/*.{ttf,woff,woff2,eof,svg}')
       .pipe(gulp.dest('./web/fonts'));
});

gulp.task('watch', function () {
    gulp.watch(path.spritesSrc, ['sprite']);
    gulp.watch(path.scssSrc, ['sass']);
    gulp.watch(path.jsSrc, ['js']);
    gulp.watch(path.twigSrcAll, ['twig']);
    gulp.watch(path.imagesSrc, ['image']);
    gulp.watch(path.fontsSrc, ['fonts']);
});

gulp.task('clean', function () {
    return del(path.dist);
});

gulp.task('build', function() {
    runSequence('clean', ['js'], ['image'], ['sprite'], ['sass'], ['twig'], ['fonts']);
});

gulp.task('connect', function () {
    connect.server({
        root: 'web',
        port: 8001,
        livereload: true
    });
});