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

/* eslint-disable no-var */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */

(function() {
  var $output = document.getElementById('output');
  var $connect = document.getElementById('connect-btn');
  var $disconnect = document.getElementById('disconnect-btn');
  var $send = document.getElementById('send-btn');
  var $input = document.getElementById('input-message');
  var $form = document.getElementById('message-form');

  var sse = null;

  function createStream() {
    if (!sse) {
      sse = new EventSource('/stream');

      sse.onopen = onopen;
      sse.onerror = onerror;
      sse.onmessage = onmessage;

      sse.addEventListener('open', onOpenListener);
      sse.addEventListener('error', onErrorListener);
      sse.addEventListener('message', onMessageListener);
    }
  }

  function closeStream() {
    if (sse) {
      sse.close();
    }
  }

  $disconnect.addEventListener('click', function() {
    closeStream();
  });

  $connect.addEventListener('click', function() {
    createStream();
  });

  $form.addEventListener('submit', function(e) {
    e.preventDefault();

    ajax('POST', '/message', $input.value);

    $input.value = '';
  });

  function appendToOutput(message) {
    $output.innerHTML += message + '<br />';
  }

  function onOpenListener(e) {
    console.log('Event listener `open` called:', this, e);
    appendToOutput('SSE Connection connected, `open` listener executed');
  }

  function onMessageListener(e) {
    console.log('Event listener `message` called:', this, e);
    appendToOutput('SSE Connection, `message` listener executed');
  }

  function onErrorListener(e) {
    console.log('Event listener `error` called: ', this, e);
    appendToOutput('SSE Connection error, `error` listener executed');
  }

  function onopen(e) {
    $disconnect.disabled = false;
    $send.disabled = false;
    $connect.disabled = true;

    console.log('Method `onopen` called:', this, e);
    appendToOutput('SSE Connection opened, `onpen` callback executed');
  }

  function onmessage(e) {
    console.log('Method `onmessage` called:', this, e);
    appendToOutput('SSE Connection message, `onmessage` callback executed');
  }

  function onerror(e) {
    console.log('Method `onerror` called:', e);
    appendToOutput('SSE Connection error, `onerror` callback executed');
  }

  function ajax(method, url, body) {
    const rq = new XMLHttpRequest();
    rq.open(method, url);
    rq.send(body);
  }
})();
