// Configurable Legal Public-Domain & Open-Source Movie Video Streams
// Verified streamable HTML5 MP4 sources with fallback support

// Embedded VTT subtitle track for demonstration & testing
const sampleSubtitlesVtt = `WEBVTT

00:00:01.000 --> 00:00:04.000
[Cinematic Music Playing]

00:00:04.500 --> 00:00:08.000
Welcome to CineMind AI — Next-Gen Movie Streaming

00:00:08.500 --> 00:00:13.000
All systems operational. Ultra HD 4K playback active.

00:00:14.000 --> 00:00:19.000
Enjoy the experience powered by Artificial Intelligence.
`;

const sampleSubtitlesDataUri = `data:text/vtt;charset=utf-8,${encodeURIComponent(sampleSubtitlesVtt)}`;

export const MOVIE_VIDEOS = {
  'featured-1': {
    title: 'Cyberpulse: Omega',
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons / Open Source Film',
    durationSeconds: 596,
  },
  'feat-1': {
    title: 'Cyberpulse: Omega',
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons / Open Source Film',
    durationSeconds: 596,
  },
  'tr-1': {
    title: 'Interstellar: Echoes',
    videoUrl: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Blender Foundation / Creative Commons',
    durationSeconds: 888,
  },
  'tr-2': {
    title: 'The Silent Verdict',
    videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Orange Open Movie Project',
    durationSeconds: 654,
  },
  'tr-3': {
    title: 'Nebula Syndicate',
    videoUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Mango Open Movie Project',
    durationSeconds: 734,
  },
  'tr-4': {
    title: 'Shadows of Montmartre',
    videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons Open Cinema',
    durationSeconds: 654,
  },
  'tr-5': {
    title: 'Apex Vanguard',
    videoUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons Open Film',
    durationSeconds: 734,
  },
  'tr-6': {
    title: 'Chronicles of Solitude',
    videoUrl: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Blender Open Movie Project',
    durationSeconds: 888,
  },
  'pop-1': {
    title: 'Velvet Midnight',
    videoUrl: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Durian Open Movie Project',
    durationSeconds: 888,
  },
  'pop-2': {
    title: 'The Alchemist’s Protocol',
    videoUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Mango Open Film',
    durationSeconds: 734,
  },
  'pop-3': {
    title: 'Rogue Drift',
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Peach Open Movie Project',
    durationSeconds: 596,
  },
  'top-1': {
    title: 'The Grand Cinema',
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons Attribution',
    durationSeconds: 596,
  },
  'top-2': {
    title: 'Eternal Resonance',
    videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons Attribution',
    durationSeconds: 654,
  },
  'top-3': {
    title: 'Oppenheim: Singularity',
    videoUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
    fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    subtitlesUrl: sampleSubtitlesDataUri,
    license: 'Creative Commons Open Cinema',
    durationSeconds: 734,
  },
};

const DEFAULT_VIDEO = {
  title: 'CineMind Feature Stream',
  videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
  fallbackUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  subtitlesUrl: sampleSubtitlesDataUri,
  license: 'Authorized Public Domain / Open Source Source',
  durationSeconds: 600,
};

/**
 * Get video configuration for any movie ID
 */
export const getVideoForMovie = (movieId) => {
  return MOVIE_VIDEOS[movieId] || DEFAULT_VIDEO;
};

export default { MOVIE_VIDEOS, getVideoForMovie };
