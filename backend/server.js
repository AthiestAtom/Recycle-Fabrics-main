const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Environment variable for Gemini API
const GEMINI_API_KEY = process.env.RECYCLE_FABRIC || 'AIzaSyBpPDgjbxTZ-N_As3dcZJ-yitxkyAQQGyA';

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware with CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://localhost:5173', 'https://recycle-fabrics-main.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import local CNN model if available
let SimpleFabricModel;
try {
  const modelModule = require('./models/working-model');
  SimpleFabricModel = modelModule.SimpleFabricModel;
} catch (e) {
  console.log('Local model not found or failed to load, will use Gemini only');
}

let fabricClassifier = null;

async function initializeModel() {
  if (SimpleFabricModel) {
    try {
      fabricClassifier = new SimpleFabricModel();
      await fabricClassifier.initialize();
      console.log('✅ Local CNN model initialized');
    } catch (error) {
      console.error('❌ Failed to initialize local model:', error);
    }
  }
}

// Gemini Classification Logic
const classifyWithGemini = async (imageBuffer) => {
  try {
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';

    const response = await fetch(\https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\\, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Analyze this fabric image and classify it. Return a JSON response with: fabric_type, recycling_method, confidence (0-1), and description.',
            inline_data: { mime_type: mimeType, data: base64Image }
          }]
        })
      })
    });

    if (!response.ok) throw new Error(\Gemini API error: \\);
    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const geminiText = data.candidates[0].content.parts[0].text;
      const jsonMatch = geminiText.match(/\\{[^}]*\\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          material: parsed.fabric_type || 'Unknown',
          confidence: parsed.confidence || 0.8,
          recyclable: true,
          biodegradable: true,
          guidance: parsed.recycling_method || 'Standard recycling',
          tips: ['Check labels', 'Consider donating'],
          environmental_impact: parsed.description || 'AI analysis'
        };
      }
    }
    throw new Error('Invalid Gemini response');
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
};

app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file' });

    let result = null;

    // 1. Try Local Model first if available
    if (fabricClassifier) {
      try {
        result = await fabricClassifier.classify(req.file.buffer);
        console.log('✅ Classified with local model:', result.material);
      } catch (e) {
        console.error('Local model classification failed:', e);
      }
    }

    // 2. Try Gemini if local fails or not available
    if (!result) {
      result = await classifyWithGemini(req.file.buffer);
      if (result) console.log('✅ Classified with Gemini:', result.material);
    }

    // 3. Fallback
    if (!result) {
      result = {
        material: 'Cotton',
        confidence: 0.7,
        recyclable: true,
        biodegradable: true,
        guidance: 'Standard recycling',
        tips: ['Check labels', 'Consider donating'],
        environmental_impact: 'AI service temporarily unavailable'
      };
      console.log('⚠️ Using fallback classification');
    }

    res.json({
      success: true,
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Classification failed', details: error.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', model_ready: !!fabricClassifier }));

app.listen(PORT, async () => {
  console.log(\🚀 Backend running on port \\);
  await initializeModel();
});
