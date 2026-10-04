# Stremio PiP

Adds a **Picture-in-Picture (PiP)** button to the Stremio web player.

## Easiest install — Stremio Web

This is now the recommended install method.

### 1. Install a userscript manager

Install **Tampermonkey** (or another compatible userscript manager) in Chrome/Edge.

### 2. Install Stremio PiP

Open this link:

https://raw.githubusercontent.com/DefnoJae/StremioPIP/main/stremio-pip.user.js

Tampermonkey should open an installation screen. Press **Install**.

### 3. Open Stremio Web

Go to:

https://web.stremio.com/

Start a video. A PiP button should appear in the player controls.

You can also press **Alt + P** to toggle Picture-in-Picture.

## Features

- Picture-in-Picture button inside Stremio's player controls
- Automatically follows the currently active video
- Works when changing movies, shows, and episodes
- Updates its icon when PiP opens/closes
- Alt + P shortcut
- Self-updates through the userscript manager
- No manual file copying required

## Why this is not installed through Stremio's Add-ons page

Stremio's normal addon system is for catalogs, metadata, streams, subtitles, and similar content resources. It cannot inject new controls into the player interface.

Because PiP changes the player UI, this project runs as a userscript/WebMod instead.

## Desktop WebMod

The repository also contains a WebMod build for **Stremio Community v5**:

- `manifest.json`
- `stremio-pip.js`

That route is optional. For most users, the Tampermonkey userscript is much easier.

## Files

- `stremio-pip.user.js` — recommended browser/userscript build
- `stremio-pip.js` — raw WebMod implementation
- `manifest.json` — Stremio Community v5 WebMod manifest
- `install.ps1` — optional Community v5 installer
- `uninstall.ps1` — optional Community v5 uninstaller

## Current version

**0.1.0**
