/**
 * Fabric Classification Pipeline
 * Complete TensorFlow.js implementation for fabric classification
 */

const tf = require('@tensorflow/tfjs-node');
const { FabricViTConfig } = require('./config');
const { FabricViTModel } = require('./model');
const { FabricImageProcessor } = require('./processor');

class FabricClassifier {
  constructor(config = null, modelPath = null) {
    // Load or create config
    this.config = config || new FabricViTConfig();
    
    // Initialize model
    this.model = new FabricViTModel(this.config);
    
    // Initialize processor
    this.processor = new FabricImageProcessor(this.config);
    
    // Load model weights if provided
    this.modelPath = modelPath;
    
    console.log('FabricClassifier initialized');
    console.log(`Model supports ${this.config.num_fabric_classes} fabric classes: ${this.config.fabric_classes.join(', ')}`);
    console.log(`Input image size: ${this.config.image_size}x${this.config.image_size}`);
  }
  
  async loadModel(modelPath) {
    try {
      console.log(`Loading model from ${modelPath}`);
      await this.model.getModel().loadModel(modelPath);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error(`Failed to load model: ${error.message}`);
      throw error;
    }
  }
  
  async saveModel(savePath) {
    try {
      console.log(`Saving model to ${savePath}`);
      await this.model.getModel().save(savePath);
      console.log('Model saved successfully');
    } catch (error) {
      console.error(`Failed to save model: ${error.message}`);
      throw error;
    }
  }
  
  async preprocessImage(imageBuffer) {
    // Validate image
    this.processor.validateImage(imageBuffer);
    
    // Process image
    const pixelValues = await this.processor.processImage(imageBuffer);
    
    return pixelValues;
  }
  
  async predict(imageBuffer, returnProbabilities = true) {
    try {
      // Preprocess image
      const pixelValues = await this.preprocessImage(imageBuffer);
      
      // Get prediction
      const result = await this.model.classify(pixelValues);
      
      // Prepare output
      const output = {
        predicted_class: result.predicted_class,
        confidence: result.confidence,
      };
      
      if (returnProbabilities) {
        output.class_probabilities = result.class_probabilities;
      }
      
      return output;
      
    } catch (error) {
      console.error(`Prediction failed: ${error.message}`);
      throw error;
    }
  }
  
  async predictBatch(imageBuffers, returnProbabilities = true) {
    try {
      // Process batch
      const pixelValues = await this.processor.processBatch(imageBuffers);
      
      // Get predictions
      const results = [];
      for (let i = 0; i < imageBuffers.length; i++) {
        const singleImage = pixelValues.slice([i, i + 1], [1, -1, -1, -1]);
        const result = await this.model.classify(singleImage);
        
        const output = {
          predicted_class: result.predicted_class,
          confidence: result.confidence,
        };
        
        if (returnProbabilities) {
          output.class_probabilities = result.class_probabilities;
        }
        
        results.push(output);
      }
      
      return results;
      
    } catch (error) {
      console.error(`Batch prediction failed: ${error.message}`);
      throw error;
    }
  }
  
