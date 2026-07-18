# IntruX — Frontend

AI-powered zone-based intrusion detection system. This repository contains the **frontend** (Next.js) built for Frontend Developer 1's scope: Authentication, Camera Management, Leaflet Map, Zone Drawing, and Role-Based Access Control.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `src/` layout, Turbopack) |
| Styling | Tailwind CSS |
| State management | Zustand |
| Auth + Database | Supabase (`@supabase/ssr`, cookie-based sessions) |
| Map | Leaflet + react-leaflet |
| Zone drawing | Leaflet (`CRS.Simple` mode) + leaflet-draw |
| Route protection | Next.js Proxy (`src/proxy.js`) |

## Project Structure

```
intrux/
├── public/
│   └── snapshots/              # Static camera-feed snapshot(s) used as the zone-drawing surface
│
├── src/
│   ├── proxy.js                # Route protection — redirects based on auth session (Next.js 16+ convention, replaces middleware.js)
│   │
│   ├── app/
│   │   ├── login/page.jsx              # Login page
│   │   ├── signup/page.jsx             # Signup page
│   │   │
│   │   └── dashboard/
│   │       ├── layout.jsx              # Dashboard shell — sidebar + nav
│   │       ├── page.jsx                # Dashboard home
│   │       │
│   │       └── cameras/
│   │           ├── page.jsx                    # Camera list + Leaflet map (Add form shown to owners only)
│   │           └── [id]/
│   │               ├── page.jsx                # Camera detail / edit (read-only for viewers)
│   │               └── zone/page.jsx            # Zone drawing page (read-only for viewers)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx          # Includes "check your inbox" flow for email confirmation
│   │   │
│   │   ├── cameras/
│   │   │   └── CameraMap.jsx           # Leaflet map — camera pins at GPS coordinates
│   │   │
│   │   ├── zone/
│   │   │   └── ZoneDrawer.jsx          # Polygon-drawing tool over a static camera snapshot
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx
│   │       └── Input.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js           # Session + profile (role) loading, used across protected pages
│   │
│   ├── lib/
│   │   ├── supabase.js          # Supabase browser client (createBrowserClient)
│   │   ├── auth.js              # signUp / signIn / signOut / getProfile
│   │   └── cameras.js           # getCameras / getCameraById / addCamera / updateCamera / deleteCamera
│   │
│   └── store/
│       └── useStore.js          # Zustand global store
│
└── .env.local                   # Supabase URL + anon key (not committed — see below)
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
This file is git-ignored — never commit real keys.

3. Run the dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Database Setup (Supabase)

Two tables back this app:

- **`profiles`** — `id`, `full_name`, `role` (`'owner'` or `'viewer'`, defaults to `'viewer'` on signup)
- **`cameras`** — `id`, `owner_id`, `name`, `rtsp_url`, `latitude`, `longitude`, `status`, `zone_polygon` (jsonb)

Row-Level Security (RLS) enforces:
- Any authenticated user can **read** all cameras (shared visibility)
- Only accounts with `role = 'owner'` can **insert/update/delete** cameras

New signups default to `viewer`. Promoting an account to `owner` is a manual step in Supabase's Table Editor (`profiles` table) — this is intentional; roles are not self-assignable at signup.

## Features

- **Authentication** — signup/login, email confirmation handling, cookie-based session persistence, protected `/dashboard` routes
- **Camera Management** — add/edit/delete cameras with RTSP URL validation, persisted to Supabase
- **Leaflet Map** — camera pins at real GPS coordinates; click a pin to open that camera
- **Zone Drawing** — draw a restricted-area polygon over a snapshot of the camera's field of view (not the geographic map — detection needs pixel coordinates, not GPS)
- **Role-Based Access** — owners get full CRUD; viewers get a read-only view of the same shared camera set, enforced both in the UI and at the database level

## Known Limitations / Out of Scope

- Uses a static extracted video frame as a stand-in for a live camera snapshot — real RTSP stream ingestion is a separate backend task
- No detection pipeline in this repo (YOLOv8n / FastAPI backend is a separate service)
- No push notifications (Firebase FCM) or physical alarm integration (MQTT/ESP32) yet — planned for a later phase
- Email confirmation is currently toggled for dev convenience in Supabase; re-enable enforcement before onboarding real users
