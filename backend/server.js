const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Simple environment variable loading
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBpPDgjbxTZ-N_As3dcZJ-yitxkyAQQGyA';

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
    
    let response;
    let geminiError = null;
    let data = null;
    
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Analyze this fabric image and classify it. Return ONLY a JSON response with these exact keys: fabric_type, recycling_method, confidence (as a decimal between 0 and 1), and description. Do not include any other text.",
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }]
          }]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Gemini error response:', errorText);
        geminiError = new Error(`Gemini API error: ${response.status} - ${errorText}`);
      } else {
        data = await response.json();
        console.log('Gemini response data:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Network or parsing error:', error);
      geminiError = error;
    }
    
    // Return classification data
    if (geminiError) {
      // Fallback to basic classification if Gemini fails
      console.log('Using fallback classification due to Gemini error:', geminiError.message);
      return {
        fabric_type: "Unknown",
        recycling_method: "Standard recycling",
        confidence: 0.3,
        description: `AI service error: ${geminiError.message}. Please try again later.`,
        tips: [
          "Check fabric care labels before washing",
          "Consider donating usable fabrics",
          "Research local recycling options"
        ]
      };
    }
    
    // Parse Gemini response if successful
    let classificationData;
    try {
      if (data && typeof data === 'object' && data.candidates && Array.isArray(data.candidates) && data.candidates[0]?.content?.parts && Array.isArray(data.candidates[0]?.content?.parts)) {
        const geminiText = data.candidates[0]?.content?.parts?.[0]?.text || "Unable to classify this fabric.";
        console.log('Gemini raw text:', geminiText);
        
        // Try to extract JSON from the text response - look for complete JSON objects
        const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            classificationData = JSON.parse(jsonMatch[0]);
            console.log('Parsed classification data:', classificationData);
            
            // Validate required fields
            if (!classificationData.fabric_type || !classificationData.recycling_method || classificationData.confidence === undefined) {
              throw new Error('Missing required fields in Gemini response');
            }
            
            // Ensure confidence is a valid number between 0 and 1
            if (typeof classificationData.confidence !== 'number' || classificationData.confidence < 0 || classificationData.confidence > 1) {
              console.log('Invalid confidence value, defaulting to 0.5');
              classificationData.confidence = 0.5;
            }
          } catch (parseError) {
            console.log('Failed to parse JSON from Gemini response:', parseError);
            classificationData = {
              fabric_type: "Unknown",
              recycling_method: "Standard recycling",
              confidence: 0.4,
              description: `AI response parsing failed. Raw response: ${geminiText.substring(0, 200)}...`
            };
          }
        } else {
          console.log('Gemini response is not JSON format, using text as description');
          classificationData = {
            fabric_type: "Unknown",
            recycling_method: "Standard recycling",
            confidence: 0.4,
            description: geminiText
          };
        }
      } else {
        throw new Error('Invalid Gemini response structure');
      }
    } catch (parseError) {
      console.log('Failed to process Gemini response:', parseError);
      classificationData = {
        fabric_type: "Unknown",
        recycling_method: "Standard recycling",
        confidence: 0.3,
        description: `AI processing failed: ${parseError.message}`
      };
    }
    
    // Return classification data
    return {
      fabric_type: classificationData?.fabric_type || "Unknown",
      recycling_method: classificationData?.recycling_method || "Standard recycling",
      confidence: classificationData?.confidence || 0.5,
      description: classificationData?.description || "Unable to classify this fabric.",
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

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  console.log('=== API Key Test ===');
  console.log('Environment variable GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
  console.log('All environment variables:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
  
  res.json({ 
    message: 'Backend test endpoint working!',
    timestamp: new Date().toISOString(),
    api_key_configured: !!process.env.GEMINI_API_KEY,
    api_key_value: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT_SET',
    env_vars_count: Object.keys(process.env).filter(key => key.includes('GEMINI')).length
  });
});

// Test API key validity
app.get('/api/check-key', async (req, res) => {
  try {
    console.log('Checking API key validity...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API key check failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Available models:', JSON.stringify(data, null, 2));
    
    res.json({
      success: true,
      message: 'API key is valid',
      models_count: data.models?.length || 0,
      available_models: data.models?.map(m => m.name) || []
    });
  } catch (error) {
    console.error('API key check error:', error);
    res.status(500).json({
      success: false,
      message: 'API key check failed',
      error: error.message
    });
  }
});

// Test Gemini API without image
app.get('/api/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini API without image...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Return ONLY a JSON response with these exact keys: fabric_type, recycling_method, confidence (as a decimal between 0 and 1), and description. For this test, classify 'cotton' fabric."
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Test Gemini response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      const geminiText = data.candidates[0].content.parts[0].text;
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const classificationData = JSON.parse(jsonMatch[0]);
        res.json({
          success: true,
          message: 'Gemini API test successful',
          result: classificationData,
          raw_response: geminiText
        });
      } else {
        res.json({
          success: false,
          message: 'Could not parse JSON from Gemini response',
          raw_response: geminiText
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Invalid Gemini response structure',
        data: data
      });
    }
  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({
      success: false,
      message: 'Gemini API test failed',
      error: error.message
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
