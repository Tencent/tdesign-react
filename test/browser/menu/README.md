# SubMenu browser regression

JSDOM unit tests cover transition state and visibility. This check builds
the current Menu source and the pinned common submodule's real Less, then verifies
geometry and animation frames in system Chrome. It does not use mocked layout or a
checked-in bundle.

From the repository root:

```sh
git submodule update --init
pnpm install
pnpm run test:browser:menu
```

Chrome must be installed. To use system Edge, set `BROWSER_CHANNEL=msedge`.
The server uses an available localhost port and is closed even when an assertion fails.

The browser runner, esbuild, and Less are managed by the root `package.json` and
installed together with the workspace dependencies. No separate npm install is needed.
The repository currently ignores lockfiles; the browser runner version is pinned
in the root manifest.

`.github/workflows/menu-browser.yml` runs the same command in Chrome on Ubuntu for
pull requests to `develop` or `main` that change component source, the common
submodule, browser tests, or their dependency/CI configuration. The workflow can
also be run manually and uploads generated evidence even when the test fails.

Checks cover three nested levels with 90px items, enter and exit animation frames,
dynamic 300px content, interrupted exits, rapid controlled toggles, a 120-item menu,
delayed controlled popup content, CSS-only popup resizing, and horizontal popup
layout, plus switching the sidebar between inline and popup modes. Geometry comparisons
allow one pixel for rounding. Outputs (screenshot and measured frames) are written to
`test/browser/.output/menu/`. `preview.gif` records the original and fixed SubMenu
side by side with the same three 90px items, including expansion, collapse, and
an interrupted collapse. The generated output and bundle are not committed.

This is a Chromium regression check; it does not establish Safari/Firefox coverage.
