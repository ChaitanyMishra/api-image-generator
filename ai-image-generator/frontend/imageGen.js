document.addEventListener('DOMContentLoaded', () => {
  // Set dark theme by default
  document.documentElement.setAttribute('data-theme', 'dark');

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const textArea = document.querySelector('#textArea');
  const outputArea = document.querySelector('.output-images');
  const generateBtn = document.querySelector('.genrateBtn');
  const loadingMessage = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Generating images...</p>';
  
  function handleSearch() {
    const selectApi = document.querySelector('#selectApi').value;
    if (selectApi === 'selectTag') {
      showErrorOverlay("Please select an image source (Unsplash or Pixabay)");
      return;
    }
    
    const query = textArea.value.trim();
    if (!query) {
      showErrorOverlay("Please enter an image description!");
      return;
    }

    generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating...`;
    generateBtn.disabled = true;
    
    outputArea.innerHTML = loadingMessage;
    
    if (selectApi === 'unsplash') {
      fetchFromUnsplash(query);
    } else if (selectApi === 'pixlab') {
      fetchFromPixabay(query);
    }
  }

  async function fetchFromUnsplash(query) {
    const page = Math.floor(Math.random() * 30) + 1;
    try {
      const response = await fetch('http://localhost:3000/api/unsplash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, page }),
      });
      
      if (!response.ok) throw new Error("Unsplash API failed");
      const data = await response.json();
      if (data.results.length === 0) {
        throw new Error("No images found on Unsplash");
      }
      renderImages(data.results.map(img => img.urls.regular), "Unsplash");
    } catch (err) {
      console.warn("Trying fallback (Pixabay)...", err.message);
      fetchFromPixabay(query);
    }
  }

  async function fetchFromPixabay(query) {
    try {
      const response = await fetch('http://localhost:3000/api/pixabay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) throw new Error("Pixabay API failed");
      const data = await response.json();
      if (data.hits.length === 0) {
        throw new Error("No images found on Pixabay");
      }
      renderImages(data.hits.map(img => img.webformatURL), "Pixabay");
    } catch (err) {
      showErrorOverlay("No images found. Please try a different description.");
      console.error("Both APIs failed:", err.message);
    }
  }
    
  function renderImages(urls, source) {
    outputArea.innerHTML = '';
    urls.forEach(url => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');

      const img = document.createElement('img');
      img.src = url;
      img.alt = `Result from ${source}`;
      img.loading = "lazy";
      img.classList.add('imgStyle');
      
      const downloadBtn = document.createElement('button');
      downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
      downloadBtn.classList.add('download-btn');
      downloadBtn.addEventListener('click', () => downloadImage(url));

      imgContainer.appendChild(img);
      imgContainer.appendChild(downloadBtn);
      outputArea.appendChild(imgContainer);
    });
  }

  async function downloadImage(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showErrorOverlay("Failed to download image. Please try again.");
    }
  }

  function showErrorOverlay(message) {
    if (document.getElementById('errorOverlay')) {
      document.body.removeChild(document.getElementById('errorOverlay'));
    }

    const overlay = document.createElement('div');
    overlay.id = 'errorOverlay';

    const box = document.createElement('div');
    box.style.background = 'var(--surface)';
    box.style.padding = 'var(--space-xl)';
    box.style.borderRadius = 'var(--border-radius-md)';
    box.style.maxWidth = '90%';
    box.style.width = '400px';
    box.style.textAlign = 'center';

    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    icon.style.color = 'var(--primary)';
    icon.style.fontSize = '2rem';
    icon.style.marginBottom = 'var(--space-md)';

    const text = document.createElement('p');
    text.style.color = 'var(--text)';
    text.style.fontSize = '1.2rem';
    text.style.marginBottom = 'var(--space-lg)';
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'generate-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    box.appendChild(icon);
    box.appendChild(text);
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  generateBtn.addEventListener('click', handleSearch);
  textArea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});



