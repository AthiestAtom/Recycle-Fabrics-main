/**
 * Fabric Image Processor
 * TensorFlow.js implementation for image preprocessing
 */

const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const { FabricViTConfig } = require('./config');

class FabricImageProcessor {
  constructor(config) {
    this.config = config;
    this.imageSize = config.image_size;
    this.patchSize = config.patch_size;
    
    // ImageNet normalization (standard for Vision Transformers)
    this.mean = [0.485, 0.456, 0.406];
    this.std = [0.229, 0.224, 0.225];
  }
  
  async processImage(imageBuffer) {
    try {
      // Use sharp for image processing
      const image = sharp(imageBuffer);
      
      // Get image metadata
      const metadata = await image.metadata();
      
      // Resize and crop to square
      const processedImage = await image
        .resize(this.imageSize, this.imageSize, {
          fit: 'cover',
          position: 'center'
        })
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // Convert to tensor
      const { data, info } = processedImage;
      const imageTensor = tf.tensor3d(
        new Uint8Array(data),
        [info.height, info.width, info.channels],
        'int32'
      );
      
      // Normalize to [0, 1]
      const normalized = imageTensor.toFloat().div(255.0);
      
      // Apply ImageNet normalization
      const meanTensor = tf.tensor1d(this.mean);
      const stdTensor = tf.tensor1d(this.std);
      
      const imageNorm = normalized.sub(meanTensor).div(stdTensor);
      
      // Add batch dimension
      const batchedImage = imageNorm.expandDims(0);
      
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
    return batchTensor;
  }
  
  validateImage(imageBuffer) {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Input must be a Buffer');
    }
    
    if (imageBuffer.length === 0) {
      throw new Error('Image buffer is empty');
    }
    
    // Basic image format validation
    const validFormats = ['jpg', 'jpeg', 'png', 'webp', 'bmp'];
    const format = require('file-type').sync(imageBuffer);
    
    if (!format || !validFormats.includes(format.ext)) {
      throw new Error(`Unsupported image format. Supported formats: ${validFormats.join(', ')}`);
    }
  }
}

module.exports = { FabricImageProcessor };
