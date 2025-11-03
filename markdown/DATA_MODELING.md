# Synapse - Data Modeling Documentation

## Overview
This document describes the data models used in the Synapse peer tutoring platform, following the structure shown in the provided data modeling sample.

---

## Table: User

### Description:
Represents all users in the system (students, tutors, and admins) with their profile information and authentication credentials.

### Usage in App:
Stores user authentication data, profile information, and tutor-specific details. Used for login, profile management, and tutor discovery features.

### Attributes:

| Attribute | Type | Sample Value | Description |
|-----------|------|--------------|-------------|
| _id | ObjectId | 507f1f77bcf86cd799439011 | MongoDB unique identifier for the user document |
| userId | String | U1001 | Unique identifier for each user, used for display and linking |
| email | String | alex.tan@student.tp.edu.sg | User's email address, used for login and notifications |
| password | String | $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy | Hashed password for authentication (bcrypt) |
| name | String | Alex Tan | Full name of the user, displayed in UI and profiles |
| phone | String | +65 9123 4567 | Contact number for communication purposes |
| year | String | Year 2 | Current year of study for academic context |
| course | String | Diploma in IT | Academic program the user is enrolled in |
| bio | String | IT student passionate about web development | Personal description displayed on profile |
| profilePhoto | String | /uploads/alex-tan.jpg | URL or path to user's profile picture |
| role | String | student | User role in the system (student/tutor/admin) |
| isTutor | Boolean | false | Flag indicating if user offers tutoring services |
| tutorProfile | Object | {...} | Nested object containing tutor-specific information |
| tutorProfile.rating | Number | 4.9 | Average rating from student reviews (1-5 scale) |
| tutorProfile.reviewCount | Number | 87 | Total number of reviews received as a tutor |
| tutorProfile.totalSessions | Number | 88 | Total tutoring sessions completed |
| tutorProfile.hoursTaught | Number | 132 | Total hours spent tutoring |
| tutorProfile.responseRate | Number | 95 | Percentage of messages responded to |
| tutorProfile.replyTime | String | < 2 hours | Average time taken to reply to messages |
| tutorProfile.subjects | Array | [{name: "Python", grade: "A", sessions: 25}] | Subjects tutor can teach with grades and experience |
| tutorProfile.badges | Array | ["Top Tutor", "Subject Expert"] | Achievement badges earned by tutor |
| tutorProfile.availability | Array | [{day: "Monday", slots: ["2:00 PM"]}] | Weekly availability schedule for booking |
| subjectsNeedHelp | Array | ["Full Stack Web Development"] | Subjects student needs tutoring in |
| subjectsCanTeach | Array | ["Python", "Java"] | Subjects user can tutor (if isTutor is true) |
| notifications | Object | {emailBookings: true, ...} | User notification preferences |
| memberSince | Date | 2024-01-15T08:00:00Z | Date when user joined the platform |
| createdAt | Date | 2024-01-15T08:00:00Z | Timestamp of document creation (auto-generated) |
| updatedAt | Date | 2025-11-03T10:30:00Z | Timestamp of last document update (auto-generated) |

---

## Table: Session

### Description:
Represents tutoring sessions booked between students and tutors, including scheduling details and session outcomes.

### Usage in App:
Manages all tutoring session bookings, tracks session status, stores session notes, and handles reviews. Used in booking, schedule, and history features.

### Attributes:

| Attribute | Type | Sample Value | Description |
|-----------|------|--------------|-------------|
| _id | ObjectId | 507f1f77bcf86cd799439012 | MongoDB unique identifier for the session document |
| sessionId | String | S1001 | Unique identifier for each session, displayed to users |
| student | ObjectId | 507f1f77bcf86cd799439011 | Reference to User document (student who booked) |
| tutor | ObjectId | 507f1f77bcf86cd799439013 | Reference to User document (tutor providing service) |
| subject | String | Python | Subject area of the tutoring session |
| moduleCode | String | CIT2C40 | TP module code related to the session |
| topic | String | Object-Oriented Programming | Specific topic to be covered in the session |
| date | Date | 2025-11-04T14:00:00Z | Date and time when session is scheduled |
| time | String | 2:00 PM | Human-readable time for display purposes |
| duration | Number | 60 | Session length in minutes |
| location | String | Library Level 5 | Physical or virtual location of the session |
| notes | String | Need help with inheritance | Additional notes from student when booking |
| sessionNotes | String | Covered OOP concepts thoroughly | Tutor's notes after session completion |
| status | String | Confirmed | Current status (Pending/Confirmed/Completed/Cancelled) |
| review | Object | {...} | Nested object containing session review |
| review.rating | Number | 5 | Student's rating of the session (1-5 stars) |
| review.comment | String | Excellent tutor! | Student's written feedback |
| review.reviewedAt | Date | 2025-11-04T16:00:00Z | Timestamp when review was submitted |
| createdBy | ObjectId | 507f1f77bcf86cd799439011 | Reference to User who created the booking |
| createdAt | Date | 2025-11-01T10:00:00Z | Timestamp of booking creation |
| updatedAt | Date | 2025-11-04T16:00:00Z | Timestamp of last update |

---

## Table: Message

### Description:
Represents individual messages sent between users in the platform's messaging system.

### Usage in App:
Enables communication between students and tutors. Messages are grouped by conversationId for chat interface display.

### Attributes:

