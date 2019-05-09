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

import {forEach} from './common/for-each';
import {has} from './common/has';
import {includes} from './common/includes';
import {indexOf} from './common/index-of';
import {isFunction} from './common/is-function';
import {factory} from './common/factory';
import {flatten} from './common/flatten.js';
import {parseUrl} from './common/parse-url';
import {values} from './common/values.js';
import {fakeEventFactory, FakeEvent} from './fake-event';
import {track} from './sse-tracker.js';
import {EventListener} from './event-listener';
import {CONNECTING, OPEN, CLOSED} from './event-source-state';
import {NONE, AT_TARGET} from './event-states';

export interface FakeEventSource extends EventSource {
  _announceConnection(): void;
  _reestablishConnection(): void;
  _failConnection(): void;
  _getEventListeners(type: string): EventListener[];
  _executeListener(listener: EventListener, event: Event): void;
}

export const fakeEventSourceFactory = factory(() => {
  const FakeEventImpl = fakeEventFactory();

  /**
   * The fake `EventSource` implementation.
   *
   * @class
   * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface
   */
  return class FakeEventSourceImpl implements EventSource, FakeEventSource {
    private _url: URL;
    private _corsAttributeState: 'anonymous' | 'use-credentials';
    private _withCredentials: boolean;
    private _readyState: number;
    private _listeners: {[key: string]: EventListener[]};

    onopen: (evt: MessageEvent) => any;
    onmessage: (evt: MessageEvent) => any;
    onerror: (evt: MessageEvent) => any;

    /**
     * Create the `EventSource` connection.
     *
     * @param {string} url The connection URL.
     * @param {EventSourceInit} eventSourceInitDict The `EventSource` initialization parameter.
     * @constructor
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource
     */
    constructor(url: string, eventSourceInitDict?: EventSourceInit) {
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

      this._listeners = {
      };

      this.onopen = null;
      this.onmessage = null;
      this.onerror = null;

      // Track connection.
      track(this);
    }

    /**
     * Returns the URL providing the event stream.
     *
     * @return {string} The connection URL.
     */
    get url(): string {
      return this._url.toString();
    }

    /**
     * Returns the state of this EventSource object's connection.
     *
     * @return {number} The connection state.
     */
    get readyState(): number {
      return this._readyState;
    }

    /**
     * Returns `true` if the credentials mode for connection requests to the URL providing the event stream
     * is set to "include", and `false` otherwise.
     *
     * @return {boolean} The credentials mode.
     */
    get withCredentials(): boolean {
      return this._withCredentials;
    }

    /**
     * Sets up a function that will be called whenever the specified event is delivered to the target.
     *
     * @param {string} event The event identifier.
     * @param {EventListener} listener The listener function.
     * @return {void}
     */
    addEventListener(event: string, listener: EventListener) {
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
     * @param {EventListener} listener The listener function.
     * @return {void}
     */
    removeEventListener(event: string, listener: EventListener) {
      const nbArguments: number = arguments.length;

      if (nbArguments !== 2) {
        throw new TypeError(
            `Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, ` +
            `but only ${nbArguments} present.`
        );
      }

      if (!has(this._listeners, event)) {
        return;
      }

      const listeners: EventListener[] = this._listeners[event];
      const idx: number = indexOf(listeners, listener);
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
    dispatchEvent(event: Event) {
      const type: string = event.type;
      const listeners: EventListener[] = has(this._listeners, type) ? this._listeners[type] : [];

      const methodName = `on${type}`;
      const method = this[methodName];
      if (isFunction(method)) {
        method.call(this, event);
      }

      forEach(listeners, (listener) => {
        this._executeListener(listener, event);
      });

      return !!event.cancelable && !!event.defaultPrevented;
    }

    /**
     * Sets the readyState attribute to CLOSED.
     *
     * @return {void}
     */
    close(): void {
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
    _executeListener(listener: EventListener, event: Event) {
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
    _announceConnection(): void {
      this._readyState = OPEN;
      this._dispatchFakeEvent(
          new FakeEventImpl('open', this)
      );
    }

    /**
     * Fail the `EventSource` connection.
     *
     * @return {void}
     */
    _failConnection(): void {
      this._readyState = CLOSED;
      this._dispatchFakeEvent(
          new FakeEventImpl('error', this)
      );
    }

    /**
     * Reestablish the `EventSource` connection.
     *
     * @return {void}
     */
    _reestablishConnection(): void {
      this._readyState = CONNECTING;
      this._dispatchFakeEvent(
          new FakeEventImpl('error', this)
      );
    }

      /**
     * Get all registered listeners, or listeners for given specific event
     * type.
     *
     * @param {string} type Event type (optional).
     * @return {Array<function>} The registered listeners.
     */
    _getEventListeners(type: string = ''): EventListener[] {
      const sseListeners = this._listeners;
      const listeners: EventListener[] = type ? sseListeners[type] : flatten(values(sseListeners));
      return listeners ? listeners.slice() : [];
    }

    /**
     * Dispatches an Event at the specified EventTarget, (synchronously) invoking
     * the affected EventListeners in the appropriate order.
     *
     * @param {Event} event The event to dispatch.
     * @return {void}
     */
    _dispatchFakeEvent(event: FakeEvent) {
      const type: string = event.type;
      const listeners: EventListener[] = has(this._listeners, type) ? this._listeners[type] : [];

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
