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

import {assign} from './common/assign.js';
import {isFunction} from './common/is-function.js';
import {isNil} from './common/is-nil.js';
import {isObject} from './common/is-object.js';
import {factory} from './common/factory.js';
import {fakeMessageEventFactory} from './fake-message-event.js';
import {CONNECTING, OPEN, CLOSED} from './event-source-state.js';

export const fakeEventSourceProxyFactory = factory(() => {
  const FakeMessageEvent = fakeMessageEventFactory();

  /**
   * A proxy for `FakeEventSource` instance that add some methods that can
   * be called in unit tests.
   *
   * @class
   */
  class FakeEventSourceProxy {
    /**
     * Create the `FakeEventSourceProx` instance.
     *
     * @param {FakeEventSource} eventSource The `eventSource` instance.
     * @param {*} eventSourceInitDict The `EventSource` initialization parameter.
     * @constructor
     */
    constructor(eventSource) {
      this._eventSource = eventSource;
    }

    /**
     * Returns the `url` flag of the internal `eventSource` instance.
s     *
     * @return {string} The connection URL.
     */
    get url() {
      return this._eventSource.url;
    }

    /**
     * Returns the state of the internal `eventSource` instance.
     *
     * @return {number} The connection state.
     */
    get readyState() {
      return this._eventSource.readyState;
    }

    /**
     * Returns the `withCredentials` flag of the internal `eventSource` instance.
     *
     * @return {boolean} The credentials mode.
     */
    get withCredentials() {
      return this._eventSource.withCredentials;
    }

    /**
     * Get the tracked `EventSource` `onopen` handler.
     *
     * @return {function} The `onopen` handler.
     */
    get onopen() {
      return this._eventSource.onopen;
    }

    /**
     * Set the tracked `EventSource` `onopen` handler.
     *
     * @param {function} onopen The `onopen` handler.
     * @return {void}
     */
    set onopen(onopen) {
      this._eventSource.onopen = onopen;
    }

    /**
     * Get the tracked `EventSource` `onerror` handler.
     *
     * @return {function} The `onerror` handler.
     */
    get onerror() {
      return this._eventSource.onerror;
    }

    /**
     * Set the tracked `EventSource` `onerror` handler.
     *
     * @param {function} onerror The `onerror` handler.
     * @return {void}
     */
    set onerror(onerror) {
      this._eventSource.onerror = onerror;
    }

    /**
     * Get the tracked `EventSource` `onmessage` handler.
     *
     * @return {function} The `onmessage` handler.
     */
    get onmessage() {
      return this._eventSource.onmessage;
    }

    /**
     * Set the tracked `EventSource` `onmessage` handler.
     *
     * @param {function} onmessage The `onmessage` handler.
     * @return {void}
     */
    set onmessage(onmessage) {
      this._eventSource.onmessage = onmessage;
    }

    /**
     * Add new event listener to internal event source connection.
     *
     * @param {string} type Event type.
     * @param {function|Object} listener The listener.
     * @return {void}
     */
    addEventListener(type, listener) {
      this._eventSource.addEventListener(type, listener);
    }

    /**
     * Remove event listener from internal event source connection.
     *
     * @param {string} type Event type.
     * @param {function|Object} listener The listener.
     * @return {void}
     */
    removeEventListener(type, listener) {
      this._eventSource.removeEventListener(type, listener);
    }

    /**
     * Dispatch event to internal event source connection.
     *
     * @param {Object} event The event to dispatch.
     * @return {void}
     */
    dispatchEvent(event) {
      this._eventSource.dispatchEvent(event);
    }

    /**
     * Sets the `readyState` value of internal event source connection to `CLOSED`.
     *
     * @return {void}
     */
    close() {
      this._eventSource.close();
    }

    /**
     * Emit new message to the sse connection.
     *
     * @param {string|object} data The message data to emit.
     * @return {void}
     */
    emit(data) {
      if (isNil(data) || isFunction(data)) {
        throw new Error(
            `Failed to emit message on 'EventSource': The message is ${String(data)}.`
        );
      }

      if (this._eventSource.readyState === CLOSED) {
        throw new Error(
            `Failed to emit message on 'EventSource': The connection state is CLOSED.`
        );
      }

      let message = {type: 'message'};

      if (isObject(data)) {
        message = assign(message, data);
      } else {
        message = assign(message, {data: String(data)});
      }

      if (this._eventSource._readyState === CONNECTING) {
        this._eventSource._announceConnection();
      }

      this._eventSource.dispatchEvent(
          new FakeMessageEvent(message, this._eventSource)
      );
    }

    /**
     * Fail the `EventSource` connection.
     *
     * @return {void}
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#fail-the-connection
     */
    failConnection() {
      if (this._eventSource.readyState !== CLOSED) {
        this._eventSource._failConnection();
      }
    }

    /**
     * Reestablish the connection.
     *
     * @return {void}
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#reestablish-the-connection
     */
    reestablishConnection() {
      if (this._eventSource.readyState !== CLOSED) {
        this._eventSource._reestablishConnection();
      }
    }
  }

  FakeEventSourceProxy.CONNECTING = CONNECTING;
  FakeEventSourceProxy.OPEN = OPEN;
  FakeEventSourceProxy.CLOSED = CLOSED;

  return FakeEventSourceProxy;
});
