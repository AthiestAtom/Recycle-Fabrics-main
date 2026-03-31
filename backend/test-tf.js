const tf = require('@tensorflow/tfjs');

// Test minimal TensorFlow.js operations
async function testTensorFlow() {
  try {
    console.log('Testing TensorFlow.js operations...');
    
    // Test basic operations
    const tensor1 = tf.tensor2d([2, 2], [1, 2]);
    console.log('✅ Created tensor:', tensor1.shape);
    
    const tensor2 = tf.tensor2d([5, 6], [1, 2]);
    console.log('✅ Created tensor2:', tensor2.shape);
    
    // Test basic layers
    const dense1 = tf.layers.dense({ units: 10, inputShape: [2] });
    const result1 = dense1.apply(tensor1);
    console.log('✅ Dense layer 1 works');
    
    const dense2 = tf.layers.dense({ units: 5, inputShape: [2] });
    const result2 = dense2.apply(tensor2);
    console.log('✅ Dense layer 2 works');
    
    // Test simple operations with compatible shapes
    const added = tf.add(result1, result1); // Same tensor
    console.log('✅ Addition works');
    
    // Test model compilation
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 10, inputShape: [2] }),
        tf.layers.dense({ units: 5 })
      ]
    });
    console.log('✅ Model compilation works');
    
    // Test prediction
    const prediction = await model.predict(tensor1);
    console.log('✅ Model prediction works');
    
    // Clean up
    tf.disposeVariables([tensor1, tensor2, result1, result2, added, model]);
    
    console.log('✅ All TensorFlow.js operations work correctly');
    return true;
    
  } catch (error) {
    console.error('❌ TensorFlow.js test failed:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

testTensorFlow().then(success => {
  if (success) {
    console.log('🎉 TensorFlow.js is working correctly!');
  } else {
    console.log('❌ TensorFlow.js has issues');
  }
}).catch(err => {
  console.error('❌ Test failed:', err.message);
});
