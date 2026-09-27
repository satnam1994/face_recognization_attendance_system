# Mobile App Setup Guide — FaceAttend

## Quick Overview

This is an **Expo (React Native)** app. You run it on your phone using the **Expo Go** app — no USB, no build required. Your phone and computer must be on the **same Wi-Fi network**.

---

## Step 1 — Install Expo Go on Your Phone

| Platform | Link |
|----------|------|
| Android  | Play Store → search **"Expo Go"** → install |
| iPhone   | App Store → search **"Expo Go"** → install |

---

## Step 2 — Verify Your Machine's IP Address

Find your current machine IP with:

To re-check it anytime, run in terminal:
```bash
ip addr show | grep "inet " | grep -v "127.0.0.1"
```
Look for the `192.168.x.x` address on your Wi-Fi/ethernet interface.

If the IP has changed, update **two files**:

**`mobile/app.json`** — lines 68–69:
```json
"extra": {
  "apiUrl": "http://YOUR_NEW_IP:3000",
  "socketUrl": "http://YOUR_NEW_IP:3000"
}
```

**`backend/.env`** — FRONTEND_URL line:
```
FRONTEND_URL=http://YOUR_NEW_IP:8081
```

When using the web app, it uses the browser's hostname with the API port from
`mobile/app.json`. To use a different API origin, set `EXPO_PUBLIC_API_URL`
before starting Expo (for example, `http://localhost:3000`; do not add `/api`).

---

## Step 3 — Start the Backend Server

Open a terminal and run:
```bash
cd /home/hello/Test/face_recognization_attendance_system/backend
npm run dev
```

You should see output like:
```
Server running on port 3000
Database connected
```

**Keep this terminal open.**

To verify the backend is reachable from your phone's browser, open:
```
http://YOUR_COMPUTER_LAN_IP:3000/health
```
You should get a JSON response. If not, see Troubleshooting below.

---

## Demo Accounts and MCA Sample Classes

Run the backend migrations to add the demo dataset:
```bash
cd backend
npm run migrate
```

The migration adds four MCA classes for academic year **2026-27**, assigns one
teacher and subject to each class, and enrolls five students in each class.
Demo students start without face embeddings so you can enroll each face from
the mobile app. Their roll numbers are included in the account profile and
class roster.

**All demo accounts use the password `password123`.**

| Class | Teacher login | Subject |
|-------|---------------|---------|
| MCA 1 | Dr. Asha Mehta — `mca1.teacher@demo.test` | Programming Fundamentals |
| MCA 2 | Prof. Vikram Rao — `mca2.teacher@demo.test` | Data Structures |
| MCA 3 | Dr. Neha Kapoor — `mca3.teacher@demo.test` | Database Management Systems |
| MCA 4 | Prof. Arjun Desai — `mca4.teacher@demo.test` | Machine Learning |

| Class | Student | Login email | Roll number |
|-------|---------|-------------|-------------|
| MCA 1 | Aarav Sharma | `mca1.student01@demo.test` | MCA1-001 |
| MCA 1 | Diya Patel | `mca1.student02@demo.test` | MCA1-002 |
| MCA 1 | Rohan Verma | `mca1.student03@demo.test` | MCA1-003 |
| MCA 1 | Ananya Singh | `mca1.student04@demo.test` | MCA1-004 |
| MCA 1 | Kabir Mehta | `mca1.student05@demo.test` | MCA1-005 |
| MCA 2 | Ishaan Gupta | `mca2.student01@demo.test` | MCA2-001 |
| MCA 2 | Meera Nair | `mca2.student02@demo.test` | MCA2-002 |
| MCA 2 | Aditya Joshi | `mca2.student03@demo.test` | MCA2-003 |
| MCA 2 | Sara Khan | `mca2.student04@demo.test` | MCA2-004 |
| MCA 2 | Dev Malhotra | `mca2.student05@demo.test` | MCA2-005 |
| MCA 3 | Vivaan Shah | `mca3.student01@demo.test` | MCA3-001 |
| MCA 3 | Ira Iyer | `mca3.student02@demo.test` | MCA3-002 |
| MCA 3 | Arjun Reddy | `mca3.student03@demo.test` | MCA3-003 |
| MCA 3 | Kiara Bose | `mca3.student04@demo.test` | MCA3-004 |
| MCA 3 | Reyansh Kulkarni | `mca3.student05@demo.test` | MCA3-005 |
| MCA 4 | Atharv Rao | `mca4.student01@demo.test` | MCA4-001 |
| MCA 4 | Anika Chawla | `mca4.student02@demo.test` | MCA4-002 |
| MCA 4 | Krish Patel | `mca4.student03@demo.test` | MCA4-003 |
| MCA 4 | Myra Fernandes | `mca4.student04@demo.test` | MCA4-004 |
| MCA 4 | Samar Sethi | `mca4.student05@demo.test` | MCA4-005 |

For the demo, sign in as a student and enroll their face from the mobile device.
Repeat for additional student accounts, then use the matching class teacher
account to run the attendance flow.

---

## Step 4 — Start the Expo (Mobile) Dev Server

Open a **second terminal** and run:
```bash
cd /home/hello/Test/face_recognization_attendance_system/mobile
npx expo start
```