  getFabricInfo(fabricClass) {
    const fabricInfo = {
      'cotton': {
        'material': 'Cotton',
        'recyclable': true,
        'biodegradable': true,
        'guidance': 'Compost or donate for textile recycling',
        'tips': [
          'Wash in cold water to reduce energy consumption',
          'Line dry instead of using dryer',
          'Consider donating usable cotton clothing',
          'Compost worn-out cotton items'
        ],
        'environmental_impact': 'Cotton is natural and biodegradable but requires significant water to produce.'
      },
      'polyester': {
        'material': 'Polyester',
        'recyclable': true,
        'biodegradable': false,
        'guidance': 'Take to textile recycling centers or specialized facilities',
        'tips': [
          'Check local recycling programs for polyester',
          'Consider upcycling into new items',
          'Avoid microfiber shedding during washing',
          'Use mesh laundry bags to reduce microplastic pollution'
        ],
        'environmental_impact': 'Polyester is synthetic and not biodegradable but can be recycled into new fibers.'
      },
      'wool': {
        'material': 'Wool',
        'recyclable': true,
        'biodegradable': true,
        'guidance': 'Donate or compost for natural fiber decomposition',
        'tips': [
          'Hand wash or use gentle cycle',
          'Air dry to maintain fiber quality',
          'Donate wool items to charity',
          'Compost worn-out wool items'
        ],
        'environmental_impact': 'Wool is renewable and biodegradable with natural temperature regulation properties.'
      },
      'silk': {
        'material': 'Silk',
        'recyclable': true,
        'biodegradable': true,
        'guidance': 'Specialized textile recycling or composting',
        'tips': [
          'Dry clean or hand wash gently',
          'Store properly to prevent damage',
          'Consider resale due to high value',
          'Compost when no longer usable'
        ],
        'environmental_impact': 'Silk is a luxury natural fiber that is biodegradable but requires specialized processing.'
      },
      'linen': {
        'material': 'Linen',
        'recyclable': true,
        'biodegradable': true,
        'guidance': 'Mechanical recycling into linen fibers or composting',
        'tips': [
          'Wash in cool water',
          'Air dry to prevent shrinkage',
          'Donate usable linen items',
          'Compost worn-out linen fabrics'
        ],
        'environmental_impact': 'Linen is a natural fiber that can be effectively recycled through various methods.'
      },
      'nylon': {
        'material': 'Nylon',
        'recyclable': true,
        'biodegradable': false,
        'guidance': 'Specialized recycling facilities for synthetic fibers',
        'tips': [
          'Check for nylon recycling programs',
          'Avoid washing with hot water',
          'Consider upcycling into new products',
          'Use proper disposal methods'
        ],
        'environmental_impact': 'Nylon is durable and recyclable but contributes to microplastic pollution.'
      },
      'rayon': {
        'material': 'Rayon',
        'recyclable': false,
        'biodegradable': true,
        'guidance': 'Compost or dispose in textile waste',
        'tips': [
          'Dry clean or hand wash gently',
          'Avoid high heat drying',
          'Consider donation if in good condition',
          'Compost when no longer usable'
        ],
        'environmental_impact': 'Rayon is semi-synthetic and biodegradable but difficult to recycle effectively.'
      }
    };
    
    return fabricInfo[fabricClass] || {
      'material': fabricClass.charAt(0).toUpperCase() + fabricClass.slice(1),
      'recyclable': false,
      'biodegradable': false,
      'guidance': 'Check local recycling options',
      'tips': [
        'Check fabric care labels before washing',
        'Consider donating usable fabrics',
        'Research local recycling options'
      ],
      'environmental_impact': `${fabricClass.charAt(0).toUpperCase() + fabricClass.slice(1)} requires specialized disposal methods.`
    };
  }
  
  async classifyFabric(imageBuffer) {
    try {
      // Get prediction
      const prediction = await this.predict(imageBuffer, true);
      
      // Get fabric information
      const fabricInfo = this.getFabricInfo(prediction.predicted_class);
      
      // Combine results
      const result = {
        'material': fabricInfo.material,
        'confidence': prediction.confidence,
        'recyclable': fabricInfo.recyclable,
        'biodegradable': fabricInfo.biodegradable,
        'guidance': fabricInfo.guidance,
        'tips': fabricInfo.tips,
        'environmental_impact': fabricInfo.environmental_impact,
        'class_probabilities': prediction.class_probabilities
      };
      
      return result;
      
    } catch (error) {
      console.error(`Classification failed: ${error.message}`);
      throw error;
    }
  }
  
  getModelSummary() {
    this.model.summary();
  }
  
  async warmup() {
    // Create a dummy image tensor for warmup
    const dummyImage = tf.randomNormal([1, this.config.image_size, this.config.image_size, 3]);
    await this.model.predict(dummyImage);
    dummyImage.dispose();
    console.log('Model warmed up and ready for predictions');
  }
}

// Convenience function for quick classification
async function classifyFabricImage(imageBuffer, modelPath = null) {
  const classifier = new FabricClassifier(null, modelPath);
  return await classifier.classifyFabric(imageBuffer);
}

module.exports = { 
  FabricClassifier, 
  classifyFabricImage,
  FabricViTConfig,
  FabricViTModel,
  FabricImageProcessor
};
