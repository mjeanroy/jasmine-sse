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

/**
 * A fake `URL` implementation.
 *
 * @class
 */
class FakeUrl {
  /**
   * Build the fake `URL`.
   *
   * @param {string} protocol The URL protocol.
   * @param {string} username  The URL username.
   * @param {string} password The URL password.
   * @param {string} host The URL host.
   * @param {string} hostname The URL hostname.
   * @param {string} port The URL port.
   * @param {string} pathname The URL pathname.
   * @param {string} search  The URL search (a.k.a the query string).
   * @param {string} hash The URL hash (a.k.a the fragment).
   * @constructor
   */
  constructor(protocol, username, password, host, hostname, port, pathname, search, hash) {
    this.protocol = protocol;
    this.username = username || '';
    this.password = password || '';
    this.host = host || null;
    this.hostname = hostname || null;
    this.port = port || null;
    this.pathname = pathname || '';
    this.search = search || '';
    this.hash = hash || '';

    // Ensure the pathname always starts with a '/'
    if (this.pathname[0] !== '/') {
      this.pathname = '/' + this.pathname;
    }
  }

  /**
   * Serialize the URL to a `string`.
   *
   * @return {string} The serialized value.
   * @override
   */
  toString() {
    // 1- Let output be url’s scheme and U+003A (:) concatenated.
    let output = this.protocol;

    // 2- If url’s host is non-null:
    if (this.host !== null) {
      // 2-1 Append "//" to output.
      output += '//';

      // 2-2 If url includes credentials, then:
      if (this.username !== '' || this.password !== '') {
        // 2-2-1 Append url’s username to output.
        output += this.username;

        // 2-2-2 If url’s password is not the empty string, then append U+003A (:), followed by url’s
        // password, to output.
        if (this.password !== '') {
          output += this.password;
          output += ':';
        }

        // 2-2-3 Append U+0040 (@) to output.
        output += '@';
      }

      // 2-3 Append url’s host, serialized, to output.
      output += this.hostname;

      // 2-4 If url’s port is non-null, append U+003A (:) followed by url’s port, serialized, to output.
      if (this.port !== null) {
        output += ':';
        output += this.port;
      }
    }

    // 3- Otherwise, if url’s host is null and url’s scheme is "file", append "//" to output.
    if (this.host === null && this.protocol === 'file:') {
      output += '//';
    }

    // 4- Otherwise, then for each string in url’s path, append U+002F (/) followed by the string to output.
    output += this.pathname;

    // 5- If url’s query is non-null, append U+003F (?), followed by url’s query, to output.
    if (this.search !== '') {
      output += this.search;
    }

    // 6- If the exclude fragment flag is unset and url’s fragment is non-null, append U+0023 (#),
    // followed by url’s fragment, to output.
    if (this.hash !== '') {
      output += this.hash;
    }

    return output;
  }
}

/**
 * Parse URL using native API.
 *
 * @param {string} url The URL.
 * @return {FakeUrl} The parsed URL.
 */
function nativeUrl(url) {
  const result = new URL(url);
  return new FakeUrl(
      result.protocol,
      result.username,
      result.password,
      result.host,
      result.hostname,
      result.port,
      result.pathname,
      result.search,
      result.hash
  );
}

/**
 * Parse URL using polyfill url parser.
 *
 * @param {string} url The URL.
 * @return {FakeUrl} The parsed URL.
 */
function polyfillUrl(url) {
  const a = document.createElement('a');
  a.href = url;

  return new FakeUrl(
      a.protocol,
      a.username,
      a.password,
      a.host,
      a.hostname,
      a.port,
      a.pathname,
      a.search,
      a.hash
  );
}

/**
 * Check for `URL` support in current environment.
 *
 * @return {boolean} `true` if `URL` supported, `false` otherwise.
 */
function checkUrlSupport() {
  try {
    return new URL('http://localhost') !== null;
  } catch (e) {
    return false;
  }
}

const toUrl = checkUrlSupport() ? nativeUrl : polyfillUrl;

/**
 * Parse given URL to a new `URL` instance, returns `null` if URL parsing fails.
 *
 * @param {string} url The URL.
 * @return {FakeUrl} The parsed URL.
 */
export function parseUrl(url) {
  if (!url) {
    return null;
  }

  try {
    return toUrl(url);
  } catch (e) {
    return null;
  }
}
