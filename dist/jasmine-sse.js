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
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * Iterates over elements of collection and invokes iteratee for each element.
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given iteratee function.
   * @return {void}
   */
  function forEach(array, iteratee) {
    for (var i = 0, size = array.length; i < size; ++i) {
      iteratee.call(null, array[i], i, array);
    }
  }

  /**
   * The `Object` prototype.
   * @type {Object}
   */
  var ObjectProto = Object.prototype;

  /**
   * Check if a given object has given key as own property.
   *
   * @param {Object} object The given object.
   * @param {string} key The given key.
   * @return {boolean} `true` if `objecct` has given `key`, `false`otherwise.
   */

  function has(object, key) {
    return ObjectProto.hasOwnProperty.call(object, key);
  }

  /**
   * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *
   * @param {Array<*>} array The array.
   * @param {*} item The element to look for.
   * @return {number} The index of element in the array, -1 otherwise.
   */
  function indexOf(array, item) {
    return array.indexOf(item);
  }

  /**
   * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *
   * @param {Array<*>} array The array.
   * @param {*} item The element to look for.
   * @return {number} The index of element in the array, -1 otherwise.
   */

  function includes(array, item) {
    return indexOf(array, item) >= 0;
  }

  /**
   * Check if a given value is `null`.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `null`, `false`otherwise.
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Check if a given value is `undefined`.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `undefined`, `false`otherwise.
   */
  function isUndefined(value) {
    return value === void 0;
  }

  /**
   * Return the tag name of the object (a.k.a the result of `Object.prototype.toString`).
   *
   * @param {*} value Object to get tag name.
   * @return {string} Tag name.
   */

  function tagName(value) {
    if (isNull(value)) {
      return '[object Null]';
    }

    if (isUndefined(value)) {
      return '[object Undefined]';
    }

    return ObjectProto.toString.call(value);
  }

  /**
   * Check that a given value is of a given type.
   * The type is the tag name displayed with `Object.prototype.toString`
   * function call.
   *
   * @param {*} value Value to check.
   * @param {string} type The type id.
   * @return {boolean} `true` if `obj` is of given type, `false` otherwise.
   */

  function is(value, type) {
    return tagName(value) === "[object ".concat(type, "]");
  }

  /**
   * Check if a given value is a `string` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `string`, `false`otherwise.
   */

  function isFunction(value) {
    return is(value, 'Function');
  }

  /**
   * The factory value initializer.
   * @type {Object}
   */
  var NULL_OBJECT = {};
  /**
   * A factory that will build a given getter function to compute a value once (and
   * only once).
   *
   * @param {function} factoryFn The factory function.
   * @return {function} The getter function.
   */

  function factory(factoryFn) {
    var value = NULL_OBJECT;
    return function() {
      if (value === NULL_OBJECT) {
        value = factoryFn();
      }

      return value;
    };
  }

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

  /**
   * A fake `URL` implementation.
   *
   * @class
   */
  var FakeUrl =
  /*#__PURE__*/
  function() {
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
    function FakeUrl(protocol, username, password, host, hostname, port, pathname, search, hash) {
      _classCallCheck(this, FakeUrl);

      this.protocol = protocol;
      this.username = username || '';
      this.password = password || '';
      this.host = host || null;
      this.hostname = hostname || null;
      this.port = port || null;
      this.pathname = pathname || '';
      this.search = search || '';
      this.hash = hash || ''; // Ensure the pathname always starts with a '/'

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


    _createClass(FakeUrl, [{
      key: "toString",
      value: function toString() {
        // 1- Let output be url’s scheme and U+003A (:) concatenated.
        var output = this.protocol; // 2- If url’s host is non-null:

        if (this.host !== null) {
          // 2-1 Append "//" to output.
          output += '//'; // 2-2 If url includes credentials, then:

          if (this.username !== '' || this.password !== '') {
            // 2-2-1 Append url’s username to output.
            output += this.username; // 2-2-2 If url’s password is not the empty string, then append U+003A (:), followed by url’s
            // password, to output.

            if (this.password !== '') {
              output += this.password;
              output += ':';
            } // 2-2-3 Append U+0040 (@) to output.


            output += '@';
          } // 2-3 Append url’s host, serialized, to output.


          output += this.hostname; // 2-4 If url’s port is non-null, append U+003A (:) followed by url’s port, serialized, to output.

          if (this.port !== null) {
            output += ':';
            output += this.port;
          }
        } // 3- Otherwise, if url’s host is null and url’s scheme is "file", append "//" to output.


        if (this.host === null && this.protocol === 'file:') {
          output += '//';
        } // 4- Otherwise, then for each string in url’s path, append U+002F (/) followed by the string to output.


        output += this.pathname; // 5- If url’s query is non-null, append U+003F (?), followed by url’s query, to output.

        if (this.search !== '') {
          output += this.search;
        } // 6- If the exclude fragment flag is unset and url’s fragment is non-null, append U+0023 (#),
        // followed by url’s fragment, to output.


        if (this.hash !== '') {
          output += this.hash;
        }

        return output;
      }
    }]);

    return FakeUrl;
  }();
  /**
   * Parse URL using native API.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */


  function nativeUrl(url) {
    var result = new URL(url, document.documentURI);
    return new FakeUrl(result.protocol, result.username, result.password, result.host, result.hostname, result.port, result.pathname, result.search, result.hash);
  }
  /**
   * Parse URL using polyfill url parser.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */


  function polyfillUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return new FakeUrl(a.protocol, a.username, a.password, a.host, a.hostname, a.port, a.pathname, a.search, a.hash);
  }
  /**
   * Ensure that given URL is valid with expected values.
   *
   * @param {URL} url The URL.
   * @param {string} protocol The expected protocol part.
   * @param {string} hostname The expected hostname part.
   * @param {string} port The expected port part.
   * @param {string} pathname The expected pathname part.
   * @param {string} search The expected search part.
   * @return {boolean} `true` if `url` has expected settings, `false` otherwise.
   */


  function ensureUrl(url, protocol, hostname, port, pathname, search) {
    return url !== null && url.protocol === protocol && url.hostname === hostname && url.port === port && url.host === "".concat(hostname, ":").concat(port) && url.pathname === pathname;
  }
  /**
   * Check for `URL` support in current environment.
   *
   * @return {boolean} `true` if `URL` supported, `false` otherwise.
   */


  function checkUrlSupport() {
    try {
      var url = new URL('http://localhost:8080/test?q') !== null;
      return ensureUrl(url, 'http:', 'localhost', '8080', '/test', '?q');
    } catch (e) {
      return false;
    }
  }

  var toUrl = checkUrlSupport() ? nativeUrl : polyfillUrl;
  /**
   * Parse given URL to a new `URL` instance, returns `null` if URL parsing fails.
   *
   * @param {string} url The URL.
   * @return {FakeUrl} The parsed URL.
   */

  function parseUrl(url) {
    if (!url) {
      return null;
    }

    try {
      return toUrl(url);
    } catch (e) {
      return null;
    }
  }

  /**
   * No event is being processed at this time.
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */
  var NONE = 0;
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

  var CAPTURING_PHASE = 1;
  /**
   * The event has arrived at the event's target. Event listeners registered for this phase are
   * called at this time.
   * If Event.bubbles is `false`, processing the event is finished after this phase is complete.
   *
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */

  var AT_TARGET = 2;
  /**
   * The event is propagating back up through the target's ancestors in reverse order,
   * starting with the parent, and eventually reaching the containing Window.
   * This is known as bubbling, and occurs only if Event.bubbles is `true`.
   * Event listeners registered for this phase are triggered during this process.
   *
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#Constants
   */

  var BUBBLING_PHASE = 3;

  var fakeEventFactory = factory(function() {
    /**
     * A fake implementation of `Event`.
     *
     * @class
     */
    var FakeEvent =
    /*#__PURE__*/
    function() {
      /**
       * Create the fake `Event` class.
       *
       * @param {string} type The event type.
       * @param {*} target The event target.
       * @constructor
       */
      function FakeEvent(type, target) {
        _classCallCheck(this, FakeEvent);

        this._type = type;
        this._eventPhase = NONE;
        this._cancelable = false;
        this._defaultPrevented = false;
        this._bubbles = false;
        this._isTrusted = true;
        this._composed = false;
        this._timeStamp = new Date().getTime();
        this._stopped = false;
        this._target = target;
        this._currentTarget = target;
        this._srcElement = target; // Non readonly properties.

        this.returnValue = true;
        this.cancelBubble = false;
      }
      /**
       * The name of the event (case-insensitive).
       *
       * @return {string} The event type.
       */


      _createClass(FakeEvent, [{
        key: "initEvent",

        /**
         * Initializes the value of an Event created. If the event has already being
         * dispatched, this method does nothing.
         *
         * @return {void}
         */
        value: function initEvent() {}
        /**
         * Cancels the event (if it is cancelable).
         *
         * @return {void}
         */

      }, {
        key: "preventDefault",
        value: function preventDefault() {
          if (this._cancelable) {
            this._defaultPrevented = true;
          }
        }
        /**
         * For this particular event, no other listener will be called.
         * Neither those attached on the same element, nor those attached on elements
         * which will be traversed later (in capture phase, for instance).
         *
         * @return {void}
         */

      }, {
        key: "stopImmediatePropagation",
        value: function stopImmediatePropagation() {
          this.cancelBubble = true;
          this._stopped = true;
        }
        /**
         * Stops the propagation of events further along in the DOM.
         *
         * @return {void}
         */

      }, {
        key: "stopPropagation",
        value: function stopPropagation() {
          this.cancelBubble = true;
        }
      }, {
        key: "type",
        get: function get() {
          return this._type;
        }
        /**
         * Indicates which phase of the event flow is currently being evaluated.
         *
         * @return {number} An integer value which specifies the current evaluation phase.
         */

      }, {
        key: "eventPhase",
        get: function get() {
          return this._eventPhase;
        }
        /**
         * A Boolean indicating whether the event is cancelable.
         *
         * @return {boolean} The `cancelable` flag.
         */

      }, {
        key: "cancelable",
        get: function get() {
          return this._cancelable;
        }
        /**
         * Indicates whether or not event.preventDefault() has been called on the event.
         *
         * @return {boolean} `true` if `preventDefault` has been called, `false` otherwise.
         */

      }, {
        key: "defaultPrevented",
        get: function get() {
          return this._defaultPrevented;
        }
        /**
         * A Boolean indicating whether the event bubbles up through the DOM or not.
         *
         * @return {boolean} The `bubbles` flag.
         */

      }, {
        key: "bubbles",
        get: function get() {
          return this._bubbles;
        }
        /**
         * A Boolean value indicating whether or not the event can bubble across the
         * boundary between the shadow DOM and the regular DOM.
         *
         * @return {boolean} The `composed` flag.
         */

      }, {
        key: "composed",
        get: function get() {
          return this._composed;
        }
        /**
         * The time at which the event was created (in milliseconds)
         *  By specification, this value is time since epoch.
         *
         * @return {number} The timestamp of event creation.
         */

      }, {
        key: "timeStamp",
        get: function get() {
          return this._timeStamp;
        }
        /**
         * The isTrusted read-only property of the Event interface is a boolean that is true
         * when the event was generated by a user action, and false when the event was
         * created or modified by a script or dispatched via dispatchEvent.
         *
         * @return {boolean} The `isTrusted` flag.
         */

      }, {
        key: "isTrusted",
        get: function get() {
          return this._isTrusted;
        }
        /**
         * A reference to the currently registered target for the event.
         * This is the object to which the event is currently slated to be sent; it's possible
         * this has been changed along the way through retargeting.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "currentTarget",
        get: function get() {
          return this._currentTarget;
        }
        /**
         * A reference to the target to which the event was originally dispatched.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "target",
        get: function get() {
          return this._target;
        }
        /**
         * The non-standard alias (from old versions of Microsoft Internet Explorer) for Event.target,
         * which is starting to be supported in some other browsers for web compatibility purposes.
         *
         * @return {Object} The event target.
         */

      }, {
        key: "srcElement",
        get: function get() {
          return this._srcElement;
        }
      }]);

      return FakeEvent;
    }();

    FakeEvent.NONE = NONE;
    FakeEvent.BUBBLING_PHASE = BUBBLING_PHASE;
    FakeEvent.CAPTURING_PHASE = CAPTURING_PHASE;
    FakeEvent.AT_TARGET = AT_TARGET;
    return FakeEvent;
  });

  /**
   * Creates an array of the own enumerable property names of object.
   *
   * @param {Object} object The object to get keys.
   * @return {Array<string>} Array of all enumerable keys of `object`.
   */
  function keys(object) {
    return Object.keys(object);
  }

  var _assign = Object.assign ? Object.assign : function(target) {
    var _arguments = arguments;
    var to = Object(target);

    var _loop = function _loop(i, size) {
      var current = i + 1 < 1 || _arguments.length <= i + 1 ? undefined : _arguments[i + 1];
      var currentKeys = keys(current);
      forEach(currentKeys, function(k) {
        to[k] = current[k];
      });
    };

    for (var i = 0, size = arguments.length <= 1 ? 0 : arguments.length - 1; i < size; ++i) {
      _loop(i);
    }

    return to;
  };
  /**
   * Assigns own enumerable string keyed properties of source objects to the destination object.
   * Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.
   *
   * @param {Object} target The destination object.
   * @param {Array<Object>} sources The source objects.
   * @return {Object} The merged object.
   */


  function assign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return _assign.apply(void 0, [target].concat(sources));
  }

  /**
   * Check if a given value is `undefined` or `null`.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is `undefined` or `null`, `false`otherwise.
   */

  function isNil(value) {
    return isNull(value) || isUndefined(value);
  }

  /**
   * Check if a given value is an array value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is an array, `false`otherwise.
   */
  function isArray(value) {
    return Array.isArray(value);
  }

  /**
   * Check if a given value is a `string` value.
   *
   * @param {*} value The value to check.
   * @return {boolean} `true` if `value` is a `string`, `false`otherwise.
   */

  function isObject(value) {
    if (isNil(value) || isFunction(value) || isArray(value)) {
      return false;
    }

    return _typeof(value) === 'object';
  }

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

  /**
   * Flatten all given array into a new single flat array.
   *
   * @param {Array<Array<*>>} arrays Array of given arrays.
   * @return {Array<*>} An array containing all arrays elements.
   */
  function flatten(arrays) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(arrays));
  }

  /**
   * Map each elements of given array to an array of new elements, each one
   * being the results of the `iteratee` function.
   *
   * @param {Array<*>} array The given array.
   * @param {function} iteratee The given predicate.
   * @return {Array<*>} The new results.
   */
  function map(array, iteratee) {
    var results = [];

    for (var i = 0, size = array.length; i < size; ++i) {
      results.push(iteratee.call(null, array[i], i, array));
    }

    return results;
  }

  /**
   * Get array of all object values.
   *
   * @param {Object} object The given object.
   * @return {Array<Object>} The array of values.
   */

  function values(object) {
    return map(keys(object), function(k) {
      return object[k];
    });
  }

  /**
   * Parse URL and extract origin (protocol, host and port if provided).
   *
   * @param {string} url Given URL.
   * @return {string} URL Origin.
   */

  function parseUrlOrigin(url) {
    var parsedUrl = parseUrl(url);
    return "".concat(parsedUrl.protocol, "//").concat(parsedUrl.host);
  }

  var fakeMessageEventFactory = factory(function() {
    var FakeEvent = fakeEventFactory();
    /**
     * A fake Message Event.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
     */

    var FakeMessageEvent =
    /*#__PURE__*/
    function(_FakeEvent) {
      _inherits(FakeMessageEvent, _FakeEvent);

      /**
       * Create the fake event.
       *
       * @param {Object} data The sent data.
       * @param {FakeEventSource} target The `EventSource` connection.
       * @constructor
       */
      function FakeMessageEvent(data, target) {
        var _this;

        _classCallCheck(this, FakeMessageEvent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(FakeMessageEvent).call(this, data.type, target));
        _this._data = data.data;
        _this._lastEventId = data.id;
        _this._origin = parseUrlOrigin(target.url);
        return _this;
      }
      /**
       * Initializes a message event.
       *
       * This method is deprecated and is here just to make the event compatible with a "real"
       * message event.
       *
       * @return {void}
       */


      _createClass(FakeMessageEvent, [{
        key: "initMessageEvent",
        value: function initMessageEvent() {}
        /**
         * The data sent by the message emitter.
         *
         * @return {*} The sent data.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
         */

      }, {
        key: "data",
        get: function get() {
          return this._data;
        }
        /**
         * A `string` representing a unique ID for the event.
         *
         * @return {string} The unique event identifier.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/lastEventId
         */

      }, {
        key: "lastEventId",
        get: function get() {
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

      }, {
        key: "ports",
        get: function get() {
          return [];
        }
        /**
         * A USVString representing the origin of the message emitter.
         *
         * @return {string} The message emitter origin.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/origin
         */

      }, {
        key: "origin",
        get: function get() {
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

      }, {
        key: "source",
        get: function get() {
          return null;
        }
      }]);

      return FakeMessageEvent;
    }(FakeEvent);

    return FakeMessageEvent;
  });

  /**
   * The connection has not yet been established.
   * @type {number}
   * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-connecting
   */
  var CONNECTING = 0;
  /**
   * The user agent has an open connection and is dispatching events as it receives them.
   * @type {number}
   * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-open
   */

  var OPEN = 1;
  /**
   * The connection is not open, and the user agent is not trying to reconnect. Either there was a fatal error or
   * the close() method was invoked.
   * @type {number}
   * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed
   */

  var CLOSED = 2;

  var fakeEventSourceProxyFactory = factory(function() {
    var FakeMessageEvent = fakeMessageEventFactory();
    /**
     * A proxy for `FakeEventSource` instance that add some methods that can
     * be called in unit tests.
     *
     * @class
     */

    var FakeEventSourceProxy =
    /*#__PURE__*/
    function() {
      /**
       * Create the `FakeEventSourceProx` instance.
       *
       * @param {FakeEventSource} eventSource The `eventSource` instance.
       * @param {*} eventSourceInitDict The `EventSource` initialization parameter.
       * @constructor
       */
      function FakeEventSourceProxy(eventSource) {
        _classCallCheck(this, FakeEventSourceProxy);

        this._eventSource = eventSource;
      }
      /**
       * Returns the `url` flag of the internal `eventSource` instance.
      s     *
       * @return {string} The connection URL.
       */


      _createClass(FakeEventSourceProxy, [{
        key: "addEventListener",

        /**
         * Add new event listener to internal event source connection.
         *
         * @param {string} type Event type.
         * @param {function|Object} listener The listener.
         * @return {void}
         */
        value: function addEventListener(type, listener) {
          this._eventSource.addEventListener(type, listener);
        }
        /**
         * Remove event listener from internal event source connection.
         *
         * @param {string} type Event type.
         * @param {function|Object} listener The listener.
         * @return {void}
         */

      }, {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
          this._eventSource.removeEventListener(type, listener);
        }
        /**
         * Dispatch event to internal event source connection.
         *
         * @param {Object} event The event to dispatch.
         * @return {void}
         */

      }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          this._eventSource.dispatchEvent(event);
        }
        /**
         * Sets the `readyState` value of internal event source connection to `CLOSED`.
         *
         * @return {void}
         */

      }, {
        key: "close",
        value: function close() {
          this._eventSource.close();
        }
        /**
         * Emit new message to the sse connection.
         *
         * @param {string|object} data The message data to emit.
         * @return {void}
         */

      }, {
        key: "emit",
        value: function emit(data) {
          if (isNil(data) || isFunction(data)) {
            throw new Error("Failed to emit message on 'EventSource': The message is ".concat(String(data), "."));
          }

          if (this._eventSource.readyState === CLOSED) {
            throw new Error("Failed to emit message on 'EventSource': The connection state is CLOSED.");
          }

          var message = {
            type: 'message'
          };

          if (isObject(data)) {
            message = assign(message, data);
          } else {
            message = assign(message, {
              data: String(data)
            });
          }

          if (this._eventSource._readyState === CONNECTING) {
            this._eventSource._announceConnection();
          }

          this._eventSource.dispatchEvent(new FakeMessageEvent(message, this._eventSource));
        }
        /**
         * Fail the `EventSource` connection.
         *
         * @return {void}
         * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#fail-the-connection
         */

      }, {
        key: "failConnection",
        value: function failConnection() {
          if (this._eventSource.readyState !== CLOSED) {
            this._eventSource._failConnection();
          }
        }
        /**
         * Reestablish the connection.
         *
         * @return {void}
         * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#reestablish-the-connection
         */

      }, {
        key: "reestablishConnection",
        value: function reestablishConnection() {
          if (this._eventSource.readyState !== CLOSED) {
            this._eventSource._reestablishConnection();
          }
        }
        /**
         * Get all registered listeners, or listeners for given specific event
         * type.
         *
         * @param {string} type Event type (optional).
         * @return {Array<function>} The registered listeners.
         */

      }, {
        key: "getEventListeners",
        value: function getEventListeners() {
          var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var sseListeners = this._eventSource._listeners;
          var listeners = type ? sseListeners[type] : flatten(values(sseListeners));
          return listeners ? listeners.slice() : [];
        }
      }, {
        key: "url",
        get: function get() {
          return this._eventSource.url;
        }
        /**
         * Returns the state of the internal `eventSource` instance.
         *
         * @return {number} The connection state.
         */

      }, {
        key: "readyState",
        get: function get() {
          return this._eventSource.readyState;
        }
        /**
         * Returns the `withCredentials` flag of the internal `eventSource` instance.
         *
         * @return {boolean} The credentials mode.
         */

      }, {
        key: "withCredentials",
        get: function get() {
          return this._eventSource.withCredentials;
        }
        /**
         * Get the tracked `EventSource` `onopen` handler.
         *
         * @return {function} The `onopen` handler.
         */

      }, {
        key: "onopen",
        get: function get() {
          return this._eventSource.onopen;
        }, /**
         * Set the tracked `EventSource` `onopen` handler.
         *
         * @param {function} onopen The `onopen` handler.
         * @return {void}
         */
        set: function set(onopen) {
          this._eventSource.onopen = onopen;
        }
        /**
         * Get the tracked `EventSource` `onerror` handler.
         *
         * @return {function} The `onerror` handler.
         */

      }, {
        key: "onerror",
        get: function get() {
          return this._eventSource.onerror;
        }, /**
         * Set the tracked `EventSource` `onerror` handler.
         *
         * @param {function} onerror The `onerror` handler.
         * @return {void}
         */
        set: function set(onerror) {
          this._eventSource.onerror = onerror;
        }
        /**
         * Get the tracked `EventSource` `onmessage` handler.
         *
         * @return {function} The `onmessage` handler.
         */

      }, {
        key: "onmessage",
        get: function get() {
          return this._eventSource.onmessage;
        }, /**
         * Set the tracked `EventSource` `onmessage` handler.
         *
         * @param {function} onmessage The `onmessage` handler.
         * @return {void}
         */
        set: function set(onmessage) {
          this._eventSource.onmessage = onmessage;
        }
      }]);

      return FakeEventSourceProxy;
    }();

    FakeEventSourceProxy.CONNECTING = CONNECTING;
    FakeEventSourceProxy.OPEN = OPEN;
    FakeEventSourceProxy.CLOSED = CLOSED;
    return FakeEventSourceProxy;
  });

  /**
   * The queue of opened `EventSource`.
   * @type {Array<FakeEventSource>}
   */

  var queue = [];
  /**
   * Add `FakeEventSource` to the internal tracker.
   * @param {FakeEventSource} ws The `FakeEventSource` to track.
   * @return {void}
   */

  function track(ws) {
    var FakeEventSourceProxy = fakeEventSourceProxyFactory();
    var proxy = new FakeEventSourceProxy(ws);
    queue.push(proxy);
  }
  /**
   * Reset all tracked `EventSource`.
   *
   * @return {void}
   */

  function reset() {
    queue.splice(0, queue.length);
  }
  var sseTracker = {
    /**
     * Get the most recent tracked `EventSource`.
     *
     * @return {FakeEventSource} The last tracked connection.
     */
    mostRecent: function mostRecent() {
      return queue[queue.length - 1];
    },

    /**
     * Get the first tracked `EventSource`.
     *
     * @return {FakeEventSource} The first tracked connection.
     */
    first: function first() {
      return queue[0];
    },

    /**
     * Get the tracked `EventSource` at given index.
     *
     * @param {number} idx The tracked index.
     * @return {FakeEventSource} The tracked connection at given index.
     */
    at: function at(idx) {
      return queue[idx];
    },

    /**
     * Get the number of previously opened `EventSource` connections.
     *
     * @return {number} Number of tracked connections.
     */
    count: function count() {
      return queue.length;
    },

    /**
     * Get all previously opened `EventSource` connections.
     *
     * @return {Array<FakeEventSource>} The list of tracked connections.
     */
    all: function all() {
      return queue.slice();
    }
  };

  var fakeEventSourceFactory = factory(function() {
    var FakeEvent = fakeEventFactory();
    /**
     * The fake `EventSource` implementation.
     *
     * @class
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface
     */

    var FakeEventSource =
    /*#__PURE__*/
    function() {
      /**
       * Create the `EventSource` connection.
       *
       * @param {string} url The connection URL.
       * @param {*} eventSourceInitDict The `EventSource` initialization parameter.
       * @constructor
       * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource
       */
      function FakeEventSource(url) {
        var eventSourceInitDict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, FakeEventSource);

        // 1- Let ev be a new EventSource object.
        // 2- Let settings be ev's relevant settings object.
        // 3- Let urlRecord be the result of parsing url with settings's API base URL and settings's
        // API URL character encoding.
        // 3-1 If urlRecord is failure, then throw a "SyntaxError" DOMException.
        // 3-2 Set ev's url to urlRecord.
        var urlRecord = parseUrl(url);

        if (!urlRecord) {
          throw new SyntaxError("Failed to construct 'EventSource': The URL '".concat(url, "' is invalid."));
        }

        this._url = urlRecord; // 4- Let corsAttributeState be Anonymous.

        this._corsAttributeState = 'anonymous';
        this._withCredentials = false; // 5- If the value of eventSourceInitDict's withCredentials member is true,
        // then set corsAttributeState to Use Credentials and set ev's withCredentials attribute to true.

        if (eventSourceInitDict.withCredentials === true) {
          this._corsAttributeState = 'use-credentials';
          this._withCredentials = true;
        } // When the object is created its readyState must be set to CONNECTING (0)


        this._readyState = CONNECTING;
        this._listeners = {};
        this.onopen = null;
        this.onmessage = null;
        this.onerror = null; // Track connection.

        track(this);
      }
      /**
       * Returns the URL providing the event stream.
       *
       * @return {string} The connection URL.
       */


      _createClass(FakeEventSource, [{
        key: "addEventListener",

        /**
         * Sets up a function that will be called whenever the specified event is delivered to the target.
         *
         * @param {string} event The event identifier.
         * @param {function} listener The listener function.
         * @return {void}
         */
        value: function addEventListener(event, listener) {
          var nbArguments = arguments.length;

          if (nbArguments !== 2) {
            throw new TypeError("Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, " + "but only ".concat(nbArguments, " present."));
          }

          if (!has(this._listeners, event)) {
            this._listeners[event] = [];
          }

          var listeners = this._listeners[event];

          if (!includes(listeners, listener)) {
            listeners.push(listener);
          }
        }
        /**
         * Removes from the  event listener previously registered with `addEventListener()`.
         *
         * @param {string} event The event name.
         * @param {function} listener The listener function.
         * @return {void}
         */

      }, {
        key: "removeEventListener",
        value: function removeEventListener(event, listener) {
          var nbArguments = arguments.length;

          if (nbArguments !== 2) {
            throw new TypeError("Failed to execute 'removeEventListener' on 'EventTarget': 2 arguments required, " + "but only ".concat(nbArguments, " present."));
          }

          if (!has(this._listeners, event)) {
            return;
          }

          var listeners = this._listeners[event];
          var idx = indexOf(listeners, listener);

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

      }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          var _this = this;

          var type = event.type;
          var listeners = has(this._listeners, type) ? this._listeners[type] : []; // Ensure the event phase is correct.

          event._eventPhase = AT_TARGET;
          var methodName = "on".concat(type);
          var method = this[methodName];

          if (isFunction(method)) {
            method.call(this, event);
          }

          if (!event._stopped) {
            forEach(listeners, function(listener) {
              if (!event._stopped) {
                _this._executeListener(listener, event);
              }
            });
          } // Ensure the event phase is correct.


          event._eventPhase = NONE;
          return !!event.cancelable && !!event.defaultPrevented;
        }
        /**
         * Sets the readyState attribute to CLOSED.
         *
         * @return {void}
         */

      }, {
        key: "close",
        value: function close() {
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

      }, {
        key: "_executeListener",
        value: function _executeListener(listener, event) {
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

      }, {
        key: "_announceConnection",
        value: function _announceConnection() {
          this._readyState = OPEN;
          this.dispatchEvent(new FakeEvent('open', this));
        }
        /**
         * Fail the `EventSource` connection.
         *
         * @return {void}
         */

      }, {
        key: "_failConnection",
        value: function _failConnection() {
          this._readyState = CLOSED;
          this.dispatchEvent(new FakeEvent('error', this));
        }
        /**
         * Reestablish the `EventSource` connection.
         *
         * @return {void}
         */

      }, {
        key: "_reestablishConnection",
        value: function _reestablishConnection() {
          this._readyState = CONNECTING;
          this.dispatchEvent(new FakeEvent('error', this));
        }
      }, {
        key: "url",
        get: function get() {
          return this._url.toString();
        }
        /**
         * Returns the state of this EventSource object's connection.
         *
         * @return {number} The connection state.
         */

      }, {
        key: "readyState",
        get: function get() {
          return this._readyState;
        }
        /**
         * Returns `true` if the credentials mode for connection requests to the URL providing the event stream
         * is set to "include", and `false` otherwise.
         *
         * @return {boolean} The credentials mode.
         */

      }, {
        key: "withCredentials",
        get: function get() {
          return this._withCredentials;
        }
      }]);

      return FakeEventSource;
    }();

    FakeEventSource.CONNECTING = CONNECTING;
    FakeEventSource.OPEN = OPEN;
    FakeEventSource.CLOSED = CLOSED;
    return FakeEventSource;
  });

  var GLOBAL = window || global;
  var EVENT_SOURCE = GLOBAL.EventSource || null;
  /**
   * Update the global `EventSource` API in the current running environment.
   *
   * @param {function} impl The `EventSource` API implementation.
   * @return {void}
   */

  function setEventSourceImpl(impl) {
    GLOBAL.EventSource = impl;
  }
  /**
   * Check if the current installed `EventSource` in the running environment is strictly
   * equal to the one in parameter.
   *
   * @param {function} impl The `EventSource` API implementation to check.
   * @return {boolean} `true` if the global `EventSource` is equal to `impl`, `false` otherwise.
   */


  function checkEventSourceImpl(impl) {
    return GLOBAL.EventSource === impl;
  }

  var FakeEventSource;

  jasmine.sse = function() {
    return {
      /**
       * Install the fake `EventSource` implementation, if and only if native `EventSource` is supported
       * on runtime environment.
       *
       * @return {void}
       */
      install: function install() {
        if (EVENT_SOURCE) {
          // Create the `FakeEventSource` once.
          if (!FakeEventSource) {
            FakeEventSource = fakeEventSourceFactory();
          }

          if (checkEventSourceImpl(FakeEventSource)) {
            throw new Error('It seems that jasmine-sse has already been installed, make sure `jasmine.sse().uninstall()` ' + 'has been called after test suite.');
          } // Override the default `EventSource` API.


          setEventSourceImpl(FakeEventSource); // Ensure the tracker is resetted.

          reset();
        }
      },

      /**
       * Uninstall the fake `EventSource` implementation if it was previously installed.
       *
       * @return {void}
       */
      uninstall: function uninstall() {
        if (EVENT_SOURCE) {
          if (!checkEventSourceImpl(FakeEventSource)) {
            throw new Error('It seems that `jasmine.sse` has not been installed, make sure `jasmine.sse().install()` ' + 'has been called before uninstalling it.');
          } // Restore the default `EventSource` API.


          setEventSourceImpl(EVENT_SOURCE); // Ensure the tracker is resetted.

          reset();
        }
      },

      /**
       * Allow to use fake `EventSource` API in a single test function (without dealing
       * with `jasmine.sse().install` and `jasmine.sse().uninstall()`).
       *
       * @param {function} testFn The test function.
       * @return {*} The return value of the test function.
       */
      withMock: function withMock(testFn) {
        this.install();

        try {
          return testFn();
        } finally {
          this.uninstall();
        }
      },

      /**
       * Get the store of opened `EventSource` connections.
       *
       * @return {Object} The store.
       */
      connections: function connections() {
        return sseTracker;
      }
    };
  };

}());
