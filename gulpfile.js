const fs = require("fs");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const data = require("gulp-data");
const sass = require("gulp-sass")(require("sass"));


gulp.task('pug', () => {
    return gulp.src(["www/pug/**/*.pug", "!www/pug/include/*.pug"], { base: "www/pug/" })
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(data(
            () => {
                const dirname = `${__dirname}/www/data/`;
                const files = fs.readdirSync(dirname);
                const datas = {};
                files.forEach((name) => {
                    datas[name.replace(".json", "")] = JSON.parse(fs.readFileSync(dirname + name));
                });
                return { data: datas };
            })
        )
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest("dest/"));
})

gulp.task("img", () => {
    return gulp.src(["www/scss/images/**/*.png", "www/scss/images/**/*.svg"], { base: "www/scss/images/", allowEmpty: true })
        .pipe(gulp.dest("dest/images/"));
});

gulp.task("css", gulp.parallel(
    () => gulp.src("www/scss/**.scss", { "base": "www/scss" })
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest("dest/assets/css/")),
    () => gulp.src(["www/scss/*.css", "www/scss/images/**/*"], { "base": "www/scss" })
        .pipe(gulp.dest("dest/assets/css/"))
));

gulp.task("font", () => {
    return gulp.src("www/fonts/**/*")
        .pipe(gulp.dest("dest/assets/fonts/"));
});

gulp.task("favicon", () => {
    return gulp.src("www/favicon/*")
        .pipe(gulp.dest("dest/favicon/"));
})

gulp.task("cname", () => {
    return gulp.src("www/CNAME", { allowEmpty: true })
        .pipe(gulp.dest("dest/"));
})

gulp.task("js", () => {
    return gulp.src("www/js/**/*")
        .pipe(gulp.dest("dest/assets/js/"))
})

gulp.task("build", gulp.series("js", "img", "pug", "css", "font", "cname", "favicon"));



gulp.task('watch', () => {
    gulp.watch(["www/pug/**/*.pug", "www/datas/**/*.json"], gulp.series("pug"));
    gulp.watch(["www/scss/**/*.scss"], gulp.series("css"));
    gulp.watch(["www/scss/images/**/*.png", "www/scss/images/**/*.svg"], gulp.series("img"))
})

gulp.task('default', gulp.series("watch"));
