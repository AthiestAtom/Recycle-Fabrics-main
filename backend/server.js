require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Environment variable for Gemini API
const GEMINI_API_KEY = process.env.RECYCLE_FABRIC;
if (!GEMINI_API_KEY) {
  throw new Error("RECYCLE_FABRIC API key not set in environment variables");
}

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      cb(new Error('Unsupported image format. Use JPG, PNG, or WebP.'));
      return;
    }

    cb(null, true);
  },
});

const normalizeConfidence = (confidence) => {
  const parsed = Number(confidence);

  if (!Number.isFinite(parsed)) {
    return 80;
  }

  const asPercent = parsed <= 1 ? parsed * 100 : parsed;
  return Math.max(0, Math.min(100, Math.round(asPercent)));
};

const extractJsonObject = (text) => {
  const fencedJson = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedJson ? fencedJson[1] : text;
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
};

// Gemini Classification Logic
const classifyWithGemini = async (imageBuffer, mimeType) => {
  try {
    const base64Image = imageBuffer.toString('base64');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Analyze this fabric image and classify it. Return a JSON response with: fabric_type, recycling_method, confidence (0-1), and description.',
            inline_data: { mime_type: mimeType, data: base64Image }
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (geminiText) {
      const parsed = extractJsonObject(geminiText);
      return {
        material: parsed?.fabric_type || 'Unknown',
        confidence: normalizeConfidence(parsed?.confidence),
        recyclable: true,
        biodegradable: true,
        guidance: parsed?.recycling_method || 'Standard textile recycling or donation if wearable.',
        tips: ['Check care labels before recycling', 'Donate wearable items', 'Keep textiles clean and dry'],
        environmental_impact: parsed?.description || 'AI analysis'
      };
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

    // Use Gemini API for classification
    let result = await classifyWithGemini(req.file.buffer, req.file.mimetype);
    
    // Fallback if Gemini fails
    if (!result) {
      result = {
        material: 'Cotton',
        confidence: 50,
        recyclable: true,
        biodegradable: true,
        guidance: 'Please try again or contact support.',
        tips: ['Check labels', 'Consider donating'],
        environmental_impact: 'AI service temporarily unavailable'
      };
      console.log('Using fallback classification');
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

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Image is too large. Maximum upload size is 10MB.' });
  }

  if (error.message?.includes('Unsupported image format')) {
    return res.status(415).json({ error: error.message });
  }

  next(error);
});

app.get('/api/health', (req, res) => res.json({ 
  status: 'OK', 
  model_type: 'Google Gemini 1.5 Flash Vision API',
  model_ready: true 
}));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log('Using Google Gemini API for fabric classification');
});
