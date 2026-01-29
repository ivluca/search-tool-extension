document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchOptionsContainer = document.getElementById('searchOptions');
  let selectedEngine = 'duckduckgo'; // Default search engine

  const engineConfig = {
    'duckduckgo': { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    'google': { name: 'Google', url: 'https://www.google.com/search?q=' },
    'bing': { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    'yandex': { name: 'Yandex', url: 'https://yandex.com/search/?text=' }
  };

  searchInput.focus();

  // Function to update selection and placeholder
  function updateSelection(engine) {
    selectedEngine = engine;
    
    // Remove 'selected' class from all options
    searchOptionsContainer.querySelectorAll('.search-option').forEach(opt => opt.classList.remove('selected'));
    
    // Add 'selected' class to the correct option
    const selectedOption = searchOptionsContainer.querySelector(`[data-engine="${engine}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
    
    searchInput.placeholder = `${engineConfig[engine].name}...`;
  }

  // Set default selection
  updateSelection(selectedEngine);

  // Use event delegation for search option clicks
  searchOptionsContainer.addEventListener('click', function(event) {
    const targetOption = event.target.closest('.search-option');
    if (targetOption && targetOption.dataset.engine) {
      updateSelection(targetOption.dataset.engine);
    }
  });

  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  function performSearch() {
    const query = searchInput.value.trim();
    if (query === '') {
      return; // Don't search for an empty query
    }
    
    const searchUrl = engineConfig[selectedEngine].url + encodeURIComponent(query);
    chrome.tabs.create({ url: searchUrl });
  }
});