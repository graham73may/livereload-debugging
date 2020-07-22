const $ = require('gulp-load-plugins')();
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const path = require('path');
const source = require('vinyl-source-stream');
// const argv       = require('yargs').argv;
// const fs         = require('fs');

// Different Env settings from IDE
// - Check for --production flag
// const isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
const autoprefixerCompatibility = [
    'last 2 versions',
    'ie >= 9',
];

// Livereload over SSL
const livereloadSettings = {};

// Added to arguments list:
// --sslKey="path_to_key" --sslCert="path_to_crt"
/*
if (argv.sslKey && argv.sslCert) {
    livereloadSettings = {
        host : "soapbox.horse",
        port : 35729,
        key  : fs.readFileSync(argv.sslKey, 'utf-8'),
        cert : fs.readFileSync(argv.sslCert, 'utf-8'),
    };
}
*/

function css(file) {
    console.log('css');

    const dir = path.resolve(`${__dirname}/../css`);

    return gulp.src(file)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass()
            .on('error', $.sass.logError))
        // Output CSS file
        .pipe(gulp.dest('../css'))

        // Minify with maps and output
        .pipe($.sourcemaps.init())
        .pipe($.cleanCss())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('../css'))

        // Run livereload
        .pipe($.filter([
            path.join(dir, "/**/*.css"),
            "../**/*.css"
        ]))
        .pipe($.livereload());
}

// Build the theme CSS file
gulp.task('build-css', gulp.series(() => css('scss/style.scss')));

// Build the admin CSS file
gulp.task('build-admin-css', gulp.series(() => css('scss/admin-style.scss')));

// Build the TinyMCE CSS file
gulp.task('build-tinymce-css', gulp.series(() => css('scss/tinymce-style.scss')));

gulp.task('build-all', gulp.series([
    'build-css',
    'build-admin-css',
    'build-tinymce-css',
]));

gulp.task('build', gulp.series([
    'build-css',
]));

// Reload the browser!
gulp.task('reload', gulp.series(() => {
    $.livereload.reload();
}));

// Watcher
gulp.task('watch', gulp.series([
    'build-css',
], () => {
    // Start livereload
    $.livereload.listen(livereloadSettings);

    // Watch .scss files
    gulp.watch('scss/**/*.scss')
        .on('change', gulp.series('build-css'));

    // Watch .php files
    gulp.watch([
        '../../*.php',
        '../../views/*.php',
        '../../assets/includes/*.php',

        '!../node_modules/',
        '!../node_modules/**/*',
        '!node_modules/',
        '!node_modules/**/*',
    ])
        .on('change', gulp.series('reload'));
}));
