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
    console.log('Image buffer type:', typeof imageBuffer);
    
    // Convert image buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    
    console.log('Base64 image length:', base64Image.length);
    console.log('API Key exists:', !!GEMINI_API_KEY);
    
    // Call Google Gemini API
    console.log('Making API call to Gemini...');
    
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
    
    console.log('Gemini response status:', response.status);
    console.log('Gemini response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Gemini error response:', errorText);
      console.log('Response headers on error:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Gemini response data type:', typeof data);
    console.log('Gemini response data:', data);
    
    // Handle different response formats
    if (!data || typeof data !== 'object') {
      console.log('Invalid Gemini response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.log('No candidates in Gemini response:', data);
      throw new Error('No candidates returned from Gemini API');
    }
    
    if (!data.candidates[0]?.content?.parts || !Array.isArray(data.candidates[0]?.content?.parts) || data.candidates[0]?.content?.parts?.length === 0) {
      console.log('No parts in Gemini response:', data.candidates[0]?.content);
      throw new Error('No parts returned from Gemini API');
    }
    
    // Return the raw text response from Gemini
    const geminiText = data.candidates[0]?.content?.parts?.[0]?.text || "Unable to classify this fabric.";
    console.log('Gemini raw text:', geminiText);
    
    // Try to parse as JSON, fallback to text if parsing fails
    let classificationData;
    try {
      classificationData = JSON.parse(geminiText);
    } catch (parseError) {
      console.log('Failed to parse Gemini response as JSON:', parseError);
      console.log('Response that failed to parse:', geminiText);
      classificationData = {
        fabric_type: "Unknown",
        recycling_method: "Standard recycling",
        confidence: 0.5,
        description: geminiText
      };
    }
    
    // Return classification data
    return {
      fabric_type: classificationData.fabric_type || "Unknown",
      recycling_method: classificationData.recycling_method || "Standard recycling",
      confidence: classificationData.confidence || 0.5,
      description: classificationData.description || "Unable to classify this fabric.",
      tips: [
        "Check fabric care labels before washing",
        "Consider donating usable fabrics",
        "Research local recycling options"
      ]
    };
    
  } catch (error) {
    console.error('Classification error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// API Routes
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    console.log('Received fabric classification request');
    console.log('File details:', {
      size: req.file?.size,
      mimetype: req.file?.mimetype,
      originalname: req.file?.originalname
    });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await classifyFabric(req.file.buffer);
    console.log('Classification result:', result);
    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to classify fabric',
      details: error.message,
      stack: error.stack
    });
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

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend test endpoint working!',
    timestamp: new Date().toISOString(),
    api_key_configured: !!GEMINI_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
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
