# Campus FixIt Backend API

Backend server for Campus FixIt - Campus Issue Reporting System.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Issue Routes

#### Create Issue
```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Broken Light in Room 101",
  "description": "The ceiling light is not working",
  "category": "Electrical",
  "image": "data:image/jpeg;base64,...",
  "priority": "High"
}
```

#### Get All Issues
```http
GET /api/issues?category=Electrical&status=Open&myIssues=true
Authorization: Bearer <token>
```

#### Get Single Issue
```http
GET /api/issues/:id
Authorization: Bearer <token>
```

#### Update Issue (Admin Only)
```http
PUT /api/issues/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "remarks": "Electrician assigned",
  "priority": "High"
}
```

#### Add Remarks (Admin Only)
```http
PUT /api/issues/:id/remarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "remarks": "Issue has been resolved"
}
```

#### Delete Issue
```http
DELETE /api/issues/:id
Authorization: Bearer <token>
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-fixit
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=Admin@123
```

3. Start MongoDB (if running locally)

4. Run the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## Default Admin Credentials

- **Email**: admin@campus.edu
- **Password**: Admin@123

**⚠️ IMPORTANT**: Change these credentials after first login!

## Data Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String: 'student' | 'admin')

### Issue
- title (String, required)
- description (String, required)
- category (Enum: Electrical, Water, Internet, Infrastructure)
- status (Enum: Open, In Progress, Resolved)
- priority (Enum: Low, Medium, High)
- image (String, Base64)
- createdBy (ObjectId, ref: User)
- remarks (String)

## Error Handling

All endpoints return responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```
