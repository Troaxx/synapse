# Synapse - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Step 2: Configure Environment

Create `server/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/synapse
JWT_SECRET=synapse_secret_key_2025
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key**: https://makersuite.google.com/app/apikey

### Step 3: Seed Database

```bash
# From server directory
npm run seed
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Login

Open http://localhost:5173

**Test Account:**
- Email: `alex.tan@student.tp.edu.sg`
- Password: `password123`

---

## 📁 Project Structure

```
synapse/
├── server/          # Backend (Express + MongoDB)
├── src/             # Frontend (React)
├── html/            # Static HTML/CSS versions
└── env.example      # Environment template
```

---

## 🔑 Test Credentials

### Student
- alex.tan@student.tp.edu.sg / password123

### Tutors
- sarah.chen@student.tp.edu.sg / password123
- marcus.tan@student.tp.edu.sg / password123
- priya.kumar@student.tp.edu.sg / password123

---

## 📚 Key Features

1. **AI Recommendations** - Personalized tutor suggestions
2. **Session Booking** - Schedule tutoring sessions
3. **Messaging** - Chat with tutors
4. **Reviews** - Rate and review sessions
5. **Calendar** - View schedule
6. **Profile** - Manage account

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod
```

### Port Already in Use
```bash
# Change PORT in server/.env
PORT=5001
```

### AI Recommendations Not Working
- Add GEMINI_API_KEY to server/.env
- Get key from: https://makersuite.google.com/app/apikey
- Restart server after adding key

---

## 📖 Full Documentation

- **Setup Guide**: README_FULLSTACK.md
- **Database**: DATA_MODELING.md
- **AI Feature**: AI_RECOMMENDATIONS_GUIDE.md
- **Summary**: IMPLEMENTATION_SUMMARY.md

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. 📱 Explore all 10 pages
3. 🤖 Test AI recommendations
4. 💬 Try messaging feature
5. 📅 Book a session
6. ⭐ Leave a review

---

## 💡 Pro Tips

- **AI works best** after completing 2-3 sessions
- **Refresh recommendations** to see updated suggestions
- **Check insights** to see your learning patterns
- **Browse modules** to find tutors by course code

---

**Need Help?** Check the full documentation files!

**Ready to Deploy?** See IMPLEMENTATION_SUMMARY.md for deployment guide.

