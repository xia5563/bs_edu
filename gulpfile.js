var gulp = require('gulp'),
    scss = require('gulp-sass'),
    fileInclude = require('gulp-file-include'),
    rename = require('gulp-rename'),
    cleanCss = require('gulp-clean-css'),
    minify = require('gulp-minify'),
    imagemin = require('gulp-imagemin');

var paths = {
            bootstrap: "./src/lib/bootstrap-3.3.6-dist/",
            src: "./src/",
            srcHtml: "./src/html/",
            srcHtmlInclude: "./src/html/include/",
            srcScss: "./src/scss/",
            srcCss: "./src/css/",
            srcJs: "./src/js/",
            srcImg: ".src/img/",
            dist: "./dist/",
            distHtml: "./dist/html/",
            distCss: "./dist/css/",
            distJs: "./dist/js/",
            distImg: "./dist/img/"
};

//*****Run all the tasks by default.
gulp.task('default',['compileScss','compileHtml','watchScss','watchHtml']);


//*****Compile scss to css.
gulp.task('compileScss', function(){
    gulp.src(paths.srcScss + 'cx-style.scss')
        .pipe(scss())
        .pipe(gulp.dest(paths.srcCss ));
});



//*****Build html using "include".
//gulp.task('compileHtml', function(){
//    gulp.src(paths.srcHtml + 'index-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('index.html'))
//        .pipe(gulp.dest(paths.srcHtml ));
//    gulp.src(paths.srcHtml + 'PTE-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('PTE.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//    gulp.src(paths.srcHtml + 'PTE-test-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('PTE-test.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//    gulp.src(paths.srcHtml + 'about-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('about.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//    gulp.src(paths.srcHtml + 'contact-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('contact.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//    gulp.src(paths.srcHtml + 'customerReview-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('customerReview.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//    gulp.src(paths.srcHtml + 'PTE-test-copy-build.html')
//        .pipe(fileInclude({basepath: paths.srcHtmlInclude, context:{environment:'development'} }))
//        .pipe(rename('PTE-test-copy.html'))
//        .pipe(gulp.dest(paths.srcHtml));
//});

//*****Compile html using gulp-file-include
gulp.task('compileHtml', function(){
    gulp.src(paths.srcHtml + '*-build.html')
        .pipe(fileInclude({basepath:paths.srcHtmlInclude, context:{environment:'development'}}))
        .pipe(rename(function(path){
            path.basename = path.basename.replace("-build", "");
        }))
        .pipe(gulp.dest(paths.srcHtml));
});
//*****Recompile the files when they changes.
gulp.task('watchScss', function(){
    gulp.watch(paths.srcScss + '*.scss', ['compileScss']);
});

gulp.task('watchHtml', function(){
    gulp.watch([paths.srcHtml + '*.html', paths.srcHtmlInclude + '*.html'], ['compileHtml']);
});

//*****The following tasks are designed for releasing the projects like: compress js, minify css, compress images, and so on.
gulp.task('release', ['releaseHtml', 'releaseCss', 'releaseJs']);

//*****Compile html in "src" and output in "dist".
gulp.task('releaseHtml', function(){
    gulp.src(paths.srcHtml + '*-build.html')
        .pipe(fileInclude({basepath:paths.srcHtmlInclude, context:{environment:'production'}}))
        .pipe(rename(function(path){
            path.basename = path.basename.replace("-build", "");
        }))
        .pipe(gulp.dest(paths.distHtml));
});

//*****Compile scss to css and minify them with "gulp-clean-css"
gulp.task('releaseCss', function(){
    gulp.src(paths.srcScss + 'cx-style.scss')
        .pipe(scss())
        .pipe(gulp.dest(paths.distCss))
        .pipe(cleanCss())
        .pipe(rename('cx-style.min.css'))
        .pipe(gulp.dest(paths.distCss ));
});

//*****Minify js with "gulp-minify "
gulp.task('releaseJs', function(){
    gulp.src(paths.srcJs + 'cx-jQuery.js')
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest(paths.distJs));
});

//*****Compress images with "gulp-imagemin"
gulp.task('releaseImg', function(){
    gulp.src(paths.srcImg + '*')
        .pipe(imagemin({progressive:true, optimizationLevel:5}))
        .pipe(gulp.dest(paths.distImg));
});
