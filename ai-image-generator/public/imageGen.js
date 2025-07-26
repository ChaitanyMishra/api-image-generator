document.addEventListener('DOMContentLoaded', () => {
  // ...existing code from frontend/imageGen.js...
  async function fetchFromUnsplash(query) {
    try {
      const response = await fetch('/api/unsplash', {
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
      const response = await fetch('/api/pixabay', {
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
