# 🔒 Security Guide

This repository contains sensitive configuration and API keys. Follow these security guidelines:

## 🚨 Security Rules

### 1. NEVER Commit API Keys
- **Always** use environment variables for API keys
- **Never** hardcode API keys in source code
- **Always** add `.env` files to `.gitignore`

### 2. Environment Variables
```bash
# Template file (safe to commit)
cp backend/.env.example backend/.env

# Edit with your actual keys (NEVER commit)
# backend/.env
MISTRAL_API_KEY=your_actual_key_here
```

### 3. Security Check
Run security check before committing:
```bash
npm run security-check
```

### 4. Pre-commit Hook
Add this to your `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run security-check
```

## 🛡️ Security Features

### .gitignore Protection
- All `.env*` files are ignored
- API key patterns are blocked
- Configuration files with secrets are protected

### Security Check Script
- Detects 15+ types of API keys
- Scans all source files
- Prevents commits with sensitive data
- Checks for common security patterns

### Protected Patterns
- Google/Gemini API keys (`AIza...`)
- OpenAI API keys (`sk-...`)
- GitHub tokens (`ghp_...`, `gho_...`)
- AWS access keys (`AKIA...`)
- Private keys (`-----BEGIN...`)
- Generic API keys

## 📁 File Structure

```
├── .gitignore              # Protects sensitive files
├── scripts/
│   └── security-check.js   # Automated security scanning
├── backend/
│   ├── .env.example        # Template (safe)
│   └── .env                 # Actual keys (never commit)
└── package.json
    └── security-check      # Security command
```

## 🔍 Security Commands

```bash
# Run security check
npm run security-check

# Pre-commit check
npm run pre-commit

# Check specific file
node scripts/security-check.js
```

## ⚠️ If Security Issues Found

1. **Remove API keys** from source code
2. **Use environment variables** instead
3. **Add sensitive files** to `.gitignore`
4. **Revoke exposed API keys** from service providers
5. **Commit fixes** and run security check again

## 🔄 What We Fixed

- ✅ Removed all hardcoded API keys
- ✅ Added comprehensive .gitignore
- ✅ Created security check script
- ✅ Added environment variable templates
- ✅ Implemented pre-commit security scanning

## 📞 Support

If you encounter security issues:
1. Run `npm run security-check`
2. Check .gitignore configuration
3. Ensure no .env files are committed
4. Revoke any exposed API keys

---

**Remember**: Security is everyone's responsibility. Always check before committing!
