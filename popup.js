document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchOptions = document.querySelectorAll('.search-option');
  let selectedEngine = 'duckduckgo'; // Default search engine

  const engineMapping = {
    '1': 'duckduckgo',
    '2': 'google',
    '3': 'bing',
    '4': 'yandex'
  };

  searchInput.focus();

  // Function to update selection
  function updateSelection(engine) {
    selectedEngine = engine;
    searchOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`.search-option[data-engine="${engine}"]`).classList.add('selected');
  }

  // Set default selection
  updateSelection(selectedEngine);

  searchOptions.forEach(option => {
    option.addEventListener('click', function() {
      updateSelection(this.dataset.engine);
    });
  });

  searchInput.addEventListener('keydown', function(event) {
    // Handle number keys for engine selection
    if (event.key >= '1' && event.key <= '4') {
      event.preventDefault();
      const engine = engineMapping[event.key];
      if (engine) {
        updateSelection(engine);
      }
    } else if (event.key === 'Enter') {
      const query = searchInput.value;
      if (query.trim() === '') {
        return; // Don't search for empty query
      }
      let searchUrl;

      switch (selectedEngine) {
        case 'google':
          searchUrl = `https://www.google.com/search?q=${query}`;
          break;
        case 'bing':
          searchUrl = `https://www.bing.com/search?q=${query}`;
          break;
        case 'yandex':
          searchUrl = `https://yandex.com/search/?text=${query}`;
          break;
        default:
          searchUrl = `https://duckduckgo.com/?q=${query}`;
      }

      chrome.tabs.create({ url: searchUrl });
    }
  });
});