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

import {factory} from './common/factory.js';
import {parseUrl} from './common/parse-url.js';
import {CONNECTING, OPEN, CLOSED} from './event-source-state.js';

export const fakeEventSourceFactory = factory(() => {
  /**
   * The fake `EventSource` implementation.
   *
   * @class
   * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface
   */
  class FakeEventSource {
    /**
     * Create the `EventSource` connection.
     *
     * @param {string} url The connection URL.
     * @param {*} eventSourceInitDict The `EventSource` initialization parameter.
     * @constructor
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource
     */
    constructor(url, eventSourceInitDict = {}) {
      // 1- Let ev be a new EventSource object.
      // 2- Let settings be ev's relevant settings object.

      // 3- Let urlRecord be the result of parsing url with settings's API base URL and settings's
      // API URL character encoding.
      // 3-1 If urlRecord is failure, then throw a "SyntaxError" DOMException.
      // 3-2 Set ev's url to urlRecord.
      const urlRecord = parseUrl(url);
      if (!urlRecord) {
        throw new SyntaxError(`Failed to construct 'EventSource': The URL '${url}' is invalid.`);
      }

      this._url = urlRecord;

      // 4- Let corsAttributeState be Anonymous.
      this._corsAttributeState = 'anonymous';
      this._withCredentials = false;

      // 5- If the value of eventSourceInitDict's withCredentials member is true,
      // then set corsAttributeState to Use Credentials and set ev's withCredentials attribute to true.
      if (eventSourceInitDict.withCredentials === true) {
        this._corsAttributeState = 'use-credentials';
        this._withCredentials = true;
      }

      // When the object is created its readyState must be set to CONNECTING (0)
      this._readyState = CONNECTING;
    }

    /**
     * Returns the URL providing the event stream.
     *
     * @return {string} The connection URL.
     */
    get url() {
      return this._url.toString();
    }

    /**
     * Returns the state of this EventSource object's connection.
     *
     * @return {number} The connection state.
     */
    get readyState() {
      return this._readyState;
    }

    /**
     * Returns `true` if the credentials mode for connection requests to the URL providing the event stream
     * is set to "include", and `false` otherwise.
     *
     * @return {boolean} The credentials mode.
     */
    get withCredentials() {
      return this._withCredentials;
    }
  }

  FakeEventSource.CONNECTING = CONNECTING;
  FakeEventSource.OPEN = OPEN;
  FakeEventSource.CLOSED = CLOSED;

  return FakeEventSource;
});
