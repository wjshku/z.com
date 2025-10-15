# Technical Documentation

Developer guide for Z.com social network platform.

## Architecture Overview

### Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Firebase** - Authentication (Email/Password + Google OAuth) and Firestore database
- **Zustand** - Lightweight state management
- **shadcn/ui** - UI component library built on Radix UI
- **Tailwind CSS** - Utility-first styling
- **date-fns** - Date formatting

### Key Dependencies

```json
{
  "firebase": "^12.4.0",
  "zustand": "^5.0.8",
  "next": "15.5.5",
  "react": "19.1.0"
}
```

## State Management

### Auth Store (`store/authStore.ts`)

Manages authentication state and user sessions.

```typescript
interface AuthState {
  user: User | null;           // Firebase user object
  username: string | null;     // Custom username
  loading: boolean;
  register(email, password, username?): Promise<void>;
  login(email, password): Promise<void>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
}
```

**Username Generation:** Auto-generates random usernames like "SwiftPanda123" if not provided.

### Message Store (`store/messageStore.ts`)

Manages messages with Firestore realtime sync.

```typescript
interface MessageState {
  messages: Message[];
  loading: boolean;
  subscribe(): () => void;     // Firestore onSnapshot listener
  createMessage(input, authorId, authorName): Promise<void>;
  updateMessage(id, input): Promise<void>;
  deleteMessage(id): Promise<void>;
}
```

**Realtime Updates:** Uses `onSnapshot` to automatically sync messages across all clients.

## Data Models

### User Profile (Firestore: `users/{userId}`)

```typescript
{
  username: string;
  email: string;
  createdAt: Date;
}
```

### Message (Firestore: `messages/{messageId}`)

```typescript
{
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Component Structure

### Key Components

- **`app/page.tsx`** - Main feed page
- **`app/providers.tsx`** - Initializes auth and message subscriptions
- **`components/Header.tsx`** - Navigation with auth controls
- **`components/AuthDialog.tsx`** - Login/Register modal with Google OAuth
- **`components/MessageList.tsx`** - Masonry layout (CSS columns)
- **`components/MessageCard.tsx`** - Individual message card
- **`components/CreateMessageDialog.tsx`** - New message form
- **`components/EditMessageDialog.tsx`** - Edit message form

### Layout System

Uses CSS columns for Pinterest-style masonry layout:

```css
/* MessageList.tsx */
columns-1 md:columns-2 lg:columns-3 xl:columns-4
```

Messages use `break-inside-avoid` to prevent splitting across columns.

## Firebase Security Rules

### Users Collection

```javascript
match /users/{userId} {
  allow read: if true;  // Public usernames
  allow create: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId;
  allow delete: if false;
}
```

### Messages Collection

```javascript
match /messages/{messageId} {
  allow read: if true;  // Public messages
  allow create: if request.auth != null 
    && request.resource.data.authorId == request.auth.uid;
  allow update: if request.auth.uid == resource.data.authorId;
  allow delete: if request.auth.uid == resource.data.authorId;
}
```

## Key Features Implementation

### Google Authentication

Uses Firebase `GoogleAuthProvider` with popup flow. On first login, creates user profile with display name or generates random username.

### Realtime Sync

Firestore `onSnapshot` listener in `messageStore.subscribe()` provides live updates. Unsubscribes on cleanup.

### Username System

- Users can provide custom username during registration
- Google users get their display name or auto-generated username
- Stored in Firestore `users` collection
- Auto-generation format: `{Adjective}{Noun}{Number}` (e.g., "SwiftPanda123")

## Development Workflow

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Adding New Features

### Add a New Field to Messages

1. Update `types/message.ts`
2. Update `messageStore.createMessage()` to include field
3. Update `MessageCard` to display field
4. Update Firestore security rules if needed

### Add User Profiles

1. Create `app/profile/[userId]/page.tsx`
2. Fetch user data from `users` collection
3. Query messages by `authorId`
4. Add navigation link in Header

## Performance Considerations

- **Single Subscription:** Messages subscribed once in `Providers`
- **Efficient Rendering:** Zustand prevents unnecessary re-renders
- **Firestore Indexing:** Automatic indexing on `createdAt` field
- **Code Splitting:** Next.js automatic code splitting per route

## Environment Variables

Firebase credentials can be in `.env.local` or hardcoded in `lib/firebase.ts`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Deployment

Recommended: Vercel (automatic Next.js optimization)

Alternative: Any Node.js hosting platform (Netlify, Railway, Firebase Hosting)

Ensure environment variables are set in deployment platform.

