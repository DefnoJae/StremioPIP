# Stremio PiP

Adds a **Picture-in-Picture (PiP)** control to the Stremio v5 video player.

The mod watches Stremio's single-page UI, finds the active HTML5 video player, and adds a PiP button to the player control bar. It uses the browser/WebView2 native Picture-in-Picture API, so the floating video window stays above other applications while playback continues.

## Features

- Native Picture-in-Picture toggle in the Stremio player controls
- Automatically reattaches when you change movies, series, or episodes
- Detects the currently visible/active video element
- Updates the icon when PiP opens or closes
- `Alt + P` keyboard shortcut
- No build step or dependencies
- Avoids hard-coded CSS-module hashes so normal Stremio UI rebuilds are less likely to break it

## Important: Stremio add-on vs UI mod

Stremio's normal Addon SDK cannot modify the player interface. It is intended for catalogs, metadata, streams, subtitles, and related content resources.

This project is therefore a **WebMod** for Stremio's web UI rather than a normal Stremio content addon.

## Desktop installation

The easiest desktop host for UI WebMods is **Stremio Community v5** with WebMods support.

1. Install Stremio Community v5 with WebMods support (5.0.20 or newer).
2. Open its installation folder. On a default Windows install this is usually:
   `%LOCALAPPDATA%\\Programs\\LNV\\Stremio-5\\`
3. Open `portable_config\\webmods\\`. Create the `webmods` folder if it does not exist.
4. Create a folder named `stremio-pip`.
5. Copy these two files into it:
   - `stremio-pip.js`
   - `manifest.json`
6. Fully close Stremio Community v5 and reopen it.
7. Start a video. A PiP icon should appear in the player controls.

Expected layout:

```text
Stremio-5/
└─ portable_config/
   └─ webmods/
      └─ stremio-pip/
         ├─ manifest.json
         └─ stremio-pip.js
```

## Quick testing in Stremio Web

You can also test the script against Stremio Web in Chrome/Edge:

1. Open Stremio Web and start a video.
2. Open Developer Tools.
3. Paste the contents of `stremio-pip.js` into the Console.
4. Press Enter.
5. Move the mouse over the player controls and press the new PiP button.

For repeat use in a browser, the same script can be loaded through a userscript manager.

## Compatibility

PiP requires an HTML5 `<video>` player and a browser/WebView runtime that exposes:

- `HTMLVideoElement.requestPictureInPicture()`
- `document.exitPictureInPicture()`

If Stremio is using a player implementation that does not expose an HTML video element, the button will not be enabled.

## Current status

Version: **0.1.0**

This is the first functional build. The selectors are based on Stremio v5's readable CSS-module prefixes rather than generated hash values.
