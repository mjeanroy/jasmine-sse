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

import {fakeEventSourceFactory} from '../../src/core/fake-event-source.js';
import {fakeMessageEventFactory} from '../../src/core/fake-message-event.js';

describe('FakeMessageEvent', () => {
  let FakeEventSource;
  let FakeMessageEvent;

  beforeAll(() => {
    FakeMessageEvent = fakeMessageEventFactory();
    FakeEventSource = fakeEventSourceFactory();
  });

  it('should create the fake event', () => {
    const data = {type: 'message', id: '1', data: 'test'};
    const target = new FakeEventSource('/stream');
    const event = new FakeMessageEvent(data, target);

    expect(event.type).toBe('message');
    expect(event.eventPhase).toBe(0);
    expect(event.cancelable).toBe(false);
    expect(event.composed).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(event.bubbles).toBe(false);
    expect(event.isTrusted).toBe(true);
    expect(event.timeStamp).toBeDefined();
    expect(event.cancelBubble).toBe(false);
    expect(event.returnValue).toBe(true);
    expect(event.target).toBe(target);
    expect(event.currentTarget).toBe(target);
    expect(event.srcElement).toBe(target);

    expect(event.data).toBe(data.data);
    expect(event.lastEventId).toBeDefined();
    expect(event.source).toBeNull();
    expect(event.ports).toEqual([]);
  });

  it('should create the fake event with origin of given URL', () => {
    const data = {type: 'message', id: '1', data: 'test'};
    const target = new FakeEventSource('/stream');
    const event = new FakeMessageEvent(data, target);
    expect(event.origin).toBe('http://localhost:9876');
  });

  it('should create the fake event with custom type', () => {
    const data = {type: 'custom', id: '1', data: 'test'};
    const target = new FakeEventSource('/stream');
    const event = new FakeMessageEvent(data, target);

    expect(event.type).toBe('custom');
    expect(event.eventPhase).toBe(0);
    expect(event.cancelable).toBe(false);
    expect(event.composed).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(event.bubbles).toBe(false);
    expect(event.isTrusted).toBe(true);
    expect(event.timeStamp).toBeDefined();
    expect(event.cancelBubble).toBe(false);
    expect(event.returnValue).toBe(true);
    expect(event.target).toBe(target);
    expect(event.currentTarget).toBe(target);
    expect(event.srcElement).toBe(target);

    expect(event.data).toBe(data.data);
    expect(event.lastEventId).toBeDefined();
    expect(event.source).toBeNull();
    expect(event.ports).toEqual([]);
  });

  describe('once created', () => {
    let event;

    beforeEach(() => {
      const data = {type: 'message', id: '1', data: 'test'};
      const target = new FakeEventSource('/stream');
      event = new FakeMessageEvent(data, target);
    });

    it('should prevent default if event is caccelable', () => {
      event._cancelable = true;
      event.preventDefault();
      expect(event.defaultPrevented).toBe(true);
    });

    it('should not prevent default if event is not caccelable', () => {
      event.preventDefault();
      expect(event.defaultPrevented).toBe(false);
    });

    it('should stop propagation', () => {
      event.stopPropagation();
      expect(event.cancelBubble).toBe(true);
    });

    it('should stop immediate propagation', () => {
      event.stopImmediatePropagation();
      expect(event.cancelBubble).toBe(true);
    });
  });
});
