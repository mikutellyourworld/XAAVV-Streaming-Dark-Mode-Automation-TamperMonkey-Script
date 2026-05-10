# XAAVV Master Automation and Dark Mode - Troubleshooting v1.2.13

## Overview

This document tracks issues, diagnostics, and solutions for the XAAVV Master Automation and Dark Mode Tampermonkey script. Use this when features aren't working as expected.

## Known Issues & Solutions

### Issue 1: Download Button Overlaps Search Button

**Symptom:** Download button appears on top of the search bar instead of below it.

**Root Cause:** 
- Search button detection was unreliable
- Positioning calculation didn't account for all search input variations
- Inline left/top styling overriding intended layout

**Fix Applied (v1.2.13):**
```javascript
// Improved search detection - now checks for input field first
const findSearchButton = () => {
  // Look for search input field first (most reliable)
  const searchInput = document.querySelector('input[placeholder*="搜索"], input[placeholder*="search"], [role="searchbox"]');
  if (searchInput instanceof HTMLElement) {
    const parent = searchInput.closest('div[class*="search"], div[class*="Search"], form');
    if (parent instanceof HTMLElement) {
      return parent;
    }
    return searchInput;
  }
  // Falls back to button search if no input found
};

// Better spacing calculation
top = Math.round(searchRect.bottom + 16);  // 16px spacing below
left = Math.round(Math.max(12, searchRect.left));  // Align with search left edge

// Vertical-video fallback
// If the player is portrait-oriented and the button would collide with the layout,
// the script shifts the button to the right of search instead of forcing it below.
```

**How to Verify:**
1. Refresh XAAVV play page
2. Look for Download button below search input
3. Should have 16px gap between search and button
4. Button should not overlap search or any header elements
5. On vertical videos, the button may sit to the right of search if that avoids overlap

**Fallback:** If still overlapping, check that:
- Search input has `placeholder` attribute with "搜索" or "search"
- Search container is visible with dimensions > 1px
- No CSS is forcing button position to fixed coordinates

---

### Issue 2: Time Slider Not Appearing on Mouseover

**Symptom:** Progress bar doesn't appear when hovering over video. Must click and drag to interact.

**Root Cause:**
- CSS inline styles (`bottom: 0`) were overriding CSS rules (`bottom: -10px`)
- Progress wrapper wasn't receiving mouseover events
- Wrapper height set to `3px` by default, making it hard to hover over
- `.visible` class styling not being applied on hover

**Fix Applied (v1.2.13):**
```javascript
// Removed conflicting inline bottom: 0 style
wrapper.style.setProperty('position', 'absolute', 'important');
wrapper.style.setProperty('left', '0', 'important');
wrapper.style.setProperty('right', '0', 'important');
// bottom: 0 removed - let CSS handle it with bottom: -10px

// Added visible class toggle on any mouseover / pointer movement
video.addEventListener('pointerenter', () => {
  wrapper.classList.add('visible');
}, { passive: true });

video.addEventListener('pointermove', () => {
  wrapper.classList.add('visible');
}, { passive: true });

wrapper.addEventListener('pointerenter', () => {
  wrapper.classList.add('visible');
}, { passive: true });

// CSS now handles the visual transformation
.xaavv-video-progress-wrapper.visible {
  height: 5px !important;
  background: rgba(157, 140, 255, 0.5) !important;
}
```

**CSS Updates:**
```css
.xaavv-video-progress-wrapper {
  position: absolute !important;
  bottom: -10px !important;  /* Moved 10px up from bottom */
  left: 0 !important;
  right: 0 !important;
  height: 3px !important;
  background: rgba(26, 31, 43, 0.3) !important;
  cursor: pointer !important;
  z-index: 10 !important;
  transition: height 0.15s ease, background 0.15s ease !important;
}

.xaavv-video-progress-wrapper.visible {
  height: 5px !important;
  background: rgba(157, 140, 255, 0.5) !important;
}
```

**How to Verify:**
1. Install updated script in Tampermonkey
2. Refresh XAAVV play page
3. Move mouse or pointer over video - progress bar should appear (more visible, taller)
4. Move mouse away - progress bar should fade back to thin line
5. Click and drag on progress bar to seek

**If Still Not Working:**
- Check browser console (F12) for JavaScript errors
- Verify Tampermonkey is enabled for xaavv.com and xaavv.live
- Try clearing browser cache and reinstalling script
- Check if another userscript is conflicting (disable others temporarily)

---

### Issue 3: Pause Button Doesn't Show Styled Purple Appearance

**Symptom:** Center play button appears with default styling instead of purple gradient.

**Root Cause:** 
- Page may load with cached styles before userscript applies
- CSS specificity not strong enough
- Button element ID (`#sp_play_btn`) may not match actual element

