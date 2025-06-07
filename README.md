# AI Image Generator

A modern web application that generates images from text descriptions using AI technology.

## Features

- 🎨 Text-to-Image Generation
- 🎯 User-friendly Interface
- 🌈 Modern Glassmorphic Design
- 📱 Responsive Layout
- 🔒 Secure API Key Management

## Tech Stack

- Frontend:
  - HTML5
  - CSS3 (with Custom Properties)
  - JavaScript (Vanilla)
  - Glassmorphic UI Design

- Backend:
  - Node.js
  - Express.js
  - Environment Variables for Security

## Project Structure

```
ai-image-generator/
├── frontend/
│   ├── imageGen.html
│   ├── imageGen.js
│   └── imageGen.css
├── backend/
│   ├── server.js
│   ├── .env
│   └── .env.example
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd text-to-image/ai-image-generator
   ```

2. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Add your API keys and other configuration

4. Start the Backend Server:
   ```bash
   npm start
   ```

5. Open the Frontend:
   - Navigate to the `frontend` directory
   - Open `imageGen.html` in a web browser

## Features in Detail

### Image Generation
- Input your text description
- Choose image settings like size and style
- Generate multiple variations
- View generated images in a responsive grid

### UI/UX
- Clean and modern interface
- Glassmorphic design elements
- Responsive layout for all devices
- Smooth animations and transitions

### Security
- Backend proxy for API key protection
- Environment variable configuration
- Secure API endpoints

## Contributing

Feel free to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
