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

import '../src/jasmine-sse.js';

describe('jasmine-sse', () => {
  let _EventSource;

  beforeEach(() => {
    _EventSource = window.EventSource;
  });

  afterEach(() => {
    window.EventSource = _EventSource;
  });

  it('should install/uninstall jasmine-sse', () => {
    jasmine.sse().install();

    expect(window.EventSource).toBeDefined();
    expect(window.EventSource).not.toBe(_EventSource);

    jasmine.sse().uninstall();

    expect(window.EventSource).toBeDefined();
    expect(window.EventSource).toBe(_EventSource);
  });

  it('should allow installation of jasmine-sse in a single shot', () => {
    const testFn = jasmine.createSpy('testFn').and.callFake(() => {
      expect(window.EventSource).toBeDefined();
      expect(window.EventSource).not.toBe(_EventSource);
    });

    jasmine.sse().withMock(testFn);

    expect(testFn).toHaveBeenCalledTimes(1);
    expect(window.EventSource).toBeDefined();
    expect(window.EventSource).toBe(_EventSource);
  });

  it('should allow installation of jasmine-sse in a single shot and reset spies if test throw an exception', () => {
    const testFn = jasmine.createSpy('testFn').and.callFake(() => {
      throw new Error('Fail Test');
    });

    expect(() => jasmine.sse().withMock(testFn)).toThrow();

    expect(testFn).toHaveBeenCalledTimes(1);
    expect(window.EventSource).toBeDefined();
    expect(window.EventSource).toBe(_EventSource);
  });

  it('should allow installation of jasmine-sse in a single shot and return that value', () => {
    const testFn = jasmine.createSpy('testFn').and.callFake(() => {
      expect(window.EventSource).toBeDefined();
      expect(window.EventSource).not.toBe(_EventSource);
      return true;
    });

    const result = jasmine.sse().withMock(testFn);

    expect(testFn).toHaveBeenCalledTimes(1);
    expect(window.EventSource).toBeDefined();
    expect(window.EventSource).toBe(_EventSource);
    expect(result).toBe(true);
  });

  it('should fail to uninstall jasmine-sse if it has not been previously installed', () => {
    expect(() => jasmine.sse().uninstall()).toThrow(new Error(
        'It seems that `jasmine.sse` has not been installed, make sure `jasmine.sse().install()` ' +
        'has been called before uninstalling it.'
    ));
  });

  it('should fail to install jasmine-sse if it is already installed', () => {
    jasmine.sse().install();

    expect(() => jasmine.sse().install()).toThrow(new Error(
        'It seems that jasmine-sse has already been installed, make sure `jasmine.sse().uninstall()` ' +
        'has been called after test suite.'
    ));

    jasmine.sse().uninstall();
  });

  describe('once initialized', () => {
    beforeEach(() => {
      jasmine.sse().install();
    });

    it('should receive data', () => {
      const sse = new EventSource('/stream');

      sse.onopen = jasmine.createSpy('onopen');
      sse.onmessage = jasmine.createSpy('onmessage');

      const connection = jasmine.sse().connections().first();
      expect(connection.url).toBe('http://localhost:9876/stream');
      expect(connection.readyState).toBe(0);
      expect(connection.onopen).not.toHaveBeenCalled();
      expect(connection.onmessage).not.toHaveBeenCalled();

      connection.emit('test');

      expect(sse.onopen).toHaveBeenCalledTimes(1);
      expect(sse.onmessage).toHaveBeenCalledTimes(1);
    });
  });
});
