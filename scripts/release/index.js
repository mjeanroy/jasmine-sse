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

const gulp = require('gulp');
const path = require('path');
const bump = require('gulp-bump');
const git = require('gulp-git');
const tagVersion = require('gulp-tag-version');

const conf = require('../config');
const PKG_JSON = path.join(conf.root, 'package.json');
const DIST = conf.dist;

['minor', 'major', 'patch'].forEach((level) => {
  /**
   * Prepare the release: this is a just a wrapper around the `updateVersion`
   * function with a pre-defined parameter.
   *
   * @return {WritableStream} The stream pipeline.
   */
  function prepareRelease() {
    return updateVersion(level);
  }

  module.exports[level] = gulp.series(
      prepareRelease,
      performRelease,
      tagRelease,
      prepareNextRelease
  );
});


/**
 * Update version in number in `package.json` file.
 *
 * @param {string} level The semver level identifier (`major`, `minor` or `patch`).
 * @return {WritableStream} The stream pipeline.
 */
function updateVersion(level) {
  return gulp.src([PKG_JSON])
      .pipe(bump({type: level}))
      .pipe(gulp.dest(conf.root));
}

/**
 * Commit the current changes:
 * - The `dist` directory containing final bundle.
 * - The `package.json` containing the new version number.
 *
 * @return {WritableStream} The stream pipeline.
 */
function performRelease() {
  return gulp.src([DIST, PKG_JSON])
      .pipe(git.add({args: '-f'}))
      .pipe(git.commit('release: release version'));
}

/**
 * Tag current version: the tag name will be extracted from
 * the `version` field in the `package.json` file.
 *
 * @return {WritableStream} The stream pipeline.
 */
function tagRelease() {
  return gulp.src([PKG_JSON]).pipe(tagVersion());
}

/**
 * Prepare the next release cycle:
 * - Remove the `dist` directory containing bundle tagged on given version.
 * - Create a new commit preparing the next release.
 *
 * @return {WritableStream} The stream pipeline.
 */
function prepareNextRelease() {
  return gulp.src([DIST])
      .pipe(git.rm({args: '-rf'}))
      .pipe(git.commit('release: prepare next release'));
}
