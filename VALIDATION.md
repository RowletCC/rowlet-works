# Validation · 2026-10-02

## Browser checks actually performed

- Desktop layout inspected in the Codex in-app browser.
- 390 × 844 viewport: document width 390 px, no horizontal overflow. The full-screen preview dialog also measures 390 px.
- Opened Form / Field inside the dialog; actual GLB reached “GLB loaded · ready”. Selecting the 04.20 phase changed the timeline and formation text to “A common measure”.
- Closing the dialog removes the iframe and restores focus to the link that opened it. Escape also closes the dialog; its queued close event removes the iframe.
- Opened The Pass inside the dialog; “Serve table” changed Table 04 from Ready to serve to Dining, retaining the $48.00 ticket total.
- Browser error/warning log was empty at the end of these checks.
- Twenty relative HTML asset/page links resolved to existing local files. JavaScript syntax passed `node --check index.js`.

No claim of exhaustive automated accessibility, browser compatibility, Unity, FBX or Unreal testing is made. The individual studies include their own validation scope.

The catalogue loads no third-party runtime assets. Three.js is vendored in its study, with its MIT license included. Public GitHub links and the email link require normal external connectivity.

## Publication

Prepared and reviewed locally. This catalogue has not yet been published. GitHub API access returned EOF and a public HTTPS connection failed with SSL_ERROR_SYSCALL during this turn. The original two study sites were published earlier; their publication is separate from this new catalogue.
