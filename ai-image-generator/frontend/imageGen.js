document.addEventListener('DOMContentLoaded', () => {
  const textArea = document.querySelector('#textArea');
  const outputArea = document.querySelector('.output-images');
  const genrateBtn = document.querySelector('.genrateBtn');
  const reGenrateBtn = document.querySelector('.reGenrateBtn');
  
  function handleSearch(e) {
    const selectApi = document.querySelector('#selectApi').value;
    console.log(selectApi)
    genrateBtn.innerHTML = `Generating...`;
    setTimeout(() => {
      genrateBtn.innerHTML = `Generate`;
    }, 1500);
    
    const query = textArea.value.trim();
    if (!query) {
      showErrorOverlay("Search Box Cannot Be Empty!");
      return;
    } else if(selectApi === 'unsplash') {
      fetchFromUnsplash(query);
    } else if(selectApi === 'pixlab') {
      fetchFromPixabay(query);
    }
    outputArea.innerHTML = `<p class="loading">Loading...</p>`;
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
        throw new Error("No images on Unsplash");
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
        throw new Error("No images on Pixabay");
      }
      renderImages(data.hits.map(img => img.webformatURL), "Pixabay");
    } catch (err) {
      showErrorOverlay("Image Not Found. Please try something else.");
      console.error("Both APIs failed:", err.message);
    }
  }

  async function downloadImage(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      showErrorOverlay('Failed to download image. Please try again.');
    }
  }

  function renderImages(urls, source) {
    outputArea.innerHTML = '';
    urls.forEach((url, index) => {
      const container = document.createElement('div');
      container.classList.add('image-container');
      
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Result from ${source}`;
      img.loading = "lazy";
      img.classList.add('imgStyle');
      
      const downloadBtn = document.createElement('button');
      downloadBtn.classList.add('download-btn');
      const downloadIcon = document.createElement('img');
      downloadIcon.src = 'down.png';
      downloadIcon.alt = 'Download';
      downloadBtn.appendChild(downloadIcon);

      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(url, `${source.toLowerCase()}-image-${index + 1}.jpg`);
      });

      container.appendChild(img);
      container.appendChild(downloadBtn);
      outputArea.appendChild(container);
    });
  }

  function showErrorOverlay(message) {
    if (document.getElementById('errorOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'errorOverlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 12, 41, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
      flexDirection: 'column',
    });



    const box = document.createElement('div');
    box.innerHTML = `
      <p style="color: #fef08a; font-size: 1.2rem; font-weight: bold; text-align: center;">${message}</p>
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'generate-btn';
    closeBtn.style.marginTop = '20px';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  genrateBtn.addEventListener('click', handleSearch);
});



