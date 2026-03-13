const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log('Starting backend server...');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Open-source fabric classification using TensorFlow.js
const classifyFabric = async (imageBuffer) => {
  try {
    console.log('Classifying fabric with image buffer size:', imageBuffer.length);
    
    // Mock open-source model classification
    // In production, this would use TensorFlow.js MobileNet or similar
    const fabricTypes = ['cotton', 'polyester', 'wool', 'silk', 'linen', 'nylon', 'rayon'];
    const recyclingMethods = {
      'cotton': 'Mechanical recycling (shredding, re-spinning) and chemical recycling (dissolving pulp)',
      'polyester': 'Mechanical recycling into polyester fibers or chemical recycling into PET pellets',
      'wool': 'Mechanical recycling into wool insulation or composting for natural fibers',
      'silk': 'Mechanical recycling into silk fibers or composting for natural fibers',
      'linen': 'Mechanical recycling into linen fibers or composting for natural fibers',
      'nylon': 'Mechanical recycling into nylon fibers or chemical recycling into new polymers',
      'rayon': 'Mechanical recycling into rayon fibers or chemical recycling into regenerated fibers'
    };
    
    // Simulate model prediction with some randomness
    const randomIndex = Math.floor(Math.random() * fabricTypes.length);
    const fabricType = fabricTypes[randomIndex];
    const confidence = 0.75 + (Math.random() * 0.20); // 0.75-0.95 range
    
    return {
      fabric_type: fabricType,
      recycling_method: recyclingMethods[fabricType],
      confidence: Math.min(confidence, 0.98),
      description: `${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)} is a ${fabricType === 'cotton' || fabricType === 'wool' || fabricType === 'silk' || fabricType === 'linen' ? 'natural' : 'synthetic'} fiber that can be effectively recycled through various methods.`,
      tips: [
        "Check fabric care labels before washing",
        "Consider donating usable fabrics",
        "Research local recycling options"
      ]
    };
  } catch (error) {
    console.error('Classification error:', error);
    return {
      fabric_type: "Unknown",
      recycling_method: "Standard recycling",
      confidence: 0.5,
      description: `Classification error: ${error.message}`,
      tips: [
        "Check fabric care labels before washing",
        "Consider donating usable fabrics",
        "Research local recycling options"
      ]
    };
  }
};

// Fabric classification endpoint
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Received image:', req.file.originalname);
    console.log('Image size:', req.file.size);
    console.log('Image type:', req.file.mimetype);

    const result = await classifyFabric(req.file.buffer);
    
    res.json({
      success: true,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ 
      error: 'Classification failed',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!',
    timestamp: new Date().toISOString(),
    open_source_model: true,
    model_type: 'TensorFlow.js Mock'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend test endpoint working!',
    timestamp: new Date().toISOString(),
    open_source_model: true,
    no_api_keys: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🌱 Using open-source model - no API keys needed!`);
});
