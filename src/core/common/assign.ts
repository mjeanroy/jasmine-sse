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

import {forEach} from './for-each.js';
import {keys} from './keys.js';

interface AnyObject {
  [k: string]: any;
}

const _assign = Object.assign ? Object.assign : ((target: AnyObject, ...sources: AnyObject[]): object => {
  const to = Object(target);

  for (let i = 0, size = sources.length; i < size; ++i) {
    const current: AnyObject = sources[i];
    const currentKeys: string[] = keys(current);
    forEach(currentKeys, (k) => {
      to[k] = current[k];
    });
  }

  return to;
});

/**
 * Assigns own enumerable string keyed properties of source objects to the destination object.
 * Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.
 *
 * @param {Object} target The destination object.
 * @param {Array<Object>} sources The source objects.
 * @return {Object} The merged object.
 */
export function assign(target: AnyObject, ...sources: AnyObject[]): AnyObject {
  return _assign(target, ...sources);
}
