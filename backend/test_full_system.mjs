import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log(' CINEMIND AI — END-TO-END FULL SYSTEM VERIFICATION SUITE       ');
  console.log('================================================================\n');

  let passes = 0;
  let failures = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`[PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
      passes++;
    } else {
      console.error(`[FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
      failures++;
    }
  };

  // 1. Connect to Database directly
  console.log('--- 1. DATABASE & SERVER INITIALIZATION ---');
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cinemind_ai';
  await mongoose.connect(mongoUri);
  assert(mongoose.connection.readyState === 1, 'MongoDB connection established successfully');

  // Import Express app from ./server.js
  const { default: app } = await import('./server.js');

  // Start test server on ephemeral port 5099
  const TEST_PORT = 5099;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));
  const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;
  assert(true, 'Test server running', `port ${TEST_PORT}`);

  try {
    // 2. Health check endpoint
    console.log('\n--- 2. HEALTH CHECK & SYSTEM STATUS ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health responds with status: ok');
    assert(healthData.database.status === 'connected', 'Database reported as connected in health check');

    // 3. User Authentication (Register, Login, Profile)
    console.log('\n--- 3. USER AUTHENTICATION & SESSION MANAGEMENT ---');
    const timestamp = Date.now();
    const testUserA = {
      name: 'Cinema Explorer Alpha',
      email: `explorer_${timestamp}@cinemind.ai`,
      password: 'SecurePassword123!',
    };
    const testUserB = {
      name: 'Cinema Explorer Beta',
      email: `beta_${timestamp}@cinemind.ai`,
      password: 'SecurePassword123!',
    };

    // Register User A
    const regResA = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUserA),
    });
    const regDataA = await regResA.json();
    assert(regResA.status === 201 && regDataA.success && regDataA.token, 'User A registered with status 201 and JWT');
    const tokenA = regDataA.token;

    // Duplicate Registration Prevention
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUserA),
    });
    assert(dupRes.status === 400, 'Duplicate email registration rejected with status 400');

    // Login User A
    const loginResA = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserA.email, password: testUserA.password }),
    });
    const loginDataA = await loginResA.json();
    assert(loginResA.status === 200 && loginDataA.success && loginDataA.token, 'User A login succeeded with status 200');

    // Login with Wrong Password
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserA.email, password: 'WrongPassword999' }),
    });
    assert(badLoginRes.status === 401, 'Invalid password rejected with status 401');

    // Protected Route: GET /api/auth/me
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === testUserA.email.toLowerCase(), 'GET /api/auth/me restored authenticated user profile');

    // Profile Update: PUT /api/auth/profile
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        name: 'Cinema Explorer Alpha (Updated)',
        bio: 'Sci-Fi addict & Cyberpunk researcher',
        favoriteGenres: ['Sci-Fi', 'Cyberpunk', 'Mystery'],
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.user.bio.includes('Cyberpunk'), 'PUT /api/auth/profile updated bio and favoriteGenres');

    // Register User B for Isolation Testing
    const regResB = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUserB),
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.token;

    // 4. Watchlist API & User Isolation
    console.log('\n--- 4. WATCHLIST SYSTEM & USER ISOLATION ---');
    const moviePayload = {
      movieId: 'tr-1',
      title: 'Interstellar: Echoes',
      overview: 'A deep-space rescue team enters an anomaly beyond Jupiter.',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
      rating: 8.9,
      releaseYear: 2025,
      duration: '2h 35m',
      genres: ['Sci-Fi', 'Adventure'],
      matchScore: 98,
    };

    // User A adds movie to Watchlist
    const addWatchlistRes = await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(moviePayload),
    });
    const addWatchlistData = await addWatchlistRes.json();
    assert(addWatchlistRes.status === 201 && addWatchlistData.success, 'POST /api/watchlist added movie for User A (status 201)');

    // Duplicate Prevention
    const dupWatchlistRes = await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(moviePayload),
    });
    assert(dupWatchlistRes.status === 409, 'Duplicate watchlist entry blocked with status 409 Conflict');

    // User Isolation: Check User B's watchlist
    const userBWatchlistRes = await fetch(`${BASE_URL}/watchlist`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const userBWatchlistData = await userBWatchlistRes.json();
    assert(userBWatchlistRes.status === 200 && userBWatchlistData.watchlist.length === 0, 'User B watchlist is empty (strict User Isolation verified)');

    // User A removes movie from Watchlist
    const deleteWatchlistRes = await fetch(`${BASE_URL}/watchlist/tr-1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(deleteWatchlistRes.status === 200, 'DELETE /api/watchlist/:movieId removed movie for User A (status 200)');

    // 5. Watch Progress & Continue Watching
    console.log('\n--- 5. WATCH PROGRESS & CONTINUE WATCHING ---');
    const progressPayload = {
      movieId: 'tr-1',
      title: 'Interstellar: Echoes',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86',
      currentTime: 180,
      duration: 600,
    };

    const saveProgRes = await fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify(progressPayload),
    });
    const saveProgData = await saveProgRes.json();
    assert(saveProgRes.status === 200 && saveProgData.progress.progressPercentage === 30, 'POST /api/progress saved playback progress at 30%');

    const getProgRes = await fetch(`${BASE_URL}/progress`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const getProgData = await getProgRes.json();
    assert(getProgRes.status === 200 && getProgData.progress.length > 0, 'GET /api/progress retrieved in-progress sessions');

    const delProgRes = await fetch(`${BASE_URL}/progress/tr-1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(delProgRes.status === 200, 'DELETE /api/progress/:movieId removed progress');

    // 6. AI Movie Recommendations
    console.log('\n--- 6. AI MOVIE RECOMMENDATIONS & FALLBACK ENGINE ---');
    const moodsRes = await fetch(`${BASE_URL}/ai/moods`);
    const moodsData = await moodsRes.json();
    assert(moodsRes.status === 200 && Array.isArray(moodsData.moods) && moodsData.moods.length === 8, 'GET /api/ai/moods returned 8 mood categories');

    const aiRecRes = await fetch(`${BASE_URL}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: 'Thriller',
        genres: ['Sci-Fi', 'Cyberpunk'],
        query: 'fast-paced neon mystery',
      }),
    });
    const aiRecData = await aiRecRes.json();
    assert(
      aiRecRes.status === 200 &&
      aiRecData.success &&
      Array.isArray(aiRecData.recommendations) &&
      aiRecData.recommendations.length > 0,
      'POST /api/ai/recommend returned curated recommendations with match scores',
      `source: ${aiRecData.source}`
    );

    // 7. Admin Control Center & Role Protection
    console.log('\n--- 7. ADMIN DASHBOARD & ROLE-BASED ACCESS CONTROL ---');
    // Non-admin attempt should return 403
    const nonAdminStats = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(nonAdminStats.status === 403, 'Non-admin user rejected from /api/admin/stats with status 403');

    // Promote User A to admin
    await mongoose.connection.collection('users').updateOne(
      { email: testUserA.email.toLowerCase() },
      { $set: { role: 'admin' } }
    );

    // Re-login User A as Admin to get updated token/role
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserA.email, password: testUserA.password }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;
    assert(adminLoginData.user.role === 'admin', 'User A promoted to admin role');

    // Admin Stats Check
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminStatsData = await adminStatsRes.json();
    assert(adminStatsRes.status === 200 && adminStatsData.stats.totalUsers >= 2, 'Admin GET /api/admin/stats returned platform metrics');

    // Admin Users Directory
    const adminUsersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminUsersData = await adminUsersRes.json();
    assert(adminUsersRes.status === 200 && adminUsersData.users.length >= 2, 'Admin GET /api/admin/users retrieved registered users directory');

    // Admin Movie Management (Create custom movie)
    const customMoviePayload = {
      title: 'Neon Odyssey 2099',
      overview: 'A rogue neural hacker navigates an orbital city controlled by an omniscient synthetic consciousness.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
      backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477',
      videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
      rating: 9.1,
      releaseYear: 2026,
      duration: '2h 18m',
      genres: ['Sci-Fi', 'Cyberpunk'],
      matchScore: 99,
    };
    const addMovieRes = await fetch(`${BASE_URL}/admin/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(customMoviePayload),
    });
    const addMovieData = await addMovieRes.json();
    assert(addMovieRes.status === 201 && addMovieData.movie, 'Admin POST /api/admin/movies created custom movie record');
    const createdMovieId = addMovieData.movie._id;

    // Admin Delete Movie
    const delMovieRes = await fetch(`${BASE_URL}/admin/movies/${createdMovieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delMovieRes.status === 200, 'Admin DELETE /api/admin/movies/:id removed custom movie record');

    // 8. Public Domain Stream Verification
    console.log('\n--- 8. ACTUAL MOVIE STREAM CONNECTIVITY & HEADERS ---');
    const streamsToTest = [
      { name: 'Big Buck Bunny (Archive.org 720p)', url: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4' },
      { name: 'Sintel (Archive.org 1080p)', url: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4' },
      { name: 'Tears of Steel (Archive.org 720p)', url: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4' },
      { name: 'Universal Fallback Stream (W3C MP4)', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ];

    for (const s of streamsToTest) {
      try {
        const streamRes = await fetch(s.url, {
          method: 'GET',
          headers: { Range: 'bytes=0-1024' },
        });
        const isStreaming = streamRes.status === 200 || streamRes.status === 206;
        assert(isStreaming, `${s.name} responds with HTTP ${streamRes.status} (Streamable)`);
      } catch (err) {
        assert(false, `${s.name} stream check failed`, err.message);
      }
    }

  } finally {
    // Clean up test server and mongo connection
    server.close();
    await mongoose.connection.close();
  }

  console.log('\n================================================================');
  console.log(` SUMMARY: ${passes} Passed, ${failures} Failed`);
  console.log('================================================================\n');

  if (failures > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runComprehensiveTests().catch((err) => {
  console.error('[Test Suite Error]:', err);
  process.exit(1);
});
