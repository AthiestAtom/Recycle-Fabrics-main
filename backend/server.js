require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Environment variable for Gemini API
const GEMINI_API_KEY = process.env.RECYCLE_FABRIC || process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Gemini API key not set. Use RECYCLE_FABRIC or GEMINI_API_KEY.");
}

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const GEMINI_API_VERSION = process.env.GEMINI_API_VERSION || 'v1';
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Middleware with CORS
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'https://recycle-fabrics-main.onrender.com',
    'https://athiestatom.github.io'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const appData = {
  pickups: [],
  quotes: [],
  partners: [],
  listings: [],
  bids: [],
};

const addRecord = (collection, payload) => {
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'received',
    createdAt: new Date().toISOString(),
    ...payload,
  };
  appData[collection].unshift(record);
  appData[collection] = appData[collection].slice(0, 100);
  return record;
};

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

    const response = await fetch(`https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Analyze this fabric image and classify it. Return only JSON with: fabric_type, recycling_method, confidence (0-1), and description.',
            inline_data: { mime_type: mimeType, data: base64Image }
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
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
    console.error('Gemini error:', error.message);
    return { error: error.message };
  }
};

app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file' });

    // Use Gemini API for classification
    const geminiResult = await classifyWithGemini(req.file.buffer, req.file.mimetype);
    let result = geminiResult;
    
    // Fallback if Gemini fails
    if (!result || result.error) {
      result = {
        material: 'Cotton',
        confidence: 50,
        recyclable: true,
        biodegradable: true,
        guidance: 'Please try again or contact support.',
        tips: ['Check labels', 'Consider donating'],
        environmental_impact: 'AI service temporarily unavailable',
        model_error: result?.error || 'Unknown Gemini failure'
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
  model_type: `Google Gemini Vision API (${GEMINI_MODEL})`,
  api_version: GEMINI_API_VERSION,
  model_ready: true 
}));

app.get('/api/pickups', (req, res) => res.json({ pickups: appData.pickups }));
app.post('/api/pickups', (req, res) => {
  const pickup = addRecord('pickups', { ...req.body, status: 'Scheduled' });
  res.status(201).json({ success: true, pickup });
});

app.get('/api/quotes', (req, res) => res.json({ quotes: appData.quotes }));
app.post('/api/quotes', (req, res) => {
  const quote = addRecord('quotes', req.body);
  res.status(201).json({ success: true, quote });
});

app.get('/api/partners', (req, res) => res.json({ partners: appData.partners }));
app.post('/api/partners', (req, res) => {
  const application = addRecord('partners', { ...req.body, status: 'Pending review' });
  res.status(201).json({ success: true, application });
});

app.get('/api/listings', (req, res) => res.json({ listings: appData.listings }));
app.post('/api/listings', (req, res) => {
  const listing = addRecord('listings', req.body);
  res.status(201).json({ success: true, listing });
});

app.post('/api/bids', (req, res) => {
  const bid = addRecord('bids', req.body);
  res.status(201).json({ success: true, bid });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Using Google Gemini API model ${GEMINI_MODEL}`);
});
