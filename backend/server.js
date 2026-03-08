const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Simple environment variable loading
const GEMINI_API_KEY = process.env.RECYCLE_FABRIC || 'AIzaSyBpPDgjbxTZ-N_As3dcZJ-yitxkyAQQGyA';

console.log('Starting backend server...');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('API Key configured:', !!GEMINI_API_KEY);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fabric classification endpoint
const classifyFabric = async (imageBuffer) => {
  try {
    console.log('Classifying fabric with image buffer size:', imageBuffer.length);
    
    // For now, return a mock response to test the backend
    return {
      fabric_type: "Cotton",
      recycling_method: "Composting",
      confidence: 0.85,
      description: "This is a cotton fabric that can be composted or recycled into new textiles."
    };
    
    // TODO: Add actual Gemini API call later
    /*
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Analyze this fabric image and classify it. Return a JSON response with: fabric_type, recycling_method, confidence (0-1), and description.",
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }]
        }]
      })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    */
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
};

// API Routes
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    console.log('Received fabric classification request');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await classifyFabric(req.file.buffer);
    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify fabric' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!',
    timestamp: new Date().toISOString(),
    api_key_configured: !!GEMINI_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});
