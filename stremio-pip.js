(() => {
  "use strict";

  const MOD_KEY = "__stremioPipWebModLoaded";
  if (window[MOD_KEY]) return;
  window[MOD_KEY] = true;

  const BUTTON_ID = "stremio-pip-button";
  const STYLE_ID = "stremio-pip-styles";
  const BUTTONS_CONTAINER_SELECTOR = '[class*="control-bar-buttons-container"]';
  const SAMPLE_BUTTON_SELECTOR = '[class*="control-bar-button-"]';

  let activeVideo = null;
  let rafPending = false;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }

      #${BUTTON_ID} svg {
        width: 1.55rem;
        height: 1.55rem;
        pointer-events: none;
      }

      #${BUTTON_ID}[aria-disabled="true"] {
        opacity: 0.45;
        cursor: default;
      }
    `;
    document.head.appendChild(style);
  }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden";
  }

  function getPlayerButtonsContainer() {
    const containers = Array.from(document.querySelectorAll(BUTTONS_CONTAINER_SELECTOR));
    return containers.find(isVisible) || null;
  }

  function getBestVideo() {
    const videos = Array.from(document.querySelectorAll("video"))
      .filter((video) => {
        if (video.disablePictureInPicture === true) return false;
        const rect = video.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return (br.width * br.height) - (ar.width * ar.height);
      });

    return videos[0] || null;
  }

  function pipSupported(video) {
    return Boolean(
      video &&
      document.pictureInPictureEnabled !== false &&
      typeof video.requestPictureInPicture === "function" &&
      typeof document.exitPictureInPicture === "function"
    );
  }

  function iconMarkup(active) {
    return active
      ? `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor"/>
          <path d="M10 8H6.5v3.5M6.5 8l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
      : `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor"/>
        </svg>
      `;
  }

  function updateButton() {
    const button = document.getElementById(BUTTON_ID);
    if (!button) return;

    const video = getBestVideo();
    const supported = pipSupported(video);
    const active = Boolean(video && document.pictureInPictureElement === video);

    button.setAttribute("aria-disabled", supported ? "false" : "true");
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.title = !supported
      ? "Picture-in-Picture is not available for this player"
      : active
        ? "Exit Picture-in-Picture (Alt+P)"
        : "Picture-in-Picture (Alt+P)";
    button.innerHTML = iconMarkup(active);
  }

  function unbindVideo() {
    if (!activeVideo) return;
    activeVideo.removeEventListener("enterpictureinpicture", updateButton);
    activeVideo.removeEventListener("leavepictureinpicture", updateButton);
    activeVideo.removeEventListener("loadedmetadata", updateButton);
    activeVideo = null;
  }

  function bindVideo(video) {
    if (video === activeVideo) return;

    unbindVideo();
    activeVideo = video;

    if (!activeVideo) return;

    activeVideo.addEventListener("enterpictureinpicture", updateButton);
    activeVideo.addEventListener("leavepictureinpicture", updateButton);
    activeVideo.addEventListener("loadedmetadata", updateButton);
  }

  async function togglePictureInPicture(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const video = getBestVideo();
    if (!pipSupported(video)) {
      updateButton();
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.warn("[Stremio PiP] Unable to toggle Picture-in-Picture:", error);
    } finally {
      updateButton();
    }
  }

  function createButton(container) {
    const sample = container.querySelector(SAMPLE_BUTTON_SELECTOR);
    const button = document.createElement(sample?.tagName || "div");

    button.id = BUTTON_ID;
    button.dataset.stremioPip = "true";
    button.className = sample?.className || "";
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", "Picture-in-Picture");
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", togglePictureInPicture);
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        togglePictureInPicture(event);
      }
    });

    button.innerHTML = iconMarkup(false);

    const lastChild = container.lastElementChild;
    if (lastChild) {
      container.insertBefore(button, lastChild);
    } else {
      container.appendChild(button);
    }

    return button;
  }

  function sync() {
    rafPending = false;

    injectStyles();

    const container = getPlayerButtonsContainer();
    const video = getBestVideo();
    bindVideo(video);

    let button = document.getElementById(BUTTON_ID);

    if (!container || !video) {
      if (button && !container) button.remove();
      return;
    }

    if (!button || button.parentElement !== container) {
      button?.remove();
      button = createButton(container);
    }

    updateButton();
  }

  function scheduleSync() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(sync);
  }

  function isEditableTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key.toLowerCase() === "p" &&
      !isEditableTarget(event.target)
    ) {
      togglePictureInPicture(event);
    }
  });

  const observer = new MutationObserver(scheduleSync);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("hashchange", scheduleSync);
  window.addEventListener("popstate", scheduleSync);
  document.addEventListener("visibilitychange", scheduleSync);
  document.addEventListener("enterpictureinpicture", updateButton, true);
  document.addEventListener("leavepictureinpicture", updateButton, true);

  scheduleSync();

  console.info("[Stremio PiP] WebMod loaded");
})();
