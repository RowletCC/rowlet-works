# Form / Field

A twelve-second kinetic infographic by **Jianhao Cheng**. Twenty-four beveled prisms move from a circular field into three rows, then a rising spiral, before returning to the first formation. Six coral objects remain identifiable throughout the sequence.

This is an original independent procedural motion study, built with AI assistance and checked against the exported asset. It is not a commissioned client project. Values are illustrative, not measured data.

## View and inspect

Open the live preview, choose a phase, scrub the timeline, or press Play. Drag to orbit and scroll to zoom. Focus the canvas and use arrow keys to rotate, or Home to reset the camera. Wireframe reveals the exported geometry. The study starts paused; hidden tabs pause playback.

- **Asset:** `form-field.glb`, 347,308 bytes
- **Duration:** 12 seconds, continuous loop endpoints
- **Content:** 24 animated mesh objects; 72 transform tracks; 241 samples per track
- **Geometry:** 2,592 triangles across all objects; three materials; zero textures
- **Format:** glTF 2.0 binary with standard position, scale and quaternion animation

The preview loads this exact GLB. Lighting, shadows, floor, grid and camera are preview-only and are not baked into the asset. The browser engine is vendored Three.js r182, with its MIT notice in `vendor/LICENSE-three.txt`. No CDN or account is needed. Serve over HTTP; ES modules do not support opening the page directly as a `file:` URL.

## Reproduce

Requires Node.js and Python 3. Dependency installation uses npm; the preview itself makes only same-origin file requests.

```sh
npm ci --ignore-scripts
node build.mjs
python3 -m http.server 8905 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8905/`. The builder regenerates the GLB, asset report and vendored viewer dependencies. It runs Khronos glTF Validator and re-imports the result through Three.js GLTFLoader to inspect the animation.

## Validation and limits

Khronos glTF Validator reports **zero errors and zero warnings**. All 241 sampled animation times contain finite transforms and positive scales. The first and last transforms agree within 1e-5. Browser review covered the three formations, play/pause and looping, seeking back from the final frame, wireframe, keyboard time controls and a 390 px layout without horizontal document overflow.

**Unity import/playback, FBX export and target-device frame budgets have not been tested.** A Unity integration milestone should fix the editor version, render pipeline, importer, material treatment, performance budget and acceptance scene before work starts. File-format validity alone is not an integration guarantee.

The original visual study and asset are provided for portfolio viewing and evaluation. Commercial use or a custom production sequence requires a separate agreement with the author. This reservation does not change the license of included third-party Three.js files.
