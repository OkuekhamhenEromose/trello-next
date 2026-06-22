# Trello Next

A Next.js project inspired by Trello with a marketing landing page, user authentication flow, real-time board updates, and responsive UI components.

## Project overview

This repository contains a custom Trello-style Next.js application built with the App Router. It includes:

- Marketing landing page with feature sections and CTA.
- Email-based login and registration flow.
- Email verification and account setup pages.
- Auth state management via `AuthContext` and client-side token storage.
- Board UI with lists, cards, and navigation controls.
- Real-time synchronization using `socket.io-client`.
- API integration via Axios and custom service wrappers.
- Tailwind CSS styling and Radix UI primitives.

## Key routes

- `/` - Home marketing page
- `/login` - Login page with multi-step authentication
- `/signup` - Registration start page
- `/verify-email` - Email verification page
- `/setup-account` - Complete account setup after verification
- `/welcome` - Welcome page after signup
- `/board` - Board/dashboard interface

## Technologies

- `next` 15
- `react` 19
- `typescript`
- `tailwindcss`
- `axios`
- `socket.io-client`
- `react-hook-form`
- `@radix-ui/react-*`
- `lucide-react`
- `zod`
- `@tanstack/react-query`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file at the project root and add any backend URLs you need:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build the production app
- `npm run start` — start the production server after build
- `npm run lint` — run ESLint
- `npm run type-check` — run TypeScript type checking

## API and backend integration

The app expects a backend API at `NEXT_PUBLIC_API_URL` and proxies requests through `next.config.ts`.

- Default API endpoint: `http://localhost:5000/api`
- Default socket URL: `http://localhost:5000`

The frontend uses `services/api.ts` and `services/authService.ts` to manage auth, profile, boards, lists, cards, and real-time socket events.

## Auth flow

The project includes client-side auth state and token management:

- `contexts/AuthContext.tsx` manages user state and authentication lifecycle.
- `services/authService.ts` handles login, verification, token storage, and refresh.
- `services/socket.ts` connects a Socket.IO client once the user is authenticated.

## Notes

- The app is built with the App Router and server/client components.
- `app/layout.tsx` wraps the app in `AuthProvider`.
- `next.config.ts` includes rewrites for `/api/:path*` to the backend URL.
- Remote images are allowed from `localhost` and `trellonode.onrender.com`.

## Contributing

If you want to extend this project, start by exploring:

- `app/page.tsx` for the landing page layout
- `app/board/page.tsx` for the board/dashboard UI
- `services/api.ts` and `services/authService.ts` for backend integration
- `contexts/AuthContext.tsx` for auth state management

---

Built with Next.js, Tailwind CSS, and Socket.IO for a modern Trello-inspired experience.
