#!/usr/bin/env node

/**
 * Security Check Script
 * Ensures no API keys or sensitive information is committed to the repository
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Patterns that should not be in the code
const SENSITIVE_PATTERNS = [
  /AIza[A-Za-z0-9_-]{35}/, // Google/Gemini API keys
  /sk-[A-Za-z0-9]{48}/, // OpenAI API keys
  /xoxb-[A-Za-z0-9_-]{43}-[A-Za-z0-9_-]{32}/, // Slack bot tokens
  /ghp_[A-Za-z0-9]{36}/, // GitHub personal access tokens
  /gho_[A-Za-z0-9]{36}/, // GitHub OAuth tokens
  /ghu_[A-Za-z0-9]{36}/, // GitHub user tokens
  /ghs_[A-Za-z0-9]{36}/, // GitHub server tokens
  /ghr_[A-Za-z0-9]{36}/, // GitHub refresh tokens
  /xoxp-[A-Za-z0-9_-]{46}/, // Slack user tokens
  /AKIA[0-9A-Z]{16}/, // AWS access keys
  /-----BEGIN [A-Z]+ PRIVATE KEY-----/, // Private keys
  /MISTRAL_API_KEY\s*=\s*['\"][^'\"]+['\"]/, // Mistral API keys
  /API_KEY\s*=\s*['\"][^'\"]+['\"]/, // Generic API keys
];

// Files to check
const SOURCE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.json', '.md', '.txt', '.env', '.env.example'];
const DIRECTORIES_TO_CHECK = ['src', 'backend', '.', 'config'];
const DIRECTORIES_TO_IGNORE = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];

let hasSecurityIssues = false;

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      SENSITIVE_PATTERNS.forEach((pattern, patternIndex) => {
        if (pattern.test(line)) {
          console.error(`🚨 SECURITY ISSUE DETECTED!`);
          console.error(`   File: ${filePath}`);
          console.error(`   Line: ${index + 1}`);
          console.error(`   Pattern: ${pattern}`);
          console.error(`   Content: ${line.trim()}`);
          console.error('');
          hasSecurityIssues = true;
        }
      });
    });
  } catch (error) {
    // Skip files that can't be read
  }
}

function findFilesToCheck(dir) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip ignored directories
          if (!DIRECTORIES_TO_IGNORE.includes(item)) {
            traverse(fullPath);
          }
        } else {
          // Check source files
          const ext = path.extname(item);
          if (SOURCE_EXTENSIONS.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  traverse(dir);
  return files;
}

function checkEnvironmentFiles() {
  const envFiles = ['.env', '.env.local', '.env.production', '.env.development', 'backend/.env'];
  
  envFiles.forEach(envFile => {
    if (fs.existsSync(envFile)) {
      console.error(`🚨 SECURITY WARNING: ${envFile} should not be committed to version control!`);
      console.error(`   This file should be in .gitignore`);
      console.error('');
      hasSecurityIssues = true;
    }
  });
}

function main() {
  console.log('🔒 Running security check...');
  console.log('');
  
  // Check environment files
  checkEnvironmentFiles();
  
  // Check source files
  const filesToCheck = [];
  DIRECTORIES_TO_CHECK.forEach(dir => {
    if (fs.existsSync(dir)) {
      filesToCheck.push(...findFilesToCheck(dir));
    }
  });
  
  // Remove duplicates
  const uniqueFiles = [...new Set(filesToCheck)];
  
  console.log(`Checking ${uniqueFiles.length} files...`);
  
  uniqueFiles.forEach(file => {
    checkFile(file);
  });
  
  console.log('');
  
  if (hasSecurityIssues) {
    console.error('❌ SECURITY ISSUES FOUND!');
    console.error('Please remove sensitive information before committing.');
    process.exit(1);
  } else {
    console.log('✅ No security issues detected.');
    console.log('Repository is safe to commit.');
  }
}

main();

export { checkFile, findFilesToCheck, checkEnvironmentFiles };
