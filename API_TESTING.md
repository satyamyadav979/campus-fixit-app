# API Testing Instructions

## Using cURL

### 1. Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@student.edu",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.edu",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Create an Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Broken Light in Room 101",
    "description": "The ceiling light is not working since morning",
    "category": "Electrical",
    "priority": "High"
  }'
```

### 4. Get All Issues
```bash
curl -X GET http://localhost:5000/api/issues \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Update Issue Status (Admin Only)
```bash
# First login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@campus.edu",
    "password": "Admin@123"
  }'

# Then update issue
curl -X PUT http://localhost:5000/api/issues/ISSUE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "In Progress",
    "remarks": "Electrician has been assigned"
  }'
```

## Using Postman

1. Import the following collection or create requests manually:
   - Set base URL: `http://localhost:5000/api`
   - Add Authorization header with Bearer token after login

2. Test flow:
   - Register → Login → Create Issue → View Issues → Admin Login → Update Status
