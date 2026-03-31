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

// Import Vision Transformer model
const { FabricViTModel } = require('./models/model');

// Initialize fabric classifier
let fabricClassifier = null;

// Initialize model on startup
async function initializeModel() {
  try {
    console.log('=== INITIALIZING FABRIC CLASSIFICATION MODEL ===');
    
    // Use Vision Transformer model
    fabricClassifier = new FabricViTModel({
      image_size: 224,
      patch_size: 16,
      hidden_size: 128,
      num_hidden_layers: 4,
      num_attention_heads: 4,
      intermediate_size: 256,
      layer_norm_eps: 1e-6,
      num_fabric_classes: 7,
      fabric_classes: ['cotton', 'polyester', 'wool', 'silk', 'linen', 'nylon', 'rayon']
    });
    await fabricClassifier.buildModel();
    console.log('✅ Using Vision Transformer model');
    console.log('✅ Fabric classification model initialized successfully');
    console.log(`📊 Model supports ${fabricClassifier.config.num_fabric_classes} fabric classes: ${fabricClassifier.config.fabric_classes.join(', ')}`);
    console.log(`🖼️ Input image size: ${fabricClassifier.config.image_size}x${fabricClassifier.config.image_size}`);
    console.log(`🔧 Model architecture: ${fabricClassifier.constructor.name}`);
    
  } catch (error) {
    console.error('❌ Failed to initialize fabric classification model:', error);
    process.exit(1); // Exit if model fails to load - no fallbacks
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

// Fabric classification endpoint - Real deep learning implementation only
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    console.log('=== CLASSIFICATION REQUEST START ===');
    console.log('Headers:', req.headers);
    console.log('File object:', req.file);
    
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('=== FABRIC CLASSIFICATION REQUEST ===');
    console.log('Received image:', req.file.originalname);
    console.log('Image size:', req.file.size);
    console.log('Image type:', req.file.mimetype);
    
    // Check if model is loaded
    if (!fabricClassifier) {
      console.log('❌ Model not initialized');
      return res.status(500).json({ 
        error: 'Deep learning model not initialized',
        message: 'Fabric classification model failed to load'
      });
    }
    
    console.log('🧠 Processing image with deep learning model...');
    console.log('Image buffer length:', req.file.buffer.length);
    console.log('Image buffer type:', typeof req.file.buffer);
    
    // Convert buffer to image for classification
    const imageBuffer = req.file.buffer;
    
    // Classify fabric using our deep learning model
    const result = await fabricClassifier.classifyFabric(imageBuffer);
    
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
        type: fabricClassifier.constructor.name,
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
  try {
    console.log(`🚀 Backend server starting on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    
    // Initialize deep learning model
    await initializeModel();
    
    if (fabricClassifier) {
      console.log(`🤖 Fabric classification server ready with deep learning model!`);
      console.log(`📊 Model type: ${fabricClassifier.constructor.name}`);
      console.log(`🔧 Backend ready to serve requests`);
    } else {
      console.log('⚠️ Server started but model initialization failed');
      console.log('⚠️ Server will run in degraded mode');
    }
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
});
