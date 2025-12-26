# MongoDB Setup Guide for Campus FixIt

You have **two options** to set up MongoDB. Choose the one that works best for you:

---

## Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED** ⭐

This is the easiest option - **no installation required**, completely **FREE**, and works immediately!

### Step-by-Step Instructions:

#### 1. Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with your email (or use Google/GitHub login)
3. Choose the **FREE** tier (M0 Sandbox)

#### 2. Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider (AWS/Google Cloud/Azure - any is fine)
4. Choose a region close to you
5. Click **"Create Cluster"** (takes 1-3 minutes)

#### 3. Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `campusfixit`
   - Password: `CampusFixIt2024!` (or any strong password)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

#### 4. Allow Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
   - *Note: For production, use specific IP addresses*
4. Click **"Confirm"**

#### 5. Get Connection String

1. Go back to **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://campusfixit:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 6. Update Your Backend `.env` File

1. Open `backend/.env` file
2. Replace the MongoDB URI line with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://campusfixit:CampusFixIt2024!@cluster0.xxxxx.mongodb.net/campus-fixit?retryWrites=true&w=majority
   ```
   
   **Important:** 
   - Replace `<password>` with your actual password
   - Replace `xxxxx` with your cluster ID from the connection string
   - Add `/campus-fixit` before the `?` to specify database name

#### 7. Start Your Backend

```bash
cd "Campus App/backend"
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Default admin user created
🚀 Server running on port 5000
```

**Done!** Your backend is now connected to MongoDB Atlas! 🎉

---

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally on your Mac:

### Step 1: Install MongoDB

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0
```

### Step 2: Start MongoDB Service

```bash
# Start MongoDB as a service (runs in background)
brew services start mongodb-community@7.0

# Verify it's running
brew services list | grep mongodb
```

You should see `mongodb-community@7.0` with status `started`.

### Step 3: Verify Installation

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

### Step 4: Your `.env` File

The default `.env` configuration should work:
```env
MONGODB_URI=mongodb://localhost:27017/campus-fixit
```

### Step 5: Start Your Backend

```bash
cd "Campus App/backend"
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Default admin user created
🚀 Server running on port 5000
```

---

## Troubleshooting

### MongoDB Atlas Issues

**Connection timeout:**
- Check that you added `0.0.0.0/0` to Network Access
- Verify username/password in connection string
- Wait a few minutes for cluster to fully deploy

**Authentication failed:**
- Make sure password in connection string matches database user password
- Check for special characters in password (may need URL encoding)

### Local MongoDB Issues

**"brew: command not found":**
- Install Homebrew first (see Step 1 above)

**MongoDB won't start:**
```bash
# Check logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log

# Try manual start
mongod --config /opt/homebrew/etc/mongod.conf
```

**Port 27017 already in use:**
```bash
# Find and kill the process
lsof -ti:27017 | xargs kill -9

# Restart MongoDB
brew services restart mongodb-community@7.0
```

---

## Which Option Should I Choose?

| Feature | MongoDB Atlas (Cloud) | Local MongoDB |
|---------|----------------------|---------------|
| **Setup Time** | 5 minutes | 10-15 minutes |
| **Cost** | FREE (512MB) | FREE |
| **Installation** | None needed | Requires installation |
| **Internet Required** | Yes | No |
| **Best For** | Quick start, demos | Development, offline work |
| **Recommended** | ✅ YES | For advanced users |

**For this assignment, I recommend MongoDB Atlas** - it's faster, easier, and requires no local setup!

---

## After MongoDB is Running

Once you see the backend server successfully connected to MongoDB:

1. **Restart Expo** (if not already running):
   ```bash
   cd "Campus App/mobile"
   npx expo start
   ```

2. **Update API URL** in `mobile/utils/api.js`:
   - For iOS Simulator: `http://localhost:5000/api`
   - For Android: `http://10.0.2.2:5000/api`
   - For Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

3. **Test the Full App:**
   - Register a student account
   - Create an issue with photo
   - Login as admin (`admin@campus.edu` / `Admin@123`)
   - Update issue status

---

## Quick Reference

### Default Admin Login
- **Email:** `admin@campus.edu`
- **Password:** `Admin@123`

### Backend Server
```bash
cd "Campus App/backend"
npm start
```

### Mobile App
```bash
cd "Campus App/mobile"
npx expo start
```

---

Need help? Check the main [README.md](file:///Users/satyam/Desktop/Campus%20App/README.md) for more details!
