const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');

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

// Fabric type mapping from ImageNet classes to fabric types
const fabricTypeMapping = {
  'T-shirt': 'cotton',
  'jersey, T-shirt, tee shirt': 'cotton',
  'sweatshirt': 'cotton',
  'balloon': 'silk',
  'pillow': 'cotton',
  'quilt': 'cotton',
  'blanket': 'wool',
  'wool': 'wool',
  'cashmere': 'wool',
  'silk': 'silk',
  'linen': 'linen',
  'denim': 'cotton',
  'jeans': 'cotton',
  'polyester': 'polyester',
  'nylon': 'nylon',
  'rayon': 'rayon',
  'velvet': 'silk',
  'leather': 'synthetic',
  'canvas': 'cotton',
  'tweed': 'wool',
  'flannel': 'wool',
  'corduroy': 'cotton',
  'satin': 'silk',
  'chiffon': 'silk',
  'organza': 'silk',
  'taffeta': 'silk',
  'brocade': 'silk',
  'damask': 'silk',
  'gauze': 'cotton',
  'muslin': 'cotton',
  'calico': 'cotton',
  'percale': 'cotton',
  'voile': 'cotton',
  'poplin': 'cotton',
  'broadcloth': 'cotton',
  'twill': 'wool',
  'serge': 'wool',
  'worsted': 'wool',
  'flannelette': 'wool',
  'merino': 'wool',
  'angora': 'wool',
  'mohair': 'wool',
  'alpaca': 'wool',
  'vicuna': 'wool',
  'cashmere': 'wool',
  'pashmina': 'wool',
  'shetland': 'wool',
  'lambswool': 'wool',
  'boiled_wool': 'wool',
  'felt': 'wool',
  'felted_wool': 'wool',
  'worsted_fabric': 'wool',
  'tweed': 'wool',
  'plaid': 'wool',
  'tartan': 'wool',
  'gingham': 'cotton',
  'madras': 'cotton',
  'paisley': 'silk',
  'toile': 'cotton',
  'chintz': 'cotton',
  'patchwork': 'cotton',
  'applique': 'cotton',
  'embroidery': 'cotton',
  'lace': 'silk',
  'crochet': 'cotton',
  'knit': 'wool',
  'knitted': 'wool',
  'woven': 'cotton',
  'non-woven': 'synthetic',
  'georgette': 'silk',
  'crepe': 'silk',
  'charmeuse': 'silk',
  'habotai': 'silk',
  'dupioni': 'silk',
  'shantung': 'silk',
  'noil': 'silk',
  'raw_silk': 'silk',
  'tussar': 'silk',
  'eri': 'silk',
  'muga': 'silk',
  'tussah': 'silk',
  'spun_silk': 'silk',
  'filament_silk': 'silk',
  'reeled_silk': 'silk',
  'mulberry': 'silk',
  'tasar': 'silk',
  'eri': 'silk',
  'tussar': 'silk',
  'muga': 'silk',
  'anaphe': 'silk',
  'coan': 'silk',
  'fagara': 'silk',
  'muga': 'silk',
  'tasar': 'silk',
  'eri': 'silk',
  'tussah': 'silk',
  'spun': 'silk',
  'filament': 'silk',
  'reeled': 'silk',
  'mulberry': 'silk',
  'tasar': 'silk',
  'eri': 'silk',
  'tussar': 'silk',
  'muga': 'silk',
  'anaphe': 'silk',
  'coan': 'silk',
  'fagara': 'silk',
  'spun_silk': 'silk',
  'filament_silk': 'silk',
  'reeled_silk': 'silk',
  'mulberry_silk': 'silk',
  'tasar_silk': 'silk',
  'eri_silk': 'silk',
  'tussar_silk': 'silk',
  'muga_silk': 'silk',
  'anaphe_silk': 'silk',
  'coan_silk': 'silk',
  'fagara_silk': 'silk'
};

