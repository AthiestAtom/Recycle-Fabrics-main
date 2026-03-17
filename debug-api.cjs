#!/usr/bin/env node

/**
 * Debug script to test the API endpoints and identify 405 errors
 */

const http = require('http');
const fs = require('fs');

function testMethod(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing API endpoints for 405 errors...\n');

  // Test different methods on different endpoints
  const tests = [
    { method: 'GET', path: '/api/health' },
    { method: 'POST', path: '/api/health' },
    { method: 'GET', path: '/api/test' },
    { method: 'POST', path: '/api/test' },
    { method: 'GET', path: '/api/classify-fabric' },
    { method: 'POST', path: '/api/classify-fabric' },
    { method: 'PUT', path: '/api/classify-fabric' },
    { method: 'DELETE', path: '/api/classify-fabric' },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.method} ${test.path}...`);
      const result = await testMethod(test.method, test.path);
      
      if (result.status === 405) {
        console.log(`❌ 405 ERROR: ${test.method} ${test.path}`);
        console.log(`   Response: ${result.body}`);
      } else if (result.status >= 200 && result.status < 300) {
        console.log(`✅ SUCCESS: ${test.method} ${test.path} (${result.status})`);
      } else {
        console.log(`⚠️  OTHER: ${test.method} ${test.path} (${result.status})`);
        console.log(`   Response: ${result.body}`);
      }
    } catch (error) {
      console.log(`💥 ERROR: ${test.method} ${test.path} - ${error.message}`);
    }
    console.log('');
  }

  // Test the actual file upload
  console.log('📁 Testing file upload...');
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', Buffer.from('test'), { filename: 'test.jpg', contentType: 'image/jpeg' });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/classify-fabric',
      method: 'POST',
      headers: form.getHeaders()
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`File upload status: ${res.statusCode}`);
        console.log(`File upload response: ${data}`);
      });
    });

    req.on('error', (error) => {
      console.log(`File upload error: ${error.message}`);
    });

    form.pipe(req);
  } catch (error) {
    console.log(`Form data error: ${error.message}`);
  }
}

runTests().catch(console.error);
