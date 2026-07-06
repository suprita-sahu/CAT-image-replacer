// Function to fetch a random cat image URL from the API
async function getRandomCatImageUrl() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await response.json();
    return data[0].url;
  } catch (error) {
    console.error('Error fetching cat image:', error);
    // Fallback placeholder cat image if API fails
    return 'https://placekitten.com/400/400'; 
  }
}

// Function to replace all images on the page
async function replaceImages() {
  const images = document.getElementsByTagName('img');
  
  for (let img of images) {
    // Check if we already processed this image to avoid infinite loops
    if (!img.dataset.catReplaced) {
      const catUrl = await getRandomCatImageUrl();
      
      // Preserve original layout dimensions where possible
      if (img.src) {
        img.style.width = img.offsetWidth + 'px';
        img.style.height = img.offsetHeight + 'px';
        img.src = catUrl;
        img.srcset = ''; // Clear srcset to prevent high-res overrides
        img.dataset.catReplaced = "true";
      }
    }
  }
}

// Run immediately when the DOM is ready
replaceImages();

// Observe the DOM for any dynamically added images (infinite scroll, lazy loading)
const observer = new MutationObserver((mutations) => {
  let shouldReplace = false;
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.tagName === 'IMG' || (node.querySelectorAll && node.querySelectorAll('img').length > 0)) {
        shouldReplace = true;
      }
    });
  });
  
  if (shouldReplace) {
    replaceImages();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});