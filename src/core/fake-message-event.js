/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Mickael Jeanroy
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

import {parseUrlOrigin} from './common/parse-url-origin.js';
import {factory} from './common/factory.js';
import {fakeEventFactory} from './fake-event.js';

export const fakeMessageEventFactory = factory(() => {
  const FakeEvent = fakeEventFactory();

  /**
   * A fake Message Event.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
   */
  class FakeMessageEvent extends FakeEvent {
    /**
     * Create the fake event.
     *
     * @param {Object} data The sent data.
     * @param {FakeEventSource} target The `EventSource` connection.
     * @constructor
     */
    constructor(data, target) {
      super(data.type, target);
      this._data = data.data;
      this._lastEventId = data.id;
      this._origin = parseUrlOrigin(target.url);
    }

    /**
     * Initializes a message event.
     *
     * This method is deprecated and is here just to make the event compatible with a "real"
     * message event.
     *
     * @return {void}
     */
    initMessageEvent() {
    }

    /**
     * The data sent by the message emitter.
     *
     * @return {*} The sent data.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
     */
    get data() {
      return this._data;
    }

    /**
     * A `string` representing a unique ID for the event.
     *
     * @return {string} The unique event identifier.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/lastEventId
     */
    get lastEventId() {
      return this._lastEventId;
    }

    /**
     * An array of `MessagePort` objects representing the ports associated with the channel the message is being sent
     * through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker).
     *
     * In this implementation, this method always returns an empty array.
     *
     * @return {Array<Object>} The message ports.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/ports
     */
    get ports() {
      return [];
    }

    /**
     * A USVString representing the origin of the message emitter.
     *
     * @return {string} The message emitter origin.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/origin
     */
    get origin() {
      return this._origin;
    }

    /**
     * A `MessageEventSource` (which can be a `WindowProxy`, `MessagePort`, or `ServiceWorker` object) representing
     * the message emitter.
     *
     * In this implementation, this method always returns `null`.
     *
     * @return {Object} The message emitter source.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/source
     */
    get source() {
      return null;
    }
  }

  return FakeMessageEvent;
});
