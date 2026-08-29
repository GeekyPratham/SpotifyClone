# SpotifyClone

A dark-themed, Spotify-inspired music player web app with user authentication. The frontend is a static HTML/CSS/vanilla-JavaScript client that plays locally-hosted `.mp3` playlists, and the backend is a small Node.js/Express + MongoDB API that handles account signup and signin, issuing JWTs on successful login.

---

## Features

- Email/password signup and signin with JWT issuance
- Auth-gated music library — playback UI only unlocks once a user is signed in
- Browse multiple playlists (folders of `.mp3` files) via clickable playlist cards
- Full playback controls: play/pause, next/previous (with looping), seek bar, volume + mute toggle
- Responsive collapsible sidebar navigation
- Logout clears the session client-side

## Tech Stack

**Frontend:** HTML5, CSS3, vanilla JavaScript (no framework, no bundler)
**Backend:** Node.js, Express 4
**Database:** MongoDB via Mongoose
**Auth:** JSON Web Tokens (`jsonwebtoken`)
**Other:** `cors`, `body-parser`, `dotenv`

## Project Structure

```
SpotifyClone-main/
├── Backend/
│   ├── db/index.js        # Mongoose connection + Admin model
│   ├── index.js            # Express app entry point
│   ├── routes/admin.js     # /admin/signup and /admin/signin routes
│   └── package.json
└── Frontend/
    ├── index.html           # Main player UI
    ├── script.js            # Player logic + auth gate
    ├── style.css / utility.css
    ├── SignIn.html / Signin.css / signin.js
    ├── SignUp.html / SignUp.css / SignUp.js
    └── musicSong/           # Playlist folders — each holds the .mp3 files for one playlist
        ├── bhaktiSong/
        ├── newCurrentSong/
        ├── oldSong/
        └── BhojpuriSong/
```

## Prerequisites

- **Node.js** ≥ 18 and **npm**
- A **MongoDB** instance — either a local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **VS Code with the Live Server extension** (or an equivalent static server that auto-generates directory-listing pages) to serve the `Frontend/` folder in development — this is required because the player loads each playlist's song list by parsing the folder's auto-generated directory index (see [Known Limitations](#known-limitations))

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd SpotifyClone-main

# 2. Install backend dependencies
cd Backend
npm install
```

The frontend has no dependencies to install — it's served as static files.

## Environment Setup

Create a `.env` file inside `Backend/` with the following variables:

```env
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>
secret=<a-long-random-string-used-to-sign-JWTs>
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URL` | Yes | Full MongoDB connection string (Atlas SRV URI or local `mongodb://localhost:27017/spotifyclone`) |
| `secret` | Yes | Secret key used to sign and (in a future update) verify JWTs. Use a long, random value in any real deployment. |

> The server currently listens on a hardcoded port (`8080`). If you deploy to a host that injects its own `PORT` (Render, Heroku, etc.), update `Backend/index.js` to use `process.env.PORT || 8080`.

## Running the App

### Backend (development)

```bash
cd Backend
node index.js
# Server is running on port 8080
```

For auto-restart on file changes during development, you can install and use `nodemon`:

```bash
npm install --save-dev nodemon
npx nodemon index.js
```

### Frontend (development)

1. Open the `Frontend/` folder in VS Code.
2. Right-click `index.html` → **"Open with Live Server"** (defaults to `http://127.0.0.1:5500`). This step matters — the player fetches directory listings from this exact origin/port to build each playlist's track list.
3. Add your own `.mp3` files into the relevant `Frontend/musicSong/<playlistName>/` folder(s) — the archive ships with the folder structure but no audio files. Each playlist card in `index.html` has a `data-folder` attribute that must match a folder name under `musicSong/`.
4. To sign up/sign in against a **local** backend instead of the deployed one, update the fetch URLs in `Frontend/signin.js` and `Frontend/SignUp.js` from the production Render URL to `http://localhost:8080/admin/signin` / `/signup`.

### Production

- **Backend:** deploy `Backend/` to any Node host (Render, Railway, Fly.io, a VPS, etc.). Set `MONGODB_URL` and `secret` as environment variables on the host; set the start command to `node index.js`.
- **Frontend:** because the player currently depends on a directory-auto-indexing dev server (see [Known Limitations](#known-limitations)), it is **not deployment-ready as-is** on static hosts like Netlify/Vercel/GitHub Pages without first replacing `getSongs()` with a real API/manifest-based song list. For a quick static deploy of the auth pages and UI shell, any static host will work — but playlists won't load until that fix is made.

## API Documentation

Base URL (deployed): `https://spotifyclone-ylrx.onrender.com`
Base URL (local): `http://localhost:8080`

All endpoints are under `/admin`.

### `POST /admin/signup`

Create a new account.

**Request body**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Responses**
| Status | Body | Meaning |
|---|---|---|
| 201 | `{ "msg": "Admin created successfully" }` | Account created |
| 400 | `{ "msg": "Please provide all required fields" }` | Missing field(s) |
| 411 | `{ "msg": "User alrady exist." }` | Email already registered |
| 500 | `{ "msg": "Server error: Could not create admin" }` | Unexpected server error |

### `POST /admin/signin`

Authenticate and receive a JWT.

**Request body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses**
| Status | Body | Meaning |
|---|---|---|
| 200 | `{ "token": "<jwt>" }` | Success — store the token client-side (e.g. `localStorage`) |
| 411 | `{ "msg": "incorrect email or passwrod" }` | No matching account/credentials |
| 500 | `{ "msg": "Error in signing token" }` | JWT signing failed |

**Authentication note:** the issued JWT is not currently verified by any backend middleware — no route checks or requires it. It is used purely by the frontend (stored in `localStorage.authToken`) to decide whether to display the music player UI. Treat this as a UI convenience flag, not a security boundary, until server-side token verification middleware is added.

## License

No license file is currently included in this repository. Add a `LICENSE` file (e.g., MIT) if you intend to accept external contributions or reuse.
