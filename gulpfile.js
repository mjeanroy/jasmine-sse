/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const path = require('path');
const log = require('fancy-log');
const colors = require('ansi-colors');
const del = require('del');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const bump = require('gulp-bump');
const git = require('gulp-git');
const tagVersion = require('gulp-tag-version');
const karma = require('karma');
const rollup = require('rollup');

const conf = require('./conf');
const rollupConf = require('./rollup.conf');

gulp.task('clean', () => (
  del(conf.dist)
));

gulp.task('lint', () => {
  const inputs = [
    path.join(conf.root, '*.js'),
    path.join(conf.src, '**', '*.js'),
    path.join(conf.test, '**', '*.js'),
    path.join(conf.sample, '**', '*.js'),
  ];

  return gulp.src(inputs)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], (done) => {
  startKarma('test', done);
});

gulp.task('tdd', (done) => {
  startKarma('tdd', done);
});

gulp.task('saucelab', (done) => {
  startKarma('saucelab', done);
});

gulp.task('travis', ['lint'], (done) => {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    log(colors.grey('SauceLab environment not set, running classic test suite'));
    startKarma('test', done);
  } else {
    startKarma('saucelab', done);
  }
});

gulp.task('build', ['clean', 'lint'], () => (
  rollup.rollup(rollupConf).then((bundle) => bundle.write(rollupConf.output))
));

// Release tasks
['minor', 'major', 'patch'].forEach((level) => {
  const PKG_JSON = path.join(conf.root, 'package.json');
  const DIST = conf.dist;

  gulp.task(`bump:${level}`, () => (
    gulp.src([PKG_JSON])
        .pipe(bump({type: level}))
        .pipe(gulp.dest(conf.root))
  ));

  gulp.task(`release:prepare:${level}`, ['build', `bump:${level}`], () => (
    gulp.src([DIST, PKG_JSON])
        .pipe(git.add({args: '-f'}))
        .pipe(git.commit('release: release version'))
  ));

  gulp.task(`tag:${level}`, [`release:prepare:${level}`], () => (
    gulp.src([PKG_JSON]).pipe(tagVersion())
  ));

  gulp.task(`release:${level}`, ['build', `tag:${level}`], () => (
    gulp.src([DIST])
        .pipe(git.rm({args: '-rf'}))
        .pipe(git.commit('release: prepare next release'))
  ));
});

/**
 * Start Karma Server and run unit tests.
 *
 * @param {string} mode The test mode (test or tdd).
 * @param {function} done The done callback.
 * @return {void}
 */
function startKarma(mode, done) {
  const fileName = `karma.${mode}.conf.js`;
  const configFile = path.join(conf.root, fileName);

  const srv = new karma.Server({configFile}, () => {
    log(colors.grey('Calling done callback of Karma'));
    done();
  });

  log(colors.grey(`Running karma with configuration: ${fileName}`));
  srv.start();
}
