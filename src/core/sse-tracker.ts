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

import {fakeEventSourceProxyFactory} from './fake-event-source-proxy.js';

/**
 * The queue of opened `EventSource`.
 * @type {Array<FakeEventSource>}
 */
const queue = [];

/**
 * Add `FakeEventSource` to the internal tracker.
 * @param {FakeEventSource} ws The `FakeEventSource` to track.
 * @return {void}
 */
export function track(sse) {
  const FakeEventSourceProxy = fakeEventSourceProxyFactory();
  const proxy = new FakeEventSourceProxy(sse);
  queue.push(proxy);
}

/**
 * Reset all tracked `EventSource`.
 *
 * @return {void}
 */
export function reset() {
  queue.splice(0, queue.length);
}

export const sseTracker = {
  /**
   * Get the most recent tracked `EventSource`.
   *
   * @return {FakeEventSource} The last tracked connection.
   */
  mostRecent() {
    return queue[queue.length - 1];
  },

  /**
   * Get the first tracked `EventSource`.
   *
   * @return {FakeEventSource} The first tracked connection.
   */
  first() {
    return queue[0];
  },

  /**
   * Get the tracked `EventSource` at given index.
   *
   * @param {number} idx The tracked index.
   * @return {FakeEventSource} The tracked connection at given index.
   */
  at(idx) {
    return queue[idx];
  },

  /**
   * Get the number of previously opened `EventSource` connections.
   *
   * @return {number} Number of tracked connections.
   */
  count() {
    return queue.length;
  },

  /**
   * Get all previously opened `EventSource` connections.
   *
   * @return {Array<FakeEventSource>} The list of tracked connections.
   */
  all() {
    return queue.slice();
  },
};
