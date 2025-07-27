document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navList = document.querySelector('.navList');
  const body = document.body;
  
  if (mobileMenuBtn && navList) {
    const toggleMenu = (open = true) => {
      if (typeof open !== 'boolean') {
        open = !navList.classList.contains('active');
      }
      navList.classList.toggle('active', open);
      body.classList.toggle('menu-open', open);
      body.style.overflow = open ? 'hidden' : '';
      
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-times', open);
      }
    };

    // Toggle menu when hamburger is clicked
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (navList.classList.contains('active') && 
          !navList.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Close menu when clicking on navigation links
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
        
        // Smooth scroll to section
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Handle touch events for better mobile experience
    let touchStartY;
    navList.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    navList.addEventListener('touchmove', (e) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;

      // If swiping up, close the menu
      if (diff > 50) {
        toggleMenu(false);
        touchStartY = null;
      }
    }, { passive: true });
  }

  // API Functions
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000' // dev mode
  : 'https://snapfetch-ow6v.onrender.com'; // production backend
  async function fetchFromUnsplash(query) {
    try {
      const response = await fetch(`${API_BASE}/api/unsplash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Unsplash');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        showErrorOverlay('No images found on Unsplash. Trying Pixabay...');
        return fetchFromPixabay(query);
      }

      renderImages(data.results.map(img => img.urls.regular), 'Unsplash');
      enableGenerateButton();
    } catch (error) {
      console.error('Unsplash error:', error);
      return fetchFromPixabay(query);
    }
  }

  async function fetchFromPixabay(query) {
    try {
      const response = await fetch(`${API_BASE}/api/pixabay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Pixabay');
      }

      const data = await response.json();
      
      if (!data.hits || data.hits.length === 0) {
        showErrorOverlay('No images found. Please try a different description.');
        enableGenerateButton();
        return;
      }

      renderImages(data.hits.map(img => img.webformatURL), 'Pixabay');
      enableGenerateButton();
    } catch (error) {
      console.error('Pixabay error:', error);
      showErrorOverlay('Failed to generate images. Please try again.');
      enableGenerateButton();
    }
  }

  function renderImages(urls, source) {
    outputArea.innerHTML = '';
    urls.forEach(url => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');

      const img = document.createElement('img');
      img.src = url;
      img.alt = `Generated image from ${source}`;
      img.classList.add('imgStyle');
      img.loading = 'lazy';

      const downloadBtn = document.createElement('button');
      downloadBtn.classList.add('download-btn');
      downloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16v-8m0 8l-4-4m4 4l4-4m-8 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
      link.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      showErrorOverlay('Failed to download image. Please try again.');
    }
  }

  function enableGenerateButton() {
    if (!generateBtn) return;
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate';
  }

  // Main functionality
  const textArea = document.querySelector('#textArea');
  const outputArea = document.querySelector('.output-images');
  const generateBtn = document.querySelector('.genrateBtn');
  const loadingMessage = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Generating images...</p>';

  function handleSearch() {
    const selectApi = document.querySelector('#selectApi')?.value;
    if (!selectApi || selectApi === 'selectTag') {
      showErrorOverlay("Please select an image source (Unsplash or Pixabay)");
      return;
    }
    
    const query = textArea?.value?.trim();
    if (!query) {
      showErrorOverlay("Please enter an image description!");
      return;
    }

    if (!generateBtn || !outputArea) return;

    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    outputArea.innerHTML = loadingMessage;
    
    if (selectApi === 'unsplash') {
      fetchFromUnsplash(query);
    } else if (selectApi === 'pixlab') {
      fetchFromPixabay(query);
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', handleSearch);
  }

  if (textArea) {
    textArea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSearch();
      }
    });
  }

  // Error overlay function
  function showErrorOverlay(message) {
    const existing = document.getElementById('errorOverlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'errorOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background: var(--surface);
      padding: var(--space-xl);
      border-radius: var(--border-radius-md);
      max-width: 90%;
      width: 400px;
      text-align: center;
      transform: translateY(20px);
      transition: transform 0.3s ease;
    `;

    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    icon.style.cssText = `
      color: var(--primary);
      font-size: 2rem;
      margin-bottom: var(--space-md);
      display: block;
    `;

    const text = document.createElement('p');
    text.style.cssText = `
      color: var(--text);
      font-size: 1.2rem;
      margin-bottom: var(--space-lg);
    `;
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'generate-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
    closeBtn.onclick = () => {
      overlay.style.opacity = '0';
      box.style.transform = 'translateY(20px)';
      setTimeout(() => overlay.remove(), 300);
    };

    box.appendChild(icon);
    box.appendChild(text);
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    });
  }
});
