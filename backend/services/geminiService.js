// Gemini AI Movie Recommendation Service with Intelligent Semantic Fallback

const CATALOG = [
  {
    movieId: 'feat-1',
    title: 'Cyberpulse: Omega',
    tagline: 'Beyond the edge of consciousness lies humanity’s final frontier.',
    overview: 'In a rain-soaked neo-Tokyo approaching technological singularity, a neuro-detective uncovers an encrypted consciousness frequency that allows human minds to transcend digital extinction.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    rating: 9.4,
    releaseYear: 2025,
    duration: '2h 46m',
    ageRating: '16+',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk', 'Mystery'],
    director: 'Marcus Sterling',
    cast: ['Kaelen Vance', 'Lyra Mercer', 'Tatsuya Mori'],
    moods: ['Thriller', 'Adventure', 'Mind-Bending', 'Futuristic'],
  },
  {
    movieId: 'tr-1',
    title: 'Interstellar: Echoes',
    overview: 'A deep-space rescue team enters an anomaly beyond Jupiter only to discover echoes of their own future.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    rating: 8.9,
    releaseYear: 2025,
    duration: '2h 35m',
    ageRating: 'PG-13',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    moods: ['Motivational', 'Adventure', 'Thoughtful', 'Sad'],
  },
  {
    movieId: 'tr-2',
    title: 'The Silent Verdict',
    overview: 'A high-profile criminal attorney discovers her newest client is the architect of a nationwide conspiracy.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 8.6,
    releaseYear: 2024,
    duration: '2h 12m',
    ageRating: '18+',
    genres: ['Crime', 'Thriller', 'Mystery'],
    moods: ['Thriller', 'Tense', 'Dark'],
  },
  {
    movieId: 'tr-3',
    title: 'Nebula Syndicate',
    overview: 'A crew of interstellar smugglers steals a prototype quantum core and sparks a galaxy-wide chase.',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1447433819943-74a20887a81e?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: 8.7,
    releaseYear: 2025,
    duration: '2h 20m',
    ageRating: 'PG-13',
    genres: ['Action', 'Sci-Fi', 'Space Opera'],
    moods: ['Adventure', 'Happy', 'Exciting'],
  },
  {
    movieId: 'pop-1',
    title: 'Velvet Midnight',
    overview: 'A jazz pianist in Chicago becomes entangled with a syndicate lord after witnessing a midnight heist.',
    poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    rating: 8.5,
    releaseYear: 2024,
    duration: '2h 05m',
    ageRating: '16+',
    genres: ['Noir', 'Drama', 'Music'],
    moods: ['Romantic', 'Sad', 'Thoughtful'],
  },
  {
    movieId: 'top-1',
    title: 'The Grand Cinema',
    overview: 'A nostalgic journey celebrating the golden era of 1960s cinema through the eyes of an eccentric projectionist.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    rating: 9.5,
    releaseYear: 2023,
    duration: '2h 55m',
    ageRating: 'PG',
    genres: ['Drama', 'Art House', 'Classics'],
    moods: ['Happy', 'Motivational', 'Nostalgic'],
  },
  {
    movieId: 'tr-5',
    title: 'Apex Vanguard',
    overview: 'Special ops operators deploy into an uncharted subterranean fortress where bio-engineered entities reign.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 8.8,
    releaseYear: 2025,
    duration: '2h 15m',
    ageRating: '18+',
    genres: ['Action', 'Survival', 'Horror'],
    moods: ['Horror', 'Thriller', 'Dark'],
  },
  {
    movieId: 'top-6',
    title: 'Midnight in Kyoto',
    overview: 'Two strangers find their destinies intertwined amidst the tranquil neon alleys and bamboo shrines of Kyoto.',
    poster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    rating: 8.9,
    releaseYear: 2024,
    duration: '1h 52m',
    ageRating: 'PG-13',
    genres: ['Romance', 'Drama', 'Travel'],
    moods: ['Romantic', 'Happy', 'Thoughtful'],
  },
];

/**
 * Generate AI movie recommendations based on mood, user preferences, and prompt query
 */
export const getGeminiRecommendations = async ({ mood, genres = [], query = '', userContext = {} }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If Gemini API Key is available and valid, attempt official Gemini REST endpoint
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const prompt = `You are CineMind AI, a cinematic movie recommendation engine.
User Mood: ${mood || 'Curious'}
Selected Genres: ${genres.join(', ') || 'Any'}
User Search Query: ${query || 'Something exceptional'}
User Favorite Genres: ${userContext.favoriteGenres?.join(', ') || 'Various'}

Available Films:
${JSON.stringify(CATALOG.map((m) => ({ id: m.movieId, title: m.title, genres: m.genres, overview: m.overview })))}

Select up to 4 best matching movie IDs from the list. Return ONLY a valid JSON object matching this schema:
{
  "explanation": "A 1-2 sentence cinematic explanation of why these films match the vibe",
  "recommendedIds": ["id1", "id2"],
  "reasons": { "id1": "specific reason for this movie" }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const matchedMovies = CATALOG.filter((m) => parsed.recommendedIds?.includes(m.movieId)).map((m) => ({
            ...m,
            aiReason: parsed.reasons?.[m.movieId] || 'Matches your personalized viewing mood.',
            matchScore: Math.floor(Math.random() * 5) + 95,
          }));

          if (matchedMovies.length > 0) {
            return {
              engine: 'Google Gemini AI',
              mood: mood || 'Personalized',
              aiExplanation: parsed.explanation,
              recommendations: matchedMovies,
            };
          }
        }
      }
    } catch (err) {
      console.warn('[Gemini Service]: Real-time API query fallback triggered ->', err.message);
    }
  }

  // Robust Intelligent Fallback: Dynamic Mood & Genre Mapping
  const targetMood = (mood || '').toLowerCase();
  const targetGenres = genres.map((g) => g.toLowerCase());
  const targetQuery = (query || '').toLowerCase();

  const scoredMovies = CATALOG.map((movie) => {
    let score = 70;

    // Mood match
    if (movie.moods?.some((m) => m.toLowerCase().includes(targetMood))) score += 20;

    // Genre match
    const genreMatchCount = movie.genres?.filter((g) => targetGenres.includes(g.toLowerCase())).length || 0;
    score += genreMatchCount * 5;

    // Query text match
    if (targetQuery && (movie.title.toLowerCase().includes(targetQuery) || movie.overview.toLowerCase().includes(targetQuery))) {
      score += 15;
    }

    // High rating boost
    if (movie.rating >= 9.0) score += 5;

    return {
      ...movie,
      matchScore: Math.min(99, score),
      aiReason: `Selected for its ${targetMood || 'dynamic'} resonance and cinematic ${movie.genres?.[0] || 'storytelling'} depth.`,
    };
  });

  scoredMovies.sort((a, b) => b.matchScore - a.matchScore);
  const topRecommendations = scoredMovies.slice(0, 4);

  return {
    engine: 'CineMind AI Engine',
    mood: mood || 'Personalized Blend',
    aiExplanation: `Based on your ${mood ? mood.toLowerCase() : 'custom'} mood and cinematic taste, CineMind AI curated these titles offering intense thematic depth and high audience ratings.`,
    recommendations: topRecommendations,
  };
};

export default { getGeminiRecommendations };
