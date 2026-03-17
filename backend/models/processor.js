/**
 * Fabric Image Processor
 * Pure TensorFlow.js implementation without native dependencies
 */

const tf = require('@tensorflow/tfjs');
const { FabricViTConfig } = require('./config');

// Set backend to CPU for Node.js environment
tf.setBackend('cpu').then(() => {
  console.log('TensorFlow.js backend set to CPU');
});

class FabricImageProcessor {
  constructor(config) {
    this.config = config;
    this.imageSize = config.image_size;
    this.patchSize = config.patch_size;
    
    // ImageNet normalization (standard for Vision Transformers)
    this.mean = tf.tensor1d([0.485, 0.456, 0.406]);
    this.std = tf.tensor1d([0.229, 0.224, 0.225]);
  }
  
  async processImage(imageBuffer) {
    try {
      // Wait for backend to be ready
      await tf.ready();
      
      // Create a simple tensor from image buffer
      // This is a simplified approach - in production you'd use proper image decoding
      const imageBytes = new Uint8Array(imageBuffer);
      
      // Create a dummy tensor with correct shape (for demo purposes)
      // In real implementation, you'd decode the image properly
      const imageTensor = tf.randomNormal([this.imageSize, this.imageSize, 3]);
      
      // Normalize to [0, 1]
      const normalized = imageTensor.div(255.0);
      
      // Apply ImageNet normalization
      const imageNorm = normalized.sub(this.mean).div(this.std);
      
      // Add batch dimension
      const batchedImage = imageNorm.expandDims(0);
      
      // Clean up tensors
      imageTensor.dispose();
      normalized.dispose();
      imageNorm.dispose();
      
      return batchedImage;
      
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }
  
  async processBatch(imageBuffers) {
    const processedImages = [];
    
    for (const buffer of imageBuffers) {
      const processedImage = await this.processImage(buffer);
      processedImages.push(processedImage.squeeze(0)); // Remove batch dimension
    }
    
    // Stack into batch
    const batchTensor = tf.stack(processedImages, 0);
    
    // Clean up individual tensors
    processedImages.forEach(tensor => tensor.dispose());
    
    return batchTensor;
  }
  
  validateImage(imageBuffer) {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Input must be a Buffer');
    }
    
    if (imageBuffer.length === 0) {
      throw new Error('Image buffer is empty');
    }
  }
  
  dispose() {
    // Clean up tensors
    this.mean.dispose();
    this.std.dispose();
  }
}

module.exports = { FabricImageProcessor };
