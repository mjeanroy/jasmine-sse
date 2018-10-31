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
 * No event is being processed at this time.
 * @type {number}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
 */
export const NONE = 0;

/**
 * The event is being propagated through the target's ancestor objects.
 * This process starts with the Window, then Document, then the HTMLHtmlElement, and so on through
 * the elements until the target's parent is reached.
 * Event listeners registered for capture mode when EventTarget.addEventListener() was called are
 * triggered during this phase.
 *
 * @type {number}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
 */
export const CAPTURING_PHASE = 1;

/**
 * The event has arrived at the event's target. Event listeners registered for this phase are
 * called at this time.
 * If Event.bubbles is `false`, processing the event is finished after this phase is complete.
 *
 * @type {number}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
 */
export const AT_TARGET = 2;

/**
 * The event is propagating back up through the target's ancestors in reverse order,
 * starting with the parent, and eventually reaching the containing Window.
 * This is known as bubbling, and occurs only if Event.bubbles is `true`.
 * Event listeners registered for this phase are triggered during this process.
 *
 * @type {number}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
 */
export const BUBBLING_PHASE = 3;
