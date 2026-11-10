# SubMenu browser regression

JSDOM unit tests cover transition state and visibility. This standalone check builds
the current Menu source and the pinned common submodule's real Less, then verifies
geometry and animation frames in system Chrome. It does not use mocked layout or a
checked-in bundle.

From the repository root, after `pnpm install` and `git submodule update --init`:

```sh
npm --prefix test/browser install
npm --prefix test/browser run test:menu
```

Chrome must be installed. To use system Edge, set `BROWSER_CHANNEL=msedge`.
The server uses an available localhost port and is closed even when an assertion fails.

Checks cover three nested levels with 90px items, enter and exit animation frames,
dynamic 300px content, interrupted exits, rapid controlled toggles, a 120-item menu,
delayed controlled popup content, CSS-only popup resizing, and horizontal popup
layout, plus switching the sidebar between inline and popup modes. Geometry comparisons
allow one pixel for rounding. Outputs (screenshot and measured frames) are written to
`test/browser/.output/menu/`. `preview.png` is a representative screenshot for review;
the generated output and bundle are not committed.

This is a Chromium regression check; it does not establish Safari/Firefox coverage.
