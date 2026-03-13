# Fabric Classifier API

## Deploy to Render.com

### 1. Push to GitHub
```bash
git add .
git commit -m "Add backend for Render deployment"
git push origin main
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repository
5. Select the `backend` directory
6. Use these settings:
   - **Name**: fabric-classifier-api
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### 3. Add Environment Variables
In Render dashboard, add this environment variable as a secret:
- **Key**: `GEMINI_API_KEY`
- **Value**: Add your Google Gemini API key here (get one from https://aistudio.google.com/app/apikey)

### 4. Get Your API URL
After deployment, your API will be available at:
`https://fabric-classifier-api.onrender.com`

### 5. Test the API
```bash
curl https://fabric-classifier-api.onrender.com/api/health
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/classify-fabric` - Classify fabric image

## Frontend Integration

The frontend is already configured to use the Render backend in production.
