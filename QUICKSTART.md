# Quick Start Guide

Get Z.com running in 5 minutes.

## Prerequisites

- Node.js 18+
- A Firebase account (free tier)

## Setup Steps

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Create Firebase Project (2 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Enter name → Create
3. **Enable Authentication:**
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" provider
   - Enable "Google" provider (select support email)
4. **Create Firestore Database:**
   - Click "Firestore Database" → "Create database"
   - Choose "Production mode" → Select region → Enable
5. **Deploy Security Rules:**
   - Go to Firestore → "Rules" tab
   - Copy contents from `firestore.rules` → Paste → Publish
6. **Get Firebase Config:**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" → Click web icon `</>`
   - Copy the firebaseConfig object

### 3. Configure Environment (1 min)

Replace credentials in `lib/firebase.ts` with your Firebase config, or create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Steps

1. Click "Login / Register"
2. Register with email or use "Continue with Google"
3. Optional: Enter a custom username (or auto-generate)
4. Click "Create Message" to post
5. Open in another browser to see realtime updates!

## Troubleshooting

**"Firebase not initialized"** → Check credentials in `lib/firebase.ts` or `.env.local`

**"Operation not allowed"** → Enable Email/Password and Google auth in Firebase Console

**"Permission denied"** → Deploy security rules from `firestore.rules`

**"Module not found"** → Run `npm install`

## Deploy to Production

### Using Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (if using `.env.local`)
4. Deploy!

---

**Done! You're ready to use Z.com** 🚀
