/**
 * My New Tab - MVP Main Script
 *
 * This script handles the core functionality for the MVP version,
 * focusing on speed, aesthetics, and stability.
 */
(function () {
  'use strict';

  // --- DOM Elements ---
  const timeWidget = document.getElementById('time-widget');
  const greetingWidget = document.getElementById('greeting-widget');
  const searchInput = document.getElementById('searchInput');
  const quickLinksContainer = document.getElementById('quick-links-container');
  const quickLinkTemplate = document.getElementById('quick-link-template');
  const settingsButton = document.getElementById('settings-button');

  // --- State & Config ---
  const state = {
    userName: 'Friend',
  };

  const defaultLinks = [
    { title: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/s/desktop/0146S2s2/img/favicon_144.png' },
    { title: 'Gmail', url: 'https://mail.google.com', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
    { title: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png' },
    { title: 'Reddit', url: 'https://reddit.com', icon: 'https://www.reddit.com/favicon.ico' },
    { title: 'Twitter', url: 'https://twitter.com', icon: 'https://abs.twimg.com/favicons/twitter.3.ico' },
  ];

  // --- Main Initialization ---
  async function init() {
    await loadSettings();
    initializeWidgets();
    setupEventListeners();
    renderQuickLinks();
    searchInput.focus();
  }

  // --- Settings & Data ---
  async function loadSettings() {
    try {
      const result = await chrome.storage.local.get(['userName']);
      state.userName = result.userName || 'Friend';
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  function saveUserName(name) {
    state.userName = name;
    chrome.storage.local.set({ userName: name }, () => {
      updateGreeting();
    });
  }

  // --- UI Rendering ---
  function renderQuickLinks() {
    quickLinksContainer.innerHTML = ''; // Clear existing links
    defaultLinks.forEach(link => {
      const linkElement = quickLinkTemplate.content.cloneNode(true).firstElementChild;
      linkElement.href = link.url;
      linkElement.title = link.title;
      
      const icon = linkElement.querySelector('.quick-link-icon');
      icon.src = link.icon;
      icon.alt = link.title;
      
      quickLinksContainer.appendChild(linkElement);
    });
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    settingsButton.addEventListener('click', () => {
      const newName = prompt('What should we call you?', state.userName);
      if (newName && newName.trim() !== '') {
        saveUserName(newName.trim());
      }
    });
  }

  // --- Core Functions ---
  function performSearch() {
    const query = searchInput.value.trim();
    if (query === '') return;
    // Default to Google search for the MVP
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.location.href = searchUrl;
  }

  // --- Widgets ---
  function initializeWidgets() {
    // Clock
    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (timeWidget.textContent !== timeString) {
        timeWidget.textContent = timeString;
      }
    }
    updateTime();
    setInterval(updateTime, 1000);

    // Greeting
    updateGreeting();
  }

  function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    }
    greetingWidget.textContent = `${greeting}, ${state.userName}.`;
  }

  // --- Run Application ---
  init();

})();