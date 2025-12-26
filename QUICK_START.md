# Campus FixIt - Quick Start Guide

## ⚡ Quick Setup (5 Minutes)

### 1. Start Backend

```bash
cd "Campus App/backend"

# Dependencies already installed ✅
# Just start the server:
npm start
```

**Look for this output:**
```
✅ MongoDB connected successfully
✅ Default admin user created
🚀 Server running on port 5000
```

---

### 2. Start Mobile App

**First, update the API URL:**

Open `mobile/utils/api.js` and change line 11:

```javascript
// Choose based on your device:
const API_BASE_URL = 'http://localhost:5000/api';        // iOS Simulator
// const API_BASE_URL = 'http://10.0.2.2:5000/api';      // Android Emulator  
// const API_BASE_URL = 'http://YOUR_IP:5000/api';       // Physical Device
```

**Then start Expo:**

```bash
cd "Campus App/mobile"

# Dependencies already installed ✅
# Just start Expo:
npx expo start
```

**Run the app:**
- Scan QR code with Expo Go app
- Or press `i` for iOS Simulator
- Or press `a` for Android Emulator

---

### 3. Test the App

#### As Student:
1. Register a new account
2. Create an issue with photo
3. View your issues

#### As Admin:
1. Logout from student account
2. Login with:
   - Email: `admin@campus.edu`
   - Password: `Admin@123`
3. Browse issues
4. Update status and add remarks

---

## 🎯 What to Test

- ✅ User registration & login
- ✅ Create issue with image
- ✅ View issues list
- ✅ Filter by category/status
- ✅ Admin status updates
- ✅ Admin remarks
- ✅ Issue deletion

---

## 📚 Documentation

- **Main README**: [README.md](file:///Users/satyam/Desktop/Campus%20App/README.md)
- **API Docs**: [backend/README.md](file:///Users/satyam/Desktop/Campus%20App/backend/README.md)
- **API Testing**: [API_TESTING.md](file:///Users/satyam/Desktop/Campus%20App/API_TESTING.md)
- **Implementation Walkthrough**: See artifacts

---

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure MongoDB is running: `brew services start mongodb-community`
- Check if port 5000 is available

**Mobile app can't connect:**
- Verify backend is running
- Check API_BASE_URL in `mobile/utils/api.js`
- For physical devices: use computer's IP address
- Ensure phone and computer on same WiFi

**Image picker not working:**
- Grant permissions when prompted
- On iOS simulator, use a real device for camera

---

## ✅ All Features Implemented

✓ Complete authentication system  
✓ Issue CRUD operations  
✓ Image upload with Base64  
✓ Category & status filtering  
✓ Admin controls  
✓ Role-based access  
✓ Responsive mobile UI  
✓ Error handling  

**Ready for submission!** 🎉
