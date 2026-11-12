# CineMind AI — Next-Gen AI-Powered Movie Discovery & Streaming Web Platform

A full-stack, production-ready cinematic web application inspired by Netflix. CineMind AI pairs artificial intelligence with high-fidelity video streaming, featuring user authentication, MongoDB watchlist synchronization, resume playback ("Continue Watching"), mood-based recommendations powered by Google Gemini, catalog search & filtering, and an administrator control center.

---

## 🌟 Key Features

1. **AI-Powered Movie Discovery**
   - 8 dynamic mood filters (*Happy, Sad, Romantic, Thriller, Motivational, Horror, Comedy, Adventure*).
   - Natural language prompt exploration (*e.g., "cerebral space exploration with mind-bending paradoxes"*).
   - Powered by Google Gemini API with smart algorithmic catalog fallback when an API key is not present.

2. **Custom HTML5 Cinematic Video Player**
   - Fullscreen video playback with Netflix-style controls.
   - Play/Pause, Seek ±10s, Timeline Scrubber, Volume/Mute, Playback Speed (0.5x–2.0x), Fullscreen toggle.
   - Built-in WebVTT subtitle track support.
   - Native keyboard shortcuts (`Space` / `k` for Play/Pause, `ArrowRight`/`ArrowLeft` for seek, `ArrowUp`/`ArrowDown` for volume, `f` for fullscreen, `m` for mute).
   - Automatic fallback stream recovery for high availability.
   - Streams legally licensed, open-source Creative Commons films (*Blender Foundation's Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream*).

3. **Continue Watching & Playback Position Persistence**
   - Real-time periodic timestamp sync every 4 seconds.
   - Stored in MongoDB (`WatchProgress`) for authenticated members and `localStorage` for guests.
   - Interactive Continue Watching row on the Home page and User Profile with percentage progress bars and one-click resume.

4. **User Authentication & Profiles**
   - Secure registration and login using JWT tokens and salted bcrypt password hashing.
   - Profile management with custom cinema bio and favorite genre pills.
   - Protected routes preventing unauthenticated access to personal collections.

5. **MongoDB-Backed Watchlist System**
   - Individual user isolation: Each user only accesses and modifies their own saved titles.
   - Compound index duplicate prevention (`{ user: 1, movieId: 1 }`).
   - Non-intrusive toast notification system for instant UI feedback.

6. **Catalog Discovery & Search**
   - Multi-parameter search by title, overview, director, and cast.
   - Filter by genre (*Sci-Fi, Action, Thriller, Drama, Romance, Crime, Horror, Art House, Cyberpunk*).
   - Rating threshold filters (8.0+, 8.5+, 9.0+) and release year filters.
   - Real-time sort options (Highest Rated, AI Match Score, Newest, A-Z).

7. **Admin Dashboard & Role-Based Access Control**
   - Role-protected `/admin` route accessible only to users with `role: 'admin'`.
   - Real-time platform KPI metrics (Total Users, Catalog Titles, Total Watchlists, Active Streams).
   - Content Management: Add, edit, and delete catalog movies stored in MongoDB.
   - Users directory table inspecting registered members.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 19 + Vite 8
  - Tailwind CSS v4 (Glassmorphism, Glow effects, Netflix Crimson Theme)
  - React Router DOM v7
  - Axios (with JWT interceptors, proxy support, and network error handling)
  - Lucide React Icons

- **Backend:**
  - Node.js (ES Modules)
  - Express.js v5
  - MongoDB + Mongoose v9
  - JSON Web Tokens (`jsonwebtoken`)
  - Password Hashing (`bcryptjs`)
  - CORS (wildcard localhost development configuration)

- **AI Engine:**
  - Google Gemini API (REST client with intelligent mood-matching fallback)

---

## 📁 Project Structure

```text
CineMind-AI/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── adminController.js    # Platform stats, movie CRUD, user list
│   │   ├── aiController.js       # AI recommendation & mood endpoints
│   │   ├── authController.js     # User registration, login, profile updates
│   │   ├── progressController.js # Continue watching playback progress
│   │   └── watchlistController.js# User-isolated watchlist CRUD
│   ├── middleware/
│   │   └── auth.js               # JWT protect & admin role guard
│   ├── models/
│   │   ├── Movie.js              # Catalog & custom movies schema
│   │   ├── User.js               # Users schema with bcrypt password hashing
│   │   ├── Watchlist.js          # User-isolated watchlist schema
│   │   └── WatchProgress.js      # Video playback timestamps schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── progressRoutes.js
│   │   └── watchlistRoutes.js
│   ├── services/
│   │   └── geminiService.js      # Gemini API caller + fallback engine
│   ├── utils/
│   │   └── generateToken.js      # JWT token signer
│   ├── .env                      # Backend environment variables
│   ├── server.js                 # Express server & CORS configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AdminRoute.jsx     # Admin role route protection
│   │   │   │   ├── Navbar.jsx         # Navigation bar & search
│   │   │   │   └── ProtectedRoute.jsx # Auth route protection
│   │   │   ├── movie/
│   │   │   │   ├── ContinueWatchingRow.jsx # Resume playback row
│   │   │   │   ├── HeroBanner.jsx     # Netflix-style top hero banner
│   │   │   │   ├── MovieCard.jsx      # Movie card with hover overlay
│   │   │   │   ├── MovieModal.jsx     # Quick-view modal dialog
│   │   │   │   └── MovieRow.jsx       # Horizontal scrolling row
│   │   │   └── player/
│   │   │       └── VideoPlayer.jsx    # Custom HTML5 video player with shortcuts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Authentication state & session restore
│   │   │   └── ToastContext.jsx       # Non-intrusive toast notifications
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx         # Master layout with footer
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx     # Admin analytics & movie management
│   │   │   ├── AIRecommend.jsx        # Gemini mood recommendation interface
│   │   │   ├── Discover.jsx           # Catalog filtering & search
│   │   │   ├── Home.jsx               # Featured & categorized movie showcase
│   │   │   ├── Login.jsx              # User sign in page
│   │   │   ├── MovieDetails.jsx       # Full movie details (/movie/:id)
│   │   │   ├── Movies.jsx             # Movies catalog
│   │   │   ├── NotFound.jsx           # 404 page
│   │   │   ├── Profile.jsx            # User profile, history & settings
│   │   │   ├── Signup.jsx             # User registration page
│   │   │   ├── TVShows.jsx            # TV shows showcase
│   │   │   └── WatchPage.jsx          # Borderless streaming page (/watch/:id)
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── aiService.js
│   │   │   ├── api.js                 # Axios instance with JWT interceptors
│   │   │   ├── authService.js
│   │   │   ├── progressService.js
│   │   │   └── watchlistService.js
│   │   ├── utils/
│   │   │   ├── mockMovies.js          # Curated master catalog
│   │   │   └── movieVideos.js         # Legal public-domain stream mappings
│   │   ├── App.jsx                    # Application routing & watchlist state
│   │   ├── main.jsx                   # React root with providers
│   │   └── index.css                  # Tailwind CSS styling & animations
│   ├── .env                           # Frontend environment variables
│   ├── vite.config.js                 # Vite configuration with /api reverse proxy
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer recommended, verified on v24)
- **MongoDB** running locally on default port `27017` (e.g. via MongoDB Community Server or MongoDB Compass)

### 2. Environment Variables Configuration

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cinemind_ai
CLIENT_URL=http://localhost:5173
JWT_SECRET=cinemind_jwt_super_secret_development_key_2026
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_optional_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted, the recommendation engine automatically utilizes the built-in intelligent mood-matching fallback.)*

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=/api
```
*(The Vite development server transparently proxies all `/api` requests to `http://127.0.0.1:5000`.)*

---

### 3. Running the Application

Open two terminal windows:

#### Terminal 1 — Start the Backend Server:
```powershell
cd C:\Users\Dev\OneDrive\Desktop\CineMind-AI\backend
npm start
```
*Output: `[CineMind AI] Backend server running on http://localhost:5000`*

#### Terminal 2 — Start the Frontend Application:
```powershell
cd C:\Users\Dev\OneDrive\Desktop\CineMind-AI\frontend
npm run dev
```
*Output: `Vite dev server running at: http://localhost:5173/`*

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification

To execute the automated end-to-end verification test suite:

```powershell
cd C:\Users\Dev\OneDrive\Desktop\CineMind-AI\backend
node test_full_system.mjs
```

This verifies:
1. MongoDB database connectivity and collection access.
2. Health check route (`/api/health`).
3. User registration, duplicate detection, login, wrong password rejection, `/api/auth/me`, and `/api/auth/profile` updates.
4. Watchlist CRUD, compound index uniqueness, and strict user isolation.
5. Watch progress timestamp logging and retrieval for Continue Watching.
6. AI movie recommendations with 8 moods and intelligent fallback.
7. Admin dashboard authorization, statistics metrics, user listing, and movie CRUD.
8. HTTP Range requests to open-license MP4 movie streams.

---

## 🔒 Security & Data Integrity

- Passwords hashed with `bcryptjs` (salt rounds: 10) before MongoDB persistence.
- Password hashes marked with `select: false` so they are excluded from Mongoose queries by default.
- Strict JWT authentication on protected endpoints.
- Preflight CORS handling with explicit allowed headers and dynamic localhost detection.
- Cross-Site Scripting (XSS) and injection mitigation via strict Mongoose schema validation.

---

## 🎬 Open Source Movie Attribution

Video streams used in CineMind AI are public-domain or open-source creative works:
- **Big Buck Bunny** — (c) copyright 2008, Blender Foundation / www.bigbuckbunny.org
- **Sintel** — (c) copyright 2010, Blender Foundation / www.sintel.org
- **Tears of Steel** — (c) copyright 2012, Blender Foundation / mango.blender.org
- **Elephants Dream** — (c) copyright 2006, Orange Open Movie Project / orange.blender.org
- Licensed under the Creative Commons Attribution 3.0 License.
