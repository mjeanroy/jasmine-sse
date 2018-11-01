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

import {forEach} from './common/for-each.js';
import {has} from './common/has.js';
import {includes} from './common/includes.js';
import {indexOf} from './common/index-of.js';
import {isFunction} from './common/is-function.js';
import {factory} from './common/factory.js';
import {parseUrl} from './common/parse-url.js';
import {fakeEventFactory} from './fake-event.js';
import {CONNECTING, OPEN, CLOSED} from './event-source-state.js';
import {NONE, AT_TARGET} from './event-states.js';

export const fakeEventSourceFactory = factory(() => {
  const FakeEvent = fakeEventFactory();

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

      this._listeners = {};
      this.onopen = null;
      this.onmessage = null;
      this.onerror = null;
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

    /**
     * Sets up a function that will be called whenever the specified event is delivered to the target.
     *
     * @param {string} event The event identifier.
     * @param {function} listener The listener function.
     * @return {void}
     */
    addEventListener(event, listener) {
      const nbArguments = arguments.length;

      if (nbArguments !== 2) {
        throw new TypeError(
            `Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, ` +
            `but only ${nbArguments} present.`
        );
      }

      if (!has(this._listeners, event)) {
        this._listeners[event] = [];
      }

      const listeners = this._listeners[event];

      if (!includes(listeners, listener)) {
        listeners.push(listener);
      }
    }

    /**
     * Removes from the  event listener previously registered with `addEventListener()`.
     *
     * @param {string} event The event name.
     * @param {function} listener The listener function.
     * @return {void}
     */
    removeEventListener(event, listener) {
      const nbArguments = arguments.length;

      if (nbArguments !== 2) {
        throw new TypeError(
            `Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, ` +
            `but only ${nbArguments} present.`
        );
      }

      if (!has(this._listeners, event)) {
        return;
      }

      const listeners = this._listeners[event];
      const idx = indexOf(listeners, listener);
      if (idx >= 0) {
        listeners.splice(idx, 1);
      }
    }

    /**
     * Dispatches an Event at the specified EventTarget, (synchronously) invoking
     * the affected EventListeners in the appropriate order.
     *
     * @param {Event} event The event to dispatch.
     * @return {void}
     */
    dispatchEvent(event) {
      const type = event.type;
      const listeners = has(this._listeners, type) ? this._listeners[type] : [];

      // Ensure the event phase is correct.
      event._eventPhase = AT_TARGET;

      const methodName = `on${type}`;
      const method = this[methodName];
      if (isFunction(method)) {
        method.call(this, event);
      }

      if (!event._stopped) {
        forEach(listeners, (listener) => {
          if (!event._stopped) {
            this._executeListener(listener, event);
          }
        });
      }

      // Ensure the event phase is correct.
      event._eventPhase = NONE;

      return !!event.cancelable && !!event.defaultPrevented;
    }

    /**
     * Sets the readyState attribute to CLOSED.
     *
     * @return {void}
     */
    close() {
      this._readyState = CLOSED;
    }

    /**
     * Execute the listener function (it it is a real `function`).
     * Note that error are catched and logged to the console.
     *
     * @param {function} listener The listener function.
     * @param {Object} event The event to dispatch.
     * @return {void}
     */
    _executeListener(listener, event) {
      try {
        if (isFunction(listener)) {
          listener.call(this, event);
        } else if (isFunction(listener.handleEvent)) {
          listener.handleEvent(event);
        }
      } catch (e) {
        console.error(e);
        console.error(e.stack);
      }
    }

    /**
     * Announce the open connection on the SSE connection.
     *
     * @return {void}
     */
    _announceConnection() {
      this._readyState = OPEN;
      this.dispatchEvent(
          new FakeEvent('open', this)
      );
    }

    /**
     * Fail the `EventSource` connection.
     *
     * @return {void}
     */
    _failConnection() {
      this._readyState = CLOSED;
      this.dispatchEvent(
          new FakeEvent('error', this)
      );
    }

    /**
     * Reestablish the `EventSource` connection.
     *
     * @return {void}
     */
    _reestablishConnection() {
      this._readyState = CONNECTING;
      this.dispatchEvent(
          new FakeEvent('error', this)
      );
    }
  }

  FakeEventSource.CONNECTING = CONNECTING;
  FakeEventSource.OPEN = OPEN;
  FakeEventSource.CLOSED = CLOSED;

  return FakeEventSource;
});
