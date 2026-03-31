/**
 * Fabric Vision Transformer Models Package
 * Complete TensorFlow.js implementation for fabric classification
 */

const { FabricViTConfig } = require('./config');
const { FabricViTModel } = require('./model');
const { FabricImageProcessor } = require('./processor');
const { FabricClassifier, classifyFabricImage } = require('./pipeline');
const { SimpleFabricModel } = require('./simple-model');

module.exports = {
  FabricViTConfig,
  FabricViTModel,
  FabricImageProcessor,
  FabricClassifier,
  classifyFabricImage,
  SimpleFabricModel  // Add simple model as fallback
};
