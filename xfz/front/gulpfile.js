var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var bs = require("browser-sync").create();  //创建一个服务器，刷新浏览器
var sass = require("gulp-sass");  // 将sass转换为css
// 打印js错误，防止js出现错误时退出gulp
var util = require("gulp-util");
// 通过压缩过的min.js文件很难找到那段错误，查找错误时通过gulp-sourcemaps查找未压缩文件
var sourcemaps = require("gulp-sourcemaps");


// 动态定义路径
var path = {
    'html': './templates/**/',  // **：全部文件
    'css': './src/css/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/',
};

gulp.task("html", function () {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream())
});

gulp.task("css", function () {
   gulp.src(path.css + '*.scss') // 找到所有的scss文件
   .pipe(sass().on('error',sass.logError))// 将scss转换为css,出错则打印错误
   .pipe(cssnano())  // 压缩
   .pipe(rename({"suffix": ".min"}))  // 改名
   .pipe(gulp.dest(path.css_dist))  //存放压缩文件
   .pipe(bs.stream())  // 刷新
});

gulp.task("js", function () {
   gulp.src(path.js + '*.js') // 找到所有的css文件
   .pipe(sourcemaps.init()) // 源文件错误的具体位置
   .pipe(uglify().on("error", util.log))  // 压缩并打印错误
   .pipe(rename({"suffix": ".min"}))  // 改名
   .pipe(sourcemaps.write())// 源文件错误的具体位置
   .pipe(gulp.dest(path.js_dist))  //存放压缩文件
   .pipe(bs.stream())  // 刷新
});

gulp.task("images", function () {
   gulp.src(path.images + '*.*') // 找到所有的css文件
   .pipe(cache(imagemin()))  // 压缩后缓存,压缩过的下次不需要压缩
   .pipe(gulp.dest(path.images_dist))  //存放压缩文件
   .pipe(bs.stream())  // 刷新
});

// 执行此任务，会自动执行以上的任务
gulp.task("watch",function () {
    // gulp.watch(指定要执行的文件， 执行命令)
    gulp.watch(path.html + '*.html',['html']);
    gulp.watch(path.css + '*.scss',['css']);
    gulp.watch(path.js + '*.js', ['js']);
    gulp.watch(path.images + '*.*', ['images']);
});

// 初始化 bs任务
gulp.task("bs",function () {
    bs.init({
        'server': {
            'saseDir': './' //在根目录找需要执行的文件（如找index.html：查找路径./html/index.html）
        }
    });
});

//default任务，同步刷新和压缩
gulp.task("default", ["bs", "watch"]);
