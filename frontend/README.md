# Cine-Stream

Movie explorer using the TMDB API (React + Vite).

## Run it
1. npm install
2. Make a file called `.env` (same folder as package.json) with: VITE_TMDB_KEY=your_read_access_token
   (use the long "API Read Access Token" from TMDB, not the short API key)
3. npm run dev

## Features (Phase 1 + 2)
- Popular movies grid (poster, title, year, rating)
- Search with 500ms debounce
- Infinite scroll with IntersectionObserver
- Favorites saved in localStorage, shown on /favorites
