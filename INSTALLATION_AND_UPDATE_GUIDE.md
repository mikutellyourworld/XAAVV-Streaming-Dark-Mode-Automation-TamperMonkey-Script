# XAAVV Master Automation and Dark Mode - Installation & Update Guide

## Quick Update Instructions

### Method 1: Direct URL Import (Recommended)

1. **Copy the raw script URL:**
   ```
  https://raw.githubusercontent.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script/main/xaavv-master-automation-dark-mode-v1.2.28.user.js
   ```

2. **In Tampermonkey Dashboard:**
   - Click the Tampermonkey icon (top-right of browser)
   - Click "Dashboard" or "Create a new script"
   - If creating new: paste the entire script content
   - If updating existing:
     - Click the ⚙️ (settings) icon next to the old script
     - Delete the old version
     - Create new with the URL above

3. **Refresh XAAVV page**
   - The script should now load with new features

---

## What's New in v1.2.28

### ✅ This Iteration Fixes

#### 1. Top controls restored on play pages
- **Issue before:** Search, login, and register could disappear on some play-page renders.
- **Now:** Top controls remain visible and clickable on play pages.
- **Technical change:** Removed play-page rules that collapsed/hidden entire header containers.

#### 2. Header background no longer overlaps video
- **Issue before:** The top bar background could extend into/over the video area.
- **Now:** Only top-level header wrappers are forced transparent on play pages.
- **Technical change:** Transparency logic was narrowed to top-level wrappers and pseudo-elements instead of all descendants.

#### 3. Runtime hardening aligned with CSS behavior
- **Issue before:** JS hardening could re-apply dark backgrounds to header bars after CSS made them transparent.
- **Now:** JS hardening keeps top wrappers transparent on play pages while still preserving readable text.
- **Technical change:** Added play-page guards in the known-bar hardening and nuclear pass logic.

#### 4. Version and file naming fully synchronized
- **Now:** File name and internal metadata both use 1.2.27.
- **Current script file:** `xaavv-master-automation-dark-mode-v1.2.28.user.js`

---

## Feature Overview (Complete)

