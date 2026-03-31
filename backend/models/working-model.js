const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');

// Set backend to CPU
tf.setBackend('cpu');

// Simple CNN model for fabric classification
class SimpleFabricModel {
  constructor() {
    this.model = null;
    this.initialized = false;
    this.config = {
      num_fabric_classes: 7,
      fabric_classes: ['cotton', 'polyester', 'wool', 'silk', 'linen', 'nylon', 'rayon'],
      image_size: 224,
      hidden_size: 128,
      num_hidden_layers: 4,
      num_attention_heads: 4,
      intermediate_size: 256,
      layer_norm_eps: 1e-6
    };
  }

  async initialize() {
    try {
      // Create a simple CNN model
      this.model = tf.sequential({
        layers: [
          // Convolutional layers
          tf.layers.conv2d({ inputShape: [224, 224, 3], filters: 32, kernelSize: 3, activation: 'relu' }),
          tf.layers.maxPooling2d({ poolSize: [2, 2] }),
          tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }),
          tf.layers.maxPooling2d({ poolSize: [2, 2] }),
          tf.layers.flatten(),
          tf.layers.dense({ units: 128, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.5 }),
          tf.layers.dense({ units: 7, activation: 'softmax' })
        ]
      });

      // Compile model
      this.model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      this.initialized = true;
      console.log('✅ Simple CNN model initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize model:', error);
      throw error;
    }
  }

  async classify(imageBuffer) {
    try {
      if (!this.initialized) {
        throw new Error('Model not initialized');
      }

      // Convert image buffer to tensor using sharp
      const imageBuffer = Buffer.isBuffer(imageBuffer) ? imageBuffer : Buffer.from(imageBuffer);
      let processedBuffer;
      try {
        processedBuffer = sharp(imageBuffer)
          .resize(224, 224)
          .removeAlpha()
          .raw()
          .toBuffer();
      } catch (error) {
        console.error('Sharp processing error:', error);
        throw new Error(`Image processing failed: ${error.message}`);
      }
      
      const imageTensor = tf.tensor3d(new Uint8Array(processedBuffer), [224, 224, 3]);
      const normalized = imageTensor.div(255.0);
      const batched = normalized.expandDims(0);

      // Make prediction
      const prediction = await this.model.predict(batched);
      
      // Get the predicted class and confidence
      const probabilities = await prediction.data();
      const maxProb = Math.max(...probabilities);
      const predictedClass = probabilities.indexOf(maxProb);
      const confidence = maxProb;

      // Map to fabric classes
      const fabricClasses = ['cotton', 'polyester', 'wool', 'silk', 'linen', 'nylon', 'rayon'];
      const predictedFabric = fabricClasses[predictedClass];

      return {
        material: predictedFabric,
        confidence: confidence,
        recyclable: true,
        biodegradable: ['cotton', 'wool', 'silk', 'linen'].includes(predictedFabric),
        guidance: 'Recycle or donate to textile recycling facility',
        tips: [
          'Check fabric care labels before washing',
          'Consider donating usable fabrics',
          'Research local recycling options'
        ],
        environmental_impact: `${predictedFabric} impact varies by region and production methods.`
      };
    } catch (error) {
      console.error('Classification error:', error);
      throw error;
    }
  }
}

module.exports = { SimpleFabricModel };
