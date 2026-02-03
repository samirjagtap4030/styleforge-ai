# StyleForge AI - Fashion Image Transformation

A polished, premium UI prototype for AI-powered outfit transformation. Transform any image into stunning editorial fashion looks.

![StyleForge AI](https://via.placeholder.com/800x400?text=StyleForge+AI+Fashion+Transformation)

## ✨ Features

- **Drag & Drop Upload** - Easy image upload with drag and drop support
- **4 Style Presets** - Editorial, Glamour, Avant-Garde, and Minimalist styles
- **Real-time Processing Feedback** - Animated progress indicators
- **Modular AI Integration** - Ready for Stability AI, Claude, or custom API
- **Download Results** - One-click download of transformed images
- **Responsive Design** - Works on desktop and mobile devices
- **Premium UI** - Dark theme with glassmorphism and smooth animations

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari).

> **Note**: Due to ES modules, you may need to use a local server for full functionality.

### Option 2: Local Development Server (Recommended)

Using Python:
```bash
# Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```

Using Node.js:
```bash
# Install serve globally
npm install -g serve

# Run server
serve -s . -l 8080

# Then open: http://localhost:8080
```

Using VS Code:
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 📁 Project Structure

```
ClotheRemoverApp/
├── index.html      # Main HTML structure
├── index.css       # Premium styling with design system
├── app.js          # Application logic with AI service layer
└── README.md       # This file
```

## 🔌 AI Integration Guide

The app is designed with a modular `AIService` layer that makes it easy to plug in real AI APIs.

### Integrating Stability AI (Stable Diffusion)

```javascript
// In app.js, configure the AIService:
AIService.configure({
    endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
    apiKey: 'your-stability-api-key',
    model: 'stable-diffusion-xl-1024-v1-0'
});
```

### Integrating Replicate

```javascript
AIService.configure({
    endpoint: 'https://api.replicate.com/v1/predictions',
    apiKey: 'your-replicate-token',
    model: 'stability-ai/sdxl'
});
```

### Custom Backend API

For production, we recommend wrapping AI calls in your own backend:

```javascript
AIService.configure({
    endpoint: 'https://your-backend.com/api/transform',
    apiKey: 'your-internal-token'
});
```

### Implementing the API Call

Modify the `callRealAPI` method in `app.js`:

```javascript
async callRealAPI(imageBase64, styleConfig, onProgress) {
    onProgress('step1', 'active');
    
    const response = await fetch(this.apiConfig.endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.apiConfig.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: imageBase64,
            prompt: styleConfig.prompt,
            // Add your API-specific parameters
        })
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    onProgress('step4', 'done');
    
    return data.result; // Adjust based on your API response
}
```

## 🎨 Customization

### Adding New Style Presets

In `app.js`, add to the `CONFIG.stylePresets` object:

```javascript
'bohemian': {
    name: 'Bohemian',
    prompt: 'Transform into a bohemian-chic outfit with flowing fabrics, earthy tones, and artistic layering...',
    emphasis: ['flowing', 'artistic', 'natural']
}
```

### Modifying the Color Theme

Edit CSS variables in `index.css`:

```css
:root {
    --color-primary: #your-color;
    --color-accent: #your-accent;
    --gradient-primary: linear-gradient(...);
}
```

## 🔒 Content Guidelines

This application is designed for **fashion image transformation only**:

- ✅ Outfit replacement with elegant, editorial styles
- ✅ Fashion-forward designs with tasteful necklines
- ✅ High-end photoshoot aesthetics
- ✅ Adults 18+ only

**Not supported:**
- ❌ Nudity or clothing removal
- ❌ Explicit or inappropriate content
- ❌ Content involving minors

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - ES6+ modules, async/await
- **No dependencies** - Zero external libraries required

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

This project is for educational and demonstration purposes.

---

Made with ✨ by StyleForge AI Team
