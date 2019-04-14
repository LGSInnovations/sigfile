const pkg = require('./package');
const {
    src,
    dest,
    series
} = require('gulp');
const del = require('del');
const jsdoc = require('gulp-jsdoc3');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const replace = require('gulp-replace');
const compilerPackage = require('google-closure-compiler');
const compiler = compilerPackage.gulp();
const beautify = require('gulp-jsbeautifier');
const zip = require('gulp-zip');
const sourceMaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const jest = require('gulp-jest').default;

function lint() {
    return src([
            'gulpfile.js',
            'js/*.js',
            '__tests__/*.js'
        ]).pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function jestTest() {
    return src('__tests__', {
            read: false
        })
        .pipe(jest({
            collectCoverage: true
        }));
}

function closureCompiler() {
    return src('js/*.js')
        .pipe(compiler({
            jsOutputFile: 'sigfile.debug.js',
            compilationLevel: 'WHITESPACE_ONLY',
            debug: true,
            formatting: 'PRETTY_PRINT'
        }))
        .pipe(dest('./dist'))
        .pipe(compiler({
            jsOutputFile: 'sigfile.min.js',
            compilationLevel: 'SIMPLE',
            createSourceMap: true
        }))
        .pipe(dest('./dist'));
}

function doc() {
    return src('js/*.js')
        .pipe(jsdoc());
}

function cleanBuild() {
    return del([
        'dist/**/*',
        '!dist/*.zip',
        'doc/**/*',
        '!doc/*.png',
    ]);
}

function jsbeautify() {
    return src([
            '*.js',
            'js/*.js',
            '__tests__/*.js',
            '__tests__/*.html'
        ], {
            base: "./"
        })
        .pipe(beautify({
            indentSize: 2,
            indentWithTabs: false,
            wrapLineLength: 0,
            eol: '\n'
        }))
        .pipe(dest('./'));
}

function compress() {
    const today = new Date().toISOString().slice(0, 10);
    const zipname = 'sigfile-' + pkg.version + '-' + today + '.zip';
    return src([
            'dist/*.debug.js',
            'dist/*.min.js',
            'doc/**/*'
        ]).pipe(zip(zipname))
        .pipe(dest('./dist'));
}

function replaceFunc() {
    return src('dist/*.js')
        .pipe(replace(
            /version-PLACEHOLDER/g,
            pkg.version
        ))
        .pipe(dest('dist/'));
}

function browserifyFunc() {
    return browserify('js/sigfile.js', {
            standalone: 'sigfile'
        })
        .bundle()
        .pipe(source('js/sigfile.js'))
        .pipe(buffer())
        .pipe(rename('sigfile.js'))
        .pipe(sourceMaps.init({
            loadMaps: true
        }))
        .pipe(sourceMaps.write('./map/'))
        .pipe(dest('./dist/'));
}

exports.beautify = jsbeautify;
exports.clean = cleanBuild;
exports.compile = closureCompiler;
exports.compress = compress;
exports.doc = doc;
exports.lint = lint;
exports.testNoBuild = jestTest;
exports.replace = replaceFunc;
exports.build = series(jsbeautify, lint, browserifyFunc, replaceFunc);
exports.test = series(exports.build, exports.testNoBuild);
exports.dist = series(cleanBuild, exports.test, closureCompiler, doc, compress);
exports.default = exports.test;