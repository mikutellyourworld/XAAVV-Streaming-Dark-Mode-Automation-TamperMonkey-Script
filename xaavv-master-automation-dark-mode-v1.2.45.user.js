// ==UserScript==
// @name         XAAVV Master Automation and Dark Mode
// @namespace    https://github.com/<REPO_OWNER>/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script
// @version      1.2.45
// @description  Comprehensive automation suite: dark mode rendering, video playback controls (download + seek bar), playback automation, intermediate page routing, multi-video synchronization, and unobtrusive translation support with XAAVV-native search localization for body traits, site-native tags, and trans/crossdress vocabulary.
// @author       XAAVV Automation Maintainers
// @match        *://www.xaavv.live/*
// @match        *://xaavv.live/*
// @match        *://*.xaavv.live/*
// @match        *://www.xaavv.com/*
// @match        *://xaavv.com/*
// @match        *://*.xaavv.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_VERSION = '1.2.45';

  const STYLE_ID = 'xaavv-dark-theme-style';
  const TUNED_ATTR = 'data-xaavv-dark-tuned';
  const TRANSLATE_HOOK_ID = 'xaavv-translate-hook';
  const PLAYBACK_AUTOMATION_ATTR = 'data-xaavv-playback-automation-wired';
  const PLAY_UI_TUNED_ATTR = 'data-xaavv-play-ui-tuned';
  const OVERLAY_WATCH_STARTED_ATTR = 'data-xaavv-overlay-watch-started';
  const PLAY_CLICK_BOUND_ATTR = 'data-xaavv-play-click-bound';
  const INVISIBLE_PAUSE_OVERLAY_ID = 'xaavv-invisible-pause-overlay';
  const INVISIBLE_PAUSE_OVERLAY_BOUND_ATTR = 'data-xaavv-invisible-pause-overlay-bound';
  const VIDEO_DOWNLOAD_BUTTON_ID = 'xaavv-video-download-btn';
  const VIDEO_DOWNLOAD_BOUND_ATTR = 'data-xaavv-video-download-bound';
  const VIDEO_PROGRESS_WRAPPER_CLASS = 'xaavv-video-progress-wrapper';
  const VIDEO_PROGRESS_BAR_CLASS = 'xaavv-video-progress-bar';
  const VIDEO_PROGRESS_BUFFER_CLASS = 'xaavv-video-progress-buffer';
  const VIDEO_PROGRESS_FILL_CLASS = 'xaavv-video-progress-fill';
  const VIDEO_PROGRESS_HANDLE_CLASS = 'xaavv-video-progress-handle';
  const VIDEO_PROGRESS_BOUND_ATTR = 'data-xaavv-video-progress-bound';
  const SEARCH_TRANSLATION_BOUND_ATTR = 'data-xaavv-search-translation-bound';
  const PLAYBACK_ASSIST_BOUND_ATTR = 'data-xaavv-playback-assist-bound';
  const NAV_WATCH_STARTED_ATTR = 'data-xaavv-nav-watch-started';
  const SEARCH_VARIANT_ROTATION_STORAGE_KEY = 'xaavv-search-variant-rotation-v1';
  const SEARCH_VARIANT_LAST_PICK_STORAGE_KEY = 'xaavv-search-variant-last-pick-v1';
  const LOCAL_DICTIONARY_STORAGE_KEY = 'xaavv-search-dictionary-private-v1';
  const SEARCH_VARIANT_PICK_DEDUP_WINDOW_MS = 1200;
  const SEARCH_VARIANT_LAST_PICK_MAX_KEYS = 200;
  const PROGRESS_SEEK_HIT_STRIP_PX = 36;
  const PLAY_BUTTON_PLAY_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5 L18.5 12 L8 18.5 Z"></path>
    </svg>
  `;
  const PLAY_BUTTON_PAUSE_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="5.5" width="4" height="13" rx="1"></rect>
      <rect x="13" y="5.5" width="4" height="13" rx="1"></rect>
    </svg>
  `;

  const isVerticalVideoRect = (rect) => {
    return !!rect && rect.height > rect.width * 1.05;
  };

  const setPlayButtonIcon = (button, isPlaying) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    const desiredState = isPlaying ? 'hidden' : 'pause';
    if (button.dataset.xaavvIconState === desiredState) {
      return;
    }

    button.dataset.xaavvIconState = desiredState;
    button.innerHTML = isPlaying ? '' : PLAY_BUTTON_PAUSE_ICON;
    button.setAttribute('aria-label', isPlaying ? 'Playing' : 'Pause');
  };

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  // Source pattern: dark-mode baseline adapted for XAAVV + accent colors.
  const css = `
    :root {
      color-scheme: dark;
      --xaavv-bg: #121520;
      --xaavv-bg-elev: #1a1f2b;
      --xaavv-bg-soft: #22283a;
      --xaavv-surface-2: #2b3347;
      --xaavv-text: #eceffd;
      --xaavv-text-muted: #b9c0d9;
      --xaavv-accent: #9d8cff;
      --xaavv-accent-strong: #b5a8ff;
      --xaavv-link: #8ac4ff;
      --xaavv-border: #3f4a63;
      --xaavv-success: #57c5a7;
      --xaavv-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
    }

    html,
    body,
    #app,
    .min-h-screen,
    #__next,
    .sp-play,
    #sp_player_wrap {
      background: var(--xaavv-bg) !important;
      background-image: none !important;
      color: var(--xaavv-text) !important;
    }

    #sp_player_wrap,
    #sp_player_wrap::before,
    #sp_player_wrap::after,
    .sp-player,
    .sp-play main,
    .sp-play aside,
    .sp-play [class*='drawer'],
    .sp-play [class*='panel'] {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
    }

    #xaavv-invisible-pause-overlay {
      display: none !important;
      position: fixed !important;
      z-index: 145 !important;
      background: transparent !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      color: transparent !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
    }

    #xaavv-video-download-btn {
      display: none !important;
      position: fixed !important;
      z-index: 160 !important;
      min-width: 92px !important;
      border: 1px solid #c3b7ff !important;
      border-radius: 999px !important;
      background: #7d71db !important;
      color: #120f22 !important;
      -webkit-text-fill-color: #120f22 !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      letter-spacing: 0.02em !important;
      padding: 7px 11px !important;
      line-height: 1 !important;
      cursor: pointer !important;
      box-shadow: none !important;
      opacity: 0.98 !important;
      transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease !important;
      touch-action: manipulation !important;
    }

    #xaavv-video-download-btn:hover {
      filter: brightness(1.06) !important;
      transform: translateY(-1px) !important;
      opacity: 1 !important;
    }

    body.sp-play #xaavv-video-download-btn,
    html.sp-play #xaavv-video-download-btn {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: #c3b7ff !important;
      color: #eceffd !important;
      -webkit-text-fill-color: #eceffd !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }

    .xaavv-video-progress-wrapper {
      position: absolute !important;
      bottom: -10px !important;
      left: 0 !important;
      right: 0 !important;
      height: 3px !important;
      background: rgba(26, 31, 43, 0.3) !important;
      cursor: pointer !important;
      z-index: 220 !important;
      pointer-events: auto !important;
      transition: height 0.15s ease, background 0.15s ease !important;
    }

    .xaavv-video-progress-wrapper.visible {
      height: 5px !important;
      background: rgba(157, 140, 255, 0.5) !important;
    }

    .xaavv-video-progress-bar {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: transparent !important;
      pointer-events: auto !important;
    }

    .xaavv-video-progress-buffer {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      height: 100% !important;
      background: rgba(157, 140, 255, 0.4) !important;
      pointer-events: none !important;
    }

    .xaavv-video-progress-fill {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      height: 100% !important;
      background: #9d8cff !important;
      pointer-events: none !important;
      transition: width 0.05s linear, background 0.15s ease !important;
    }

    .xaavv-video-progress-wrapper.visible .xaavv-video-progress-fill {
      background: #c3b7ff !important;
    }

    .xaavv-video-progress-handle {
      position: absolute !important;
      bottom: -4px !important;
      width: 11px !important;
      height: 11px !important;
      border-radius: 50% !important;
      background: #b5a8ff !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
      transform: translateX(-50%) !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.15s ease !important;
    }

    .xaavv-video-progress-wrapper.visible .xaavv-video-progress-handle {
      opacity: 1 !important;
    }

    .xaavv-video-progress-wrapper:hover .xaavv-video-progress-handle {
      opacity: 1 !important;
    }

    .xaavv-video-progress-wrapper:hover {
      height: 5px !important;
      background: rgba(157, 140, 255, 0.5) !important;
    }

    .xaavv-video-progress-wrapper:hover .xaavv-video-progress-fill {
      background: #c3b7ff !important;
    }

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
      color: #f8f7ff !important;
      -webkit-text-fill-color: #f8f7ff !important;
      font-weight: bold !important;
      box-shadow: 0 4px 16px rgba(157, 140, 255, 0.4) !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
    }

    #sp_play_btn svg {
      width: 24px !important;
      height: 24px !important;
      display: block !important;
      fill: #f8f7ff !important;
      -webkit-text-fill-color: #f8f7ff !important;
      pointer-events: none !important;
    }

    #sp_play_btn:hover {
      background: linear-gradient(135deg, #b5a8ff 0%, #c3b7ff 100%) !important;
      box-shadow: 0 6px 20px rgba(157, 140, 255, 0.6) !important;
      transform: scale(1.05) !important;
    }

    #sp_play_btn:active {
      transform: scale(0.95) !important;
    }

    body {
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
    }

    * {
      scrollbar-color: #3f4a63 var(--xaavv-bg);
    }

    /* Use one base tone for all common bright wrappers so side/corner boxes cannot stay white. */
    header,
    [role='banner'],
    [class*='header'],
    [class*='topbar'],
    [class*='navbar'],
    footer,
    main,
    section,
    article,
    nav,
    aside,
    .pink-header,
    .bg,
    .ep-card,
    .toc-header,
    .toc-list,
    .cat-strip,
    .cat-scroll,
    .pink-search,
    [class*='bg-pink-'],
    [class*='from-pink-'],
    [class*='to-rose-'],
    [class*='border-pink-'] {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
      border-color: var(--xaavv-border) !important;
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
    }

    .pink-header,
    .pink-header > div,
    .pink-header [class*='max-w-'],
    .pink-header [class*='bg-white'],
    .pink-header [class*='bg-pink-50'],
    .pink-header [class*='bg-pink-100'],
    [role='banner'],
    [role='banner'] > div {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
      border-color: var(--xaavv-border) !important;
    }

    /* On play pages, keep top controls visible while removing only top-level header backgrounds. */
    body.sp-play header,
    body.sp-play [role='banner'],
    body.sp-play .pink-header,
    body.sp-play .pink-header > div,
    body.sp-play [class*='topbar'],
    body.sp-play [class*='navbar'],
    html.sp-play header,
    html.sp-play [role='banner'],
    html.sp-play .pink-header,
    html.sp-play .pink-header > div,
    html.sp-play [class*='topbar'],
    html.sp-play [class*='navbar'] {
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      border-color: transparent !important;
      backdrop-filter: none !important;
    }

    /* Remove large overlay layers attached to top-level play-page header wrappers only. */
    body.sp-play header::before,
    body.sp-play header::after,
    body.sp-play [role='banner']::before,
    body.sp-play [role='banner']::after,
    body.sp-play .pink-header::before,
    body.sp-play .pink-header::after,
    body.sp-play .pink-header > div::before,
    body.sp-play .pink-header > div::after,
    html.sp-play header::before,
    html.sp-play header::after,
    html.sp-play [role='banner']::before,
    html.sp-play [role='banner']::after,
    html.sp-play .pink-header::before,
    html.sp-play .pink-header::after,
    html.sp-play .pink-header > div::before,
    html.sp-play .pink-header > div::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    body.sp-play .pink-header,
    body.sp-play [role='banner'],
    body.sp-play header,
    body.sp-play [class*='topbar'],
    body.sp-play [class*='navbar'],
    html.sp-play .pink-header,
    html.sp-play [role='banner'],
    html.sp-play header,
    html.sp-play [class*='topbar'],
    html.sp-play [class*='navbar'] {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 300 !important;
      width: 100% !important;
    }

    /* Keep top-right auth/menu chips visible but fully transparent on play pages. */
    body.sp-play .pink-header button,
    body.sp-play [role='banner'] button,
    body.sp-play header button,
    body.sp-play .pink-header .pink-btn,
    body.sp-play .pink-header .pink-btn-primary,
    body.sp-play [role='banner'] .pink-btn,
    body.sp-play [role='banner'] .pink-btn-primary,
    body.sp-play .pink-header a[href*='login'],
    body.sp-play .pink-header a[href*='register'],
    body.sp-play [role='banner'] a[href*='login'],
    body.sp-play [role='banner'] a[href*='register'],
    body.sp-play .pink-header [aria-label*='menu' i],
    body.sp-play [role='banner'] [aria-label*='menu' i],
    html.sp-play .pink-header button,
    html.sp-play [role='banner'] button,
    html.sp-play header button,
    html.sp-play .pink-header .pink-btn,
    html.sp-play .pink-header .pink-btn-primary,
    html.sp-play [role='banner'] .pink-btn,
    html.sp-play [role='banner'] .pink-btn-primary,
    html.sp-play .pink-header a[href*='login'],
    html.sp-play .pink-header a[href*='register'],
    html.sp-play [role='banner'] a[href*='login'],
    html.sp-play [role='banner'] a[href*='register'],
    html.sp-play .pink-header [aria-label*='menu' i],
    html.sp-play [role='banner'] [aria-label*='menu' i] {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }

    /* On play pages, make body and html transparent so video shows through header. */
    body.sp-play,
    html.sp-play {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      color: var(--xaavv-text) !important;
    }

    footer,
    contentinfo,
    [role='contentinfo'],
    .site-footer,
    .footer,
    footer > div,
    [role='contentinfo'] > div {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
      color: var(--xaavv-text-muted) !important;
      -webkit-text-fill-color: var(--xaavv-text-muted) !important;
      border-color: var(--xaavv-border) !important;
    }

    .pink-header a[href='/'],
    .pink-header a[href='/'] span,
    [role='banner'] a[href='/'],
    [role='banner'] a[href='/'] span,
    .pink-header .text-pink-900,
    .pink-header .text-pink-800,
    .pink-header .text-white {
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
      text-shadow: none !important;
    }

    .pink-header a[href='/'] .bg-gradient-to-br,
    [role='banner'] a[href='/'] .bg-gradient-to-br {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }

    [class*='bg-white'],
    .bg-white,
    .bg-white\/80,
    .bg-white\/95,
    .text-pink-900,
    .text-pink-800,
    .text-pink-700,
    .text-pink-600,
    .text-pink-500,
    .text-pink-400,
    .text-gray-500,
    .text-gray-600,
    .text-gray-700 {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
    }

    .text-pink-300,
    .text-pink-400,
    .text-pink-500,
    .text-pink-600,
    .text-pink-700,
    .text-gray-400,
    .text-gray-500,
    .text-gray-600 {
      color: var(--xaavv-text-muted) !important;
      -webkit-text-fill-color: var(--xaavv-text-muted) !important;
    }

    a,
    a:visited,
    [role='link'],
    button,
    .pink-btn,
    .pink-btn-primary,
    [role='button'] {
      color: var(--xaavv-link) !important;
      -webkit-text-fill-color: var(--xaavv-link) !important;
      border-color: var(--xaavv-border) !important;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease !important;
    }

    .pink-btn,
    .pink-btn-primary,
    .sp-play,
    button[class*='bg-pink-'],
    a[class*='bg-pink-'] {
      background: #7d71db !important;
      background-image: none !important;
      color: #120f22 !important;
      -webkit-text-fill-color: #120f22 !important;
      border-color: #c3b7ff !important;
      box-shadow: none !important;
    }

    button,
    a,
    [role='button'],
    .pink-btn,
    .pink-btn-primary,
    .sp-play,
    [class*='btn'],
    [class*='chip'],
    [class*='tag'],
    [class*='cat-'] {
      background-image: none !important;
    }

    button::before,
    button::after,
    a::before,
    a::after,
    [role='button']::before,
    [role='button']::after,
    .pink-btn::before,
    .pink-btn::after,
    .pink-btn-primary::before,
    .pink-btn-primary::after,
    .sp-play::before,
    .sp-play::after,
    [class*='btn']::before,
    [class*='btn']::after,
    [class*='chip']::before,
    [class*='chip']::after,
    [class*='tag']::before,
    [class*='tag']::after,
    [class*='cat-']::before,
    [class*='cat-']::after {
      background-image: none !important;
      background-color: inherit !important;
      box-shadow: none !important;
    }

    a:hover,
    button:hover,
    .pink-btn:hover,
    .pink-btn-primary:hover,
    [role='button']:hover {
      filter: brightness(1.08) !important;
    }

    input,
    textarea,
    select {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
      border-color: var(--xaavv-border) !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--xaavv-text-muted) !important;
      opacity: 0.9 !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    strong,
    .font-semibold,
    .font-bold {
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
    }

    .rounded-xl,
    .rounded-2xl,
    .rounded-full,
    [class*='rounded-'] {
      border-color: var(--xaavv-border) !important;
    }

    .border,
    [class*='border-'] {
      border-color: var(--xaavv-border) !important;
    }

    [style*='position: fixed'],
    [style*='position:fixed'],
    [style*='position: sticky'],
    [style*='position:sticky'] {
      background-color: var(--xaavv-bg-elev) !important;
      color: var(--xaavv-text) !important;
      -webkit-text-fill-color: var(--xaavv-text) !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r,
    .bg-gradient-to-l,
    .bg-gradient-to-b,
    .bg-gradient-to-t,
    [class*='bg-gradient-'],
    [class*='from-white'],
    [class*='to-white'],
    [style*='gradient'] {
      background-image: none !important;
      background-color: var(--xaavv-bg) !important;
    }

    [style*='linear-gradient'],
    [style*='radial-gradient'] {
      background-image: none !important;
      background-color: var(--xaavv-bg) !important;
    }

    /* Hard-disable top header fade overlays that still show white edges. */
    .pink-header [class*='bg-gradient-to-r'][class*='from-white'],
    .pink-header [class*='bg-gradient-to-l'][class*='from-white'],
    .pink-header [class*='from-white'][class*='to-transparent'],
    .pink-header [class*='to-white'][class*='from-transparent'],
    .pink-header [class*='pointer-events-none'][class*='bg-gradient'] {
      display: none !important;
      background: transparent !important;
      background-image: none !important;
    }

    .pink-header,
    .pink-header *,
    .pink-header *::before,
    .pink-header *::after,
    [role='banner'],
    [role='banner'] *,
    [role='banner'] *::before,
    [role='banner'] *::after {
      background-image: none !important;
      -webkit-mask-image: none !important;
      mask-image: none !important;
    }

    /* Final hardening for page chrome only (avoid touching player internals). */
    header *,
    footer *,
    nav *,
    aside *,
    [role='banner'] *,
    [role='contentinfo'] * {
      background-image: none !important;
    }

    /* Player safety: do not force player layers to dark backgrounds. */
    #player,
    #player *,
    .video-js,
    .video-js *,
    [class*='vjs-'],
    [class*='vjs-'] *,
    #danmu_layer,
    #danmu_layer *,
    [class*='player-container'],
    [class*='player-container'] * {
      background-color: initial !important;
      background-image: initial !important;
      border-color: initial !important;
      filter: none !important;
      -webkit-mask-image: initial !important;
      mask-image: initial !important;
    }

    #player,
    .video-js,
    .video-js .vjs-tech,
    video {
      visibility: visible !important;
      opacity: 1 !important;
    }

    .video-js .vjs-tech {
      z-index: 2 !important;
      object-fit: contain !important;
    }

    #danmu_layer {
      background: transparent !important;
      pointer-events: none !important;
      z-index: 3 !important;
    }

    /* Force corner decorations and gradient containers to dark. */
    div[style*='#fff'],
    div[style*='white'],
    div[style*='rgb(255'] {
      background-color: var(--xaavv-bg) !important;
      background-image: none !important;
    }

    html::before,
    html::after,
    body::before,
    body::after,
    #app::before,
    #app::after,
    [class*='container']::before,
    [class*='container']::after,
    [class*='wrap']::before,
    [class*='wrap']::after,
    [class*='content']::before,
    [class*='content']::after,
    [class*='cat-']::before,
    [class*='cat-']::after {
      background: var(--xaavv-bg) !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    .text-emerald-500,
    .text-green-500,
    .text-green-600 {
      color: var(--xaavv-success) !important;
    }

    .backdrop-blur-sm,
    .backdrop-blur-xl {
      background-color: rgba(26, 31, 43, 0.9) !important;
    }

    /* Keep media and artwork untouched to avoid playback or contrast regressions. */
    video,
    img,
    canvas,
    svg,
    picture,
    iframe {
      filter: none !important;
      mix-blend-mode: normal !important;
    }

    [style*='background-image'] {
      background-blend-mode: normal !important;
    }

    :focus-visible {
      outline: 2px solid var(--xaavv-accent-strong) !important;
      outline-offset: 2px !important;
    }

    ::selection {
      background: rgba(157, 140, 255, 0.35);
      color: #f7f5ff;
    }

    /* Keep translation output but hide Google toolbar/banner UI chrome. */
    .goog-te-banner-frame,
    .goog-te-banner-frame.skiptranslate,
    iframe.goog-te-banner-frame,
    .skiptranslate > iframe,
    .goog-te-balloon-frame,
    #goog-gt-tt,
    .goog-te-spinner-pos,
    .goog-tooltip,
    .goog-tooltip:hover {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    body,
    html,
    body.translated-ltr,
    body.translated-rtl {
      top: 0 !important;
      margin-top: 0 !important;
    }

    /* Remove translation text highlight artifacts. */
    .goog-text-highlight {
      background: inherit !important;
      box-shadow: none !important;
    }

    /* Remove lingering top-left loader ring overlays. */
    [class*='spinner'],
    [class*='loading'][class*='fixed'],
    [class*='animate-spin'][class*='fixed'],
    [class*='loader'][class*='fixed'] {
      display: none !important;
    }
  `;

  const isMediaElement = (el) => {
    return !!el.closest('img,video,canvas,picture,svg,iframe');
  };

  const isPlayerElement = (el) => {
    return !!el.closest('#player, .video-js, [class*="vjs-"], #danmu_layer, [class*="player-container"], [id*="player"]');
  };

  const resetPlayerStyles = (el) => {
    el.style.removeProperty('background-color');
    el.style.removeProperty('background-image');
    el.style.removeProperty('color');
    el.style.removeProperty('-webkit-text-fill-color');
    el.style.removeProperty('border-color');
    el.style.removeProperty('backdrop-filter');
    el.style.removeProperty('-webkit-mask-image');
    el.style.removeProperty('mask-image');
    el.removeAttribute(TUNED_ATTR);
  };

  const ensureAutoTranslateToEnglish = () => {
    const current = document.cookie || '';
    const hasGoogleTranslateCookie = current.includes('googtrans=/auto/en') || current.includes('googtrans=/zh-CN/en');

    if (!hasGoogleTranslateCookie) {
      document.cookie = 'googtrans=/auto/en; path=/';
      document.cookie = 'googtrans=/auto/en; domain=' + location.hostname + '; path=/';
    }

    if (!document.getElementById(TRANSLATE_HOOK_ID)) {
      const hook = document.createElement('div');
      hook.id = TRANSLATE_HOOK_ID;
      hook.style.position = 'fixed';
      hook.style.right = '8px';
      hook.style.bottom = '8px';
      hook.style.width = '1px';
      hook.style.height = '1px';
      hook.style.opacity = '0';
      hook.style.pointerEvents = 'none';
      document.documentElement.appendChild(hook);
    }

    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
      if (!document.getElementById('google-translate-script')) {
        window.xaavvTranslateInit = () => {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'auto',
                includedLanguages: 'en',
                autoDisplay: false,
                multilanguagePage: true,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              TRANSLATE_HOOK_ID
            );

            const killTranslateUi = () => {
              const banner = document.querySelector('.goog-te-banner-frame, iframe.goog-te-banner-frame');
              if (banner instanceof HTMLElement) {
                banner.style.setProperty('display', 'none', 'important');
              }
              document.body.style.setProperty('top', '0', 'important');
              document.documentElement.style.setProperty('top', '0', 'important');
            };

            killTranslateUi();
            setTimeout(killTranslateUi, 500);
            setTimeout(killTranslateUi, 1500);
          } catch (e) {
            // Silent fallback: cookie-based translate still helps when available.
          }
        };

        const s = document.createElement('script');
        s.id = 'google-translate-script';
        s.src = 'https://translate.google.com/translate_a/element.js?cb=xaavvTranslateInit';
        document.documentElement.appendChild(s);
      }
    }
  };

  const parseColor = (value) => {
    if (!value) {
      return null;
    }

    const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (!m) {
      return null;
    }

    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] === undefined ? 1 : Number(m[4])
    };
  };

  const replaceGradientWhites = (bgImage) => {
    if (!bgImage || bgImage === 'none') {
      return bgImage;
    }

    // Replace white hex codes in gradients
    let replaced = bgImage.replace(/#fff(?![0-9a-f])/gi, '#1a1f2b');
    replaced = replaced.replace(/#ffffff/gi, '#1a1f2b');

    // Replace rgb(255, 255, 255) with dark color
    replaced = replaced.replace(/rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi, 'rgb(26, 31, 43)');

    // Replace rgba(255, 255, 255, ...) with dark color
    replaced = replaced.replace(/rgba\s*\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi, 'rgba(26, 31, 43, $1)');

    // If any gradient remains, flatten to uniform main background for full consistency.
    if (/gradient\(/i.test(replaced)) {
      return 'none';
    }

    return replaced;
  };

  const extractPlayHref = (input) => {
    if (!input) {
      return null;
    }

    const m = input.match(/\/xavplay\/[a-zA-Z0-9_-]+\/\d+\/\d+\.html/i);
    if (!m) {
      return null;
    }

    return new URL(m[0], location.origin).href;
  };

  const getCurrentSlugFromDetailPath = () => {
    const m = location.pathname.match(/^\/xaavv\/([a-zA-Z0-9_-]+)\.html$/i);
    return m ? m[1] : null;
  };

  const isIntermediateDetailPath = () => {
    return /^\/xaavv\/[a-zA-Z0-9_-]+\.html$/i.test(location.pathname);
  };

  const isPlayPath = () => {
    return /\/xavplay\//i.test(location.pathname);
  };

  const SEARCH_DICTIONARY_STACKS = [{"name":"phrase","map":{"blue hair":["blue hair","\u84dd\u53d1","\u84dd\u6bdb","\u84dd\u8272\u5934\u53d1"],"green hair":["\u00e7\u00bb\u00bf\u00e5\u008f\u2018","\u00e7\u00bb\u00bf\u00e8\u2030\u00b2\u00e5\u00a4\u00b4\u00e5\u008f\u2018","\u00e7\u00bb\u00bf\u00e6\u00af\u203a"],"pink hair":["\u00e7\u00b2\u2030\u00e5\u008f\u2018","\u00e7\u00b2\u2030\u00e8\u2030\u00b2\u00e5\u00a4\u00b4\u00e5\u008f\u2018","\u00e7\u00b2\u2030\u00e6\u00af\u203a"],"silver hair":["\u00e9\u201c\u00b6\u00e5\u008f\u2018","\u00e9\u201c\u00b6\u00e8\u2030\u00b2\u00e5\u00a4\u00b4\u00e5\u008f\u2018"],"white hair":["\u00e7\u2122\u00bd\u00e5\u008f\u2018","\u00e9\u201c\u00b6\u00e7\u2122\u00bd\u00e5\u008f\u2018"],"black hair":["\u00e9\u00bb\u2018\u00e5\u008f\u2018","\u00e9\u00bb\u2018\u00e9\u2022\u00bf\u00e7\u203a\u00b4"],"long hair":["\u00e9\u2022\u00bf\u00e5\u008f\u2018","\u00e9\u00bb\u2018\u00e9\u2022\u00bf\u00e7\u203a\u00b4"],"short hair":["\u00e7\u0178\u00ad\u00e5\u008f\u2018","\u00e7\u0178\u00ad\u00e5\u008f\u2018\u00e5\u00a6\u00b9"],"twin tails":["\u00e5\u008f\u0152\u00e9\u00a9\u00ac\u00e5\u00b0\u00be","\u00e5\u008f\u0152\u00e9\u00a9\u00ac\u00e5\u00b0\u00be\u00e5\u00b0\u2018\u00e5\u00a5\u00b3"],"high ponytail":["\u00e9\u00ab\u02dc\u00e9\u00a9\u00ac\u00e5\u00b0\u00be","\u9a6c\u5c3e"],"hair bun":["\u4e38\u5b50\u5934","\u00e5\u008f\u2018\u00e9\u00ab\u00bb"],"curly hair":["\u00e5\u008d\u00b7\u00e5\u008f\u2018","\u5927\u6ce2\u6d6a"],"wet hair":["\u00e6\u00b9\u00bf\u00e5\u008f\u2018","\u6e7f\u8eab"],"tattoo girl":["\u7eb9\u8eab\u5973","\u7eb9\u8eab\u59b9","\u00e5\u02c6\u00ba\u00e9\u009d\u2019"],"full tattoo":["\u00e6\u00bb\u00a1\u00e8\u0192\u0152\u00e7\u00ba\u00b9\u00e8\u00ba\u00ab","\u00e5\u2026\u00a8\u00e8\u00ba\u00ab\u00e7\u00ba\u00b9\u00e8\u00ba\u00ab","\u00e5\u02c6\u00ba\u00e9\u009d\u2019"],"cosplay girl":["cos","\u00e8\u00a7\u2019\u00e8\u2030\u00b2\u00e6\u2030\u00ae\u00e6\u00bc\u201d","coser"],"anime cosplay":["\u00e5\u0160\u00a8\u00e6\u00bc\u00abcos","\u00e8\u00a7\u2019\u00e8\u2030\u00b2\u00e6\u2030\u00ae\u00e6\u00bc\u201d","cos"],"game cosplay":["\u00e6\u00b8\u00b8\u00e6\u02c6\u008fcos","\u00e8\u00a7\u2019\u00e8\u2030\u00b2\u00e6\u2030\u00ae\u00e6\u00bc\u201d","cos"],"arknights cosplay":["\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178 cos","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","arknights"],"zenless zone zero cosplay":["\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6 cos","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","zzz"],"female lead":["\u5973\u4e3b","\u00e5\u00a5\u00b3\u00e7\u00a5\u017e","\u5c0f\u59d0\u59d0"],"pretty face":["\u00e9\u00ab\u02dc\u00e9\u00a2\u0153\u00e5\u20ac\u00bc","\u00e7\u00a5\u017e\u00e9\u00a2\u0153","\u00e7\u00b2\u00be\u00e8\u2021\u00b4\u00e8\u201e\u00b8"],"big eyes":["\u00e5\u00a4\u00a7\u00e7\u0153\u00bc","\u00e7\u201d\u00b5\u00e7\u0153\u00bc"],"small waist":["\u00e5\u00b0\u008f\u00e8\u203a\u00ae\u00e8\u2026\u00b0","\u00e7\u00bb\u2020\u00e8\u2026\u00b0"],"slim body":["\u00e8\u2039\u2014\u00e6\u009d\u00a1","\u00e7\u00ba\u00a4\u00e7\u00bb\u2020","\u00e7\u02dc\u00a6\u00e8\u00ba\u00ab\u00e6\u009d\u0090"],"athletic girl":["\u00e8\u00bf\u0090\u00e5\u0160\u00a8\u00e7\u00b3\u00bb","\u5065\u8eab\u5973","\u00e6\u00b4\u00bb\u00e5\u0160\u203a\u00e5\u00b0\u2018\u00e5\u00a5\u00b3"],"office lady":["ol","\u00e8\u0081\u0152\u00e5\u0153\u00ba","\u00e7\u00a7\u02dc\u00e4\u00b9\u00a6"],"school girl":["\u00e5\u00ad\u00a6\u00e7\u201d\u0178\u00e5\u00a6\u00b9","\u00e5\u02c6\u00b6\u00e6\u0153\u008d","\u00e6\u00a0\u00a1\u00e5\u203a\u00ad"],"nurse cosplay":["\u00e6\u0160\u00a4\u00e5\u00a3\u00ab","\u00e6\u0160\u00a4\u00e5\u00a3\u00ab\u00e8\u00a3\u2026","cos"],"maid cosplay":["\u00e5\u00a5\u00b3\u00e4\u00bb\u2020","\u00e5\u00a5\u00b3\u00e4\u00bb\u2020\u00e8\u00a3\u2026","cos"],"bunny girl":["\u00e5\u2026\u201d\u00e5\u00a5\u00b3\u00e9\u0192\u017d","\u00e5\u2026\u201d\u00e5\u00a5\u00b3\u00e9\u0192\u017d\u00e8\u00a3\u2026","cos"],"cat girl":["\u00e7\u0152\u00ab\u00e8\u20ac\u00b3","\u00e7\u0152\u00ab\u00e5\u00a8\u02dc","cos"],"idol style":["\u00e5\u0081\u00b6\u00e5\u0192\u008f","\u00e5\u00a5\u00b3\u00e5\u203a\u00a2","\u00e6\u00b8\u2026\u00e7\u00ba\u00af"],"selfie style":["\u00e8\u2021\u00aa\u00e6\u2039\u008d","\u00e9\u2022\u0153\u00e5\u2030\u008d","\u00e7\u00ac\u00ac\u00e4\u00b8\u20ac\u00e8\u00a7\u2020\u00e8\u00a7\u2019"],"arknights amiya":["\u00e9\u02dc\u00bf\u00e7\u00b1\u00b3\u00e5\u00a8\u2026","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","amiya"],"arknights chen":["\u00e9\u2122\u02c6","\u00e9\u2122\u02c6sir","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178"],"arknights kaltsit":["\u00e5\u2021\u00af\u00e5\u00b0\u201d\u00e5\u00b8\u0152","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","kal'tsit"],"arknights texas":["\u00e5\u00be\u00b7\u00e5\u2026\u2039\u00e8\u0090\u00a8\u00e6\u2013\u00af","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","texas"],"arknights lappland":["\u00e6\u2039\u2030\u00e6\u2122\u00ae\u00e5\u2026\u00b0\u00e5\u00be\u00b7","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","lappland"],"arknights exusiai":["\u00e8\u0192\u00bd\u00e5\u00a4\u00a9\u00e4\u00bd\u00bf","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","exusiai"],"arknights skadi":["\u00e6\u2013\u00af\u00e5\u008d\u00a1\u00e8\u2019\u201a","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","skadi"],"arknights surtr":["\u00e5\u008f\u00b2\u00e5\u00b0\u201d\u00e7\u2030\u00b9\u00e5\u00b0\u201d","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","surtr"],"arknights mudrock":["\u6ce5\u5ca9","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","mudrock"],"arknights w":["w","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","w \u00e5\u00b9\u00b2\u00e5\u2018\u02dc"],"zenless ellen":["\u00e8\u2030\u00be\u00e8\u017d\u00b2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","ellen joe"],"zenless anby":["\u00e5\u00ae\u2030\u00e6\u00af\u201d","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","anby"],"zenless nicole":["\u59ae\u53ef","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","nicole"],"zenless nekomata":["\u00e7\u0152\u00ab\u00e5\u008f\u02c6","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","nekomata"],"zenless soldier 11":["11\u53f7","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","soldier 11"],"zenless koleda":["\u00e7\u008f\u201a\u00e8\u2022\u00be\u00e5\u00a6\u00b2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","koleda"],"zenless grace":["\u00e6\u00a0\u00bc\u00e8\u017d\u2030\u00e4\u00b8\u009d","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","grace"],"zenless rina":["\u00e4\u00b8\u00bd\u00e5\u00a8\u0153","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","rina"],"zenless zhu yuan":["\u00e6\u0153\u00b1\u00e9\u00b8\u00a2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","zhu yuan"],"zenless qingyi":["\u00e9\u009d\u2019\u00e8\u00a1\u00a3","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","qingyi"],"zenless jane":["\u00e7\u00ae\u20ac","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","jane doe"],"zenless miyabi":["\u00e9\u203a\u2026","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","miyabi"],"anime rem":["\u00e8\u2022\u00be\u00e5\u00a7\u2020","re:0","rem"],"anime asuna":["\u00e4\u00ba\u0161\u00e4\u00b8\u009d\u00e5\u00a8\u0153","\u00e5\u02c6\u20ac\u00e5\u2030\u2018\u00e7\u00a5\u017e\u00e5\u0178\u0178","asuna"],"anime mikasa":["\u00e4\u00b8\u2030\u00e7\u00ac\u00a0","\u00e8\u00bf\u203a\u00e5\u2021\u00bb\u00e7\u0161\u201e\u00e5\u00b7\u00a8\u00e4\u00ba\u00ba","mikasa"],"anime marin":["\u00e5\u2013\u0153\u00e5\u00a4\u0161\u00e5\u00b7\u009d\u00e6\u00b5\u00b7\u00e6\u00a2\u00a6","\u00e6\u203a\u00b4\u00e8\u00a1\u00a3\u00e4\u00ba\u00ba\u00e5\u0081\u00b6","marin"],"anime zero two":["02","darling in the franxx","zero two"],"anime yor":["\u00e7\u00ba\u00a6\u00e5\u00b0\u201d","\u00e9\u2014\u00b4\u00e8\u00b0\u008d\u00e8\u00bf\u2021\u00e5\u00ae\u00b6\u00e5\u00ae\u00b6","yor"],"anime makima":["\u00e7\u017d\u203a\u00e5\u00a5\u2021\u00e7\u017d\u203a","\u00e7\u201d\u00b5\u00e9\u201d\u00af\u00e4\u00ba\u00ba","makima"],"anime hinata":["\u00e9\u203a\u008f\u00e7\u201d\u00b0","\u706b\u5f71","hinata"],"anime nami":["\u00e5\u00a8\u0153\u00e7\u00be\u017d","\u00e6\u00b5\u00b7\u00e8\u00b4\u00bc\u00e7\u017d\u2039","nami"],"anime boa hancock":["\u00e6\u00b1\u2030\u00e5\u00ba\u201c\u00e5\u2026\u2039","\u00e6\u00b5\u00b7\u00e8\u00b4\u00bc\u00e7\u017d\u2039","boa"],"anime nezuko":["\u00e7\u00a5\u00a2\u00e8\u00b1\u2020\u00e5\u00ad\u0090","\u9b3c\u706d","nezuko"]}},{"name":"token","map":{"female":["\u00e5\u00a5\u00b3\u00e7\u201d\u0178","\u5c0f\u59d0\u59d0","\u00e5\u00a5\u00b3\u00e7\u00a5\u017e"],"girl":["\u59b9\u5b50","\u00e5\u00a5\u00b3\u00e7\u201d\u0178","\u00e5\u00b0\u2018\u00e5\u00a5\u00b3"],"woman":["\u5973\u4eba","\u00e5\u00a5\u00b3\u00e6\u20ac\u00a7","\u5c0f\u59d0\u59d0"],"waifu":["\u00e8\u20ac\u0081\u00e5\u00a9\u2020","\u00e4\u00ba\u0152\u00e6\u00ac\u00a1\u00e5\u2026\u0192\u00e5\u00a5\u00b3\u00e7\u00a5\u017e","\u00e5\u00a5\u00b3\u00e7\u00a5\u017e"],"hair":["\u00e5\u008f\u2018\u00e5\u017e\u2039","\u00e9\u2022\u00bf\u00e5\u008f\u2018","\u00e7\u0178\u00ad\u00e5\u008f\u2018"],"blue":["\u00e8\u201c\u009d\u00e8\u2030\u00b2","\u00e8\u201c\u009d\u00e5\u008f\u2018","\u00e8\u201c\u009d\u00e6\u00af\u203a"],"green":["\u00e7\u00bb\u00bf\u00e8\u2030\u00b2","\u00e7\u00bb\u00bf\u00e5\u008f\u2018","\u00e7\u00bb\u00bf\u00e6\u00af\u203a"],"pink":["\u00e7\u00b2\u2030\u00e8\u2030\u00b2","\u00e7\u00b2\u2030\u00e5\u008f\u2018","\u00e7\u00b2\u2030\u00e6\u00af\u203a"],"silver":["\u00e9\u201c\u00b6\u00e8\u2030\u00b2","\u00e9\u201c\u00b6\u00e5\u008f\u2018","\u00e7\u2122\u00bd\u00e5\u008f\u2018"],"white":["\u00e7\u2122\u00bd\u00e8\u2030\u00b2","\u00e7\u2122\u00bd\u00e5\u008f\u2018","\u00e9\u201c\u00b6\u00e7\u2122\u00bd\u00e5\u008f\u2018"],"black":["\u00e9\u00bb\u2018\u00e8\u2030\u00b2","\u00e9\u00bb\u2018\u00e5\u008f\u2018","\u00e9\u00bb\u2018\u00e9\u2022\u00bf\u00e7\u203a\u00b4"],"blonde":["\u00e9\u2021\u2018\u00e5\u008f\u2018","\u00e9\u00bb\u201e\u00e5\u008f\u2018","\u00e9\u2021\u2018\u00e6\u00af\u203a"],"tattoo":["\u7eb9\u8eab","\u523a\u9752","\u7eb9\u8eab\u59b9"],"cosplay":["cos","coser","\u89d2\u8272\u626e\u6f14"],"cos":["cos","coser","\u89d2\u8272\u626e\u6f14"],"anime":["\u52a8\u6f2b","\u4e8c\u6b21\u5143","\u91cc\u756a"],"game":["\u6e38\u620f","\u4e8c\u6b21\u5143","\u6e38\u620fcos"],"character":["\u00e8\u00a7\u2019\u00e8\u2030\u00b2","\u4eba\u7269","coser"],"ts":["TS","\u4f2a\u5a18","\u4eba\u5996","\u7537\u5a18"],"\u7537\u5a18":["\u7537\u5a18","\u4f2a\u5a18","TS"],"\u5f02\u88c5":["\u5f02\u88c5","\u5973\u88c5","\u7537\u626e\u5973\u88c5"],"\u5973\u88c5":["\u5973\u88c5","\u5f02\u88c5","\u7537\u5a18"],"\u4eba\u5996":["\u4eba\u5996","\u4f2a\u5a18","TS"],"\u4f2a\u5a18":["\u4f2a\u5a18","TS","\u4eba\u5996"],"\u7f51\u9ec4":["\u7f51\u9ec4","\u798f\u5229\u59ec","onlyfans"],"\u798f\u5229\u59ec":["\u798f\u5229\u59ec","\u7f51\u9ec4","onlyfans"],"onlyfans":["onlyfans","\u798f\u5229\u59ec","\u7f51\u9ec4"],"of":["onlyfans","\u798f\u5229\u59ec","\u7f51\u9ec4"],"\u767d\u864e":["\u767d\u864e","\u65e0\u6bdb","\u5ae9\u903c"],"\u7f8e\u4e73":["\u7f8e\u4e73","\u5de8\u4e73","\u5976\u5b50"],"\u7206\u4e73":["\u7206\u4e73","\u5de8\u4e73","\u7f8e\u4e73"],"\u7f8e\u817f":["\u7f8e\u817f","\u957f\u817f","\u7389\u8db3"],"\u7f8e\u81c0":["\u7f8e\u81c0","\u4e30\u81c0","\u7fd8\u81c0"],"\u7389\u8db3":["\u7389\u8db3","\u8db3\u4ea4","\u7f8e\u8db3"],"\u8db3\u4ea4":["\u8db3\u4ea4","\u7389\u8db3","\u7f8e\u8db3"],"\u4e73\u5934":["\u4e73\u5934","\u4e73\u9996","\u5976\u5b50"],"\u540e\u5ead":["\u540e\u5ead","\u83ca\u82b1","\u5c41\u773c"],"arknights":["\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","arknights","\u00e6\u2013\u00b9\u00e8\u02c6\u0178"],"zenless":["\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","zzz","zenless"],"zzz":["\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","zenless","zzz"],"amiya":["\u00e9\u02dc\u00bf\u00e7\u00b1\u00b3\u00e5\u00a8\u2026","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","amiya"],"chen":["\u00e9\u2122\u02c6","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","chen"],"kaltsit":["\u00e5\u2021\u00af\u00e5\u00b0\u201d\u00e5\u00b8\u0152","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","kal'tsit"],"texas":["\u00e5\u00be\u00b7\u00e5\u2026\u2039\u00e8\u0090\u00a8\u00e6\u2013\u00af","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","texas"],"lappland":["\u00e6\u2039\u2030\u00e6\u2122\u00ae\u00e5\u2026\u00b0\u00e5\u00be\u00b7","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","lappland"],"exusiai":["\u00e8\u0192\u00bd\u00e5\u00a4\u00a9\u00e4\u00bd\u00bf","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","exusiai"],"skadi":["\u00e6\u2013\u00af\u00e5\u008d\u00a1\u00e8\u2019\u201a","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","skadi"],"surtr":["\u00e5\u008f\u00b2\u00e5\u00b0\u201d\u00e7\u2030\u00b9\u00e5\u00b0\u201d","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","surtr"],"mudrock":["\u6ce5\u5ca9","\u00e6\u02dc\u017d\u00e6\u2014\u00a5\u00e6\u2013\u00b9\u00e8\u02c6\u0178","mudrock"],"ellen":["\u00e8\u2030\u00be\u00e8\u017d\u00b2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","ellen joe"],"anby":["\u00e5\u00ae\u2030\u00e6\u00af\u201d","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","anby"],"nicole":["\u59ae\u53ef","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","nicole"],"nekomata":["\u00e7\u0152\u00ab\u00e5\u008f\u02c6","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","nekomata"],"koleda":["\u00e7\u008f\u201a\u00e8\u2022\u00be\u00e5\u00a6\u00b2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","koleda"],"grace":["\u00e6\u00a0\u00bc\u00e8\u017d\u2030\u00e4\u00b8\u009d","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","grace"],"rina":["\u00e4\u00b8\u00bd\u00e5\u00a8\u0153","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","rina"],"zhuyuan":["\u00e6\u0153\u00b1\u00e9\u00b8\u00a2","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","zhu yuan"],"qingyi":["\u00e9\u009d\u2019\u00e8\u00a1\u00a3","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","qingyi"],"miyabi":["\u00e9\u203a\u2026","\u00e7\u00bb\u009d\u00e5\u0152\u00ba\u00e9\u203a\u00b6","miyabi"],"rem":["\u00e8\u2022\u00be\u00e5\u00a7\u2020","re:0","rem"],"asuna":["\u00e4\u00ba\u0161\u00e4\u00b8\u009d\u00e5\u00a8\u0153","\u00e5\u02c6\u20ac\u00e5\u2030\u2018\u00e7\u00a5\u017e\u00e5\u0178\u0178","asuna"],"mikasa":["\u00e4\u00b8\u2030\u00e7\u00ac\u00a0","\u00e8\u00bf\u203a\u00e5\u2021\u00bb\u00e7\u0161\u201e\u00e5\u00b7\u00a8\u00e4\u00ba\u00ba","mikasa"],"marin":["\u00e5\u2013\u0153\u00e5\u00a4\u0161\u00e5\u00b7\u009d\u00e6\u00b5\u00b7\u00e6\u00a2\u00a6","\u00e6\u203a\u00b4\u00e8\u00a1\u00a3\u00e4\u00ba\u00ba\u00e5\u0081\u00b6","marin"],"yor":["\u00e7\u00ba\u00a6\u00e5\u00b0\u201d","\u00e9\u2014\u00b4\u00e8\u00b0\u008d\u00e8\u00bf\u2021\u00e5\u00ae\u00b6\u00e5\u00ae\u00b6","yor"],"makima":["\u00e7\u017d\u203a\u00e5\u00a5\u2021\u00e7\u017d\u203a","\u00e7\u201d\u00b5\u00e9\u201d\u00af\u00e4\u00ba\u00ba","makima"],"hinata":["\u00e9\u203a\u008f\u00e7\u201d\u00b0","\u706b\u5f71","hinata"],"nami":["\u00e5\u00a8\u0153\u00e7\u00be\u017d","\u00e6\u00b5\u00b7\u00e8\u00b4\u00bc\u00e7\u017d\u2039","nami"],"hancock":["\u00e6\u00b1\u2030\u00e5\u00ba\u201c\u00e5\u2026\u2039","\u00e6\u00b5\u00b7\u00e8\u00b4\u00bc\u00e7\u017d\u2039","\u00e6\u00b1\u2030\u00e5\u00ba\u201c\u00e5\u2026\u2039"],"nezuko":["\u00e7\u00a5\u00a2\u00e8\u00b1\u2020\u00e5\u00ad\u0090","\u9b3c\u706d","nezuko"],"butt":["\u7f8e\u81c0","\u5c41\u80a1","\u7fd8\u81c0"],"ass":["\u7f8e\u81c0","\u5c41\u80a1","\u540e\u5ead"],"booty":["\u7f8e\u81c0","\u4e30\u81c0","\u7fd8\u81c0"],"boob":["\u5de8\u4e73","\u7f8e\u4e73","\u5976\u5b50"],"boobs":["\u5de8\u4e73","\u7f8e\u4e73","\u5976\u5b50"],"breast":["\u7f8e\u4e73","\u5de8\u4e73","\u4e73\u623f"],"chest":["\u80f8\u90e8","\u7f8e\u4e73","\u5de8\u4e73"],"armpit":["\u8165\u7a9d","\u8165\u4e0b"],"collar":["\u9501\u9aa8","\u9888\u90e8"],"collarbone":["\u9501\u9aa8","\u9888\u90e8"],"leg":["\u7f8e\u817f","\u957f\u817f","\u817f"],"thigh":["\u5927\u817f","\u7f8e\u817f","\u817f"],"foot":["\u7389\u8db3","\u8db3\u4ea4","\u7f8e\u8db3"],"shoulder":["\u80a9\u8180","\u9501\u9aa8"],"waist":["\u7ec6\u8170","\u8170\u80a2","\u8170"],"belly":["\u5c0f\u8179","\u8179\u90e8","\u809a\u5b50"],"cum":["\u5c04\u7cbe","\u7cbe\u6db2","\u5185\u5c04"],"nakadashi":["\u4e2d\u51fa","\u5185\u5c04","nakadashi","creampie"],"creampie":["\u4e2d\u51fa","\u5185\u5c04","creampie"],"shiofuki":["\u6f6e\u5439","\u55b7\u6c34","squirt"],"squirt":["\u6f6e\u5439","\u55b7\u6c34","\u55b7\u5c04"],"gonzo":["gonzo","\u91ce\u5916","\u514d\u8d39\u539f\u7248"],"harem":["\u540e\u5bab","harem","\u30cf\u30fc\u30ec\u30e0"],"futanari":["\u4f2a\u5a18","\u7537\u5a18","futanari"],"netorare":["\u7eff\u5e3d","netorare","ntr"],"ntr":["\u7eff\u5e3d","netorare","ntr"],"bondage":["\u7ed1\u7f1a","\u62d8\u675f","bondage"],"hypnosis":["\u50ac\u7720","hypnosis","\u50ac\u60c5"]}}];

  let cachedDictionaryPayloadRaw = null;
  let cachedDictionaryStacks = SEARCH_DICTIONARY_STACKS;

  const mergeDictionaryStackMaps = (baseMap, overrideMap) => {
    const merged = { ...(baseMap || {}) };
    for (const [key, value] of Object.entries(overrideMap || {})) {
      if (!key || !Array.isArray(value)) {
        continue;
      }
      merged[key] = value;
    }
    return merged;
  };

  const loadLocalDictionaryStacks = () => {
    try {
      const raw = localStorage.getItem(LOCAL_DICTIONARY_STORAGE_KEY);
      if (!raw) {
        cachedDictionaryPayloadRaw = null;
        cachedDictionaryStacks = SEARCH_DICTIONARY_STACKS;
        return SEARCH_DICTIONARY_STACKS;
      }

      if (raw === cachedDictionaryPayloadRaw) {
        return cachedDictionaryStacks;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        cachedDictionaryPayloadRaw = null;
        cachedDictionaryStacks = SEARCH_DICTIONARY_STACKS;
        return SEARCH_DICTIONARY_STACKS;
      }

      const phrase = parsed.find((entry) => entry && entry.name === 'phrase' && entry.map && typeof entry.map === 'object');
      const token = parsed.find((entry) => entry && entry.name === 'token' && entry.map && typeof entry.map === 'object');
      const basePhrase = SEARCH_DICTIONARY_STACKS.find((entry) => entry && entry.name === 'phrase');
      const baseToken = SEARCH_DICTIONARY_STACKS.find((entry) => entry && entry.name === 'token');

      cachedDictionaryPayloadRaw = raw;
      cachedDictionaryStacks = [
        {
          name: 'phrase',
          map: mergeDictionaryStackMaps(basePhrase ? basePhrase.map : {}, phrase ? phrase.map : {})
        },
        {
          name: 'token',
          map: mergeDictionaryStackMaps(baseToken ? baseToken.map : {}, token ? token.map : {})
        }
      ];
      return cachedDictionaryStacks;
    } catch (_) {
      cachedDictionaryPayloadRaw = null;
      cachedDictionaryStacks = SEARCH_DICTIONARY_STACKS;
      return SEARCH_DICTIONARY_STACKS;
    }
  };

  const getStackMap = (name) => {
    const stack = loadLocalDictionaryStacks().find((entry) => entry && entry.name === name);
    return stack && stack.map ? stack.map : {};
  };

  const preferLocalizedVariants = (sourceText, variants) => {
    const cleaned = dedupeSearchVariants(variants);
    if (!cleaned.length) {
      return cleaned;
    }

    const nonAscii = cleaned.filter((variant) => /[^\x00-\x7F]/.test(variant));
    if (nonAscii.length) {
      return nonAscii;
    }

    const normalizedSource = normalizeSearchQueryForLookup(sourceText);
    if (!normalizedSource) {
      return cleaned;
    }

    const nonSelf = cleaned.filter((variant) => normalizeSearchQueryForLookup(variant) !== normalizedSource);
    return nonSelf.length ? nonSelf : cleaned;
  };

  const decodeSearchPathQuery = () => {
    const m = location.pathname.match(/^\/search\/(.+)$/i);
    if (!m || !m[1]) {
      return '';
    }
    try {
      return decodeURIComponent(m[1]);
    } catch (_) {
      return m[1];
    }
  };

  const normalizeSearchToken = (token) => {
    return (token || '').toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  };

  const normalizeSearchQueryForLookup = (query) => {
    return (query || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const dedupeSearchVariants = (variants) => {
    const out = [];
    const seen = new Set();
    for (const variant of variants || []) {
      const cleaned = String(variant || '').trim();
      if (!cleaned) {
        continue;
      }

      const key = cleaned.toLowerCase();
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      out.push(cleaned);
    }
    return out;
  };

  const lookupPhraseVariants = (query) => {
    const phraseSearchMap = getStackMap('phrase');
    const normalized = normalizeSearchQueryForLookup(query);
    if (!normalized) {
      return [];
    }

    if (phraseSearchMap[normalized]) {
      return dedupeSearchVariants(phraseSearchMap[normalized]);
    }

    if (normalized.endsWith('s')) {
      const singular = normalized.slice(0, -1);
      if (phraseSearchMap[singular]) {
        return dedupeSearchVariants(phraseSearchMap[singular]);
      }
    }

    return [];
  };

  const lookupBestPhraseInQuery = (query) => {
    const phraseSearchMap = getStackMap('phrase');
    const normalized = normalizeSearchQueryForLookup(query);
    if (!normalized) {
      return null;
    }

    let best = null;
    for (const phraseKey of Object.keys(phraseSearchMap)) {
      const idx = normalized.indexOf(phraseKey);
      if (idx < 0) {
        continue;
      }

      if (!best || idx < best.idx || (idx === best.idx && phraseKey.length > best.key.length)) {
        best = { key: phraseKey, idx, variants: dedupeSearchVariants(phraseSearchMap[phraseKey]) };
      }
    }

    if (!best || !best.variants.length) {
      return null;
    }

    return best;
  };

  const loadVariantRotationState = () => {
    try {
      const raw = localStorage.getItem(SEARCH_VARIANT_ROTATION_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  };

  const saveVariantRotationState = (state) => {
    try {
      localStorage.setItem(SEARCH_VARIANT_ROTATION_STORAGE_KEY, JSON.stringify(state || {}));
    } catch (_) {
      // Ignore storage failures silently.
    }
  };

  const loadLastVariantPickState = () => {
    try {
      const raw = sessionStorage.getItem(SEARCH_VARIANT_LAST_PICK_STORAGE_KEY);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  };

  const saveLastVariantPickState = (state) => {
    try {
      sessionStorage.setItem(SEARCH_VARIANT_LAST_PICK_STORAGE_KEY, JSON.stringify(state || {}));
    } catch (_) {
      // Ignore storage failures silently.
    }
  };

  const pruneLastVariantPickState = (state) => {
    const entries = Object.entries(state || {});
    if (entries.length <= SEARCH_VARIANT_LAST_PICK_MAX_KEYS) {
      return state || {};
    }

    entries.sort((a, b) => {
      const tsA = Number(a[1] && a[1].ts) || 0;
      const tsB = Number(b[1] && b[1].ts) || 0;
      return tsB - tsA;
    });

    return Object.fromEntries(entries.slice(0, SEARCH_VARIANT_LAST_PICK_MAX_KEYS));
  };

  const pickSingleVariant = (lookupKey, variants, dedupeContextKey) => {
    const cleaned = dedupeSearchVariants(variants);
    if (!lookupKey || !cleaned.length) {
      return '';
    }

    const contextKey = String(dedupeContextKey || '');
    const dedupeLookupKey = `${lookupKey}|${contextKey}`;
    const now = Date.now();

    const dedupeState = loadLastVariantPickState();
    const lastPick = dedupeState[dedupeLookupKey];
    const lastTs = Number(lastPick && lastPick.ts);
    const lastIdx = Number(lastPick && lastPick.idx);
    const lastLen = Number(lastPick && lastPick.len);
    const withinWindow = Number.isFinite(lastTs) && now - lastTs <= SEARCH_VARIANT_PICK_DEDUP_WINDOW_MS;
    if (withinWindow && Number.isFinite(lastIdx) && lastIdx >= 0 && lastLen === cleaned.length) {
      return cleaned[lastIdx % cleaned.length] || '';
    }

    const state = loadVariantRotationState();
    const current = Number(state[lookupKey] || 0);
    const safeIndex = Number.isFinite(current) ? current : 0;
    const selectedIndex = ((safeIndex % cleaned.length) + cleaned.length) % cleaned.length;
    const selected = cleaned[selectedIndex];

    state[lookupKey] = safeIndex + 1;
    saveVariantRotationState(state);

    dedupeState[dedupeLookupKey] = {
      ts: now,
      idx: selectedIndex,
      len: cleaned.length
    };
    saveLastVariantPickState(pruneLastVariantPickState(dedupeState));

    return selected;
  };

  const lookupSearchVariants = (token) => {
    const tokenSearchMap = getStackMap('token');
    const normalized = normalizeSearchToken(token);
    if (!normalized) {
      return [];
    }

    if (tokenSearchMap[normalized]) {
      return dedupeSearchVariants(tokenSearchMap[normalized]);
    }

    if (normalized.endsWith('s') && tokenSearchMap[normalized.slice(0, -1)]) {
      return dedupeSearchVariants(tokenSearchMap[normalized.slice(0, -1)]);
    }

    return [];
  };

  const convertEnglishSearchQueryToZh = (rawQuery) => {
    const raw = (rawQuery || '').trim();
    if (!raw) {
      return { changed: false, query: raw, replacements: [] };
    }

    // Skip conversion if there is already CJK text.
    if (/[\u3400-\u9fff]/.test(raw)) {
      return { changed: false, query: raw, replacements: [] };
    }

    if (!/[a-z]/i.test(raw)) {
      return { changed: false, query: raw, replacements: [] };
    }

    const tokens = raw.split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      return { changed: false, query: raw, replacements: [] };
    }

    const phraseMatch = preferLocalizedVariants(raw, lookupPhraseVariants(raw));
    if (phraseMatch.length) {
      const normalizedPhraseKey = normalizeSearchQueryForLookup(raw);
      const selected = pickSingleVariant(`phrase:${normalizedPhraseKey}`, phraseMatch, `raw:${normalizedPhraseKey}`);
      if (selected) {
        return {
          changed: true,
          query: selected,
          replacements: [{ from: raw, to: selected }]
        };
      }
    }

    const embeddedPhraseMatch = lookupBestPhraseInQuery(raw);
    if (embeddedPhraseMatch) {
      const normalizedRaw = normalizeSearchQueryForLookup(raw);
      const selected = pickSingleVariant(
        `phrase:${embeddedPhraseMatch.key}`,
        preferLocalizedVariants(embeddedPhraseMatch.key, embeddedPhraseMatch.variants),
        `embed:${embeddedPhraseMatch.key}|raw:${normalizedRaw}`
      );
      if (selected) {
        return {
          changed: true,
          query: selected,
          replacements: [{ from: embeddedPhraseMatch.key, to: selected }]
        };
      }
    }

    // Single-word searches now resolve to one best/rotated target variant.
    if (tokens.length === 1) {
      const normalizedToken = normalizeSearchToken(tokens[0]);
      const variants = preferLocalizedVariants(tokens[0], lookupSearchVariants(tokens[0]));
      if (variants.length && normalizedToken) {
        const selected = pickSingleVariant(`token:${normalizedToken}`, variants, `single:${normalizedToken}`);
        if (selected) {
          return {
            changed: true,
            query: selected,
            replacements: [{ from: tokens[0], to: selected }]
          };
        }
      }
      return { changed: false, query: raw, replacements: [] };
    }

    // Multi-word searches: choose ONE translated term from the first recognized token.
    for (const token of tokens) {
      const normalizedToken = normalizeSearchToken(token);
      const variants = preferLocalizedVariants(token, lookupSearchVariants(token));
      if (!variants.length || !normalizedToken) {
        continue;
      }

      const normalizedRaw = normalizeSearchQueryForLookup(raw);
      const selected = pickSingleVariant(`token:${normalizedToken}`, variants, `multi:${normalizedToken}|raw:${normalizedRaw}`);
      if (!selected) {
        continue;
      }

      return {
        changed: true,
        query: selected,
        replacements: [{ from: token, to: selected }]
      };
    }

    return { changed: false, query: raw, replacements: [] };
  };

  const buildSearchUrl = (query) => {
    return `/search/${encodeURIComponent((query || '').trim())}`;
  };

  const findNearestSearchInput = (seed) => {
    if (!(seed instanceof Element)) {
      return null;
    }

    const container = seed.closest('form, [role="search"], header, [role="banner"], .pink-header, nav, div');
    if (!container) {
      return null;
    }

    const input = container.querySelector('input[type="search"], input[name*="search" i], input[placeholder*="search" i], input[placeholder*="搜" i], input[type="text"]');
    return input instanceof HTMLInputElement ? input : null;
  };

  const runSearchTranslationAndNavigate = (rawValue, triggerElement) => {
    const converted = convertEnglishSearchQueryToZh(rawValue);
    if (!converted.changed) {
      return false;
    }

    if (triggerElement instanceof HTMLInputElement) {
      triggerElement.value = converted.query;
    }

    location.assign(buildSearchUrl(converted.query));
    return true;
  };

  const maybeRewriteEnglishSearchPath = () => {
    if (!/^\/search\//i.test(location.pathname)) {
      return;
    }

    const rawQuery = decodeSearchPathQuery();
    if (!rawQuery) {
      return;
    }

    const converted = convertEnglishSearchQueryToZh(rawQuery);
    if (!converted.changed) {
      return;
    }

    const target = buildSearchUrl(converted.query);
    if (target !== `${location.pathname}${location.search}`) {
      location.replace(target);
    }
  };

  const wireSearchQueryLocalization = () => {
    maybeRewriteEnglishSearchPath();

    if (document.documentElement.getAttribute(SEARCH_TRANSLATION_BOUND_ATTR) === '1') {
      return;
    }
    document.documentElement.setAttribute(SEARCH_TRANSLATION_BOUND_ATTR, '1');

    document.addEventListener('submit', (ev) => {
      const form = ev.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      const input = form.querySelector('input[type="search"], input[name*="search" i], input[placeholder*="search" i], input[placeholder*="搜" i], input[type="text"]');
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      if (runSearchTranslationAndNavigate(input.value, input)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }, true);

    document.addEventListener('keydown', (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLInputElement) || ev.key !== 'Enter') {
        return;
      }

      const looksLikeSearchInput = /search|搜/i.test(`${target.name || ''} ${target.placeholder || ''} ${target.id || ''}`);
      if (!looksLikeSearchInput) {
        return;
      }

      if (runSearchTranslationAndNavigate(target.value, target)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }, true);

    document.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!(t instanceof Element)) {
        return;
      }

      const btn = t.closest('button, [role="button"], a[role="button"]');
      if (!(btn instanceof HTMLElement)) {
        return;
      }

      const label = `${btn.textContent || ''} ${btn.getAttribute('aria-label') || ''}`.toLowerCase();
      if (!label.includes('search') && !label.includes('\u641c\u7d22')) {
        return;
      }

      const input = findNearestSearchInput(btn);
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      if (runSearchTranslationAndNavigate(input.value, input)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }, true);
  };

  const tryRedirectFromIntermediatePage = async () => {
    if (!isIntermediateDetailPath()) {
      return;
    }

    if (document.documentElement.getAttribute('data-xaavv-redirect-attempted') === '1') {
      return;
    }

    document.documentElement.setAttribute('data-xaavv-redirect-attempted', '1');

    const currentUrl = location.href;
    const slug = getCurrentSlugFromDetailPath();

    const directLink = document.querySelector('a[href*="/xavplay/"]');
    if (directLink instanceof HTMLAnchorElement && directLink.href && directLink.href !== currentUrl) {
      location.replace(directLink.href);
      return;
    }

    const listLink = slug ? document.querySelector(`a[href*="/xavplay/${slug}/"]`) : null;
    if (listLink instanceof HTMLAnchorElement && listLink.href && listLink.href !== currentUrl) {
      location.replace(listLink.href);
      return;
    }

    // Parse in-document HTML quickly before network fallback.
    const inlineHtml = document.documentElement ? document.documentElement.innerHTML : '';
    const inlineExtracted = extractPlayHref(inlineHtml);
    if (inlineExtracted && inlineExtracted !== currentUrl) {
      location.replace(inlineExtracted);
      return;
    }

    try {
      const res = await fetch(location.href, { credentials: 'include' });
      const html = await res.text();
      const extracted = extractPlayHref(html);
      if (extracted && extracted !== currentUrl) {
        location.replace(extracted);
      }
    } catch (_) {
      // Keep current page if fetch/parse fails.
    }
  };

  const setupDirectPlayRouting = () => {
    document.addEventListener('click', async (ev) => {
      const t = ev.target;
      if (!(t instanceof Element)) {
        return;
      }

      const anchor = t.closest('a[href*="/xaavv/"]');
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) {
        return;
      }

      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
        return;
      }

      ev.preventDefault();

      try {
        const res = await fetch(anchor.href, { credentials: 'include' });
        const html = await res.text();
        const playHref = extractPlayHref(html);
        if (playHref) {
          location.assign(playHref);
          return;
        }
      } catch (_) {
        // Fall back to original click target.
      }

      location.assign(anchor.href);
    }, true);
  };

  const tryPlaybackAutomationVideo = (videoEl) => {
    if (!(videoEl instanceof HTMLVideoElement)) {
      return;
    }
    if (videoEl.getAttribute(PLAYBACK_AUTOMATION_ATTR) === '1') {
      return;
    }

    videoEl.setAttribute(PLAYBACK_AUTOMATION_ATTR, '1');

    const previousMuted = videoEl.muted;
    const previousVolume = videoEl.volume;
    let attempts = 0;
    let restoreTimer = null;

    const runPlay = async () => {
      try {
        attempts += 1;
        videoEl.autoplay = true;
        videoEl.setAttribute('autoplay', 'autoplay');
        videoEl.setAttribute('playsinline', 'playsinline');
        videoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
        videoEl.muted = true;
        await videoEl.play();

        if (restoreTimer) {
          clearTimeout(restoreTimer);
        }

        restoreTimer = setTimeout(() => {
          videoEl.muted = previousMuted;
          if (!Number.isNaN(previousVolume)) {
            videoEl.volume = previousVolume;
          }
        }, 1200);
      } catch (_) {
        // Browser gesture restrictions may block automated playback start.
      }

      if ((videoEl.paused || videoEl.readyState < 2) && attempts < 12) {
        setTimeout(runPlay, 250);
      }
    };

    videoEl.addEventListener('loadedmetadata', runPlay, { once: true });
    videoEl.addEventListener('loadeddata', runPlay, { once: true });
    videoEl.addEventListener('canplay', runPlay, { once: true });
    videoEl.addEventListener('canplaythrough', runPlay, { once: true });
    setTimeout(runPlay, 250);
    setTimeout(runPlay, 1000);
    setTimeout(runPlay, 2500);
  };

  const setupPlaybackAutomationAssist = () => {
    if (!isPlayPath()) {
      return;
    }

    if (document.documentElement.getAttribute(PLAYBACK_ASSIST_BOUND_ATTR) === '1') {
      return;
    }
    document.documentElement.setAttribute(PLAYBACK_ASSIST_BOUND_ATTR, '1');

    const wireExisting = () => {
      const videos = document.querySelectorAll('video');
      for (const v of videos) {
        tryPlaybackAutomationVideo(v);
      }
    };

    wireExisting();

    const mo = new MutationObserver(() => wireExisting());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  };

  const removeHomepageTagline = () => {
    if (location.pathname !== '/') {
      return;
    }

    const shouldHide = (value) => {
      const text = (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!text) {
        return false;
      }

      return text.includes('高清线路')
        || text.includes('极速播放')
        || text.includes('high-definition streaming')
        || text.includes('ultra-fast playback');
    };

    const nodes = document.querySelectorAll('p, span, div');
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      if (!shouldHide(node.textContent || '')) {
        continue;
      }

      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.setAttribute('aria-hidden', 'true');
    }
  };

  const runMaintenancePass = () => {
    wireSearchQueryLocalization();
    runNuclearPass();
    killTopLeftSwirl();
    removeHomepageTagline();
    wireCenterPlayOverlayState();
    syncVideoProgressBars();
    syncCenterPlayOverlay();
    syncVideoDownloadButton();
    enforceTopRightControlTransparency();
    enforceTopLeftBrandAndSearchTransparency();
    enforcePlayVideoFirstLayout();
  };

  const startNavigationReliabilityWatchdog = () => {
    if (document.documentElement.getAttribute(NAV_WATCH_STARTED_ATTR) === '1') {
      return;
    }
    document.documentElement.setAttribute(NAV_WATCH_STARTED_ATTR, '1');

    let lastHref = location.href;

    const onUrlChange = () => {
      const currentHref = location.href;
      if (currentHref === lastHref) {
        return;
      }
      lastHref = currentHref;

      // URL may update before full DOM paint; run a short burst to stabilize features.
      runMaintenancePass();
      schedule(runMaintenancePass, [120, 420, 1000]);
      schedule(tryRedirectFromIntermediatePage, [120, 420, 1000]);
    };

    const rawPushState = history.pushState;
    const rawReplaceState = history.replaceState;

    history.pushState = function patchedPushState() {
      const out = rawPushState.apply(this, arguments);
      onUrlChange();
      return out;
    };

    history.replaceState = function patchedReplaceState() {
      const out = rawReplaceState.apply(this, arguments);
      onUrlChange();
      return out;
    };

    window.addEventListener('popstate', onUrlChange, { passive: true });
    window.addEventListener('hashchange', onUrlChange, { passive: true });
    setInterval(onUrlChange, 300);
  };

  const getPlaybackVideoRect = (videos) => {
    const rects = [];

    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement)) {
        continue;
      }

      const style = getComputedStyle(video);
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue;
      }

      const rect = video.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) {
        continue;
      }

      rects.push(rect);
    }

    if (!rects.length) {
      return null;
    }

    let left = rects[0].left;
    let top = rects[0].top;
    let right = rects[0].right;
    let bottom = rects[0].bottom;

    for (let i = 1; i < rects.length; i += 1) {
      const rect = rects[i];
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
      bottom = Math.max(bottom, rect.bottom);
    }

    return {
      left,
      top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  };

  const getVideoDownloadSource = (video) => {
    if (!(video instanceof HTMLVideoElement)) {
      return '';
    }

    if (video.currentSrc) {
      return video.currentSrc;
    }
    if (video.src) {
      return video.src;
    }

    const source = video.querySelector('source[src]');
    if (source instanceof HTMLSourceElement && source.src) {
      return source.src;
    }

    return '';
  };

  const buildDownloadFilename = (url) => {
    const slugMatch = location.pathname.match(/\/xavplay\/([a-zA-Z0-9_-]+)\//i);
    const slug = slugMatch ? slugMatch[1] : 'video';

    let ext = 'mp4';
    try {
      const parsed = new URL(url, location.href);
      const extMatch = parsed.pathname.match(/\.([a-zA-Z0-9]{2,5})(?:$|\?)/);
      if (extMatch && extMatch[1]) {
        ext = extMatch[1].toLowerCase();
      }
    } catch (_) {
      // Keep default extension when URL parsing fails.
    }

    return `xaavv-${slug}-${Date.now()}.${ext}`;
  };

  const ensureVideoDownloadButton = () => {
    let btn = document.getElementById(VIDEO_DOWNLOAD_BUTTON_ID);
    if (!(btn instanceof HTMLButtonElement)) {
      if (btn instanceof HTMLElement) {
        btn.remove();
      }

      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = VIDEO_DOWNLOAD_BUTTON_ID;
      btn.textContent = 'Download';
      btn.setAttribute('aria-label', 'Download active video');
      (document.body || document.documentElement).appendChild(btn);
    }

    if (btn.getAttribute(VIDEO_DOWNLOAD_BOUND_ATTR) !== '1') {
      btn.setAttribute(VIDEO_DOWNLOAD_BOUND_ATTR, '1');
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const source = btn.dataset.downloadUrl || '';
        if (!source) {
          return;
        }

        const anchor = document.createElement('a');
        anchor.href = source;
        anchor.rel = 'noopener';
        anchor.target = '_blank';
        anchor.download = btn.dataset.downloadName || buildDownloadFilename(source);
        (document.body || document.documentElement).appendChild(anchor);
        anchor.click();
        anchor.remove();
      }, true);
    }

    return btn;
  };

  const pickBestDownloadVideo = (videos) => {
    let best = null;
    let bestScore = -1;

    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement)) {
        continue;
      }

      const source = getVideoDownloadSource(video);
      if (!source) {
        continue;
      }

      const style = getComputedStyle(video);
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue;
      }

      const rect = video.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) {
        continue;
      }

      const area = rect.width * rect.height;
      const playingBonus = (!video.paused && !video.ended) ? 1000000000 : 0;
      const score = area + playingBonus;

      if (score > bestScore) {
        best = video;
        bestScore = score;
      }
    }

    return best;
  };

  const findSearchButton = () => {
    const candidates = Array.from(document.querySelectorAll('button, a[role="button"], [role="button"]'));
    let best = null;
    let bestScore = -1;

    for (const node of candidates) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      const label = `${node.textContent || ''} ${node.getAttribute('aria-label') || ''}`.toLowerCase();
      if (!label.includes('search') && !label.includes('\u641C\u7D22')) {
        continue;
      }

      const rect = node.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) {
        continue;
      }

      const inTopBand = rect.top >= 0 && rect.top <= 200;
      if (!inTopBand) {
        continue;
      }

      // Favor top-right search controls.
      const score = rect.right + (200 - rect.top);
      if (score > bestScore) {
        best = node;
        bestScore = score;
      }
    }

    return best;
  };

  const findSearchLabel = () => {
    const candidates = Array.from(document.querySelectorAll('a, button, span, div'));
    let best = null;
    let bestScore = -1;

    for (const node of candidates) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      const label = (node.textContent || '').trim().toLowerCase();
      if (label !== 'search' && !label.includes('\u641C\u7D22')) {
        continue;
      }

      const rect = node.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) {
        continue;
      }

      const inTopBand = rect.top >= 0 && rect.top <= 220;
      if (!inTopBand) {
        continue;
      }

      const score = rect.right + (220 - rect.top);
      if (score > bestScore) {
        best = node;
        bestScore = score;
      }
    }

    return best;
  };

  const syncVideoDownloadButton = () => {
    const btn = ensureVideoDownloadButton();
    if (!(btn instanceof HTMLButtonElement)) {
      return;
    }

    if (!isPlayPath()) {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('pointer-events', 'none', 'important');
      return;
    }

    const videos = Array.from(document.querySelectorAll('video')).filter((video) => video instanceof HTMLVideoElement);
    const bestVideo = pickBestDownloadVideo(videos);
    if (!(bestVideo instanceof HTMLVideoElement)) {
      btn.style.setProperty('display', 'none', 'important');
      btn.style.setProperty('pointer-events', 'none', 'important');
      return;
    }

    const source = getVideoDownloadSource(bestVideo);

    const rect = getPlaybackVideoRect(videos) || bestVideo.getBoundingClientRect();
    const searchButton = findSearchLabel() || findSearchButton();
    const buttonWidth = 108;
    const buttonHeight = 34;
    let top = 106;
    let left = Math.max(12, window.innerWidth - buttonWidth - 16);

    if (searchButton instanceof HTMLElement) {
      const searchRect = searchButton.getBoundingClientRect();
      // Position download directly under search and align the trailing label edge.
      const downloadLabelTrailingInsetPx = 11;
      top = Math.round(searchRect.bottom + 16);
      left = Math.round(searchRect.right - buttonWidth + downloadLabelTrailingInsetPx);
    }

    // Clamp to ensure button doesn't overlap video or go off-screen
    const maxTopBeforeVideo = Math.max(100, Math.round(rect.top - 15));
    top = Math.min(top, maxTopBeforeVideo);
    top = Math.max(60, Math.min(window.innerHeight - 50, top));
    left = Math.max(8, Math.min(window.innerWidth - buttonWidth - 8, left));

    if (source) {
      btn.dataset.downloadUrl = source;
      btn.dataset.downloadName = buildDownloadFilename(source);
      btn.textContent = 'Download';
      btn.setAttribute('aria-label', 'Download active video');
      btn.style.setProperty('pointer-events', 'auto', 'important');
      btn.style.setProperty('opacity', '0.98', 'important');
    } else {
      btn.dataset.downloadUrl = '';
      btn.dataset.downloadName = '';
      btn.textContent = 'Loading...';
      btn.setAttribute('aria-label', 'Download source loading');
      btn.style.setProperty('pointer-events', 'none', 'important');
      btn.style.setProperty('opacity', '0.72', 'important');
    }

    btn.style.setProperty('top', `${top}px`, 'important');
    btn.style.setProperty('left', `${left}px`, 'important');
    btn.style.setProperty('background', 'transparent', 'important');
    btn.style.setProperty('background-color', 'transparent', 'important');
    btn.style.setProperty('background-image', 'none', 'important');
    btn.style.setProperty('border-color', '#c3b7ff', 'important');
    btn.style.setProperty('color', '#eceffd', 'important');
    btn.style.setProperty('-webkit-text-fill-color', '#eceffd', 'important');
    btn.style.setProperty('box-shadow', 'none', 'important');
    btn.style.setProperty('display', 'block', 'important');
  };

  const ensureVideoProgressBar = (video) => {
    if (!(video instanceof HTMLVideoElement)) {
      return null;
    }
    if (video.getAttribute(VIDEO_PROGRESS_BOUND_ATTR) === '1') {
      const existing = video.parentNode?.querySelector(`.${VIDEO_PROGRESS_WRAPPER_CLASS}`);
      return existing instanceof HTMLElement ? existing : null;
    }

    video.setAttribute(VIDEO_PROGRESS_BOUND_ATTR, '1');

    const wrapper = document.createElement('div');
    wrapper.className = VIDEO_PROGRESS_WRAPPER_CLASS;

    const bar = document.createElement('div');
    bar.className = VIDEO_PROGRESS_BAR_CLASS;

    const buffer = document.createElement('div');
    buffer.className = VIDEO_PROGRESS_BUFFER_CLASS;

    const fill = document.createElement('div');
    fill.className = VIDEO_PROGRESS_FILL_CLASS;

    const handle = document.createElement('div');
    handle.className = VIDEO_PROGRESS_HANDLE_CLASS;

    bar.appendChild(buffer);
    bar.appendChild(fill);
    bar.appendChild(handle);
    wrapper.appendChild(bar);

    const videoRect = video.getBoundingClientRect();
    const isVerticalVideo = isVerticalVideoRect(videoRect);
    const wrapperBottom = isVerticalVideo ? 16 : 2;
    const wrapperHeight = isVerticalVideo ? 20 : 16;

    // Position wrapper as overlay on video (use CSS for bottom positioning)
    wrapper.style.setProperty('position', 'absolute', 'important');
    wrapper.style.setProperty('bottom', `${wrapperBottom}px`, 'important');
    wrapper.style.setProperty('left', '0', 'important');
    wrapper.style.setProperty('right', '0', 'important');
    wrapper.style.setProperty('height', `${wrapperHeight}px`, 'important');
    wrapper.style.setProperty('z-index', '18', 'important');
    wrapper.style.setProperty('touch-action', 'manipulation', 'important');

    const getActiveSeekTargets = () => {
      const videos = Array.from(document.querySelectorAll('video')).filter((v) => v instanceof HTMLVideoElement);
      let primary = null;
      let primaryScore = -1;

      for (const candidate of videos) {
        const style = getComputedStyle(candidate);
        if (style.display === 'none' || style.visibility === 'hidden') {
          continue;
        }

        const rect = candidate.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) {
          continue;
        }

        if (!Number.isFinite(candidate.duration) || candidate.duration <= 0) {
          continue;
        }

        const hasSource = !!(candidate.currentSrc || candidate.src);
        const area = rect.width * rect.height;
        const playingBonus = (!candidate.paused && !candidate.ended) ? 1000000000 : 0;
        const sourceBonus = hasSource ? 1000000 : 0;
        const score = area + playingBonus + sourceBonus;

        if (score > primaryScore) {
          primary = candidate;
          primaryScore = score;
        }
      }

      if (!(primary instanceof HTMLVideoElement)) {
        return [video];
      }

      const synced = videos.filter((v) => Number.isFinite(v.duration)
        && v.duration > 0
        && Math.abs(v.duration - primary.duration) < 2);

      return synced.length ? synced : [primary];
    };

    const seekFromEvent = (ev) => {
      const rect = wrapper.getBoundingClientRect();
      const clickX = ev.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const targets = getActiveSeekTargets();

      for (const target of targets) {
        if (!(target instanceof HTMLVideoElement) || !Number.isFinite(target.duration) || target.duration <= 0) {
          continue;
        }
        target.currentTime = percent * target.duration;
      }
    };

    // Wire seek on click
    wrapper.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      seekFromEvent(ev);
    }, true);

    wrapper.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      seekFromEvent(ev);
    }, true);

    // Update on video timeupdate
    const updateProgress = () => {
      const targets = getActiveSeekTargets();
      const active = targets.find((v) => !v.paused && !v.ended) || targets[0] || video;
      if (!(active instanceof HTMLVideoElement)) {
        return;
      }

      const duration = active.duration || 0;
      const current = active.currentTime || 0;
      const percent = duration > 0 ? (current / duration) * 100 : 0;

      fill.style.setProperty('width', `${percent}%`, 'important');
      handle.style.setProperty('left', `${percent}%`, 'important');

      if (active.buffered && active.buffered.length > 0 && duration > 0) {
        const bufferedEnd = active.buffered.end(active.buffered.length - 1);
        const bufferedPct = Math.max(0, Math.min(100, (bufferedEnd / duration) * 100));
        buffer.style.setProperty('width', `${bufferedPct}%`, 'important');
      }
    };

    video.addEventListener('timeupdate', updateProgress, { passive: true });
    video.addEventListener('loadedmetadata', updateProgress, { passive: true });
    video.addEventListener('play', updateProgress, { passive: true });
    video.addEventListener('pause', updateProgress, { passive: true });

    let hideTimer = null;
    const showProgress = () => {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      wrapper.classList.add('visible');
    };

    const hideProgress = () => {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }

      hideTimer = window.setTimeout(() => {
        wrapper.classList.remove('visible');
      }, 120);
    };

    // Show progress bar on pointer movement or hover over either the video or the seek bar.
    video.addEventListener('pointerenter', showProgress, { passive: true });
    video.addEventListener('pointermove', showProgress, { passive: true });
    video.addEventListener('mouseover', showProgress, { passive: true });

    video.addEventListener('pointerleave', hideProgress, { passive: true });
    video.addEventListener('mouseout', hideProgress, { passive: true });

    // Also listen on the wrapper itself for hover.
    wrapper.addEventListener('pointerenter', showProgress, { passive: true });
    wrapper.addEventListener('pointermove', showProgress, { passive: true });
    wrapper.addEventListener('mouseover', showProgress, { passive: true });

    wrapper.addEventListener('pointerleave', hideProgress, { passive: true });
    wrapper.addEventListener('mouseout', hideProgress, { passive: true });

    // Inject into DOM hierarchy - append to video element's parent for proper positioning
    wrapper.style.setProperty('width', '100%', 'important');
    wrapper.style.setProperty('background', 'transparent', 'important');

    if (video.parentNode instanceof HTMLElement) {
      // Ensure parent is relatively positioned for absolute child
      const parentStyle = getComputedStyle(video.parentNode);
      if (parentStyle.position === 'static' || !parentStyle.position) {
        video.parentNode.style.setProperty('position', 'relative', 'important');
      }
      video.parentNode.appendChild(wrapper);
    } else {
      // Fallback: append to video itself
      video.parentNode ? video.parentNode.appendChild(wrapper) : null;
    }

    return wrapper;
  };

  const syncVideoProgressBars = () => {
    if (!isPlayPath()) {
      return;
    }

    const videos = Array.from(document.querySelectorAll('video')).filter((v) => v instanceof HTMLVideoElement);
    for (const video of videos) {
      ensureVideoProgressBar(video);
    }
  };

  const ensureInvisiblePauseOverlay = () => {
    if (!document.body) {
      return null;
    }

    let overlay = document.getElementById(INVISIBLE_PAUSE_OVERLAY_ID);
    if (!(overlay instanceof HTMLButtonElement)) {
      if (overlay instanceof HTMLElement) {
        overlay.remove();
      }

      overlay = document.createElement('button');
      overlay.type = 'button';
      overlay.id = INVISIBLE_PAUSE_OVERLAY_ID;
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('tabindex', '-1');
      overlay.setAttribute('title', '');
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('position', 'fixed', 'important');
      overlay.style.setProperty('background', 'transparent', 'important');
      overlay.style.setProperty('border', '0', 'important');
      overlay.style.setProperty('outline', '0', 'important');
      overlay.style.setProperty('box-shadow', 'none', 'important');
      overlay.style.setProperty('margin', '0', 'important');
      overlay.style.setProperty('padding', '0', 'important');
      overlay.style.setProperty('opacity', '0', 'important');
      overlay.style.setProperty('visibility', 'hidden', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
      overlay.style.setProperty('z-index', '145', 'important');
      overlay.style.setProperty('appearance', 'none', 'important');
      overlay.style.setProperty('-webkit-appearance', 'none', 'important');
      overlay.style.setProperty('color', 'transparent', 'important');
      overlay.style.setProperty('cursor', 'pointer', 'important');
      overlay.style.setProperty('touch-action', 'manipulation', 'important');

      overlay.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const videos = Array.from(document.querySelectorAll('video')).filter((video) => video instanceof HTMLVideoElement);
        for (const video of videos) {
          if (!video.paused && !video.ended) {
            video.pause();
          }
        }

        setTimeout(syncCenterPlayOverlay, 30);
        setTimeout(syncCenterPlayOverlay, 140);
        setTimeout(syncCenterPlayOverlay, 360);
      }, true);

      overlay.setAttribute(INVISIBLE_PAUSE_OVERLAY_BOUND_ATTR, '1');
      document.body.appendChild(overlay);
    }

    return overlay;
  };

  const syncInvisiblePauseOverlay = (videos, isPlaying) => {
    const overlay = ensureInvisiblePauseOverlay();
    if (!(overlay instanceof HTMLElement)) {
      return;
    }

    if (!isPlaying) {
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('visibility', 'hidden', 'important');
      overlay.style.setProperty('opacity', '0', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
      return;
    }

    const rect = getPlaybackVideoRect(videos);
    if (!rect) {
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('visibility', 'hidden', 'important');
      overlay.style.setProperty('opacity', '0', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
      return;
    }

    const effectiveHeight = Math.max(0, Math.round(rect.height) - PROGRESS_SEEK_HIT_STRIP_PX);

    overlay.style.setProperty('display', 'block', 'important');
    overlay.style.setProperty('visibility', 'visible', 'important');
    overlay.style.setProperty('opacity', '0', 'important');
    overlay.style.setProperty('pointer-events', effectiveHeight > 0 ? 'auto' : 'none', 'important');
    overlay.style.setProperty('left', `${Math.round(rect.left)}px`, 'important');
    overlay.style.setProperty('top', `${Math.round(rect.top)}px`, 'important');
    overlay.style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
    overlay.style.setProperty('height', `${effectiveHeight}px`, 'important');
  };

  const syncCenterPlayOverlay = () => {
    if (!isPlayPath()) {
      return;
    }

    // XAAVV can render dual video layers; derive state from all video nodes.
    const videos = Array.from(document.querySelectorAll('video')).filter((v) => v instanceof HTMLVideoElement);
    const playBtn = document.getElementById('sp_play_btn');
    const btnText = playBtn ? (playBtn.textContent || '').trim() : '';
    const btnLabel = playBtn ? ((playBtn.getAttribute('aria-label') || '').toLowerCase()) : '';

    const hasVideo = videos.length > 0;
    const isPlayingByVideo = videos.some((v) => !v.paused && !v.ended);
    const isPausedByVideo = hasVideo && videos.every((v) => v.paused || v.ended);
    const isPlayingByIcon = btnText.includes('||') || btnLabel.includes('pause');
    const isPausedByIcon = btnText.includes('▶') || btnText.includes('▷') || btnLabel.includes('play');

    const isPlaying = isPlayingByVideo || (!isPausedByVideo && isPlayingByIcon);
    const isPaused = isPausedByVideo || (!isPlayingByVideo && isPausedByIcon);

    const centerEls = document.querySelectorAll('#sp_play_hotspot, #sp_play_btn, #sp_play_overlay');
    for (const node of centerEls) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      if (isPlaying) {
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('opacity', '0', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
      } else if (isPaused) {
        // Paused state: center controls should be visible and clickable.
        if (node.id === 'sp_play_btn' || node.id === 'sp_play_overlay' || node.id === 'sp_play_hotspot') {
          node.style.setProperty('display', node.id === 'sp_play_btn' ? 'flex' : 'block', 'important');
          node.style.setProperty('visibility', 'visible', 'important');
          node.style.setProperty('opacity', '1', 'important');
          node.style.setProperty('pointer-events', node.id === 'sp_play_btn' || node.id === 'sp_play_overlay' ? 'auto' : 'none', 'important');
        }
      }
    }

    const playBtnNode = document.getElementById('sp_play_btn');
    if (playBtnNode instanceof HTMLElement) {
      setPlayButtonIcon(playBtnNode, isPlaying);
      playBtnNode.style.setProperty('display', isPlaying ? 'none' : 'flex', 'important');
      playBtnNode.style.setProperty('visibility', isPlaying ? 'hidden' : 'visible', 'important');
      playBtnNode.style.setProperty('opacity', isPlaying ? '0' : '1', 'important');
      playBtnNode.style.setProperty('pointer-events', isPlaying ? 'none' : 'auto', 'important');
    }

    const seekOverlayEls = document.querySelectorAll('#sp_seek_gesture, #sp_seek_ui');
    for (const node of seekOverlayEls) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }

      if (isPlaying) {
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('opacity', '0', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
      } else if (isPaused) {
        node.style.removeProperty('display');
        node.style.removeProperty('visibility');
        node.style.removeProperty('opacity');
        node.style.removeProperty('pointer-events');
      }
    }

    syncInvisiblePauseOverlay(videos, isPlaying);
  };

  const startOverlayWatchdog = () => {
    if (!isPlayPath()) {
      return;
    }
    if (document.documentElement.getAttribute(OVERLAY_WATCH_STARTED_ATTR) === '1') {
      return;
    }

    document.documentElement.setAttribute(OVERLAY_WATCH_STARTED_ATTR, '1');
    setInterval(() => {
      syncCenterPlayOverlay();
      syncVideoDownloadButton();
      syncVideoProgressBars();
      enforceTopRightControlTransparency();
      enforceTopLeftBrandAndSearchTransparency();
      enforcePlayVideoFirstLayout();
    }, 220);
  };

  const wirePlayPauseBehavior = () => {
    if (!isPlayPath()) {
      return;
    }

    const videos = document.querySelectorAll('video');
    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement) || video.getAttribute(PLAY_CLICK_BOUND_ATTR) === '1') {
        continue;
      }

      video.setAttribute(PLAY_CLICK_BOUND_ATTR, '1');
      video.addEventListener('click', () => {
        setTimeout(syncCenterPlayOverlay, 30);
        setTimeout(syncCenterPlayOverlay, 140);
        setTimeout(syncCenterPlayOverlay, 360);
      }, true);
    }

    ensureInvisiblePauseOverlay();

    const playBtn = document.getElementById('sp_play_btn');
    if (playBtn instanceof HTMLElement && playBtn.getAttribute(PLAY_CLICK_BOUND_ATTR) !== '1') {
      playBtn.setAttribute(PLAY_CLICK_BOUND_ATTR, '1');
      playBtn.addEventListener('click', () => {
        setTimeout(syncCenterPlayOverlay, 30);
        setTimeout(syncCenterPlayOverlay, 140);
        setTimeout(syncCenterPlayOverlay, 360);
      }, true);
    }

    const playOverlay = document.getElementById('sp_play_overlay');
    if (playOverlay instanceof HTMLElement && playOverlay.getAttribute(PLAY_CLICK_BOUND_ATTR) !== '1') {
      playOverlay.setAttribute(PLAY_CLICK_BOUND_ATTR, '1');
      playOverlay.addEventListener('click', () => {
        setTimeout(syncCenterPlayOverlay, 30);
        setTimeout(syncCenterPlayOverlay, 140);
        setTimeout(syncCenterPlayOverlay, 360);
      }, true);
    }
  };

  const wireCenterPlayOverlayState = () => {
    if (!isPlayPath()) {
      return;
    }

    const videos = document.querySelectorAll('video');
    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement) || video.getAttribute(PLAY_UI_TUNED_ATTR) === '1') {
        continue;
      }

      video.setAttribute(PLAY_UI_TUNED_ATTR, '1');
      video.addEventListener('play', syncCenterPlayOverlay);
      video.addEventListener('playing', syncCenterPlayOverlay);
      video.addEventListener('pause', syncCenterPlayOverlay);
      video.addEventListener('ended', syncCenterPlayOverlay);
      video.addEventListener('waiting', syncCenterPlayOverlay);
    }

    wirePlayPauseBehavior();
    syncCenterPlayOverlay();
    syncVideoDownloadButton();
    syncVideoProgressBars();
  };

  const killTopLeftSwirl = () => {
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      if (!(el instanceof HTMLElement)) {
        continue;
      }

      const r = el.getBoundingClientRect();
      if (r.left > 80 || r.top > 80 || r.width > 90 || r.height > 90) {
        continue;
      }

      const cs = getComputedStyle(el);
      const cls = (el.className || '').toString().toLowerCase();
      const hasSpinClass = cls.includes('spin') || cls.includes('loader') || cls.includes('loading') || cls.includes('spinner');
      const hasSpinAnim = (cs.animation || '').toLowerCase().includes('spin');
      const blueBorder = (cs.borderColor || '').includes('59, 130, 246') || (cs.borderTopColor || '').includes('59, 130, 246');
      const ringLike = cs.borderRadius.includes('9999') || cs.borderRadius.includes('50%');
      const nearTopLeft = r.left >= -4 && r.top >= -4;

      if (nearTopLeft && (hasSpinClass || hasSpinAnim || (blueBorder && ringLike))) {
        el.style.setProperty('display', 'none', 'important');
      }

      // Also remove small top-left SVG/circle ring loaders with rotate-like animation.
      if (nearTopLeft && r.width <= 90 && r.height <= 90 && (el.tagName === 'SVG' || el.querySelector('svg,circle,path'))) {
        const stroke = (cs.stroke || '') + ' ' + (cs.borderColor || '') + ' ' + (cs.color || '');
        const animated = hasSpinAnim || (cs.transform !== 'none') || (cs.animationDuration !== '0s');
        const looksBlue = /59,\s*130,\s*246|96,\s*165,\s*250|blue/i.test(stroke);
        if (animated || looksBlue) {
          const host = el.closest('[style*="position: fixed"], [style*="position:fixed"], .fixed, .absolute') || el;
          if (host instanceof HTMLElement) {
            host.style.setProperty('display', 'none', 'important');
          }
        }
      }
    }
  };

  const luminance = (c) => {
    return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
  };

  const hardenKnownBars = () => {
    const onPlayPage = isPlayPath();
    const topBars = document.querySelectorAll('.pink-header, [role="banner"], header');
    for (const bar of topBars) {
      if (!(bar instanceof HTMLElement)) {
        continue;
      }

      if (onPlayPage) {
        bar.style.setProperty('background', 'transparent', 'important');
        bar.style.setProperty('background-color', 'transparent', 'important');
        bar.style.setProperty('background-image', 'none', 'important');
        bar.style.setProperty('border-color', 'transparent', 'important');
        bar.style.setProperty('box-shadow', 'none', 'important');
      } else {
        bar.style.setProperty('background-color', 'var(--xaavv-bg)', 'important');
      }
      bar.style.setProperty('color', 'var(--xaavv-text)', 'important');
      bar.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text)', 'important');

      const brandText = bar.querySelectorAll('a[href="/"] span, .text-pink-900, .text-pink-800, .text-white');
      for (const node of brandText) {
        if (node instanceof HTMLElement) {
          node.style.setProperty('color', 'var(--xaavv-text)', 'important');
          node.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text)', 'important');
        }
      }

      if (onPlayPage) {
        const controls = bar.querySelectorAll('a, button, [role="button"]');
        for (const control of controls) {
          if (!(control instanceof HTMLElement)) {
            continue;
          }

          const rect = control.getBoundingClientRect();
          const nearTopRight = rect.top >= -2 && rect.top <= 180 && rect.left >= window.innerWidth * 0.45;
          if (!nearTopRight) {
            continue;
          }

          control.style.setProperty('background', 'transparent', 'important');
          control.style.setProperty('background-color', 'transparent', 'important');
          control.style.setProperty('background-image', 'none', 'important');
          control.style.setProperty('border-color', 'transparent', 'important');
          control.style.setProperty('box-shadow', 'none', 'important');
          control.style.setProperty('backdrop-filter', 'none', 'important');
        }
      }
    }

    const footerBars = document.querySelectorAll('footer, contentinfo, [role="contentinfo"]');
    for (const bar of footerBars) {
      if (!(bar instanceof HTMLElement)) {
        continue;
      }
      if ((bar.textContent || '').includes('SiteMap') || (bar.textContent || '').includes('\u672C\u7AD9\u5185\u5BB9\u6765\u81EA\u4E92\u8054\u7F51')) {
        bar.style.setProperty('background-color', 'var(--xaavv-bg)', 'important');
        bar.style.setProperty('color', 'var(--xaavv-text-muted)', 'important');
        bar.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text-muted)', 'important');
        bar.style.setProperty('border-color', 'var(--xaavv-border)', 'important');
      }
    }
  };

  const enforceTopRightControlTransparency = () => {
    if (!isPlayPath()) {
      return;
    }

    const headerRoots = document.querySelectorAll('.pink-header, [role="banner"], header');
    for (const root of headerRoots) {
      if (!(root instanceof HTMLElement)) {
        continue;
      }

      const candidates = root.querySelectorAll('a, button, [role="button"], div, nav, ul');
      for (const node of candidates) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        const rect = node.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) {
          continue;
        }

        const nearTopRight = rect.top >= -2 && rect.top <= 190 && rect.left >= window.innerWidth * 0.42;
        const isChipLike = rect.width <= 420 && rect.height <= 140;
        const hasControls = node.matches('a, button, [role="button"]') || !!node.querySelector('a, button, [role="button"]');

        if (!nearTopRight || !isChipLike || !hasControls) {
          continue;
        }

        node.style.setProperty('background', 'transparent', 'important');
        node.style.setProperty('background-color', 'transparent', 'important');
        node.style.setProperty('background-image', 'none', 'important');
        node.style.setProperty('border-color', 'transparent', 'important');
        node.style.setProperty('box-shadow', 'none', 'important');
        node.style.setProperty('backdrop-filter', 'none', 'important');
      }
    }
  };

  const enforceTopLeftBrandAndSearchTransparency = () => {
    if (!isPlayPath()) {
      return;
    }

    const headerRoots = document.querySelectorAll('.pink-header, [role="banner"], header');
    for (const root of headerRoots) {
      if (!(root instanceof HTMLElement)) {
        continue;
      }

      const candidates = root.querySelectorAll('a, button, span, div, p, strong, [role="button"]');
      for (const node of candidates) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        const rect = node.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) {
          continue;
        }

        const label = (node.textContent || '').trim().toLowerCase();
        const mentionsBrand = label.includes('av welfare website') || label.includes('\u798f\u5229\u7f51');
        const isSearchLabel = label === 'search' || label.includes('\u641c\u7d22');
        const nearTop = rect.top >= -2 && rect.top <= 210;
        const nearLeft = rect.left <= window.innerWidth * 0.58;

        const brandMatch = mentionsBrand && nearLeft;
        const searchMatch = isSearchLabel;

        if (!nearTop || (!brandMatch && !searchMatch)) {
          continue;
        }

        const nodesToClear = [
          node,
          node.parentElement,
          node.closest('a, button, [role="button"], [class*="chip"], [class*="tag"], [class*="btn"], [class*="search"], [class*="brand"]')
        ];

        for (const target of nodesToClear) {
          if (!(target instanceof HTMLElement)) {
            continue;
          }
          target.style.setProperty('background', 'transparent', 'important');
          target.style.setProperty('background-color', 'transparent', 'important');
          target.style.setProperty('background-image', 'none', 'important');
          target.style.setProperty('border-color', 'transparent', 'important');
          target.style.setProperty('box-shadow', 'none', 'important');
          target.style.setProperty('backdrop-filter', 'none', 'important');
        }
      }
    }
  };

  const enforcePlayVideoFirstLayout = () => {
    if (!isPlayPath()) {
      return;
    }

    const labelNodes = Array.from(document.querySelectorAll('h2, h3, div, p, span'));
    const selectionLabel = labelNodes.find((node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }
      const text = (node.textContent || '').trim().toLowerCase();
      return text === '\u9009\u96c6' || text === 'selections';
    });

    if (!(selectionLabel instanceof HTMLElement)) {
      return;
    }

    let selectionCard = null;
    let layoutContainer = null;
    let cursor = selectionLabel.parentElement;
    while (cursor instanceof HTMLElement && cursor !== document.body) {
      const parent = cursor.parentElement;
      if (!(parent instanceof HTMLElement)) {
        break;
      }

      const siblings = Array.from(parent.children).filter((node) => node instanceof HTMLElement && node !== cursor);
      const hasVideoSibling = siblings.some((panel) => {
        if (!(panel instanceof HTMLElement)) {
          return false;
        }
        if (panel.querySelector('video, #player, .video-js')) {
          return true;
        }
        const panelText = (panel.textContent || '').toLowerCase();
        return panelText.includes('\u5168\u5c4f') || panelText.includes('full screen');
      });

      if (hasVideoSibling) {
        selectionCard = cursor;
        layoutContainer = parent;
        break;
      }

      cursor = parent;
    }

    if (!(selectionCard instanceof HTMLElement) || !(layoutContainer instanceof HTMLElement)) {
      return;
    }

    const childPanels = Array.from(layoutContainer.children).filter((node) => node instanceof HTMLElement);
    const videoPanel = childPanels.find((panel) => {
      if (!(panel instanceof HTMLElement) || panel === selectionCard) {
        return false;
      }
      if (panel.querySelector('video, #player, .video-js')) {
        return true;
      }
      const panelText = (panel.textContent || '').toLowerCase();
      return panelText.includes('\u5168\u5c4f') || panelText.includes('full screen');
    });

    if (!(videoPanel instanceof HTMLElement)) {
      return;
    }

    if (videoPanel.nextElementSibling !== selectionCard) {
      videoPanel.insertAdjacentElement('afterend', selectionCard);
    }

    layoutContainer.style.setProperty('display', 'block', 'important');
    layoutContainer.style.setProperty('width', '100%', 'important');
    layoutContainer.style.setProperty('max-width', 'none', 'important');
    layoutContainer.style.setProperty('grid-template-columns', '1fr', 'important');
    layoutContainer.style.setProperty('align-items', 'stretch', 'important');

    videoPanel.style.setProperty('width', '100%', 'important');
    videoPanel.style.setProperty('max-width', 'none', 'important');
    videoPanel.style.setProperty('margin-right', '0', 'important');
    videoPanel.style.setProperty('margin-bottom', '14px', 'important');

    selectionCard.style.setProperty('width', '100%', 'important');
    selectionCard.style.setProperty('max-width', 'none', 'important');
    selectionCard.style.setProperty('margin-top', '0', 'important');
    selectionCard.style.setProperty('position', 'static', 'important');

    const selectionAside = selectionCard.closest('aside');
    if (selectionAside instanceof HTMLElement) {
      selectionAside.style.setProperty('width', '100%', 'important');
      selectionAside.style.setProperty('max-width', 'none', 'important');
      selectionAside.style.setProperty('position', 'static', 'important');
    }

    const mediaNodes = videoPanel.querySelectorAll('video, #player, .video-js, [class*="player"]');
    for (const mediaNode of mediaNodes) {
      if (!(mediaNode instanceof HTMLElement)) {
        continue;
      }
      mediaNode.style.setProperty('width', '100%', 'important');
      mediaNode.style.setProperty('max-width', 'none', 'important');
      mediaNode.style.setProperty('margin-left', '0', 'important');
      mediaNode.style.setProperty('margin-right', '0', 'important');
    }
  };

  // Source pattern: computed-style nuclear pass with top-bar forcing for late-loaded elements.
  const runNuclearPass = () => {
    const root = document.body || document.documentElement;
    if (!root) {
      return;
    }

    const nodes = root.querySelectorAll('*');
    for (const el of nodes) {
      if (!(el instanceof HTMLElement) || isMediaElement(el)) {
        continue;
      }

      if (isPlayerElement(el)) {
        resetPlayerStyles(el);
        continue;
      }

      const cs = getComputedStyle(el);
      const bg = parseColor(cs.backgroundColor);
      const fg = parseColor(cs.color);
      const border = parseColor(cs.borderColor);
      const pos = cs.position;
      const bgImage = cs.backgroundImage;
      const inHeader = !!el.closest('.pink-header, [role="banner"], header');
      const isPlayTopHeaderWrapper = isPlayPath() && (
        el.matches('header')
        || el.matches('[role="banner"]')
        || el.matches('.pink-header')
        || el.matches('.pink-header > div')
        || el.matches('[class*="topbar"]')
        || el.matches('[class*="navbar"]')
      );

      if (isPlayTopHeaderWrapper) {
        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('border-color', 'transparent', 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
        el.style.setProperty('backdrop-filter', 'none', 'important');
        continue;
      }

      if (inHeader) {
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('-webkit-mask-image', 'none', 'important');
        el.style.setProperty('mask-image', 'none', 'important');
      }

      // Handle background gradients with white endpoints
      if (bgImage && bgImage !== 'none') {
        const cleanedGradient = replaceGradientWhites(bgImage);
        el.style.setProperty('background-image', cleanedGradient, 'important');
        el.style.setProperty('background-color', 'var(--xaavv-bg)', 'important');
        el.setAttribute(TUNED_ATTR, '1');
      }

      // Remove small absolute decorative edge-fade blocks in top bars.
      if (inHeader && pos === 'absolute' && el.offsetWidth <= 140 && el.offsetHeight <= 140) {
        const looksLikeFade = (bgImage && bgImage !== 'none') || (bg && bg.a > 0.02 && luminance(bg) > 165);
        if (looksLikeFade) {
          el.style.setProperty('display', 'none', 'important');
          el.setAttribute(TUNED_ATTR, '1');
          continue;
        }
      }

      // Force background-clip, background-origin, background-size to avoid white showing through
      if (bgImage && bgImage !== 'none') {
        el.style.setProperty('background-clip', 'border-box', 'important');
        el.style.setProperty('background-origin', 'padding-box', 'important');
      }

      if (bg && bg.a > 0.05) {
        const bgLum = luminance(bg);
        if (bgLum > 140) {
          el.style.setProperty('background-color', 'var(--xaavv-bg)', 'important');
          el.style.setProperty('background-image', 'none', 'important');
          el.style.setProperty('color', 'var(--xaavv-text)', 'important');
          el.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text)', 'important');
          el.setAttribute(TUNED_ATTR, '1');
        }
      }

      if (fg) {
        const textLum = luminance(fg);
        if (textLum < 95) {
          el.style.setProperty('color', 'var(--xaavv-text)', 'important');
          el.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text)', 'important');
          el.setAttribute(TUNED_ATTR, '1');
        }
      }

      if (border && border.a > 0.05 && luminance(border) > 170) {
        el.style.setProperty('border-color', 'var(--xaavv-border)', 'important');
      }

      if ((pos === 'fixed' || pos === 'sticky') && bg && bg.a > 0.05 && luminance(bg) > 110) {
        el.style.setProperty('background-color', 'var(--xaavv-bg)', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('color', 'var(--xaavv-text)', 'important');
        el.style.setProperty('-webkit-text-fill-color', 'var(--xaavv-text)', 'important');
        el.style.setProperty('border-color', 'var(--xaavv-border)', 'important');
        el.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
        el.setAttribute(TUNED_ATTR, '1');
      }
    }

    hardenKnownBars();
  };

  const debounce = (fn, delay) => {
    let timer = null;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  };

  const schedule = (fn, delays) => {
    for (const ms of delays) {
      setTimeout(fn, ms);
    }
  };

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;

  document.documentElement.appendChild(style);
  document.documentElement.setAttribute('data-xaavv-script-version', SCRIPT_VERSION);

  const delayedPass = () => {
    wireSearchQueryLocalization();
    ensureAutoTranslateToEnglish();
    killTopLeftSwirl();
    runNuclearPass();
    tryRedirectFromIntermediatePage();
    setupPlaybackAutomationAssist();
    wireCenterPlayOverlayState();
    startOverlayWatchdog();
    startNavigationReliabilityWatchdog();
    syncVideoProgressBars();
    syncVideoDownloadButton();
    enforceTopRightControlTransparency();
    enforceTopLeftBrandAndSearchTransparency();
    enforcePlayVideoFirstLayout();
    removeHomepageTagline();
    schedule(runNuclearPass, [500, 1500, 3000]);
    schedule(tryRedirectFromIntermediatePage, [200, 800, 1800]);
    schedule(killTopLeftSwirl, [300, 1200, 2600]);
    schedule(syncCenterPlayOverlay, [300, 1200, 2600]);
    schedule(syncVideoProgressBars, [300, 1200, 2600]);
    schedule(syncVideoDownloadButton, [300, 1200, 2600]);
    schedule(enforceTopRightControlTransparency, [300, 1200, 2600]);
    schedule(enforceTopLeftBrandAndSearchTransparency, [300, 1200, 2600]);
    schedule(enforcePlayVideoFirstLayout, [300, 1200, 2600]);
    schedule(removeHomepageTagline, [250, 900, 1800, 3200]);
  };

  setupDirectPlayRouting();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedPass, { once: true });
  } else {
    delayedPass();
  }

  const observer = new MutationObserver(debounce(() => {
    runMaintenancePass();
  }, 150));
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
})();

