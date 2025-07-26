# Vercel Deployment Guide

## Important Notes

⚠️ **Data Persistence Warning**: This application currently uses in-memory storage, which means all data will be lost when the serverless function restarts. For production use, you should integrate with a database like:
- Vercel Postgres
- PlanetScale
- Supabase
- MongoDB Atlas

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## Environment Variables

If you're using email functionality, set these in your Vercel dashboard:

- `RESEND_API_KEY` - Your Resend API key for sending emails

## File Structure for Vercel

```
├── api/
│   └── index.js          # Serverless API function
├── client/               # React frontend source
├── dist/public/          # Built frontend (auto-generated)
├── vercel.json          # Vercel configuration
└── package.json
```

## How It Works

1. **API Routes**: All `/api/*` requests are handled by the serverless function in `api/index.js`
2. **Frontend**: All other requests serve the static React app from `dist/public/`
3. **Build Process**: Vercel runs `npm run vercel-build` which builds the React app using Vite

## Troubleshooting

- **Build Errors**: Check that all dependencies are in `dependencies` (not `devDependencies`) if they're needed at runtime
- **API Errors**: Check Vercel function logs in the dashboard
- **CORS Issues**: The API includes CORS headers for cross-origin requests

## Next Steps for Production

1. **Database Integration**: Replace in-memory storage with a persistent database
2. **Authentication**: Add proper session management or JWT tokens
3. **Error Handling**: Implement comprehensive error logging
4. **Rate Limiting**: Add API rate limiting for security
5. **Input Validation**: Add comprehensive input validation and sanitization