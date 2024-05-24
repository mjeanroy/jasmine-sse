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

import { fakeEventSourceFactory } from '../../src/core/fake-event-source';
import { fakeEventFactory } from '../../src/core/fake-event';

describe('FakeEventSource', () => {
  let FakeEvent;
  let FakeEventSource;

  beforeEach(() => {
    FakeEvent = fakeEventFactory();
    FakeEventSource = fakeEventSourceFactory();
  });

  it('should define state contants', () => {
    expect(FakeEventSource.CONNECTING).toBe(0);
    expect(FakeEventSource.OPEN).toBe(1);
    expect(FakeEventSource.CLOSED).toBe(2);
  });

  it('should instantiate SSE connection', () => {
    const sse = new FakeEventSource('/stream');

    expect(sse.readyState).toBe(0);
    expect(sse.withCredentials).toBe(false);
    expect(sse.url).toBe('http://localhost:9876/stream');
  });

  it('should instantiate SSE connection with `withCredentials`', () => {
    const sse = new FakeEventSource('/stream', {
      withCredentials: true,
    });

    expect(sse.readyState).toBe(0);
    expect(sse.withCredentials).toBe(true);
    expect(sse.url).toBe('http://localhost:9876/stream');
  });

  it('should initialize handlers to null', () => {
    const sse = new FakeEventSource('/stream');
    expect(sse.onopen).toBeNull();
    expect(sse.onmessage).toBeNull();
    expect(sse.onerror).toBeNull();
  });

  describe('once created', () => {
    let sse;

    beforeEach(() => {
      sse = new FakeEventSource('/stream');
    });

    it('should add event listener', () => {
      const event = new FakeEvent('open', sse);
      const listener = jasmine.createSpy('listener').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      sse.addEventListener('open', listener);
      sse.dispatchEvent(event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(event.eventPhase).toBe(0);
    });

    it('should fail to add event listener without any argument', () => {
      expect(() => sse.addEventListener()).toThrow(new Error(
        "Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only 0 present.",
      ));
    });

    it('should fail to add event listener without listener handler', () => {
      expect(() => sse.addEventListener('open')).toThrow(new Error(
        "Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only 1 present.",
      ));
    });

    it('should not add duplicated event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = { type: 'open' };

      sse.addEventListener('open', listener);
      sse.dispatchEvent(event);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not try to remove unregistered event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = { type: 'open' };

      sse.removeEventListener('open', listener);
      sse.dispatchEvent(event);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove event listener', () => {
      const listener = jasmine.createSpy('listener');
      const event = new FakeEvent('open', sse);

      sse.addEventListener('open', listener);
      sse.removeEventListener('open', listener);
      sse.dispatchEvent(event);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should fail to remove event listener without any argument', () => {
      expect(() => sse.removeEventListener()).toThrow(new Error(
        "Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, but only 0 present.",
      ));
    });

    it('should fail to remove event listener without listener handler', () => {
      expect(() => sse.removeEventListener('open')).toThrow(new Error(
        "Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, but only 1 present.",
      ));
    });

    it('should dispatch event to event listeners', () => {
      const event = new FakeEvent('open', sse);
      const onmessage = jasmine.createSpy('onmessage');
      const onopen = jasmine.createSpy('onopen').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      sse.addEventListener('open', onopen);
      sse.addEventListener('message', onmessage);

      const canceled = sse.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen).toHaveBeenCalledWith(event);
      expect(onopen.calls.mostRecent().object).toBe(sse);
      expect(onmessage).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should catch errors in event listeners and execute next listeners', () => {
      spyOn(console, 'error');

      const onOpenListener1 = jasmine.createSpy('onOpenListener1').and.throwError('Error With Listener 1');
      const onOpenListener2 = jasmine.createSpy('onOpenListener2');
      const event = new FakeEvent('open', sse);

      sse.addEventListener('open', onOpenListener1);
      sse.addEventListener('open', onOpenListener2);
      sse.dispatchEvent(event);

      expect(onOpenListener1).toHaveBeenCalled();
      expect(onOpenListener2).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should dispatch event on objects implemeting the handleEvent method', () => {
      const onopen = {
        handleEvent: jasmine.createSpy('onopen').and.callFake((e) => (
          expect(e.eventPhase).toBe(2)
        )),
      };

      const onmessage = {
        handleEvent: jasmine.createSpy('onmessage'),
      };

      const event = new FakeEvent('open', sse);

      sse.addEventListener('open', onopen);
      sse.addEventListener('message', onmessage);

      const canceled = sse.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen.handleEvent).toHaveBeenCalledWith(event);
      expect(onopen.handleEvent.calls.mostRecent().object).toBe(onopen);
      expect(onmessage.handleEvent).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should call direct method listeners', () => {
      const onmessage = jasmine.createSpy('onmessage');
      const event = new FakeEvent('open', sse);
      const onopen = jasmine.createSpy('onopen').and.callFake((e) => (
        expect(e.eventPhase).toBe(2)
      ));

      sse.onopen = onopen;
      sse.onmessage = onmessage;

      const canceled = sse.dispatchEvent(event);

      expect(canceled).toBe(false);
      expect(onopen).toHaveBeenCalledWith(event);
      expect(onopen.calls.mostRecent().object).toBe(sse);
      expect(onmessage).not.toHaveBeenCalledWith();
      expect(event.eventPhase).toBe(0);
    });

    it('should stop immediate propagation of event', () => {
      const listener1 = jasmine.createSpy('listener1').and.callFake((e) => e.stopImmediatePropagation());
      const listener2 = jasmine.createSpy('listener2');
      const event = new FakeEvent('open', sse);

      sse.addEventListener('open', listener1);
      sse.addEventListener('open', listener2);
      sse.dispatchEvent(event);

      expect(listener1).toHaveBeenCalledWith(event);
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should close connection', () => {
      sse.close();
      expect(sse.readyState).toBe(2);
    });
  });
});
