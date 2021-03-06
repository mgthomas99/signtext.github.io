const babelify = require("babelify");
const browserify = require("gulp-browserify");
const buffer = require("vinyl-buffer");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const tslint = require("gulp-tslint");
const uglify = require("gulp-uglify-es").default;
const typescript = require("gulp-typescript");

const ts_project = typescript.createProject("tsconfig.json");

gulp.task("build", function () {
  return browserify()
      .add("src/index.ts")
      .plugin(tsify)
        .bundle()
      .pipe(source("index.js"))
      .pipe(gulp.dest("build/"));
});

gulp.task("clean", function () {
  return del([
    "build/",
    "dist/",
    "log/"
  ]);
});

gulp.task("dist", function () {
  return gulp.src("src/**/*.ts")
      .pipe(ts_project())
      .pipe(browserify({
        transform: ["babelify"]
      }))
      .pipe(gulp.dest("dist/"));

  return browserify()
      .add("src/index.ts")
      .plugin(tsify)
      // .transform(babelify)
        .bundle()
      .pipe(source("index.js"))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest("dist/"));

  // return browserify("src/index.ts")
  //     .plugin(tsify)
  //     .transform(babelify)
  //       .bundle()
  //     .pipe(source("index.js"))
  //     .pipe(buffer())
  //     .pipe(uglify())
  //     .pipe(gulp.dest("dist/"));
});

gulp.task("lint:javascript", function () {
  return gulp.src("src/**/*.js")
      .pipe(eslint(".eslintrc"))
      .pipe(eslint.failAfterError());
});

gulp.task("lint:typescript", function () {
  return gulp.src("src/**/*.ts")
      .pipe(tslint({ configuration: "tslint.json" }))
      .pipe(tslint.default.report({
        summarizeFailureOutput: true,
        emitError: true
      }));
});

gulp.task("lint", ["lint:javascript", "lint:typescript"]);
gulp.task("default", ["dist"]);
