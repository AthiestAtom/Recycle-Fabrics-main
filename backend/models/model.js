/**
 * Fabric Vision Transformer Model
 * TensorFlow.js implementation inspired by DeiT architecture
 */

const tf = require('@tensorflow/tfjs-node');
const { FabricViTConfig } = require('./config');

class FabricViTModel {
  constructor(config) {
    this.config = config;
    this.model = null;
    this.buildModel();
  }
  
  buildModel() {
    const input = tf.input({ shape: [this.config.image_size, this.config.image_size, 3] });
    
    // Patch embedding
    let x = this.patchEmbedding(input);
    
    // Add position embeddings
    x = this.addPositionEmbeddings(x);
    
    // Transformer encoder layers
    for (let i = 0; i < this.config.num_hidden_layers; i++) {
      x = this.transformerLayer(x);
    }
    
    // Classification head
    const clsToken = x.slice([0, 0], [-1, 1]); // Extract CLS token
    const logits = tf.layers.dense({
      units: this.config.num_fabric_classes,
      activation: 'softmax',
      name: 'classifier'
    }).apply(clsToken);
    
    this.model = tf.model({ inputs: input, outputs: logits });
    
    // Initialize weights
    this.initializeWeights();
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
    
    // Flatten patches
    const batchSize = inputs.shape[0];
    const numPatches = (this.config.image_size / patchSize) ** 2;
    
    return patches.reshape([batchSize, numPatches, hiddenSize]);
  }
  
  addPositionEmbeddings(patches) {
    const batchSize = patches.shape[0];
    const numPatches = patches.shape[1];
    const hiddenSize = this.config.hidden_size;
    
    // CLS token
    const clsToken = tf.variable(
      tf.randomNormal([1, 1, hiddenSize], 0, this.config.initializer_range),
      true,
      'cls_token'
    );
    
    const clsTokens = clsToken.tile([batchSize, 1, 1]);
    
    // Position embeddings
    const positionEmbeddings = tf.variable(
      tf.randomNormal([1, numPatches + 1, hiddenSize], 0, this.config.initializer_range),
      true,
      'position_embeddings'
    );
    
    // Concatenate CLS token and patches
    const embeddings = tf.concat([clsTokens, patches], 1);
    
    // Add position embeddings
    return embeddings.add(positionEmbeddings);
  }
  
  transformerLayer(inputs) {
    // Self-attention
    let attentionOutput = this.selfAttention(inputs);
    
    // Add & Norm
    let x = tf.layers.add().apply([inputs, attentionOutput]);
    x = tf.layers.layerNormalization({ epsilon: this.config.layer_norm_eps }).apply(x);
    
    // Feed-forward
    let ffOutput = this.feedForward(x);
    
    // Add & Norm
    x = tf.layers.add().apply([x, ffOutput]);
    x = tf.layers.layerNormalization({ epsilon: this.config.layer_norm_eps }).apply(x);
    
    return x;
  }
  
  selfAttention(inputs) {
    const hiddenSize = this.config.hidden_size;
    const numHeads = this.config.num_attention_heads;
    const headSize = hiddenSize / numHeads;
    
    // Q, K, V projections
    const query = tf.layers.dense({ units: hiddenSize, name: 'query' }).apply(inputs);
    const key = tf.layers.dense({ units: hiddenSize, name: 'key' }).apply(inputs);
    const value = tf.layers.dense({ units: hiddenSize, name: 'value' }).apply(inputs);
    
    // Multi-head attention
    const attention = tf.layers.multiHeadAttention({
      numHeads: numHeads,
      keyDim: headSize,
      name: 'attention'
    }).apply([query, value]);
    
    // Output projection
    const output = tf.layers.dense({ units: hiddenSize, name: 'attention_output' }).apply(attention);
    
    return output;
  }
  
  feedForward(inputs) {
    const intermediate = tf.layers.dense({
      units: this.config.intermediate_size,
      activation: this.config.hidden_act,
      name: 'intermediate'
    }).apply(inputs);
    
    const output = tf.layers.dense({
      units: this.config.hidden_size,
      name: 'output'
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
    this.model.summary();
  }
}

module.exports = { FabricViTModel };
