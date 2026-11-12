import { getGeminiRecommendations } from '../services/geminiService.js';

export const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '✨', description: 'Uplifting, feel-good, vibrant cinema' },
  { id: 'sad', label: 'Sad', emoji: '🌧️', description: 'Deep, emotional, poignant storytelling' },
  { id: 'thriller', label: 'Thriller', emoji: '⚡', description: 'High-stakes, suspenseful plot twists' },
  { id: 'romantic', label: 'Romantic', emoji: '🌹', description: 'Passionate, heartfelt connections' },
  { id: 'motivational', label: 'Motivational', emoji: '🔥', description: 'Inspiring triumphs against all odds' },
  { id: 'horror', label: 'Horror', emoji: '🕯️', description: 'Chilling, eerie, atmospheric tension' },
  { id: 'comedy', label: 'Comedy', emoji: '🍿', description: 'Witty banter, lighthearted laughter' },
  { id: 'adventure', label: 'Adventure', emoji: '🚀', description: 'Epic voyages across unknown realms' },
];

/**
 * @desc    Get AI recommendations based on mood and preferences
 * @route   POST /api/ai/recommend
 * @access  Public (Optional auth for personalized preferences)
 */
export const getRecommendations = async (req, res) => {
  try {
    const { mood, genres = [], query = '' } = req.body;

    const userContext = req.user
      ? {
          name: req.user.name,
          favoriteGenres: req.user.favoriteGenres || [],
        }
      : {};

    const result = await getGeminiRecommendations({
      mood,
      genres,
      query,
      userContext,
    });

    return res.status(200).json({
      success: true,
      engine: result.engine || 'CineMind AI Engine',
      source: result.source || 'gemini-fallback',
      mood: result.mood,
      aiExplanation: result.aiExplanation,
      recommendations: result.recommendations || [],
      data: result,
    });
  } catch (error) {
    console.error('[AI Controller Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message,
    });
  }
};

/**
 * @desc    Get list of available recommendation moods
 * @route   GET /api/ai/moods
 * @access  Public
 */
export const getMoods = (req, res) => {
  return res.status(200).json({
    success: true,
    moods: MOODS,
  });
};
