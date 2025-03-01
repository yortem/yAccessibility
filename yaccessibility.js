async function loadTranslations(basePath, language) {
  const languagePath = `${basePath}/languages/${language}.json`;
  try {
    const response = await fetch(languagePath);
    if (!response.ok) {
      throw new Error(`Failed to load translations for language: ${language}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    if (language != 'en')
    {
      return loadTranslations('en');
    }
    else {
        return {};
    }
  }
}

function getScriptBasePath() {
  // Use document.currentScript if available
  const currentScript = document.currentScript;
  //console.log(currentScript);

  if (currentScript && currentScript.src) {
    const scriptSrc = currentScript.src;
    const lastSlashIndex = scriptSrc.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      return ''; // No slashes in the URL
    }
    return scriptSrc.substring(0, lastSlashIndex);
  }

  try {
    throw new Error();
  } catch (error) {
    const stack = error.stack;
    if (!stack) {
      console.warn('Could not determine the script base path. Using the fallback.');
      // Fallback to previous method if document.currentScript is not available
      const scripts = document.getElementsByTagName('script');
      const lastScript = scripts[scripts.length - 1];
      const lastScriptSrc = lastScript.src;
      if (!lastScriptSrc) {
        return ''; // Inline script or something went wrong
      }
      const lastSlashIndex = lastScriptSrc.lastIndexOf('/');
      if (lastSlashIndex === -1) {
        return ''; // No slashes in the URL
      }
      return lastScriptSrc.substring(0, lastSlashIndex);
    }

    const match = stack.match(/((?:https?|file):\/\/.+?\/[^:/]+?(?=:))\b/); // Regex to get file path in the stacktrace
    if (!match || match.length < 1) {
      console.warn('Could not determine the script base path. Using the fallback.');
      const scripts = document.getElementsByTagName('script');
      const lastScript = scripts[scripts.length - 1];
      const lastScriptSrc = lastScript.src;
      if (!lastScriptSrc) {
        return ''; // Inline script or something went wrong
      }
      const lastSlashIndex = lastScriptSrc.lastIndexOf('/');
      if (lastSlashIndex === -1) {
        return ''; // No slashes in the URL
      }
      return lastScriptSrc.substring(0, lastSlashIndex);
    }
    const scriptUrl = match[1];
    const lastSlashIndex = scriptUrl.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      return ''; // No slashes in the URL
    }
    return scriptUrl.substring(0, lastSlashIndex);
  }
}

async function yAccessibility(options = {}) {
  
  // Default options
  const defaultOptions = {
    language: 'en',
    statement: null,
    direction: 'ltr'
  };

  const settings = { ...defaultOptions, ...options };
  const { language, statement, direction } = settings;

  const basePath = getScriptBasePath();

  const cssPath = basePath ? `${basePath}/yaccessibility.css` : 'yaccessibility.css';
  const translations = await loadTranslations(basePath, language);

  const markedButtons = [];

  const shadowHost = document.createElement('div');
  shadowHost.id = 'y-accessibility-shadow-host';
  document.body.appendChild(shadowHost);
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  shadowRoot.appendChild(link);

  const link2 = document.createElement('link');
  link2.rel = 'stylesheet';
  link2.href = cssPath;
  document.head.appendChild(link2);

  const accessibilityButton = document.createElement('button');
  accessibilityButton.id = 'y-accessibility-button';
  accessibilityButton.setAttribute('aria-label', translations['open_accessibility_bar']);
  accessibilityButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M423.9 255.8L411 413.1c-3.3 40.7-63.9 35.1-60.6-4.9l10-122.5-41.1 2.3c10.1 20.7 15.8 43.9 15.8 68.5 0 41.2-16.1 78.7-42.3 106.5l-39.3-39.3c57.9-63.7 13.1-167.2-74-167.2-25.9 0-49.5 9.9-67.2 26L73 243.2c22-20.7 50.1-35.1 81.4-40.2l75.3-85.7-42.6-24.8-51.6 46c-30 26.8-70.6-18.5-40.5-45.4l68-60.7c9.8-8.8 24.1-10.2 35.5-3.6 0 0 139.3 80.9 139.5 81.1 16.2 10.1 20.7 36 6.1 52.6L285.7 229l106.1-5.9c18.5-1.1 33.6 14.4 32.1 32.7zm-64.9-154c28.1 0 50.9-22.8 50.9-50.9C409.9 22.8 387.1 0 359 0c-28.1 0-50.9 22.8-50.9 50.9 0 28.1 22.8 50.9 50.9 50.9zM179.6 456.5c-80.6 0-127.4-90.6-82.7-156.1l-39.7-39.7C36.4 287 24 320.3 24 356.4c0 130.7 150.7 201.4 251.4 122.5l-39.7-39.7c-16 10.9-35.3 17.3-56.1 17.3z"/></svg>`;
  shadowRoot.appendChild(accessibilityButton);

  const accessibilityBar = document.createElement('div');
  accessibilityBar.id = 'y-accessibility-bar';
  accessibilityBar.setAttribute('aria-label', translations['accessibility_bar']);
  accessibilityBar.setAttribute('aria-hidden', 'true'); 
  accessibilityBar.setAttribute('aria-expanded', 'false');
  accessibilityBar.setAttribute('style', 'transform: translateX(-100%);');

  const buttons = [
    { id: 'y-accessibility-contrast', label: translations['contrast'], action: toggleContrast, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>' },
    { id: 'y-accessibility-colorless', label: translations['colorless'], action: toggleColorless, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 512c53.2 0 101.4-21.6 136.1-56.6l-298.3-235C140 257.1 128 292.3 128 320c0 106 86 192 192 192zM505.2 370.7c4.4-16.2 6.8-33.1 6.8-50.7c0-91.2-130.2-262.3-166.6-308.3C339.4 4.2 330.5 0 320.9 0l-1.8 0c-9.6 0-18.5 4.2-24.5 11.7C277.8 33 240.7 81.3 205.8 136L38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L505.2 370.7zM224 336c0 44.2 35.8 80 80 80c8.8 0 16 7.2 16 16s-7.2 16-16 16c-61.9 0-112-50.1-112-112c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>' },
    { id: 'y-accessibility-highlightLinks', label: translations['highlight_links'], action: toggleHighlightLinks, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>' },
    { id: 'y-accessibility-simple-font', label: translations['simple_font'], action: simpleFont, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z"/></svg>' },
    { id: 'y-accessibility-increase-font', label: translations['increase_font'], action: increaseFont, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z"/></svg>' },
    { id: 'y-accessibility-decrease-font', label: translations['decrease_font'], action: decreaseFont, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z"/></svg>' },
    { id: 'y-accessibility-alt-text-body', label: translations['alt_text'], action: altText, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M160 32c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L160 32zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320l-144 0-48 0-80 0c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120L0 344c0 75.1 60.9 136 136 136l320 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-320 0c-48.6 0-88-39.4-88-88l0-224z"/></svg>' },
    { id: 'y-accessibility-big-cursor', label: translations['big_cursor'], action: bigCursor, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>'},
    { id: 'y-accessibility-stop-flickering', label: translations['stop_flickering'], action: stopFlickering, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm192-96l128 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32z"/></svg>'}
  ];

  if (statement != null) {
    let statementButton = { id: 'y-accessibility-page', label: translations['accessibility_statement'], action: () => window.open(statement, '_blank'), svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/></svg>' };
    buttons.push(statementButton);
  }

  let resetbutton = { id: 'y-accessibility-reset', label: translations['reset'], action: resetAccessibility, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9L0 168c0 13.3 10.7 24 24 24l110.1 0c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24l0 104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65 0-94.1c0-13.3-10.7-24-24-24z"/></svg>'};
  buttons.push(resetbutton);

  const title = document.createElement('div');
  title.id = 'y-accessibility-title';
  title.innerHTML = translations['accessibility_title'];
  accessibilityBar.appendChild(title);

  const buttonsWrap = document.createElement('div');
  buttonsWrap.id = 'y-accessibility-buttons-wrap';
  accessibilityBar.appendChild(buttonsWrap);

  buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.id = button.id;
    btn.setAttribute('aria-label', button.label);
    btn.setAttribute('aria-hidden', 'true');
    btn.innerHTML = button.svg + '<span class="y-accessibility-button-label">' + button.label + '</span>';
  
    const checkmark = document.createElement('span');
    checkmark.classList.add('y-accessibility-checkmark');
    checkmark.textContent = '✔';
    btn.appendChild(checkmark);
  
    const updateCheckmark = () => {
      if (sessionStorage.getItem(button.id) === 'true') {
        checkmark.style.display = 'inline';
        checkmark.setAttribute('aria-hidden', 'false');
        btn.classList.add('y-accessibility-button-active');
      } else {
        checkmark.style.display = 'none';
        checkmark.setAttribute('aria-hidden', 'true');
        btn.classList.remove('y-accessibility-button-active');
      }
    };

  
    updateCheckmark(); 
  
    btn.addEventListener('click', () => {
      button.action();
      updateCheckmark();
    });
  
    buttonsWrap.appendChild(btn);
    markedButtons.push(btn);
  });

  const credits = document.createElement('div');
  credits.id = 'y-accessibility-credits';
  credits.innerHTML = translations['credits'] +' <a href="https://github.com/yortem/yAccessibility" target="_blank">yAccessibility</a>';
  accessibilityBar.appendChild(credits);

  shadowRoot.appendChild(accessibilityBar);

  function toggleContrast() {
    document.body.classList.toggle('y-accessibility-contrast');
    saveSettings('y-accessibility-contrast', document.body.classList.contains('y-accessibility-contrast'));
  }

  function toggleColorless() {
    document.body.classList.toggle('y-accessibility-colorless');
    saveSettings('y-accessibility-colorless', document.body.classList.contains('y-accessibility-colorless'));
  }

  function increaseFont() {
    const currentFontSize = parseInt(window.getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = `${currentFontSize + 2}px`;
    saveSettings('y-accessibility-increase-font', document.body.style.fontSize);
  }

  function decreaseFont() {
    const currentFontSize = parseInt(window.getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = `${currentFontSize - 2}px`;
    saveSettings('y-accessibility-decrease-font', document.body.style.fontSize);
  }

  function toggleHighlightLinks() {
    document.body.classList.toggle('y-accessibility-highlight-links');
    saveSettings('y-accessibility-highlightLinks', document.body.classList.contains('y-accessibility-highlight-links'));
  }

  function stopFlickering() {
    document.querySelectorAll('img, video').forEach(element => {
      element.style.setProperty('animation', 'none', 'important');
    });
    document.body.classList.toggle('y-accessibility-stop-flickering');
    saveSettings('y-accessibility-stop-flickering', document.body.classList.contains('y-accessibility-stop-flickering'));
  }

  function simpleFont() {
    document.body.classList.toggle('y-accessibility-simple-font');
    saveSettings('y-accessibility-simple-font', document.body.classList.contains('y-accessibility-simple-font'));
  }

  function altText() {
    const images = document.querySelectorAll('img');
    images.forEach(image => {
      const alt = image.getAttribute('alt');
      const existingAltText = image.nextElementSibling;

      if (alt) {
          if (existingAltText && existingAltText.classList.contains('y-accessibility-alt-text')) {
              existingAltText.remove();
          } else {
              image.insertAdjacentHTML('afterend', `<div class="y-accessibility-alt-text">${alt}</div>`);
          }
      } else if (existingAltText && existingAltText.classList.contains('y-accessibility-alt-text'))
      {
        existingAltText.remove();
      }
    }
    );
    document.body.classList.toggle('y-accessibility-alt-text-body');
    saveSettings('y-accessibility-alt-text-body', document.body.classList.contains('y-accessibility-alt-text-body'));
  }

  function bigCursor() {
    document.body.classList.toggle('y-accessibility-big-cursor');
    saveSettings('y-accessibility-big-cursor', document.body.classList.contains('y-accessibility-big-cursor'));
  }


  function resetAccessibility() {
    document.body.classList.remove('y-accessibility-contrast', 'y-accessibility-colorless','y-accessibility-highlight-links', 'y-accessibility-stop-flickering', 'y-accessibility-simple-font', 'y-accessibility-alt-text-body');
    document.body.style.fontSize = '';
    sessionStorage.clear();

    markedButtons.forEach(button => {
      const checkmark = button.querySelector('.y-accessibility-checkmark');
      if (checkmark) {
        checkmark.style.display = 'none'; 
      }

      button.classList.remove('y-accessibility-button-active');
    });

    const altTextElements = document.querySelectorAll('.y-accessibility-alt-text');
    altTextElements.forEach(element => {
      element.remove();
    }); 
  }

  function saveSettings(key, value) {
    sessionStorage.setItem(key, value);
  }

  function loadSettings() {
    if (sessionStorage.getItem('y-accessibility-contrast') === 'true') {
      document.body.classList.add('y-accessibility-contrast');
    }
    if (sessionStorage.getItem('y-accessibility-colorless') === 'true') {
      document.body.classList.add('y-accessibility-colorless');
    }
    if (sessionStorage.getItem('y-accessibility-highlightLinks') === 'true') {
      document.body.classList.add('y-accessibility-highlight-links');
    }
    if (sessionStorage.getItem('y-accessibility-stop-flickering') === 'true') {
      document.body.classList.add('y-accessibility-stop-flickering');
    }
    if (sessionStorage.getItem('y-accessibility-fontSize')) {
      document.body.style.fontSize = sessionStorage.getItem('y-accessibility-fontSize');
    }
    if(sessionStorage.getItem('y-accessibility-simple-font') === 'true') {
      document.body.classList.add('y-accessibility-simple-font');
    }
    if(sessionStorage.getItem('y-accessibility-big-cursor') === 'true') {
      document.body.classList.add('y-accessibility-big-cursor');
    }
    if(sessionStorage.getItem('y-accessibility-alt-text-body') === 'true') {
      document.body.classList.add('y-accessibility-alt-text-body');
      altText();
    }
  }

  loadSettings();

  accessibilityButton.addEventListener('click', () => {
    toggleYAccessibility();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleYAccessibility();
    }
  });

  function toggleYAccessibility() {
    accessibilityBar.classList.toggle('y-accessibility-active');
    const isActive = accessibilityBar.classList.contains('y-accessibility-active');
    accessibilityBar.setAttribute('aria-hidden', !isActive); 
    accessibilityBar.setAttribute('aria-expanded', isActive); 

    if (isActive) {
      accessibilityBar.setAttribute('style', 'transform: translateX(0);');
    } else {
      accessibilityBar.setAttribute('style', 'transform: translateX(-100%);');
    }


    const buttons = accessibilityBar.querySelectorAll('button');
    buttons.forEach(button => {
      button.setAttribute('aria-hidden', !isActive);
    });

    // make items inside not visible if it's inactive
    toggleFocusableElements(!isActive);

    // change the icon
    toggleButtonIcon();
    
    // focus first element
    if (isActive) {
      const firstFocusableElement = accessibilityBar.querySelector('button:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  }

  function toggleFocusableElements(isHidden) {

      const focusableElements = accessibilityBar.querySelectorAll('button, a'); 
      focusableElements.forEach(element => {
          if (isHidden) {
              element.setAttribute('tabindex', '-1');
          } else {
              element.removeAttribute('tabindex');
          }
      });
  }


  function toggleButtonIcon() {
    const isActive = accessibilityBar.classList.contains('y-accessibility-active');
    const newIcon = isActive
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffffff" d="M423.9 255.8L411 413.1c-3.3 40.7-63.9 35.1-60.6-4.9l10-122.5-41.1 2.3c10.1 20.7 15.8 43.9 15.8 68.5 0 41.2-16.1 78.7-42.3 106.5l-39.3-39.3c57.9-63.7 13.1-167.2-74-167.2-25.9 0-49.5 9.9-67.2 26L73 243.2c22-20.7 50.1-35.1 81.4-40.2l75.3-85.7-42.6-24.8-51.6 46c-30 26.8-70.6-18.5-40.5-45.4l68-60.7c9.8-8.8 24.1-10.2 35.5-3.6 0 0 139.3 80.9 139.5 81.1 16.2 10.1 20.7 36 6.1 52.6L285.7 229l106.1-5.9c18.5-1.1 33.6 14.4 32.1 32.7zm-64.9-154c28.1 0 50.9-22.8 50.9-50.9C409.9 22.8 387.1 0 359 0c-28.1 0-50.9 22.8-50.9 50.9 0 28.1 22.8 50.9 50.9 50.9zM179.6 456.5c-80.6 0-127.4-90.6-82.7-156.1l-39.7-39.7C36.4 287 24 320.3 24 356.4c0 130.7 150.7 201.4 251.4 122.5l-39.7-39.7c-16 10.9-35.3 17.3-56.1 17.3z"/></svg>`;
    accessibilityButton.innerHTML = newIcon;

    if (isActive) {
      accessibilityButton.classList.toggle('y-accessibility-toggle-active');
    } else {
      accessibilityButton.classList.remove('y-accessibility-toggle-active');
    }
  }

  toggleFocusableElements(true);

}