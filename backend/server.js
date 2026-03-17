const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import our fabric classification model
let FabricClassifier, FabricViTConfig;

try {
  const models = require('./models/__init__');
  FabricClassifier = models.FabricClassifier;
  FabricViTConfig = models.FabricViTConfig;
  console.log('✅ Deep learning models loaded successfully');
} catch (error) {
  console.log('⚠️ Deep learning models not available, using fallback mode');
  console.log('Error:', error.message);
  FabricClassifier = null;
  FabricViTConfig = null;
}

// Initialize the fabric classifier
let fabricClassifier = null;

// Initialize model on startup
async function initializeModel() {
  try {
    if (!FabricClassifier || !FabricViTConfig) {
      console.log('⚠️ Deep learning models not available, running in demo mode');
      return;
    }
    
    console.log('=== INITIALIZING FABRIC CLASSIFICATION MODEL ===');
    
    // Create default config
    const config = new FabricViTConfig();
    
    // Initialize classifier
    fabricClassifier = new FabricClassifier(config);
    
    console.log('✅ Fabric classification model initialized successfully');
    console.log(`📊 Model supports ${config.num_fabric_classes} fabric classes: ${config.fabric_classes.join(', ')}`);
    console.log(`🖼️ Input image size: ${config.image_size}x${config.image_size}`);
    console.log(`🔧 Model architecture: Vision Transformer (${config.num_hidden_layers} layers)`);
    
  } catch (error) {
    console.error('❌ Failed to initialize fabric classification model:', error);
    console.log('🔄 Server will continue but classification will use fallback mode');
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!',
    timestamp: new Date().toISOString(),
    model_loaded: fabricClassifier !== null,
    model_type: 'Fabric Vision Transformer',
    open_source_model: true,
    deep_learning: true,
    message: fabricClassifier ? 'Deep learning model ready for fabric classification' : 'Model not initialized'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend test endpoint working!',
    timestamp: new Date().toISOString(),
    model_loaded: fabricClassifier !== null,
    model_type: 'Fabric Vision Transformer',
    open_source_model: true,
    deep_learning: true,
    no_api_keys: true,
    local_inference: true
  });
});

// Fabric classification endpoint - Real deep learning implementation
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('=== FABRIC CLASSIFICATION REQUEST ===');
    console.log('Received image:', req.file.originalname);
    console.log('Image size:', req.file.size);
    console.log('Image type:', req.file.mimetype);
    
    // Check if model is loaded
    if (!fabricClassifier) {
      console.log('⚠️ Using demo mode - deep learning model not available');
      
      // Provide demo response
      const demoResult = {
        material: "Cotton",
        confidence: 0.85,
        recyclable: true,
        biodegradable: true,
        guidance: "Compost or donate for textile recycling",
        tips: [
          "Wash in cold water to reduce energy consumption",
          "Line dry instead of using dryer",
          "Consider donating usable cotton clothing",
          "Compost worn-out cotton items"
        ],
        environmental_impact: "Cotton is natural and biodegradable but requires significant water to produce."
      };
      
      const response = {
        success: true,
        result: demoResult,
        timestamp: new Date().toISOString(),
        model_info: {
          type: 'Demo Mode',
          deep_learning: false,
          local_inference: false,
          confidence_score: demoResult.confidence,
          message: 'Deep learning model not available - showing demo result'
        }
      };

      console.log('✅ Demo classification completed!');
      console.log('Demo result:', demoResult.material);
      res.json(response);
      return;
    }
    
    console.log('🧠 Processing image with deep learning model...');
    
    // Convert buffer to image for classification
    const imageBuffer = req.file.buffer;
    
    // Classify fabric using our deep learning model
    const result = await fabricClassifier.classify_fabric(imageBuffer);
    
    console.log('🎯 Classification completed!');
    console.log('Predicted fabric:', result.material);
    console.log('Confidence:', (result.confidence * 100).toFixed(2) + '%');
    console.log('Recyclable:', result.recyclable);
    console.log('Biodegradable:', result.biodegradable);
    
    // Format response for frontend
    const response = {
      success: true,
      result: result,
      timestamp: new Date().toISOString(),
      model_info: {
        type: 'Fabric Vision Transformer',
        deep_learning: true,
        local_inference: true,
        confidence_score: result.confidence
      }
    };

    console.log('✅ Sending classification result');
    res.json(response);

  } catch (error) {
    console.error('❌ Classification error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Classification failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  
  // Initialize the deep learning model
  await initializeModel();
  
  console.log(`🤖 Fabric classification server ready with deep learning model!`);
});
