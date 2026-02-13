
# Project Context: ChatGuru Onboarding

## Overview
This is a React 19 web application acting as a self-service onboarding wizard for a SaaS platform (ChatGuru). The goal is a "One Click to Go" experience allowing users to register, choose plans, connect WhatsApp, and configure chatbots seamlessly.

## Project Structure
```text
/
├── index.html           # Entry point, Tailwind Config, Importmaps
├── index.tsx            # React Root
├── App.tsx              # Main Layout, Lazy loading of steps
├── types.ts             # Global TypeScript Interfaces
├── constants.ts         # Static data (Plans, Niches, Configs)
├── context/
│   └── OnboardingContext.tsx # Global State (Wizard Step, User Data)
├── components/
│   ├── ui/              # Reusable UI (Button, Input, ChatBubble)
│   ├── steps/           # Individual Wizard Screens (Welcome, Auth, etc.)
│   ├── Logo.tsx         # Brand Logo
│   └── ProgressBar.tsx  # Wizard Progress Indicator
├── services/
│   ├── httpClient.ts    # Fetch wrapper
│   └── onboardingService.ts # Mock backend logic with delays
├── validators/
│   └── schemas.ts       # Zod validation schemas
└── utils/
    └── jwt.ts           # JWT decoding utility
```

## Tech Stack & Conventions

### 1. Framework & Core
- **React 19:** Uses `createRoot`, `Suspense`, `lazy`, and Hooks (`useState`, `useEffect`, `useContext`, `useRef`).
- **No Router:** Navigation is handled by state (`currentStep`) in `OnboardingContext`.
- **Module System:** Browser-native ES Modules via `importmap` (esm.sh).

### 2. Styling (Tailwind CSS)
- configuration is injected in `index.html`.
- **Custom Colors:**
  - `brand-green`: `#2DD4A0` (Primary)
  - `brand-greenDark`: `#1B3D2F` (Headings/Dark BG)
  - `brand-offWhite`: `#F7FAF8` (App Background)
  - `brand-textMuted`: `#6B7C74`
- **Animations:**
  - `animate-fade-in`: Opacity 0 -> 1.
  - `animate-slide-up`: TranslateY 10px -> 0px + Opacity.

### 3. Data & Validation
- **Zod:** Used for form validation.
  - **Rule:** Name field requires composite name (min 2 words, max 300 chars).
  - **Rule:** Password min 8 chars.
  - **Rule:** Company name > 3 chars.
- **Interfaces:** All types must be exported from `types.ts`.

### 4. Authentication
- **Google:** Native integration using `window.google.accounts.id` (GSI).
- **Email:** Custom flow with OTP verification simulation.

### 5. Services
- All API calls are mocked in `onboardingService.ts` using `setTimeout` to simulate network latency for better UX perception.
- `httpClient.ts` is prepared for real Fetch API calls.

## Key Development Rules
1.  **Immutability:** Always treat state as immutable.
2.  **Responsiveness:** Mobile-first approach using Tailwind classes (e.g., `flex-col md:flex-row`).
3.  **Clean Code:** Keep components small. If a step becomes too complex, extract sub-components to the same file or `components/ui` if reusable.
4.  **Icons:** Use Inline SVGs. Do not install icon libraries to avoid build complexity in this environment.

## Current Wizard Steps
1.  `welcome`: Intro screen.
2.  `auth`: Login/Register (Google or Email).
3.  `verify`: Phone & Company Name input.
4.  `plan`: Plan selection (Starter, Business, Enterprise).
5.  `niche`: Business type selection for auto-config.
6.  `channel`: Choose connection type (Web vs WABA).
7.  `connect`: QR Code scanning simulation.
8.  `chatbot`: Greeting message configuration.
9.  `cockpit`: Final checklist dashboard.
10. `live`: Simulated live chat interface.
