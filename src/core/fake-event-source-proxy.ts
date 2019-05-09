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
import {EventListener} from './event-listener';
import {FakeEventSource} from './fake-event-source';
import {CONNECTING, OPEN, CLOSED} from './event-source-state.js';

export interface FakeEventSourceProxy extends EventSource {
  emit(data: string | object): void;
  failConnection(): void;
  reestablishConnection(): void;
  getEventListeners(type: string): EventListener[];
}

export const fakeEventSourceProxyFactory = factory(() => {
  const FakeMessageEvent = fakeMessageEventFactory();

  /**
   * A proxy for `FakeEventSource` instance that add some methods that can
   * be called in unit tests.
   *
   * @class
   */
  return class FakeEventSourceProxyImpl implements EventSource, FakeEventSourceProxy {
    private _eventSource: FakeEventSource;

    /**
     * Create the `FakeEventSourceProx` instance.
     *
     * @param {FakeEventSource} eventSource The `eventSource` instance.
     * @param {*} eventSourceInitDict The `EventSource` initialization parameter.
     * @constructor
     */
    constructor(eventSource: FakeEventSource) {
      this._eventSource = eventSource;
    }

    /**
     * Returns the `url` flag of the internal `eventSource` instance.
s     *
     * @return {string} The connection URL.
     */
    get url(): string {
      return this._eventSource.url;
    }

    /**
     * Returns the state of the internal `eventSource` instance.
     *
     * @return {number} The connection state.
     */
    get readyState(): number {
      return this._eventSource.readyState;
    }

    /**
     * Returns the `withCredentials` flag of the internal `eventSource` instance.
     *
     * @return {boolean} The credentials mode.
     */
    get withCredentials(): boolean {
      return this._eventSource.withCredentials;
    }

    /**
     * Get the tracked `EventSource` `onopen` handler.
     *
     * @return {function} The `onopen` handler.
     */
    get onopen(): (evt: MessageEvent) => any {
      return this._eventSource.onopen;
    }

    /**
     * Set the tracked `EventSource` `onopen` handler.
     *
     * @param {function} onopen The `onopen` handler.
     * @return {void}
     */
    set onopen(onopen: (evt: MessageEvent) => any) {
      this._eventSource.onopen = onopen;
    }

    /**
     * Get the tracked `EventSource` `onerror` handler.
     *
     * @return {function} The `onerror` handler.
     */
    get onerror(): (evt: MessageEvent) => any {
      return this._eventSource.onerror;
    }

    /**
     * Set the tracked `EventSource` `onerror` handler.
     *
     * @param {function} onerror The `onerror` handler.
     * @return {void}
     */
    set onerror(onerror: (evt: MessageEvent) => any) {
      this._eventSource.onerror = onerror;
    }

    /**
     * Get the tracked `EventSource` `onmessage` handler.
     *
     * @return {function} The `onmessage` handler.
     */
    get onmessage(): (evt: MessageEvent) => any {
      return this._eventSource.onmessage;
    }

    /**
     * Set the tracked `EventSource` `onmessage` handler.
     *
     * @param {function} onmessage The `onmessage` handler.
     * @return {void}
     */
    set onmessage(onmessage: (evt: MessageEvent) => any) {
      this._eventSource.onmessage = onmessage;
    }

    /**
     * Add new event listener to internal event source connection.
     *
     * @param {string} type Event type.
     * @param {function|Object} listener The listener.
     * @return {void}
     */
    addEventListener(type: string, listener: EventListener) {
      this._eventSource.addEventListener(type, listener);
    }

    /**
     * Remove event listener from internal event source connection.
     *
     * @param {string} type Event type.
     * @param {function|Object} listener The listener.
     * @return {void}
     */
    removeEventListener(type: string, listener: EventListener) {
      this._eventSource.removeEventListener(type, listener);
    }

    /**
     * Dispatch event to internal event source connection.
     *
     * @param {Object} event The event to dispatch.
     * @return {boolean} Returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
     */
    dispatchEvent(event: Event): boolean {
      return this._eventSource.dispatchEvent(event);
    }

    /**
     * Sets the `readyState` value of internal event source connection to `CLOSED`.
     *
     * @return {void}
     */
    close(): void {
      this._eventSource.close();
    }

    /**
     * Emit new message to the sse connection.
     *
     * @param {string|object} data The message data to emit.
     * @return {void}
     */
    emit(data: string | object): void {
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

      let message: object = {type: 'message'};

      if (isObject(data)) {
        message = assign(message, data);
      } else {
        message = assign(message, {data: String(data)});
      }

      if (this._eventSource.readyState === CONNECTING) {
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
    failConnection(): void {
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
    reestablishConnection(): void {
      if (this._eventSource.readyState !== CLOSED) {
        this._eventSource._reestablishConnection();
      }
    }

    /**
     * Get all registered listeners, or listeners for given specific event
     * type.
     *
     * @param {string} type Event type (optional).
     * @return {Array<EventListener>} The registered listeners.
     */
    getEventListeners(type = ''): EventListener[] {
      return this._eventSource._getEventListeners(type);
    }

    get CONNECTING(): number {
      return CONNECTING;
    }

    get OPEN(): number {
      return OPEN;
    }

    get CLOSED(): number {
      return CLOSED;
    }

    static CONNECTING: number = CONNECTING;
    static OPEN: number = CONNECTING;
    static CLOSED: number = CONNECTING;
  }
});