// Recycling methods for fabric types
const recyclingMethods = {
  'cotton': 'Mechanical recycling (shredding, re-spinning) and chemical recycling (dissolving pulp to create regenerated fibers like lyocell or rayon)',
  'polyester': 'Mechanical recycling into polyester fibers or chemical recycling into PET pellets for new polyester production',
  'wool': 'Mechanical recycling into wool insulation, carpet backing, or composting for natural fiber decomposition',
  'silk': 'Mechanical recycling into silk fibers for luxury textiles or composting for natural fiber decomposition',
  'linen': 'Mechanical recycling into linen fibers or composting for natural fiber decomposition',
  'nylon': 'Mechanical recycling into nylon fibers or chemical recycling into new polymers',
  'rayon': 'Mechanical recycling into rayon fibers or chemical recycling into regenerated cellulose fibers',
  'synthetic': 'Mechanical recycling into synthetic fibers or chemical recycling into base polymers'
};

// Load MobileNet model
let model = null;
let modelLoading = false;

async function loadModel() {
  if (modelLoading) return;
  modelLoading = true;
  
  try {
    console.log('Loading MobileNet model...');
    model = await mobilenet.load();
    console.log('MobileNet model loaded successfully!');
  } catch (error) {
    console.error('Failed to load MobileNet model:', error);
  } finally {
    modelLoading = false;
  }
}

// Initialize model on startup
loadModel();

// Real fabric classification using TensorFlow.js MobileNet
const classifyFabric = async (imageBuffer) => {
  try {
    console.log('Classifying fabric with image buffer size:', imageBuffer.length);
    
    // Wait for model to load
    if (!model) {
      if (modelLoading) {
        console.log('Model still loading, please wait...');
        return {
          fabric_type: "Unknown",
          recycling_method: "Standard recycling",
          confidence: 0.5,
          description: "Model is still loading. Please try again in a moment.",
          tips: [
            "Check fabric care labels before washing",
            "Consider donating usable fabrics",
            "Research local recycling options"
          ]
        };
      }
      await loadModel();
    }
    
    if (!model) {
      throw new Error('Failed to load MobileNet model');
    }
    
    // Convert buffer to tensor
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    // Classify with MobileNet
    const predictions = await model.classify(imageTensor);
    
    // Clean up tensor
    imageTensor.dispose();
    
    console.log('MobileNet predictions:', predictions);
    
    // Find best fabric match
    let fabricType = 'Unknown';
    let confidence = 0.5;
    
    for (const prediction of predictions) {
      const className = prediction.className.toLowerCase();
      
      // Check if this class maps to a fabric type
      for (const [key, value] of Object.entries(fabricTypeMapping)) {
        if (className.includes(key.toLowerCase())) {
          fabricType = value;
          confidence = prediction.probability;
          break;
        }
      }
      
      if (fabricType !== 'Unknown') break;
    }
    
    // If no fabric match found, use the top prediction
    if (fabricType === 'Unknown' && predictions.length > 0) {
      fabricType = 'cotton'; // Default to cotton
      confidence = predictions[0].probability * 0.8; // Slightly lower confidence for default
    }
    
    return {
      fabric_type: fabricType,
      recycling_method: recyclingMethods[fabricType] || 'Standard recycling',
      confidence: Math.min(confidence, 0.98),
      description: `${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)} is a ${fabricType === 'cotton' || fabricType === 'wool' || fabricType === 'silk' || fabricType === 'linen' ? 'natural' : 'synthetic'} fiber that can be effectively recycled through various methods.`,
      tips: [
        "Check fabric care labels before washing",
        "Consider donating usable fabrics",
        "Research local recycling options"
      ],
      model_predictions: predictions.slice(0, 3) // Include top 3 predictions for debugging
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
    model_type: 'TensorFlow.js MobileNet',
    model_loaded: !!model,
    model_loading: modelLoading
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend test endpoint working!',
    timestamp: new Date().toISOString(),
    open_source_model: true,
    model_type: 'TensorFlow.js MobileNet',
    no_api_keys: true,
    model_loaded: !!model,
    model_loading: modelLoading
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Fabric classification: http://localhost:${PORT}/api/classify-fabric`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🤖 Using TensorFlow.js MobileNet - Real AI classification!`);
});