Wait for the QR code to appear in the terminal. It looks like:

```
Metro waiting on exp://YOUR_COMPUTER_LAN_IP:8081
  ▄▄▄▄▄▄▄▄▄▄▄
  █ ▄▄▄▄▄ █▀█
  █ █   █ █▀▀
  ...
```

**Keep this terminal open too.**

### Open on an Android emulator

`npx expo start --android` requires Android Studio's Android SDK and the
`adb` platform tool. Install Android Studio, then use **Tools → SDK Manager**
to install Android SDK Platform-Tools and an Android SDK platform. Create
and start an emulator in **Tools → Device Manager**.

On Linux, configure the SDK path in `~/.bashrc` (change it if Android Studio
installed the SDK in a different directory):
```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
```
Open a new terminal or run `source ~/.bashrc`, then verify:
```bash
adb version
adb devices
```
Start the emulator and confirm it appears in `adb devices` before running:
```bash
npx expo start --android
```

To test on a physical Android phone without installing the Android SDK, run
`npx expo start --lan` and scan the QR code with Expo Go instead. Keep the
phone and computer on the same Wi-Fi network. In LAN development, the app
uses Expo's current host address for the backend, so changing Wi-Fi IPs does
not require editing `app.json`. The backend must be running on port 3000 and
reachable from the phone.

---

## Step 5 — Connect Your Phone

### Android
1. Open **Expo Go** app
2. Tap **"Scan QR code"**
3. Point your camera at the QR code in the terminal
4. The app will load on your phone

### iPhone
1. Open the default **Camera** app (not Expo Go)
2. Point at the QR code — a banner appears at the top
3. Tap the banner → it opens in Expo Go automatically

---

## Step 6 — Grant Permissions When Prompted

The app will ask for these permissions on first launch — **allow all of them**:

- **Camera** — required for face recognition
- **Location** — required for venue-based attendance verification
- **Photo Library** — required for uploading profile photo

---

## Common Problems & Fixes

### Problem: QR code scans but app shows "Network request failed" or can't connect

**Cause:** Your phone can't reach the backend on your computer's LAN address.

**Fix checklist:**
1. Confirm phone and computer are on the **same Wi-Fi network** (not one on 5GHz and other on 2.4GHz hotspot — both must be same router)
2. Check backend is running (Step 3)
3. Check firewall is not blocking port 3000:
   ```bash
   sudo ufw allow 3000
   sudo ufw allow 8081
   ```
4. Test from phone browser: open `http://YOUR_COMPUTER_LAN_IP:3000/health`

---

### Problem: QR code appears but scanning does nothing / times out

**Cause:** Expo tunnel mode may be needed if your network blocks LAN connections.

**Fix:** Start Expo with tunnel mode:
```bash
npx expo start --tunnel
```
This routes through Expo's servers — slower but bypasses network restrictions. Requires internet on both devices.

---

### Problem: "Something went wrong" screen in Expo Go

**Fix:**
1. Shake your phone to open the Expo developer menu
2. Tap **"Reload"**
3. If still broken, check the terminal running `npx expo start` for red error messages

---

### Problem: `ANDROID_HOME` is not set or `spawn adb ENOENT`

Expo cannot find Android SDK Platform-Tools. Install Platform-Tools using
Android Studio's SDK Manager, set `ANDROID_HOME` and `PATH` as described in
**Open on an Android emulator** above, then open a new terminal and verify
`adb devices` works. If you only need to test on a phone, run `npx expo start`
and scan the QR code with Expo Go; `--android` is only needed to launch an
emulator automatically.

---

### Problem: Metro bundler shows "Unable to resolve module"

**Fix:**
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

---

### Problem: Backend starts but crashes immediately

**Fix:** Check Redis is running (required by backend):
```bash
sudo systemctl start redis
sudo systemctl status redis
```
Or start Redis via Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

---

### Problem: IP address changed (e.g., after reconnecting Wi-Fi)

**Fix:** Find new IP and update both files:
```bash
# 1. Get new IP
ip addr show | grep "inet " | grep -v "127.0.0.1"

# 2. Expo Go uses the current Metro LAN host; set EXPO_PUBLIC_API_URL only for a custom API host.
# 3. Update backend/.env FRONTEND_URL
# 4. Restart both servers
```

---

## Normal Startup Sequence (Summary)

```
Terminal 1:  cd backend  →  npm run dev          (keeps running)
Terminal 2:  cd mobile   →  npx expo start       (keeps running)
Phone:       Open Expo Go  →  Scan QR code
```

---

## Ports Used

| Service        | Port | URL from phone                      |
|----------------|------|-------------------------------------|
| Backend API    | 3000 | `http://YOUR_COMPUTER_LAN_IP:3000`  |
| Expo Metro     | 8081 | `exp://YOUR_COMPUTER_LAN_IP:8081`   |

---

## First-Time App Usage

1. **Register** — Create an account (Admin or Employee role)
2. **Enroll face** — Go to Profile → tap "Enroll Face" → follow camera prompts
3. **Mark attendance** — Go to Attendance → tap "Check In" → let camera scan your face
4. Face must be enrolled before attendance marking will work
