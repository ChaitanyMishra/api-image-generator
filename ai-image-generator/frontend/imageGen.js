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
    } else if(selectApi === 'runway') {
      fetchFromRunware(query);
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

  async function fetchFromRunware(query) {
    try {
      const response = await fetch('http://localhost:3000/api/runware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Runware Response:", result);

      const imgUrl = result.data?.[0]?.imageURL || result.data?.[0]?.imgUrl;
      if (imgUrl) {
        renderImages([imgUrl], "Runware");
      } else {
        showErrorOverlay("Runware returned no valid image.");
      }

    } catch (error) {
      console.error("Runware API Error:", error);
      showErrorOverlay("Something went wrong with Runware.");
    }
  }
    
  function renderImages(urls, source) {
    outputArea.innerHTML = '';
    urls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Result from ${source}`;
      img.loading = "lazy";
      img.classList.add('imgStyle');
      outputArea.appendChild(img);
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



