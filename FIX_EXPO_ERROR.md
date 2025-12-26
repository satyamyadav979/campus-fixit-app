# Fix Expo "Too Many Open Files" Error

## Problem
The error `EMFILE: too many open files` occurs because macOS has a default limit of open file descriptors that's too low for Metro Bundler.

## Solution

### Option 1: Quick Fix (Current Terminal Session)
Run this command in your terminal before starting Expo:

```bash
ulimit -n 4096
cd "/Users/satyam/Desktop/Campus App/mobile"
npx expo start
```

### Option 2: Permanent Fix (Recommended)
Add this to your `~/.zshrc` file:

```bash
echo "ulimit -n 4096" >> ~/.zshrc
source ~/.zshrc
```

Then restart your terminal and run:

```bash
cd "/Users/satyam/Desktop/Campus App/mobile"
npx expo start
```

### Option 3: Install Watchman (Best Performance)
Watchman is more efficient at file watching:

```bash
brew install watchman
cd "/Users/satyam/Desktop/Campus App/mobile"
npx expo start
```

## After Running These Commands

Once Expo starts successfully, you'll see a QR code. You can:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Alternative: Use Expo Web
If you continue having issues, you can test in the browser:

```bash
cd "/Users/satyam/Desktop/Campus App/mobile"
npx expo start --web
```
