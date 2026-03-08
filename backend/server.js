const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables first
try {
  require('dotenv').config();
} catch (error) {
  console.log('Error loading .env:', error);
  // Continue without environment variables
}

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not configured in environment variables');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Real fabric classification using Google Gemini API
const classifyFabric = async (imageBuffer) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Convert image buffer to base64
  const base64Image = imageBuffer.toString('base64');
  const mimeType = 'image/jpeg'; // You might want to detect this dynamically

  const systemPrompt = `You are an expert textile material classifier. Given an image of a fabric or textile item, identify the material type and provide recycling guidance.

You MUST respond by calling the classify_fabric function with accurate information. Identify one primary material from these categories: Cotton, Denim, Polyester, Silk, Wool, Leather, Nylon, Linen, or Mixed/Blended.

Be specific and helpful with recycling guidance. Consider the material's properties for accurate environmental impact assessment.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt + "\n\nPlease analyze this fabric/textile image and classify the material type. Provide recycling guidance." },
            { 
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        },
        tools: [{
          functionDeclarations: [{
            name: "classify_fabric",
            description: "Classify the fabric material and provide recycling guidance",
            parameters: {
              type: "object",
              properties: {
                material: {
                  type: "string",
                  description: "The identified fabric material (e.g., Cotton, Denim, Polyester, Silk, Wool, Leather, Nylon, Linen, Mixed/Blended)"
                },
                confidence: {
                  type: "number",
                  description: "Confidence level of the classification (0-100)"
                },
                recyclable: {
                  type: "boolean",
                  description: "Whether the material is recyclable"
                },
                biodegradable: {
                  type: "boolean",
                  description: "Whether the material is biodegradable"
                },
                guidance: {
                  type: "string",
                  description: "Detailed recycling or disposal guidance for this material"
                },
                tips: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-4 actionable tips for recycling or repurposing this material"
                },
                environmental_impact: {
                  type: "string",
                  description: "Brief description of the environmental impact of this material"
                }
              },
              required: ["material", "confidence", "recyclable", "biodegradable", "guidance", "tips", "environmental_impact"]
            }
          }]
        }],
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: ["classify_fabric"]
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (!functionCall?.args) {
      throw new Error("No classification result returned from Gemini");
    }

    return functionCall.args;
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
};

// Routes
app.post('/api/classify-fabric', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Received image for classification:', req.file.originalname);
    
    // Classify the fabric
    const result = await classifyFabric(req.file.buffer);
    
    console.log('Classification result:', result.material);
    
    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify fabric' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fabric classification backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Fabric classification backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
