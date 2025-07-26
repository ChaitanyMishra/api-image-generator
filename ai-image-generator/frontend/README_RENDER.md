# SnapFetch – Render Hosting Instructions

## How to Deploy on Render

1. **Push your code to GitHub.**
2. **Go to [Render.com](https://render.com/)** and create a new Static Site.
3. **Connect your GitHub repo.**
4. **Set the root directory to:**
   ```
   text-to-image/ai-image-generator/frontend
   ```
5. **No build command needed.**
6. **No start command needed.**
7. **Render will use `static.json` for client-side routing.**
8. **Your site will be live at the provided Render URL.**

---

## API Notes
- If you have a backend (Node.js/Express), deploy it separately as a Web Service on Render.
- Update your frontend API URLs to point to the Render backend service URL (not `localhost`).

---

## Troubleshooting
- If you see 404s on refresh, make sure `static.json` is present and correct.
- For CORS/API issues, check your backend deployment and CORS settings.

---

**Made by Chaitanya Mishra**
