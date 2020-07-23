var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');

// Check for --production flag
var isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
var COMPATIBILITY = [
    'last 2 versions',
    'ie >= 9',
    'safari >= 8'
];

var livereloadSettings = {};

// Added to arguments list:
// --sslKey="path_to_key" --sslCert="path_to_crt"
// if (argv.sslKey && argv.sslCert) {
//     livereloadSettings = {
//         host : "soapbox.horse",
//         port : 35729,
//         key  : fs.readFileSync(argv.sslKey, 'utf-8'),
//         cert : fs.readFileSync(argv.sslCert, 'utf-8'),
//     };
// }

// File paths to various assets are defined here.
var PATHS = {
    sass: [
        'scss/style.scss',
    ],
    admin_sass: [
        'scss/admin-style.scss',
    ],
    tinymce_sass: [
        'scss/tinymce-style.scss',
    ],
    javascript: [
        'es6/script.es6',
    ],
    javascript_admin: [
        'es6/admin.es6',
    ],
    sprite: [
        'sprite-images/**/*.svg'
    ]
};

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('build-js', function () {
    var dir = path.resolve(__dirname + '/../js');

    var bundler = browserify({
        entries: PATHS.javascript,
        debug: true
    });

    bundler.transform(babelify, {
        presets: ['env'],
        sourceMaps: true
    });

    return bundler.bundle()
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(source('script.es6'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('../js'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('../js'))

        .pipe($.filter([
            path.join(dir, "/**/*.js"),
            "../**/*.js"
        ]))
        // Run livereload
        .pipe($.livereload());
});

gulp.task('build-admin-js', function () {
    var dir = path.resolve(__dirname + '/../js');

    var bundler = browserify({
        entries: PATHS.javascript_admin,
        debug: true
    });

    bundler.transform(babelify, {
        presets: ['env'],
        sourceMaps: true
    });

    return bundler.bundle()
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(source('admin.es6'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('admin.js'))
        .pipe(gulp.dest('../js'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('../js'))

        .pipe($.filter([
            path.join(dir, "/**/*.js"),
            "../**/*.js"
        ]))
        // Run livereload
        .pipe($.livereload());
});

// Compile Theme Sass into CSS.
gulp.task('build-css', function () {
    var dir = path.resolve(__dirname + '/../css');

    return gulp.src(PATHS.sass)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))

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
});

gulp.task('build-admin-css', function () {
    var dir = path.resolve(__dirname + '/../css');

    return gulp.src(PATHS.admin_sass)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))

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
});

gulp.task('build-tinymce-css', function () {
    var dir = path.resolve(__dirname + '/../css');

    return gulp.src(PATHS.tinymce_sass)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))

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
});

// Build SVG sprite
gulp.task('build-svg-sprite', function () {
    var dir = path.resolve(__dirname + '/../img');
    var config = {
        svg: {
            xmlDeclaration: false,
            namespaceClassnames: false,
        },
        mode: {
            // Activate the «symbol» mode
            symbol: {
                bust: false,
            }
        }
    };

    return gulp.src(PATHS.sprite)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe($.svgSprite(config))
        .pipe(gulp.dest('../img'))

        // Run livereload
        //        .pipe($.filter([
        //            path.join(dir, "/**/*.svg"),
        //            "../**/*.svg"
        //        ]))
        .pipe($.livereload());
});

gulp.task('build-all', [
    'build-js',
    'build-admin-js',
    'build-css',
    'build-admin-css',
    'build-tinymce-css',
]);

gulp.task('build', [
    'build-js',
    'build-css',
]);

// Reload the browser!
gulp.task('reload', function () {
    $.livereload.reload();
});

gulp.task('watch', [
    'build-js',
    'build-css',
], function () {
    $.livereload.listen(livereloadSettings);

    gulp.watch([
        'es6/**/*.es6',
        'es6/modules/**/*.js'
    ], [
        'build-js',
    ]);

    gulp.watch([
        'es6/admin.es6',
        'es6/admin-modules/**/*.js'
    ], [
        'build-admin-js',
    ]);

    gulp.watch(['scss/**/*.scss'], [
        'build-css',
    ]);

    // gulp.watch(['../../**/*.twig'], ['reload']);

    gulp.watch([
        '../../../**/*.php',
        '!../node_modules/',
        '!../node_modules/**/*',
        '!node_modules/',
        '!node_modules/**/*',
    ], ['reload']);
});