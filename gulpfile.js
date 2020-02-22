/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/develop/LICENSE
 *
 * Example how a build can look like, incl. component scan etc.
 */
const { task, src, dest, series, parallel  } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const del = require('delete');
const argv = require('yargs').argv;
const fs = require('fs');
const run = require ('gulp-run-command').default;
const {writeComponentList} = require('./packing/componentScanner');
const {updateBuildNumber} = require('./packing/build_number_update');
const isProduction = (argv.prod === undefined) ? false : true;

const OUTROOTDIR = "dist/"
const OUTDIR = "www/";
const BUILDDIR = OUTROOTDIR+"build_src/"


function clean(cb) {
    del([OUTROOTDIR+'/**'], cb);
}
function cleanWWW(cb) {
    del([OUTDIR+'/**'], cb);
}


function babelGame() {
    return src(['game/**/*.js'])
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest(BUILDDIR+'game/'));
}

function babelTTjs() {
    return src([
        'TTjs/**/*.js',
        '!TTjs/src/ttjs/lib/**/*.js',
        '!TTjs/r.js',
    ])
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest(BUILDDIR+'TTjs/'));
}

function copyStaticJS1() {
    return src([ 'TTjs/src/ttjs/lib/**/*.js'])
        .pipe(dest(BUILDDIR+'TTjs/src/ttjs/lib/'));
}

function copyStaticJS2() {
    return src([ 'main.js'])
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(dest(BUILDDIR));
}


function copyAssets() {
    return src([
        'game/**/*',
        '!game/**/*.js',
    ])
    .pipe(dest(OUTDIR+'game/'));
}

function copyWebFiles() {
    return src([ 'web/**/*' ])
    .pipe(dest(OUTDIR+'web/'));
}

function copyRSBuildFile() {
    return src([ './packing/rjs_build.js' ])
        .pipe(dest(BUILDDIR+'/'));
}

function buildComponentDependencyFile(cb) {
    writeComponentList({}, cb);
}

function updateBuildVersionFile(cb) {
    updateBuildNumber(isProduction, cb);
}

task('execRJS', run('node ../../packing/r.js -o ./rjs_build.js optimize=none', {  cwd: BUILDDIR }));


function copyResult() {
    return src([ BUILDDIR+'/game.js' ])
        .pipe(gulpif(isProduction, uglify({output: {max_line_len: 512}, compress: { drop_console: true }})))
        .pipe(dest(OUTDIR+'/'));
}

function copyIndexHTML() {
    return src([ './index_packed.html' ])
        .pipe(dest(OUTDIR+''));
}

function copyRequireJS() {
    return src([ './TTjs/src/ttjs/lib/require.js' ])
        .pipe(dest(OUTDIR+'/'));
}


function copyVersion() {
    return src([ './version.json' ])
        .pipe(dest(OUTDIR+'/'));
}



exports.clean = parallel(clean, cleanWWW);

exports.build = series(
    parallel(babelGame, babelTTjs, copyStaticJS1, copyStaticJS2, copyAssets, copyWebFiles),
    parallel(buildComponentDependencyFile, copyRSBuildFile),
    'execRJS',
    updateBuildVersionFile,
    parallel(copyResult, copyIndexHTML, copyRequireJS, copyVersion),
);



exports.default = exports.build;