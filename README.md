## Jasmine-SSE

[![Greenkeeper badge](https://badges.greenkeeper.io/mjeanroy/jasmine-sse.svg)](https://greenkeeper.io/)

A simple addon for [](Jasmine) to test a "Server Sent Event" application easily!

### Installation

- Install the latest version: `npm run install --save-dev jasmine-sse`.
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
  sse.addEventListener('message', displayMessage);
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
    sse.removeEventListener('message', displayMessage);
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

    // Or with an object containing event type.
    connection.emit({
      type: 'custom',
      message: 'Hi bob',
    });

    expect(messages).toEqual(['Hi dude']);

    disconnect();
    expect(sse.getEventListeners()).toEqual([]);
  });
});
```

### API

#### `jasmine.sse`

`jasmine.sse().install()`

Install the fake `EventSource` implementation, typically called in a `beforeEach` method.
Note that:
  - The fake implementation is installed if, and only if, a native `EventSource` implementaton is available (i.e if browser supports `EventSource`), otherwise this method do nothing (and do not fail).
  - This method will fail if `jasmine-sse` has already been installed.

`jasmine.sse().uninstall()`

Install the fake `EventSource` implementation, typically called in a `beforeEach` method.
Note that:
  - Like the `jasmine.sse().install()` method, if browser does not support native `EventSource` this method do nothing (and do not fail).
  - This method will fail if `jasmine-sse` has not been previously installed.

`jasmine.sse().connections()`

Returns an object containing methods to get tracked connection:
  - `count(): number` Get the number of tracked connections.
  - `all(): Array<FakeEventSource>` Get an array of all tracked connections.
  - `first(): FakeEventSource` Get the first tracked connections or `undefined`.
  - `last(): FakeEventSource` Get the last tracked connections or `undefined`.
  - `at(idx: number): FakeEventSource` Get the tracked connection at given index or `undefined`.

`jasmine.sse().withMock(testFn)`

Install the fake `EventSource` implementation, execute the test function `testFn`, then reset the fake implementation. This method can be used
to install/uninstall fake `EventSource` API in a single test, for example:

```javascript
it('should run test with fake implementation', () => {
  jasmine.sse().withMock(() => {
    doYourTest();
    doYourExpect();
  });
});
```

#### `FakeEventSource`

A tracked connection is a fake `EventSource` (so contains all methods of `EventSource` object as documented [here](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)) with additional methods:

- `emit(message: string|object): void` Emit a message from the server.
- `failConnection(): void` Fail the connection, typically used to test a connection failure from server.
- `reestablishConnection(): Array<string>` Reestablish connection, typically used to test connection establishment.
- `getEventListeners(eventType?: string): Array<function>` Get registered listeners (passing string parameter will return registered event listeners for given event type).

### Licence

MIT License (MIT)

### Contributing

If you find a bug or you think something is missing, feel free to contribute and submit an issue or a pull request.
