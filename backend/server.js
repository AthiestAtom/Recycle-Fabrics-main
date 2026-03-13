const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
});

// Simple fabric classification endpoint
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Received image:', req.file.originalname);
    console.log('Image size:', req.file.size);

    // Simple mock response for testing
    const mockResult = {
      success: true,
      result: {
        fabric_type: "cotton",
        recycling_method: "Mechanical recycling (shredding, re-spinning)",
        confidence: 0.85,
        description: "Cotton is a natural fiber that can be effectively recycled.",
        tips: [
          "Check fabric care labels before washing",
          "Consider donating usable fabrics",
          "Research local recycling options"
        ]
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(mockResult);

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
    model_type: 'Simple Mock Model',
    model_loaded: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend running on port ${PORT}`);
  console.log(`📊 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔍 Classification: http://localhost:${PORT}/api/classify-fabric`);
});