| Attribute | Type | Sample Value | Description |
|-----------|------|--------------|-------------|
| _id | ObjectId | 507f1f77bcf86cd799439014 | MongoDB unique identifier for the message document |
| messageId | String | M1001 | Unique identifier for each message |
| conversationId | String | 507f...011-507f...013 | Identifier grouping messages between two users |
| sender | ObjectId | 507f1f77bcf86cd799439011 | Reference to User who sent the message |
| receiver | ObjectId | 507f1f77bcf86cd799439013 | Reference to User who receives the message |
| text | String | Hi! Thanks for booking | Content of the message |
| read | Boolean | false | Flag indicating if message has been read |
| readAt | Date | 2025-11-03T11:00:00Z | Timestamp when message was read (null if unread) |
| createdAt | Date | 2025-11-03T10:30:00Z | Timestamp when message was sent |
| updatedAt | Date | 2025-11-03T11:00:00Z | Timestamp of last update |

---

## Table: Module

### Description:
Represents academic modules/courses offered at Temasek Polytechnic that students can get tutoring for.

### Usage in App:
Organizes tutors by module codes, allows students to browse tutors by specific modules, and provides module information for booking context.

### Attributes:

| Attribute | Type | Sample Value | Description |
|-----------|------|--------------|-------------|
| _id | ObjectId | 507f1f77bcf86cd799439015 | MongoDB unique identifier for the module document |
| moduleCode | String | CIT2C20 | Official TP module code (unique identifier) |
| name | String | Full Stack Web Development | Full name of the module |
| school | String | School of IT | Academic school offering the module |
| diploma | String | Diploma in IT | Diploma program the module belongs to |
| description | String | Learn to build complete web applications | Brief description of module content |
| tutors | Array | [ObjectId, ObjectId] | Array of User references (tutors who teach this module) |
| createdAt | Date | 2024-01-10T08:00:00Z | Timestamp of document creation |
| updatedAt | Date | 2025-11-01T09:00:00Z | Timestamp of last update |

---

## Relationships

### One-to-Many Relationships:

1. **User (Tutor) → Session**
   - One tutor can have many sessions
   - Referenced by: `Session.tutor`

2. **User (Student) → Session**
   - One student can book many sessions
   - Referenced by: `Session.student`

3. **User (Sender) → Message**
   - One user can send many messages
   - Referenced by: `Message.sender`

4. **User (Receiver) → Message**
   - One user can receive many messages
   - Referenced by: `Message.receiver`

### Many-to-Many Relationships:

1. **Module ↔ User (Tutor)**
   - One module can have many tutors
   - One tutor can teach many modules
   - Referenced by: `Module.tutors` array

---

## Indexes

For optimal query performance, the following indexes are recommended:

### User Collection:
- `userId` (unique)
- `email` (unique)
- `isTutor` (for tutor queries)
- `tutorProfile.rating` (for sorting)

### Session Collection:
- `sessionId` (unique)
- `student` (for user's sessions)
- `tutor` (for tutor's sessions)
- `date` (for scheduling)
- `status` (for filtering)
- Compound index: `{student: 1, date: -1}`
- Compound index: `{tutor: 1, date: -1}`

### Message Collection:
- `messageId` (unique)
- `conversationId` (for grouping)
- Compound index: `{conversationId: 1, createdAt: 1}`
- Compound index: `{receiver: 1, read: 1}`

### Module Collection:
- `moduleCode` (unique)
- `school` (for filtering)

---

## Data Validation Rules

### User:
- Email must be valid format and unique
- Password must be hashed before storage
- Rating must be between 0-5
- Year must be one of: Year 1, Year 2, Year 3
- Role must be one of: student, tutor, admin

### Session:
- Duration must be positive number
- Date must be in the future for new bookings
- Status must be one of: Pending, Confirmed, Completed, Cancelled
- Review rating must be between 1-5

### Message:
- Text cannot be empty
- Sender and receiver must be different users

### Module:
- Module code must follow TP format (e.g., CIT2C20)
- Module code must be unique

---

## Sample Queries

### Find all available tutors for a subject:
```javascript
User.find({
  isTutor: true,
  'tutorProfile.subjects.name': 'Python'
}).sort({ 'tutorProfile.rating': -1 })
```

### Get user's upcoming sessions:
```javascript
Session.find({
  student: userId,
  date: { $gte: new Date() },
  status: { $in: ['Pending', 'Confirmed'] }
}).populate('tutor', 'name profilePhoto')
```

### Get conversation messages:
```javascript
Message.find({
  conversationId: conversationId
}).sort({ createdAt: 1 })
```

### Find modules by school:
```javascript
Module.find({
  school: 'School of IT'
}).populate('tutors', 'name tutorProfile.rating')
```

---

## Data Flow Examples

### Booking a Session:
1. Student selects tutor from FindTutors page
2. Student fills booking form with session details
3. POST `/api/sessions` creates new Session document
4. Session status set to "Pending"
5. Tutor receives notification
6. Tutor updates status to "Confirmed"
7. Session appears in both users' schedules

### Sending a Message:
1. User clicks "Message Tutor" button
2. POST `/api/messages` creates new Message document
3. ConversationId generated from both user IDs
4. Message appears in receiver's conversation list
5. Unread count increments
6. When receiver opens chat, messages marked as read

### Completing a Session:
1. Tutor marks session as "Completed"
2. Session.status updated to "Completed"
3. Tutor's totalSessions and hoursTaught incremented
4. Student prompted to leave review
5. Student submits rating and comment
6. Review added to Session document
7. Tutor's average rating recalculated

---

## Security Considerations

- Passwords stored as bcrypt hashes (never plain text)
- JWT tokens used for authentication
- User IDs in tokens verified on protected routes
- Users can only access their own sessions and messages
- Tutors can only update their own session status
- Students can only review sessions they attended

---

## Scalability Notes

- MongoDB's flexible schema allows easy addition of new fields
- Indexes optimize query performance for large datasets
- ConversationId pattern enables efficient message grouping
- Separate collections prevent document size limits
- Population used sparingly to avoid performance issues

