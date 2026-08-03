# Sports Progression Tracker — Node.js + Express + MongoDB API

A backend for a school/college sports tracking app. Users register, play
matches in different sports, and climb a level ladder:

```
LEVEL_1 → LEVEL_2 → LEVEL_3 → LEVEL_4 → LEVEL_5 → DISTRICT → STATE → OLYMPICS
```

This is a from-scratch **Node.js/Express/MongoDB** rebuild of an original
Spring Boot/MySQL backend, kept 100% API-compatible with the existing React
frontend (same routes, same JSON response shape).

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web framework | Express |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs password hashing |
| Validation | express-validator |
| Dev tooling | nodemon, morgan (request logging) |

---

## Project structure

```
sports-node-backend/
├── server.js                 # entry point — connects DB, starts Express
├── app.js                    # Express app: middleware, CORS, routes, error handling
├── src/
│   ├── config/db.js          # MongoDB connection
│   ├── constants/            # enums (game levels, roles, sport categories, score types)
│   ├── models/                # Mongoose schemas (User, Sport, Match, PlayerProgress, PerformanceSummary)
│   ├── middleware/            # auth (JWT check), error handler, validation, 404
│   ├── validators/            # express-validator rule chains per route
│   ├── controllers/           # thin HTTP layer — parses req, calls service, sends response
│   ├── services/               # business logic (score evaluation, level progression, etc.)
│   ├── routes/                 # route → controller wiring
│   └── seed/                   # seed data for the 34 sports + seed script
└── .env.example
```

### Why this layering?
Same reasoning as a typical Spring Boot app, just without the framework
magic:

```
Route          →  which URL maps to which function       (like @RequestMapping)
Middleware      →  auth check, validation, error handling  (like Spring Security filters / @ExceptionHandler)
Controller      →  reads req, calls a service, sends res    (like @RestController)
Service         →  the actual business rules                (like @Service)
Model (Mongoose)→  talks to the database                     (like a JPA @Entity + Repository combined)
```

---

## How it maps to the original Spring Boot project

| Java / Spring Boot | Node.js equivalent | Notes |
|---|---|---|
| `@RestController` | `controllers/*.js` | Same responsibility: parse request, call service, return response |
| `@Service` | `services/*.js` | Business logic lives here |
| `@Entity` (JPA) | `models/*.js` (Mongoose schema) | MongoDB is schema-flexible but Mongoose still enforces structure |
| `JpaRepository` | Mongoose model methods (`Model.find()`, `.findById()`, etc.) | Mongoose models act as both entity + repository |
| `SecurityConfig` + `JwtAuthenticationFilter` | `middleware/auth.js` (`protect`) | Reads `Authorization: Bearer <token>`, verifies JWT, attaches user to `req.user` |
| `CorsConfig` | `cors()` middleware in `app.js` | |
| `GlobalExceptionHandler` (`@RestControllerAdvice`) | `middleware/errorHandler.js` | One place all errors flow through, same JSON error shape |
| `BadRequestException` / `ResourceNotFoundException` | `utils/AppError.js` | One class + a status code instead of two exception classes |
| `@Valid @RequestBody` + Bean Validation | `express-validator` rule chains + `middleware/validate.js` | Same field-level validation, same error response shape |
| `ApiResponse<T>` wrapper | `utils/ApiResponse.js` | Identical `{ success, message, data, timestamp }` shape — frontend needs zero changes |
| `data.sql` | `src/seed/seed.js` + `sportsSeedData.js` | Same idempotent "insert if not exists" behavior |
| `BCryptPasswordEncoder` | `bcryptjs` inside a Mongoose `pre('save')` hook on `User` | Password is hashed automatically before every save |
| `@UniqueConstraint` on entities | `schema.index({...}, { unique: true })` | e.g. one `PlayerProgress` per (user, sport) |
| MySQL relational joins | `.populate('sport')` | Mongoose's equivalent of a SQL join, done at query time |
| `MapToJsonConverter` (custom JPA converter for JSON column) | `mongoose.Schema.Types.Mixed` | MongoDB stores JSON natively — no converter class needed at all |

**Key architectural difference to be ready to explain in interviews:**
MongoDB is NoSQL and document-based, not relational. There are no foreign
key constraints or SQL joins. Instead:
- Relationships are modeled with `ObjectId` references (`ref: 'User'`) and
  resolved at query time with `.populate()`.
- Referential integrity (e.g. "this Match must point to a real User") isn't
  enforced by the database — it's enforced by application code.
- Uniqueness rules that were `@UniqueConstraint` in JPA become compound
  MongoDB indexes.

---

## API endpoints

All responses use this shape (unchanged from the Java version):
```json
{ "success": true, "message": "...", "data": { ... }, "timestamp": "..." }
```

| Method | Endpoint | Auth required |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/sports` | No |
| GET | `/api/sports/olympic` | No |
| GET | `/api/sports/:id` | No |
| POST | `/api/matches/submit` | Yes |
| POST | `/api/matches/advance/:sportId` | Yes |
| GET | `/api/matches/history/:sportId` | Yes |
| GET | `/api/matches/recent` | Yes |
| GET | `/api/performance/progress` | Yes |
| GET | `/api/performance/progress/:sportId` | Yes |
| GET | `/api/performance/summary/:sportId` | Yes |
| GET | `/api/performance/summary` | Yes |

Protected routes require: `Authorization: Bearer <token>`

---

## Setup

### 1. Install MongoDB
- Locally: install MongoDB Community Server, or
- Free cloud option: create a free cluster on MongoDB Atlas and copy its
  connection string

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, CLIENT_URL
```

### 4. Seed the sports data (one-time, safe to re-run)
```bash
npm run seed
```

### 5. Run the server
```bash
npm run dev     # with auto-restart (nodemon)
# or
npm start        # plain node
```

Server starts on `http://localhost:8080` (matches the Java app's default
port, so the existing frontend needs no changes).

---

## Talking points for interviews

1. **Why Express + Mongoose over other options?** It's the most widely
   used, well-documented combo in the Node ecosystem — easy for any
   teammate or interviewer to read.
2. **Password security:** bcrypt hashing happens automatically in a
   Mongoose `pre('save')` hook, so no controller/service can ever
   accidentally save a plaintext password.
3. **Centralized error handling:** every thrown `AppError` (or Mongoose
   validation/cast/duplicate-key error) flows through one `errorHandler`
   middleware — no repeated try/catch blocks in controllers.
4. **The core business logic** (`matchScoreEvaluator.js` +
   `matchService.js`) is deliberately separated from Express — it doesn't
   know about `req`/`res` at all, so it's easily unit-testable and could be
   reused (e.g. in a CLI tool or background job) without any HTTP layer.
5. **Data modeling tradeoff:** explain why MongoDB was a valid choice here
   (flexible `scoreDetails` field varies wildly by sport — cricket needs
   runs/wickets, swimming needs time, gymnastics needs judge scores — a
   schemaless `Mixed` field handles this more naturally than a rigid SQL
   column).
