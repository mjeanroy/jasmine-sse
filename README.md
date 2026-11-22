## Jasmine-SSE

A simple addon for [Jasmine](https://jasmine.github.io/) to test a "Server Sent Event" application easily!

### Installation

- Install the latest version: `npm install --save-dev jasmine-sse`.
- Add the `main` entry point (i.e `dist/jasmine-sse.js`) file to your test suite.

### Example

Suppose this (very) simple chat application:

```javascript
let sse;
let messages = [];

function onNewMessage(e) {
  messages.push(e.data);
}

function connect() {
  if (sse) {
    return;
  }

  sse = new EventSource('/chat');
  sse.addEventListener('message', onNewMessage);
}

function sendMessage(message) {
  fetch('/chat', {
    method: 'POST',
    body: JSON.stringify({message}),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function disconnect() {
  if (sse) {
    sse.close();
    sse.removeEventListener('message', onNewMessage);
    sse = null;
  }
}
```

Testing this application can be easy with `jasmine-sse`:

```javascript
describe('app', () => {
  beforeEach(() => {
    jasmine.sse().install();
  });

  afterEach(() => {
    jasmine.sse().uninstall();
  });

  it('should connect sse', () => {
    connect();

    const connections = jasmine.sse().connections();
    expect(connections.count()).toBe(1);

    const connection = connections.mostRecent();
    expect(connection.url).toBe('...');
    expect(connection.readyState).toBe(0);
    expect(messages).toEqual([]);

    connection.emit('Hi dude');
    expect(messages).toEqual(['Hi dude']);

    // Or with an object containing event type: it is not dispatched to `message` listeners.
    connection.emit({
      type: 'custom',
      data: 'Hi bob',
    });

    expect(messages).toEqual(['Hi dude']);

    disconnect();
    expect(connection.getEventListeners()).toEqual([]);
  });
});
```

### API

#### `jasmine.sse`

`jasmine.sse().install()`

Install the fake `EventSource` implementation, typically called in a `beforeEach` method.
Note that:
  - The fake implementation is installed if, and only if, a native `EventSource` implementation is available (i.e if browser supports `EventSource`), otherwise this method does nothing (and does not fail).
  - This method will fail if `jasmine-sse` has already been installed.

`jasmine.sse().uninstall()`

Uninstall the fake `EventSource` implementation and restore the native one, typically called in an `afterEach` method.
Note that:
  - Like the `jasmine.sse().install()` method, if browser does not support native `EventSource` this method does nothing (and does not fail).
  - This method will fail if `jasmine-sse` has not been previously installed.

`jasmine.sse().connections()`

Returns an object containing methods to get tracked connections:
  - `count(): number` Get the number of tracked connections.
  - `all(): Array<FakeEventSource>` Get an array of all tracked connections.
  - `first(): FakeEventSource` Get the first tracked connection or `undefined`.
  - `mostRecent(): FakeEventSource` Get the most recent tracked connection or `undefined`.
  - `at(idx: number): FakeEventSource` Get the tracked connection at given index or `undefined`.

`jasmine.sse().withMock(testFn)`

Install the fake `EventSource` implementation, execute the test function `testFn` (and return its result), then uninstall the fake implementation, even if `testFn` throws. This method can be used
to install/uninstall fake `EventSource` API in a single test, for example:

```javascript
it('should run test with fake implementation', () => {
  jasmine.sse().withMock(() => {
    doYourTest();
    doYourExpect();
  });
});
```

Note that, since it calls `jasmine.sse().install()`, this method will fail if `jasmine-sse` has already been installed (for example in a `beforeEach` method).

#### `FakeEventSource`

A tracked connection is a fake `EventSource` (so contains all methods of `EventSource` object as documented [here](https://developer.mozilla.org/en-US/docs/Web/API/EventSource), and the static `CONNECTING`, `OPEN` and `CLOSED` constants) with additional methods:

- `emit(message: string|object): void` Emit a message from the server:
  - A string is dispatched as the `data` of a `message` event.
  - An object may define the event `type` (defaults to `message`), its `data` and its `id` (exposed as `lastEventId`).
  - If the connection is still `CONNECTING`, it is opened first (and an `open` event is dispatched).
  - This method will fail if the connection is `CLOSED`, or if the message is `null`, `undefined` or a function.
- `failConnection(): void` Fail the connection, typically used to test a connection failure from server: the connection state is set to `CLOSED` and an `error` event is dispatched (does nothing if the connection is already `CLOSED`).
- `reestablishConnection(): void` Reestablish connection, typically used to test connection establishment: the connection state is set to `CONNECTING` and an `error` event is dispatched (does nothing if the connection is already `CLOSED`).
- `getEventListeners(eventType?: string): Array<function>` Get registered listeners (passing string parameter will return registered event listeners for given event type).

### License

MIT License (MIT)

### Contributing

If you find a bug or you think something is missing, feel free to contribute and submit an issue or a pull request.
