# Image Generation Feature

## What Changed

Added AI image generation to AutoBlog using **DALL-E 3** via OpenRouter.

### Database Changes
- Added `image_url` column to `articles` table
- Migration script automatically runs on server start
- Seed articles include Unsplash placeholder images

### Backend Changes
- `Article` interface now includes `image_url?: string`
- `aiClient.ts` has `generateArticleWithImage()` method
- Uses **DALL-E 3** for AI-generated images
- Fallback to Unsplash if DALL-E fails or no API key

### How It Works
1. When an article is generated, DALL-E 3 creates a custom image
2. Image prompt based on article title for relevance
3. Fallback images (Unsplash) ensure every article has an image
4. Generated images are unique and professional

### Costs
- **DALL-E 3**: ~$0.04 per image (standard quality, 1024x1024)
- **Daily article**: 1 image/day = ~$1.20/month
- **Fallback**: Free Unsplash images if API fails

### API Key Required
Set `OPENROUTER_API_KEY` in `backend/.env`:
```env
OPENROUTER_API_KEY=your_key_here
```
Get your key from: https://openrouter.ai/keys

### Testing
Start Docker and backend:
```bash
# Start Postgres
docker compose up -d

# Start backend
cd backend
npm run dev
```

New articles will automatically include AI-generated images from DALL-E 3.

### Monitoring Costs
Check your usage at: https://openrouter.ai/activity

