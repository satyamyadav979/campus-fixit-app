# Campus FixIt

A mobile app for reporting and managing campus issues. Students can report problems with photos, and admins can track and resolve them.

## Features

**For Students:**
- Register and login
- Report issues with photos
- Track your submitted issues
- See status updates
- Browse all campus issues
- Filter by category and status

**For Admins:**
- View all reported issues
- Update status and add remarks
- Set priority levels
- Manage and delete issues

## Tech Stack

**Mobile App:**
- React Native (Expo)
- React Navigation
- Context API
- Expo Image Picker
- AsyncStorage
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs

## 📁 Project Structure

```
Campus App/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with authentication
│   │   └── Issue.js         # Issue schema
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   └── issues.js        # Issue CRUD endpoints
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── admin.js         # Admin authorization
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env                 # Environment variables
│
└── mobile/
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── HomeScreen.js
    │   ├── CreateIssueScreen.js
    │   ├── IssueDetailScreen.js
    │   ├── AllIssuesScreen.js
    │   └── ProfileScreen.js
    ├── context/
    │   ├── AuthContext.js   # Authentication state
    │   └── IssueContext.js  # Issue management state
    ├── navigation/
    │   └── AppNavigator.js  # Navigation setup
    ├── utils/
    │   └── api.js           # Axios configuration
    ├── App.js               # Main app component
    ├── package.json
    └── app.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "Campus App/backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit the `.env` file with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-fixit
   # OR use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-fixit
   
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   ADMIN_EMAIL=admin@campus.edu
   ADMIN_PASSWORD=Admin@123
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or manually
   mongod
   ```

5. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # OR production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory:**
   ```bash
   cd "Campus App/mobile"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL:**
   
   Open `mobile/utils/api.js` and update the API_BASE_URL:
   
   - **iOS Simulator**: `http://localhost:5000/api`
   - **Android Emulator**: `http://10.0.2.2:5000/api`
   - **Physical Device**: `http://YOUR_COMPUTER_IP:5000/api`
     (Find your IP: `ipconfig getifaddr en0` on macOS or `ipconfig` on Windows)

4. **Start the Expo development server:**
   ```bash
   npm start
   # OR
   npx expo start
   ```

5. **Run the app:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 🔐 Default Admin Credentials

After starting the backend, a default admin account is automatically created:

- **Email**: `admin@campus.edu`
- **Password**: `Admin@123`

**⚠️ IMPORTANT**: Change these credentials after first login for security!

## 📱 App Usage Guide

### For Students

1. **Registration**
   - Open the app and tap "Register"
   - Enter your name, email, and password
   - You'll be automatically logged in

2. **Report an Issue**
   - Tap the "+" New Issue button on the Home screen
   - Fill in title, description, and select category
   - Optionally add a photo
   - Select priority level
   - Tap "Submit Issue"

3. **Track Your Issues**
   - View all your issues on the Home screen
   - Tap any issue to see details
   - Check status updates and admin remarks

4. **Browse All Issues**
   - Go to "Browse" tab
   - Filter by category and status
   - View issues reported by others

### For Administrators

1. **Login**
   - Use admin credentials
   - Access all issues across the campus

2. **Manage Issues**
   - View any issue from Browse tab
   - Update issue status (Open → In Progress → Resolved)
   - Add remarks for users
   - Set priority levels
   - Delete inappropriate issues

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Issues
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues (with filters)
- `GET /api/issues/:id` - Get single issue
- `PUT /api/issues/:id` - Update issue (admin)
- `DELETE /api/issues/:id` - Delete issue
- `PUT /api/issues/:id/remarks` - Add remarks (admin)

See `backend/README.md` for detailed API documentation.

## 🎨 Categories

- ⚡ **Electrical** - Power outages, faulty lights, etc.
- 💧 **Water** - Leaks, plumbing issues, etc.
- 📡 **Internet** - WiFi problems, connectivity issues
- 🏗️ **Infrastructure** - Building maintenance, furniture, etc.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (Student/Admin)
- Protected API routes
- Token expiration (30 days)
- Input validation and sanitization

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
brew services start mongodb-community
# Or check if it's already running
brew services list
```

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### Mobile App Issues

**Cannot connect to API:**
- Check that backend is running
- Verify API_BASE_URL in `mobile/utils/api.js`
- For physical devices, ensure phone and computer are on same WiFi
- Disable any firewalls blocking port 5000

**Image Picker Not Working:**
- Grant camera/gallery permissions when prompted
- On iOS simulator, you'll need to use a real device for camera

**Expo Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

## Future Improvements

- Email/push notifications
- Admin dashboard
- Location tagging
- Multiple images per issue
- Comments on issues

---

Built for campus issue management
