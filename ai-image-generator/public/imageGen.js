document.addEventListener('DOMContentLoaded', () => {
  // ...existing code from frontend/imageGen.js...
  // Always use Render backend for API requests
  const API_BASE = 'https://snapfetch-ow6v.onrender.com';

  async function fetchFromUnsplash(query) {
    try {
      const response = await fetch(`${API_BASE}/api/unsplash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      // ...existing code...
    } catch (error) {
      // ...existing code...
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
      // ...existing code...
    } catch (error) {
      // ...existing code...
    }
  }
});
