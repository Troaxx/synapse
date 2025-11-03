# Synapse - Peer Tutoring Platform (MERN Stack)

A full-stack web application for connecting students with peer tutors at Temasek Polytechnic.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

### Core Functionality
- User authentication (Register/Login)
- Browse and search tutors by subject, rating, availability
- View detailed tutor profiles with reviews and ratings
- Book tutoring sessions
- Manage bookings (upcoming, pending, past)
- Session calendar view
- Real-time messaging between students and tutors
- Session history and reviews
- Profile management
- Browse by module codes

### User Roles
- **Student**: Can book sessions, message tutors, leave reviews
- **Tutor**: Can accept/reject bookings, manage availability, receive reviews
- **Admin**: Can manage modules and users (future enhancement)

## Project Structure

```
synapse/
├── server/                 # Backend
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Message.js
│   │   └── Module.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── tutorController.js
│   │   ├── sessionController.js
│   │   ├── messageController.js
│   │   └── moduleController.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── tutorRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── messageRoutes.js
│   │   └── moduleRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── seeders/          # Database seeders
│   │   └── seed.js
│   ├── server.js         # Express app entry point
│   └── package.json
├── src/                  # Frontend
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── context/         # React context (Auth)
│   ├── services/        # API service layer
│   └── App.jsx
├── html/                # Static HTML/CSS versions
└── env.example          # Environment variables template
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd synapse
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `server` directory:
```bash
cp ../env.example .env
```

Edit `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/synapse
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
FRONTEND_URL=http://localhost:5173
```

#### Seed the Database
```bash
npm run seed
```

This will create:
- 6 test users (1 student, 5 tutors)
- 6 modules
- 3 sample sessions

#### Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ..
npm install
```

#### Configure Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Test Credentials

### Student Account
- **Email**: alex.tan@student.tp.edu.sg
- **Password**: password123

### Tutor Accounts
- **Email**: sarah.chen@student.tp.edu.sg
- **Password**: password123

- **Email**: marcus.tan@student.tp.edu.sg
- **Password**: password123

- **Email**: priya.kumar@student.tp.edu.sg
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Tutors
- `GET /api/tutors` - Get all tutors (with filters)
- `GET /api/tutors/:id` - Get tutor by ID
- `GET /api/tutors/recommended` - Get recommended tutors (protected)
- `PUT /api/tutors/profile` - Update tutor profile (protected)

### Sessions
- `POST /api/sessions` - Create new session (protected)
- `GET /api/sessions` - Get user sessions (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `PUT /api/sessions/:id/status` - Update session status (protected)
- `POST /api/sessions/:id/review` - Add review to session (protected)
- `DELETE /api/sessions/:id` - Cancel session (protected)

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/:otherUserId` - Get messages with user (protected)
- `PUT /api/messages/:messageId/read` - Mark message as read (protected)

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get module by ID
- `POST /api/modules` - Create module (protected)
- `POST /api/modules/:id/tutors` - Add tutor to module (protected)

## Data Models

### User Model
```javascript
{
  userId: String (unique),
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  year: String,
  course: String,
  bio: String,
  profilePhoto: String,
  role: String (student/tutor/admin),
  isTutor: Boolean,
  tutorProfile: {
    rating: Number,
    reviewCount: Number,
    totalSessions: Number,
    hoursTaught: Number,
    responseRate: Number,
    replyTime: String,
    subjects: Array,
    badges: Array,
    availability: Array
  },
  subjectsNeedHelp: Array,
  subjectsCanTeach: Array,
  notifications: Object,
  memberSince: Date
}
```

### Session Model
```javascript
{
  sessionId: String (unique),
  student: ObjectId (ref: User),
  tutor: ObjectId (ref: User),
  subject: String,
  moduleCode: String,
  topic: String,
  date: Date,
  time: String,
  duration: Number,
  location: String,
  notes: String,
  sessionNotes: String,
  status: String (Pending/Confirmed/Completed/Cancelled),
  review: {
    rating: Number,
    comment: String,
    reviewedAt: Date
  },
  createdBy: ObjectId (ref: User)
}
```

### Message Model
```javascript
{
  messageId: String (unique),
  conversationId: String,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  text: String,
  read: Boolean,
  readAt: Date
}
```

### Module Model
```javascript
{
  moduleCode: String (unique),
  name: String,
  school: String,
  diploma: String,
  description: String,
  tutors: Array<ObjectId> (ref: User)
}
```

## Database Relationships

```
User (Student) ─────┐
                    ├──> Session
User (Tutor) ───────┘

User (Sender) ──────┐
                    ├──> Message
User (Receiver) ────┘

Module ──────────────> User (Tutor) [Many-to-Many]
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- CORS configuration
- Input validation

## Future Enhancements

- Real-time chat with Socket.io
- Email notifications
- Payment integration
- File upload for profile photos
- Advanced search filters
- Admin dashboard
- Analytics and reporting
- Mobile responsive improvements
- Push notifications

## Development Notes

- Backend runs on port 5000
- Frontend runs on port 5173
- MongoDB connection string can be local or Atlas
- JWT tokens expire after 7 days
- All passwords in seed data are "password123"

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify MONGODB_URI in .env file

### CORS Errors
- Check FRONTEND_URL in backend .env
- Ensure frontend is running on correct port

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT_SECRET is set in .env
- Verify token is being sent in Authorization header

## License

This project is for educational purposes only.

## Contributors

- Daniella (Frontend & Backend Development)

