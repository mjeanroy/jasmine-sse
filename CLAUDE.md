# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jasmine-sse` is a Jasmine add-on that replaces the browser's global `EventSource` with a fake implementation so Server-Sent-Event code can be unit tested. It ships as a single IIFE bundle (`dist/jasmine-sse.js`) that registers `jasmine.sse()` on the global `jasmine` object. It is browser-only: it has no Node runtime and no exports.

## Commands

The package manager is pnpm (pinned in CI; Node version is in `.nvmrc`). `pnpm-workspace.yaml` sets `lockfile: false`, so no lockfile is committed. All npm scripts delegate to gulp tasks defined in `gulpfile.js` → `scripts/*`.

- `pnpm test`: lint, then run Karma once. It uses headless Chrome, or SauceLabs if `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` are set (`scripts/test/index.js` → `auto`). CI (GitHub Actions, on every push) sets them, so CI runs the suite on the SauceLabs browsers in `scripts/test/karma.saucelab.conf.js` (Safari 14–17, latest Chrome, Firefox 89), not on headless Chrome. Code must work on those older Safari versions.
- `pnpm run tdd`: Karma in watch mode with a real Chrome window.
- `pnpm run lint`: ESLint over root `*.js`, `src`, `test`, `sample`, `scripts`. **Warnings fail the build**, as errors do.
  - `pnpm run lint --file src/jasmine-sse.js --file test/jasmine-sse.test.js`: lint only the given files. The option is repeatable and accepts directories and globs. A path that matches nothing is an error.
  - `--file` only narrows the standalone `lint` task. `build`, `test` and `release` always lint the whole project (`lint.lint` vs `lint.lintCli` in `gulpfile.js`).
- `pnpm run build`: clean + lint + Rollup bundle to `dist/jasmine-sse.js` (Babel, license banner from `LICENSE`).
- `pnpm start`: runs a real SSE demo chat on port 3000. The Express server is `sample/server.js` and the browser client is `sample/app.js`, written in ES5 with no build step. The demo does not use jasmine-sse and has no tests.
- `pnpm run release[:major|:minor|:patch]`: lint, test, build, then `npm version` (which commits and tags with `dist/` force-added), then a second commit removing `dist/`. `dist/` is git-ignored and only committed for tagged releases. The published package contains only `dist/` (see `.npmignore`).

To run a subset of tests, pass options straight after the script name. Do **not** add a `--` separator, because pnpm forwards it and gulp then fails with "Task never defined: --file". This applies to `lint` too. These options also work with `pnpm run tdd`:

- `pnpm test --file test/core/sse-tracker.test.js`: bundle and run only this spec file instead of `test/index.js`. The option can be repeated, accepts globs, and also accepts `--file=<path>`.
- `pnpm test --filter "should get first connection"`: run only specs whose full name (describe + it) contains the pattern. This uses karma-jasmine `--grep`.
- The two can be combined: `pnpm test --file <path> --filter <pattern>`.

`--file`/`--filter` are parsed once, by `readCliOptions` in `scripts/cli/index.js` (`node:util` `parseArgs`, non-strict, paths resolved against the repo root). The lint task and the test task (`createKarmaOptions` → `karma.config.parseConfig` overrides) both use it, so a new flag goes there.

`pnpm test` lints the whole project, so a throwaway spec placed under `test/` must pass lint. To check behaviour ad hoc, write the spec outside the linted directories (for example the scratchpad), import the source by absolute path, and run it with `--file <absolute path>`.

## Architecture

- **Entry point** `src/jasmine-sse.js`: captures the native `window.EventSource` at load time and defines `jasmine.sse()` with `install`/`uninstall`/`withMock`/`connections`. Install/uninstall do nothing if the browser has no native `EventSource`. They throw if called twice or out of order. Both reset the tracker.
- **Lazy singletons via `factory()`** (`src/core/common/factory.js`): every fake class (`FakeEventSource`, `FakeEvent`, `FakeMessageEvent`, `FakeEventSourceProxy`) is exported as a memoized `xxxFactory()` getter instead of a class. Classes are built on first call and then reused. Tests and source call `fooFactory()` to get the class.
- **`FakeEventSource`** (`src/core/fake-event-source.js`): spec-oriented implementation. Comments follow the numbered steps of the WHATWG SSE spec. Its constructor calls `track(this)`, which registers the instance with the tracker. Internal state uses underscored fields (`_readyState`, `_listeners`) and internal methods (`_announceConnection`, `_failConnection`, `_reestablishConnection`).
- **Tracker** (`src/core/sse-tracker.js`): a module-level queue. `track()` wraps each `FakeEventSource` in a **`FakeEventSourceProxy`**, so users get proxies from `jasmine.sse().connections()`, not the raw instances. The proxy forwards the standard `EventSource` API and adds test helpers: `emit` (which auto-transitions CONNECTING→OPEN on the first message), `failConnection`, `reestablishConnection`, `getEventListeners`. New test-facing behavior goes on the proxy, and spec behavior goes on `FakeEventSource`.
- **`src/core/common/`**: small utility helpers (`has`, `includes`, `forEach`, `parseUrl`, …) that `src/` uses instead of the built-in equivalents. Follow the same pattern for new helpers. Each helper has a matching test in `test/core/common/`, registered in that folder's `index.js`.

## Tests

- Tests live in `test/` and mirror `src/`. Karma uses a **single entry point, `test/index.js`**, which imports the aggregator files (`test/core/index.js`, `test/core/common/index.js`). **A new test file must be added to the relevant `index.js` or it will not run.**
- `test/after-each.js` resets the tracker after every spec. It is **not** bundled when a file is run alone with `--file`. A spec that relies on a clean tracker must therefore call `reset()` in its own `beforeEach` (see `test/core/sse-tracker.test.js`).
- Tests run in a real browser served by Karma on port 9876. Relative URLs therefore resolve to `http://localhost:9876/...` in assertions.

## Conventions

- Every JS and YAML file starts with the MIT license header block (JSON configs such as `.eslintrc` do not). Keep it on new files.
- ESLint is airbnb-base with `valid-jsdoc` enforced: every function needs JSDoc with `@param` descriptions and `@return` (even `@return {void}`). Max line length is 120. `console` is allowed only for `warn`/`error`.
- ESLint environments: the root `.eslintrc` targets the browser (`node: false`) for `src/`, `test/` and `sample/`. `scripts/.eslintrc` switches `scripts/` to Node. A Node file elsewhere needs a `/* eslint-env node */` comment, as in `gulpfile.js` and `sample/server.js`.
- Dependencies: pin exact versions (`saveExact: true`). pnpm enforces `minimumReleaseAge` and `trustPolicy: no-downgrade`. `jasmine-core` stays on 3.x to match `karma-jasmine` 4, and Dependabot ignores `karma-jasmine-html-reporter` major updates because they require jasmine >= 4. Do not bump these on your own.
- Commit messages follow Conventional Commits: `chore: …`, `docs: …`, `chore(ci): …`, `chore(deps-dev): …`.
