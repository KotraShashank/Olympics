# OlympicPath

OlympicPath is a real-time web application designed to track player performance and manage progression across 34 different sports. It features a custom scoring evaluator, automated level-gating, and a global leaderboard system.

## 🛠 Tech Stack

**Frontend**
* **React 18 & Vite:** UI framework utilizing concurrent rendering and automatic batching, built with Vite for rapid HMR.
* **Tailwind CSS:** Utility-first styling utilizing PurgeCSS for minimal build size.
* **Framer Motion:** Declarative animations for UI feedback (e.g., win celebrations, slide-overs).
* **React Hook Form & Zod:** Uncontrolled component form state management with strict TypeScript-first schema validation.
* **Recharts:** Declarative, React-idiomatic charting built on D3 primitives for performance dashboards.
* **Axios:** HTTP client configured with request/response interceptors for JWT token attachment and error handling.

**Backend**
* **Node.js & Express.js:** REST API utilizing a modular middleware architecture.
* **MongoDB & Mongoose:** Document database utilizing schema validation and hooks (e.g., pre-save password hashing). Handles dynamic data payloads via `Mixed` types for varied sport scoring.
* **JWT & bcryptjs:** Stateless session management and adaptive password hashing.
* **express-validator:** Middleware for chained request payload validation.

**Testing & DevOps**
* **Jest:** Unit testing framework with built-in snapshot testing guarding pure business logic.
* **GitHub Actions:** Automated CI/CD pipeline that runs test suites on every push.

## ✨ Core Features & Mechanics

### 1. Unified Score Evaluator
A centralized domain logic service (`matchScoreEvaluator.js`) that handles 11 distinct scoring paradigms without relying on brittle conditionals. 
* Processes wildly different rulesets (e.g., `CRICKET`, `KABADDI`, `COMBAT`) dynamically.
* Reverses comparison logic for sports like Athletics (`TIME_LOWER_WINS`) where a lower numeric input wins.

### 2. Level Progression State Machine
An automated progression engine (`matchService.advanceToNextLevel`) that gates advancement from `LEVEL_1` up to `OLYMPICS`.
* Validates strict state preconditions (e.g., total matches played and win thresholds).
* Generates immutable historical snapshots (`PerformanceSummary`) upon level completion.
* Automatically triggers side-effects, such as unlocking milestone achievements (e.g., `QUALIFIED_DISTRICT`).

### 3. Aggregation-Driven Leaderboards
A highly scalable global leaderboard (`leaderboardService.js`) returning the top 20 players by total wins.
* Offloads computation to the database using MongoDB Aggregation Pipelines (`$group`, `$match`, `$sort`, `$limit`, `$lookup`, `$unwind`, `$project`).
* Dynamically calculates total wins, matches played, and win rate percentages directly on the database server.

## 📂 Project Structure

```text
olympicpath/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── constants/       # Enums, levels, achievements
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── middleware/      # JWT auth, error handlers, rate limiters
│   │   ├── models/          # Mongoose schemas (User, Sport, Match, Progress)
│   │   ├── routes/          # Express API endpoints
│   │   ├── services/        # Core business logic and database queries
│   │   └── utils/           # Standardized responses and custom errors
│   │   ├── validators/      # express-validator rule chains
│   │   └── seed/            # Seed data for sports catalog
│   ├── tests/               # Jest test suites
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/
    ├── src/
    │   ├── api/             # Axios API client functions
    │   ├── components/      # Reusable UI (Navbar, Forms, Charts)
    │   ├── context/         # Global state (AuthContext)
    │   ├── pages/           # Route views (Dashboard, Match, Leaderboard)
    │   └── routes/          # Protected route wrappers
    ├── tailwind.config.js
    └── vite.config.js
