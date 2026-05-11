# Download Button Format Fix 1.2.9

## Issue

The floating `Download` button could overlap top navigation controls (`Log in`, `register`, menu) on some viewport/layout combinations.

## Fix

1. Reworked button positioning to use the playback video union rectangle first.
2. Added a minimum top offset (`>= 96px`) to keep it below top nav/header controls.
3. Anchored button from the left edge of the video viewport (`rect.left + 14`) instead of the top-right/header-adjacent area.

## Result

The `Download` control stays in the video area and avoids intersecting header buttons.

## Files

1. `xaavv-kiro-dark.user.js`
2. `README.md`
3. `DOWNLOAD_BUTTON_FORMAT_FIX_1.2.9.md`

