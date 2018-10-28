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

import {parseUrl} from '../../../src/core/common/parse-url.js';

describe('parseUrl', () => {
  it('should parse given URL', () => {
    const input = 'ws://localhost:9200';
    const url = parseUrl(input);
    expect(url).not.toBeNull();
    expect(url.protocol).toBe('ws:');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.host).toBe('localhost:9200');
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('9200');
    expect(url.pathname).toBe('/');
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.toString()).toBe('ws://localhost:9200/');
  });

  it('should parse given URL with pathname', () => {
    const input = 'ws://localhost:9200/test';
    const url = parseUrl(input);
    expect(url).not.toBeNull();
    expect(url.protocol).toBe('ws:');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.host).toBe('localhost:9200');
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('9200');
    expect(url.pathname).toBe('/test');
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.toString()).toBe('ws://localhost:9200/test');
  });

  it('should parse given URL with fragment', () => {
    const input = 'http://localhost:9200#test';
    const url = parseUrl(input);
    expect(url).not.toBeNull();
    expect(url.protocol).toBe('http:');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.host).toBe('localhost:9200');
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('9200');
    expect(url.pathname).toBe('/');
    expect(url.search).toBe('');
    expect(url.hash).toBe('#test');
    expect(url.toString()).toBe('http://localhost:9200/#test');
  });

  it('should parse given URL with query string', () => {
    const input = 'http://localhost:9200?foo&bar';
    const url = parseUrl(input);
    expect(url).not.toBeNull();
    expect(url.protocol).toBe('http:');
    expect(url.username).toBe('');
    expect(url.password).toBe('');
    expect(url.host).toBe('localhost:9200');
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('9200');
    expect(url.pathname).toBe('/');
    expect(url.search).toBe('?foo&bar');
    expect(url.hash).toBe('');
    expect(url.toString()).toBe('http://localhost:9200/?foo&bar');
  });

  it('should return null with empty URL', () => {
    const input = '';
    const url = parseUrl(input);
    expect(url).toBeNull();
  });
});
