# Placement Portal Backend

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server** (SQLite database is created automatically)
   ```bash
   npm run dev
   ```

## Database
- Uses **SQLite** - no external database setup required!
- Database file: `database.sqlite` (created automatically)
- Tables are created automatically on first run

## Default Admin Credentials
- **Email**: admin@placementportal.com
- **Password**: admin123

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Questions Routes
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `GET /api/questions/category/:category` - Get by category
- `GET /api/questions/random` - Get random questions
- `POST /api/questions` - Create question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Tests Routes
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests/:id/submit` - Submit test (protected)
- `GET /api/tests/results` - Get user test results (protected)
- `POST /api/tests` - Create test (admin)

### Companies Routes
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `GET /api/companies/status/:status` - Get by status
- `POST /api/companies` - Create company (admin)
- `POST /api/companies/:id/experience` - Add interview experience (protected)

### Progress Routes
- `GET /api/progress` - Get user progress (protected)
- `POST /api/progress` - Update progress (protected)
- `GET /api/progress/stats` - Get overall stats (protected)