**Fix Applied (v1.2.13):**
```css
#sp_play_btn {
  background: linear-gradient(135deg, #9d8cff 0%, #b5a8ff 100%) !important;
  border: 2px solid #c3b7ff !important;
  border-radius: 50% !important;
  width: 60px !important;
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 24px !important;
  color: #120f22 !important;
  -webkit-text-fill-color: #120f22 !important;
  font-weight: bold !important;
  box-shadow: 0 4px 16px rgba(157, 140, 255, 0.4) !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

#sp_play_btn:hover {
  background: linear-gradient(135deg, #b5a8ff 0%, #c3b7ff 100%) !important;
  box-shadow: 0 6px 20px rgba(157, 140, 255, 0.6) !important;
  transform: scale(1.05) !important;
}
```

**How to Verify:**
1. Load XAAVV play page
2. Look at center play button when paused
3. It should show a normal play/pause SVG icon, not a text glyph
4. It should have a purple gradient background
5. On hover, the gradient brightens and button scales up

**Current Behavior (v1.2.13+):**
- The center control now uses explicit SVG icons for play and pause
- The button is hidden while the video is actively playing
- It reappears when paused so the icon always matches the state

---

## Diagnostic Steps

If features aren't working, follow this checklist:

### 1. Verify Script Installation
```
Browser Console (F12):
- Go to Sources → Tampermonkey Scripts
- Look for "XAAVV Master Automation and Dark Mode"
- Should show version 1.2.13
```

### 2. Check Page Detection
```javascript
// In browser console:
/\/xavplay\//i.test(location.pathname)  // Should return true on play pages
```

### 3. Verify DOM Elements
```javascript
// Check if progress bars were injected:
document.querySelectorAll('.xaavv-video-progress-wrapper').length

// Check if download button exists:
document.getElementById('xaavv-video-download-btn')

// Check if styles are applied:
document.getElementById('xaavv-dark-theme-style')
```

### 4. Check for Console Errors
Press F12 → Console tab → Look for red error messages

---

## Common Error Messages & Fixes

### Error: "Failed to load because no supported source was found"
**Meaning:** Video element doesn't have a source URL
**Fix:** This is usually a page issue, not script issue. Video should load on page refresh.

### Error: "Cannot set property X on undefined"
**Meaning:** Script tried to access an element that doesn't exist
**Fix:** Usually caused by page layout changes. Refresh page or clear cache.

### Download Button Not Appearing
1. Refresh page - script may not have run yet
2. Check if on a play page: `/xavplay/` should be in URL
3. Verify video is actually loaded (not just thumbnail)
4. Try different video/episode
5. If the page is still loading, the button now falls back to `document.documentElement` and should appear after the next sync pass

---

## Performance Notes

- Script uses passive event listeners for mouseover/mouseout (no jank)
- Progress bar updates tied to video `timeupdate` event (60fps on most browsers)
- Download button repositioned every 220ms during playback
- Mutation observer debounced to prevent excessive DOM queries

---

## Version History

### v1.2.13 (Current)
- **Fixed:** Progress bar positioning (removed conflicting bottom: 0 inline style)
- **Fixed:** Search button detection (now checks input fields first)
- **Fixed:** Download button spacing (16px gap below search)
- **Improved:** Pause button styling with purple gradient and hover effects
- **Improved:** Progress bar visibility on mouseover with class-based transitions
- **Renamed:** Script to "XAAVV Master Automation and Dark Mode"
- **File:** `xaavv-master-automation-dark-mode-v1.2.18.user.js`

### v1.2.12
- UI improvements: pause button styling, progress bar mouseover, slider positioning

### v1.2.11
- Initial video progress bar implementation

---

## How to Report Issues

When reporting issues, please include:
1. **URL** of the page where issue occurs
2. **Browser** and **Tampermonkey version** (F12 → Tampermonkey icon)
3. **Script version** (check @version in script header)
4. **Console errors** (F12 → Console tab, paste any red errors)
5. **Screenshot** of the issue
6. **Steps to reproduce** (exactly what you clicked/hovered)

Example report:
```
URL: https://www.xaavv.com/xavplay/abc123/1/456.html
Browser: Chrome 121
Tampermonkey: 4.20
Script Version: 1.2.13
Issue: Download button overlaps search bar
Console Errors: None
Steps: 1) Visit play page 2) Look at top header 3) Button is over search
```

---

## Advanced Troubleshooting

### Disable All Userscripts Except This One
1. Tampermonkey Dashboard (icon top-right)
2. Click settings icon next to other scripts
3. Toggle "Off" for each script except XAAVV
4. Refresh XAAVV page

### Clear Tampermonkey Cache
1. Tampermonkey Settings (dashboard → ⚙️ icon)
2. Storage → Clear all data
3. Reinstall script by visiting GitHub raw file URL

### Check for CSS Conflicts
```javascript
// In browser console:
window.getComputedStyle(document.getElementById('xaavv-video-download-btn'))
// Look for unexpected values
```

---

**Last Updated:** v1.2.13  
**Maintained by:** XAAVV Automation Maintainers  
**Repository:** https://github.com/mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script
