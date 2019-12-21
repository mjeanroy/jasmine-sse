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

import {track, reset, sseTracker} from '../../src/core/sse-tracker.js';

describe('sseTracker', () => {
  it('should get mostRecent connection', () => {
    const sse = jasmine.createSpyObj('FakeEventSource', ['close']);

    track(sse);

    expect(sseTracker.mostRecent()._eventSource).toBe(sse);
    expect(sseTracker.first()._eventSource).toBe(sse);
    expect(sseTracker.at(0)._eventSource).toBe(sse);
    expect(sseTracker.count()).toBe(1);
    expect(sseTracker.all()).toEqual([
      jasmine.objectContaining({
        _eventSource: sse,
      }),
    ]);
  });

  it('should get first connection', () => {
    const sse1 = jasmine.createSpyObj('FakeEventSource', ['close']);
    const sse2 = jasmine.createSpyObj('FakeEventSource', ['close']);

    track(sse1);
    track(sse2);

    expect(sseTracker.mostRecent()._eventSource).toBe(sse2);
    expect(sseTracker.first()._eventSource).toBe(sse1);
    expect(sseTracker.at(0)._eventSource).toBe(sse1);
    expect(sseTracker.at(1)._eventSource).toBe(sse2);
    expect(sseTracker.count()).toBe(2);
    expect(sseTracker.all()).toEqual([
      jasmine.objectContaining({
        _eventSource: sse1,
      }),
      jasmine.objectContaining({
        _eventSource: sse2,
      }),
    ]);
  });

  it('should reset tracked connection', () => {
    const sse1 = jasmine.createSpyObj('FakeEventSource', ['close']);
    const sse2 = jasmine.createSpyObj('FakeEventSource', ['close']);

    track(sse1);
    track(sse2);
    reset();

    expect(sseTracker.mostRecent()).toBeUndefined();
    expect(sseTracker.first()).toBeUndefined();
    expect(sseTracker.at(0)).toBeUndefined();
    expect(sseTracker.at(1)).toBeUndefined();
    expect(sseTracker.count()).toBe(0);
    expect(sseTracker.all()).toEqual([]);
  });
});
