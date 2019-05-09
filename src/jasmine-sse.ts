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

import {fakeEventSourceFactory} from './core/fake-event-source.js';
import {sseTracker, reset} from './core/sse-tracker.js';

const GLOBAL = window || global;
const EVENT_SOURCE = GLOBAL['EventSource'] || null;

/**
 * Update the global `EventSource` API in the current running environment.
 *
 * @param {function} impl The `EventSource` API implementation.
 * @return {void}
 */
function setEventSourceImpl(impl) {
  GLOBAL['EventSource'] = impl;
}

/**
 * Check if the current installed `EventSource` in the running environment is strictly
 * equal to the one in parameter.
 *
 * @param {function} impl The `EventSource` API implementation to check.
 * @return {boolean} `true` if the global `EventSource` is equal to `impl`, `false` otherwise.
 */
function checkEventSourceImpl(impl) {
  return GLOBAL['EventSource'] === impl;
}

let FakeEventSource;

jasmine['sse'] = () => ({
  /**
   * Install the fake `EventSource` implementation, if and only if native `EventSource` is supported
   * on runtime environment.
   *
   * @return {void}
   */
  install() {
    if (EVENT_SOURCE) {
      // Create the `FakeEventSource` once.
      if (!FakeEventSource) {
        FakeEventSource = fakeEventSourceFactory();
      }

      if (checkEventSourceImpl(FakeEventSource)) {
        throw new Error(
            'It seems that jasmine-sse has already been installed, make sure `jasmine.sse().uninstall()` ' +
            'has been called after test suite.'
        );
      }

      // Override the default `EventSource` API.
      setEventSourceImpl(FakeEventSource);

      // Ensure the tracker is resetted.
      reset();
    }
  },

  /**
   * Uninstall the fake `EventSource` implementation if it was previously installed.
   *
   * @return {void}
   */
  uninstall() {
    if (EVENT_SOURCE) {
      if (!checkEventSourceImpl(FakeEventSource)) {
        throw new Error(
            'It seems that `jasmine.sse` has not been installed, make sure `jasmine.sse().install()` ' +
            'has been called before uninstalling it.'
        );
      }

      // Restore the default `EventSource` API.
      setEventSourceImpl(EVENT_SOURCE);

      // Ensure the tracker is resetted.
      reset();
    }
  },

  /**
   * Allow to use fake `EventSource` API in a single test function (without dealing
   * with `jasmine.sse().install` and `jasmine.sse().uninstall()`).
   *
   * @param {function} testFn The test function.
   * @return {*} The return value of the test function.
   */
  withMock(testFn) {
    this.install();

    try {
      return testFn();
    } finally {
      this.uninstall();
    }
  },

  /**
   * Get the store of opened `EventSource` connections.
   *
   * @return {Object} The store.
   */
  connections() {
    return sseTracker;
  },
});
