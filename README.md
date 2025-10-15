# Z.com - Social Network

A realtime social messaging platform where users can share thoughts, create posts, and interact with the community instantly.

## ✨ Features

- **User Authentication** - Email/password and Google login with custom or auto-generated usernames
- **Realtime Messages** - Create, edit, and delete posts with instant updates across all users
- **Beautiful UI** - Pinterest/小红书-style masonry layout with responsive design
- **Secure** - Firestore security rules ensure users can only modify their own content

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for setup instructions.

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🎯 How It Works

1. **Register/Login** - Use email/password or Google sign-in
2. **Create Posts** - Share messages with title and content
3. **Realtime Updates** - See new posts instantly without refreshing
4. **Manage Content** - Edit or delete your own posts

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **State:** Zustand for client state management
- **Backend:** Firebase (Authentication + Firestore)
- **Realtime:** Firestore onSnapshot listeners

## 📁 Project Structure

```
z.com/
├── app/              # Next.js pages & layouts
├── components/       # React components
├── store/            # Zustand stores (auth, messages)
├── lib/              # Firebase config
└── types/            # TypeScript definitions
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Setup guide (5 minutes)
- **[TECHNICAL.md](TECHNICAL.md)** - Developer documentation

## 🔒 Security

- Public read access for all messages
- Only authenticated users can create posts
- Users can only edit/delete their own content
- Google OAuth and Firebase security rules

## 📄 License

MIT - Feel free to use as a template or learning resource

---

**Ready to get started? Check out [QUICKSTART.md](QUICKSTART.md)!**