### 🎨 Dark Mode
- Complete dark theme applied to all XAAVV pages
- Purple accent colors (#9d8cff, #b5a8ff)
- No white surface leaks
- Maintains readability while reducing eye strain

### ▶️ Video Playback Controls
- **Download Button:** Click to download active video
  - Located below search bar for easy access
  - Automatically selects best quality video
  - Works with both blob: and HTTP URLs

- **Interactive Progress Bar:**
  - Visible on any mouseover or pointer movement
  - Click anywhere to seek to that timestamp
  - Drag handle for fine-grained control
  - Shows current playback time in real-time

- **Center Pause Overlay:**
  - Click anywhere on video to pause during playback
  - Center play button hides when playing, shows when paused
  - Styled with purple gradient and a clean SVG play/pause icon

### 🎬 Playback Automation
- Auto-plays videos on play pages
- Starts muted, unmutes after 1.2 seconds
- Improves auto-play success rate in browsers with autoplay restrictions

### 🔄 Navigation
- Direct routing from detail pages to play pages
- Skip intermediate pages automatically
- Seamless navigation experience

### 🌐 Multi-Video Support
- Handles pages with multiple video layers
- Synchronizes playback controls across all video elements
- Safe state management

### 🔤 Translation
- Unobtrusive Google Translate integration
- Auto English translation without popup
- Toolbar hidden from UI

---

## Installation Methods

### Method A: From Browser Extension Store (Easiest)
1. Install Tampermonkey extension:
   - Chrome: [Tampermonkey on Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobp55f)
   - Firefox: [Tampermonkey on Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Safari: [Tampermonkey on App Store](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. Visit the raw script URL:
   ```
  https://raw.githubusercontent.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script/main/xaavv-master-automation-dark-mode-v1.2.28.user.js
   ```

3. Tampermonkey will show an install dialog
4. Click "Install"
5. Refresh XAAVV page

### Method B: Manual Copy-Paste

1. Go to GitHub: 
   ```
   https://github.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script
   ```

2. Click the script file: `xaavv-master-automation-dark-mode-v1.2.28.user.js`

3. Click "Raw" button (top-right of code view)

4. Select all (Ctrl+A) and copy

5. In Tampermonkey Dashboard:
   - Click "+ Create a new script"
   - Delete the default template content
   - Paste the script
   - Click "File" → "Save" (or Ctrl+S)

6. Refresh XAAVV page

### Method C: GitHub Releases

1. Visit Releases page:
   ```
   https://github.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script/releases
   ```

2. Find the latest release (v1.2.28)

3. Download `xaavv-master-automation-dark-mode-v1.2.28.user.js`

4. In Tampermonkey Dashboard:
   - "+ Create a new script"
   - Paste the downloaded file content
   - Save

5. Refresh XAAVV page

---

## Testing Checklist After Installation

After installing/updating, verify these features work:

- [ ] **Dark Mode Applied**
  - Visit any XAAVV page
  - Page should have dark background (#121520)
  - Text should be light (#eceffd)
  - No white elements visible

- [ ] **Search Bar Appears**
  - Top of page should have search input
  - Next to search should be login/register links

- [ ] **Download Button Below Search**
  - On play page (`/xavplay/`)
  - Download button should appear below search on standard layouts
  - On vertical video pages, it may shift to the right of search instead of stacking underneath
  - Button should have purple styling (#7d71db)
  - Not overlapping any other buttons

- [ ] **Progress Bar on Hover**
  - Move mouse or pointer over video
  - Thin line (3px) should appear near the bottom of the video
  - Line should grow to 5px thick
  - Should be purple colored
  - Move mouse away, line should shrink back

- [ ] **Progress Bar Seek**
  - Hover over video
  - Click on progress bar at any position
  - Video should seek to that timestamp
  - Handle (white circle) should appear when hovering

- [ ] **Center Play Button Styled**
  - Video should have a purple gradient play button in center when paused
  - Button should be circular (60px)
  - Hover effect: button brightens and scales up
  - Icon should look like a normal play/pause control, not plain text glyphs
  - Click to play/pause

- [ ] **Pause Overlay Works**
  - During playback, click anywhere on video
  - Video should pause
  - Center button should reappear

---

## Troubleshooting

### Script Not Loading?

1. **Check if Tampermonkey is enabled:**
   - Click Tampermonkey icon
   - Make sure it's toggled ON

2. **Check site permissions:**
   - Tampermonkey Dashboard → "Installed scripts"
   - Click ⚙️ next to XAAVV script
   - Under "Runs on" - verify `*xaavv.com*` and `*xaavv.live*` are listed

3. **Force reload:**
   - Press Ctrl+Shift+R (hard refresh)
   - Clear browser cache
   - Reinstall script

### Features Not Working?

**See:** [TROUBLESHOOTING_v1.2.13.md](./TROUBLESHOOTING_v1.2.13.md) for detailed diagnostics

Common fixes:
- Hard refresh (Ctrl+Shift+R)
- Clear Tampermonkey cache (Dashboard → ⚙️ → Storage → Clear all)
- Disable other userscripts (may conflict)
- Check browser console (F12 → Console) for errors

### Performance Issues?

- Script uses passive event listeners (no jank)
- Progress bar updates at video's framerate (60fps typical)
- Download button repositioned every 220ms during play
- If lag occurs:
  - Check browser extensions (disable others)
  - Update browser to latest version
  - Close unnecessary tabs

---

## File Naming

**Current Version:** `xaavv-master-automation-dark-mode-v1.2.28.user.js`

**Previous Names:**
- v1.2.11: `xaavv-dark-theme.user.js`
- v1.2.10: `xaavv-kiro-dark.user.js`

If you have old versions installed, consider deleting them from Tampermonkey Dashboard to avoid conflicts.

---

## Repository Info

- **Repository:** [mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script](https://github.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script)
- **Current Version:** 1.2.28
- **Last Updated:** 2026-05-10
- **License:** See repository
- **Author:** XAAVV Automation Maintainers

---

## Support Domains

The script works on:
- `*.xaavv.com`
- `*.xaavv.live`
- All subdomains

It does NOT apply to:
- Other streaming sites
- XAAVV detail/category pages (only play pages)
- Non-XAAVV domains

---

## FAQ

**Q: Is this script safe?**
A: Yes. The script:
- Only manipulates DOM and CSS
- Never sends data to external servers
- Never steals credentials or cookies
- Open source - you can review the code on GitHub
- Uses standard Tampermonkey security sandbox

**Q: Will this get me banned?**
A: No. The script:
- Only improves user interface
- Doesn't automate downloads in bulk
- Doesn't bypass age restrictions
- Doesn't scrape content
- Is similar to browser extensions like uBlock, Dark Reader, etc.

**Q: Does it work on mobile?**
A: No. Tampermonkey scripts require:
- Desktop/laptop browser
- Not available on mobile browsers (Android, iOS)
- Some mobile browsers (Kiwi Browser on Android) may support extensions

**Q: Why isn't the dark mode applying everywhere?**
A: The script targets:
- XAAVV domain only
- Play pages specifically for video features
- Other pages get dark mode but no video controls

**Q: Can I customize the colors?**
A: Yes. In Tampermonkey Dashboard:
1. Click ⚙️ next to the script
2. Click "Edit"
3. Find the color definitions (search for `--xaavv-accent`)
4. Modify hex colors
5. Save (Ctrl+S)

Example:
```javascript
--xaavv-accent: #ff6b9d;  // Change to any hex color
```

---

## Credits & Acknowledgments

This script combines:
- Dark mode expertise from web accessibility standards
- Tampermonkey scripting best practices
- XAAVV platform API knowledge
- Community feedback and testing

**Maintained by:** XAAVV Automation Team

---

**Need help?** Check [TROUBLESHOOTING_v1.2.13.md](./TROUBLESHOOTING_v1.2.13.md) or visit the GitHub repository.

**Version:** 1.2.28 | **Updated:** 2026-05-10

### v1.2.21 (2024-06-09)
- UI polish for play pages: Download button never overlaps search, always below and right-aligned; top bar fully transparent and non-blocking.
- All changes are documented in the userscript source code and documentation files.

