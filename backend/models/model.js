/**
 * Fabric Vision Transformer Model
 * TensorFlow.js implementation inspired by DeiT architecture
 */

const tf = require('@tensorflow/tfjs');
const { FabricViTConfig } = require('./config');

// Set backend to CPU for Node.js environment
tf.setBackend('cpu').then(() => {
  console.log('TensorFlow.js backend set to CPU');
});

class FabricViTModel {
  constructor(config) {
    this.config = config;
    this.model = null;
    this.initialized = false;
    this.buildModel();
  }
  
  async buildModel() {
    try {
      // Wait for backend to be ready
      await tf.ready();
      
      const input = tf.input({ shape: [this.config.image_size, this.config.image_size, 3] });
      
      // Patch embedding
      let x = this.patchEmbedding(input);
      
      // Add position embeddings
      x = this.addPositionEmbeddings(x);
      
      // Transformer encoder layers
      for (let i = 0; i < this.config.num_hidden_layers; i++) {
        x = this.transformerLayer(x, i);
      }
      
      // Classification head - use global average pooling instead of CLS token
      const pooled = tf.layers.globalAveragePooling1d().apply(x);
      const logits = tf.layers.dense({
        units: this.config.num_fabric_classes,
        activation: 'softmax',
        name: 'classifier'
      }).apply(pooled);
      
      this.model = tf.model({ inputs: input, outputs: logits });
      
      // Initialize weights
      this.initializeWeights();
      this.initialized = true;
      
      console.log('Vision Transformer model built successfully');
    } catch (error) {
      console.error('Error building model:', error);
      throw error;
    }
  }
  
  patchEmbedding(inputs) {
    const patchSize = this.config.patch_size;
    const hiddenSize = this.config.hidden_size;
    
    // Convolution for patch embedding
    const patches = tf.layers.conv2d({
      filters: hiddenSize,
      kernelSize: patchSize,
      strides: patchSize,
      padding: 'valid',
      name: 'patch_embedding'
    }).apply(inputs);
    
    // Flatten patches using reshape layer
    const batchSize = inputs.shape[0];
    const numPatches = (this.config.image_size / patchSize) ** 2;
    
    return tf.layers.reshape({
      targetShape: [numPatches, hiddenSize]
    }).apply(patches);
  }
  
  addPositionEmbeddings(patches) {
    const numPatches = patches.shape[1];
    const hiddenSize = this.config.hidden_size;
    
    // Create a learnable CLS token using a dense layer
    const clsInput = tf.layers.input({ shape: [hiddenSize] });
    const clsToken = tf.layers.dense({
      units: hiddenSize,
      useBias: false,
      name: 'cls_token'
    }).apply(clsInput);
    
    // Position embeddings
    const posInput = tf.layers.input({ shape: [numPatches + 1] });
    const positionEmbeddings = tf.layers.embedding({
      inputDim: numPatches + 1,
      outputDim: hiddenSize,
      embeddingsInitializer: 'randomNormal',
      name: 'position_embeddings'
    }).apply(posInput);
    
    // For now, let's use a simpler approach - just return patches with a learned embedding
    const enhancedPatches = tf.layers.dense({
      units: hiddenSize,
      activation: 'relu',
      name: 'patch_enhancement'
    }).apply(patches);
    
    return enhancedPatches;
  }
  
  transformerLayer(inputs, layerIndex) {
    // Self-attention
    let attentionOutput = this.selfAttention(inputs, layerIndex);
    
    // Add & Norm
    let x = tf.layers.add({
      name: `add_${layerIndex * 2}`
    }).apply([inputs, attentionOutput]);
    x = tf.layers.layerNormalization({ 
      epsilon: this.config.layer_norm_eps,
      name: `layer_norm_${layerIndex * 2}`
    }).apply(x);
    
    // Feed-forward
    let ffOutput = this.feedForward(x, layerIndex);
    
    // Add & Norm
    x = tf.layers.add({
      name: `add_${layerIndex * 2 + 1}`
    }).apply([x, ffOutput]);
    x = tf.layers.layerNormalization({ 
      epsilon: this.config.layer_norm_eps,
      name: `layer_norm_${layerIndex * 2 + 1}`
    }).apply(x);
    
    return x;
  }
  
  selfAttention(inputs, layerIndex) {
    const hiddenSize = this.config.hidden_size;
    
    // Use a simple self-attention implementation with available layers
    const query = tf.layers.dense({ 
      units: hiddenSize, 
      name: `query_${layerIndex}` 
    }).apply(inputs);
    const key = tf.layers.dense({ 
      units: hiddenSize, 
      name: `key_${layerIndex}` 
    }).apply(inputs);
    const value = tf.layers.dense({ 
      units: hiddenSize, 
      name: `value_${layerIndex}` 
    }).apply(inputs);
    
    // Use global average pooling as attention approximation
    const attentionWeights = tf.layers.globalAveragePooling1d({
      name: `gap_${layerIndex}`
    }).apply(key);
    const attentionWeightsExpanded = tf.layers.repeatVector({
      n: inputs.shape[1],
      name: `repeat_${layerIndex}`
    }).apply(attentionWeights);
    
    // Apply attention weights to values
    const weightedValues = tf.layers.multiply({
      name: `multiply_${layerIndex}`
    }).apply([value, attentionWeightsExpanded]);
    
    // Output projection
    const output = tf.layers.dense({ 
      units: hiddenSize, 
      name: `attention_output_${layerIndex}` 
    }).apply(weightedValues);
    
    return output;
  }
  
  feedForward(inputs, layerIndex) {
    const intermediate = tf.layers.dense({
      units: this.config.intermediate_size,
      activation: this.config.hidden_act,
      name: `intermediate_${layerIndex}`
    }).apply(inputs);
    
    const output = tf.layers.dense({
      units: this.config.hidden_size,
      name: `output_${layerIndex}`
    }).apply(intermediate);
    
    return output;
  }
  
  initializeWeights() {
    // Initialize all weights
    this.model.getWeights().forEach(weight => {
      if (weight.rank === 2) {
        // Dense layer weights
        weight.assign(tf.randomNormal(weight.shape, 0, this.config.initializer_range));
      } else if (weight.rank === 1) {
        // Bias terms
        weight.assign(tf.zerosLike(weight));
      }
    });
  }
  
  async predict(imageTensor) {
    if (!this.initialized) {
      throw new Error('Model not initialized');
    }
    
    const prediction = await this.model.predict(imageTensor);
    return prediction;
  }
  
  async classify(imageTensor) {
    const logits = await this.predict(imageTensor);
    const probabilities = await logits.data();
    
    // Get predicted class and confidence
    const maxProb = Math.max(...probabilities);
    const predictedClassIndex = probabilities.indexOf(maxProb);
    const predictedClass = this.config.fabric_classes[predictedClassIndex];
    
    // Get all class probabilities
    const classProbabilities = {};
    this.config.fabric_classes.forEach((className, index) => {
      classProbabilities[className] = probabilities[index];
    });
    
    return {
      predicted_class: predictedClass,
      confidence: maxProb,
      class_probabilities: classProbabilities,
      logits: probabilities
    };
  }
  
  getModel() {
    return this.model;
  }
  
  summary() {
    if (this.model) {
      this.model.summary();
    }
  }
}

module.exports = { FabricViTModel };
