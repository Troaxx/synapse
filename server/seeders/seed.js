const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Module = require('../models/Module');
const Session = require('../models/Session');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Module.deleteMany({});
    await Session.deleteMany({});

    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        userId: 'U1001',
        email: 'alex.tan@student.tp.edu.sg',
        password: hashedPassword,
        name: 'Alex Tan',
        phone: '+65 9123 4567',
        year: 'Year 2',
        course: 'Diploma in IT',
        bio: 'IT student passionate about web development and programming.',
        role: 'student',
        isTutor: false,
        subjectsNeedHelp: ['Full Stack Web Development', 'Data Structures', 'Database Systems']
      },
      {
        userId: 'U1002',
        email: 'sarah.chen@student.tp.edu.sg',
        password: hashedPassword,
        name: 'Sarah Chen',
        phone: '+65 9234 5678',
        year: 'Year 2',
        course: 'Diploma in IT',
        bio: 'Hi! I\'m Sarah, a Year 2 IT student passionate about programming and helping others succeed.',
        role: 'student',
        isTutor: true,
        tutorProfile: {
          rating: 4.9,
          reviewCount: 87,
          totalSessions: 88,
          hoursTaught: 132,
          responseRate: 95,
          replyTime: '< 2 hours',
          subjects: [
            { name: 'Python', grade: 'A', sessions: 25 },
            { name: 'Java', grade: 'A', sessions: 15 },
            { name: 'Data Structures', grade: 'A', sessions: 8 }
          ],
          badges: ['Top Tutor', 'Subject Expert'],
          availability: [
            { day: 'Monday', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] },
            { day: 'Tuesday', slots: ['10:00 AM', '2:00 PM'] },
            { day: 'Wednesday', slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
            { day: 'Thursday', slots: ['3:00 PM', '4:00 PM'] },
            { day: 'Friday', slots: ['2:00 PM', '3:00 PM'] }
          ]
        },
        subjectsCanTeach: ['Python', 'Java', 'Data Structures']
      },
      {
        userId: 'U1003',
        email: 'marcus.tan@student.tp.edu.sg',
        password: hashedPassword,
        name: 'Marcus Tan',
        phone: '+65 9345 6789',
        year: 'Year 3',
        course: 'Diploma in IT',
        bio: 'Web development enthusiast specializing in React and modern JavaScript.',
        role: 'student',
        isTutor: true,
        tutorProfile: {
          rating: 4.8,
          reviewCount: 62,
          totalSessions: 62,
          hoursTaught: 93,
          responseRate: 92,
          replyTime: '< 3 hours',
          subjects: [
            { name: 'Web Development', grade: 'A', sessions: 30 },
            { name: 'React', grade: 'A', sessions: 20 },
            { name: 'JavaScript', grade: 'A', sessions: 12 }
          ],
          badges: ['Top Tutor'],
          availability: [
            { day: 'Monday', slots: ['3:00 PM', '4:00 PM'] },
            { day: 'Wednesday', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] },
            { day: 'Friday', slots: ['3:00 PM', '4:00 PM', '5:00 PM'] }
          ]
        },
        subjectsCanTeach: ['Web Development', 'React', 'JavaScript', 'HTML/CSS']
      },
      {
        userId: 'U1004',
        email: 'priya.kumar@student.tp.edu.sg',
        password: hashedPassword,
        name: 'Priya Kumar',
        phone: '+65 9456 7890',
        year: 'Year 2',
        course: 'Diploma in IT',
        bio: 'Mathematics tutor with a passion for making complex concepts simple.',
        role: 'student',
        isTutor: true,
        tutorProfile: {
          rating: 5.0,
          reviewCount: 35,
          totalSessions: 35,
          hoursTaught: 52.5,
          responseRate: 98,
          replyTime: '< 1 hour',
          subjects: [
            { name: 'Mathematics', grade: 'A', sessions: 25 },
            { name: 'Statistics', grade: 'A', sessions: 10 }
          ],
          badges: ['Subject Expert'],
          availability: [
            { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '2:00 PM'] },
            { day: 'Thursday', slots: ['10:00 AM', '2:00 PM', '3:00 PM'] },
            { day: 'Saturday', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] }
          ]
        },
        subjectsCanTeach: ['Mathematics', 'Statistics', 'Calculus']
      },
      {
        userId: 'U1005',
        email: 'david.lim@student.tp.edu.sg',
        password: hashedPassword,
        name: 'David Lim',
        phone: '+65 9567 8901',
        year: 'Year 3',
        course: 'Diploma in IT',
        bio: 'Database expert with experience in SQL and NoSQL databases.',
        role: 'student',
        isTutor: true,
        tutorProfile: {
          rating: 4.7,
          reviewCount: 54,
          totalSessions: 71,
          hoursTaught: 106.5,
          responseRate: 90,
          replyTime: '< 4 hours',
          subjects: [
            { name: 'Database', grade: 'A', sessions: 40 },
            { name: 'SQL', grade: 'A', sessions: 20 },
            { name: 'MongoDB', grade: 'A', sessions: 11 }
          ],
          badges: ['Top Tutor'],
          availability: [
            { day: 'Monday', slots: ['4:00 PM', '5:00 PM'] },
            { day: 'Wednesday', slots: ['4:00 PM', '5:00 PM'] },
            { day: 'Friday', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] }
          ]
        },
        subjectsCanTeach: ['Database', 'SQL', 'MongoDB', 'Database Design']
      },
      {
        userId: 'U1006',
        email: 'emily.wong@student.tp.edu.sg',
        password: hashedPassword,
        name: 'Emily Wong',
        phone: '+65 9678 9012',
        year: 'Year 2',
        course: 'Diploma in IT',
        bio: 'UI/UX designer passionate about creating beautiful and functional interfaces.',
        role: 'student',
        isTutor: true,
        tutorProfile: {
          rating: 4.9,
          reviewCount: 43,
          totalSessions: 56,
          hoursTaught: 84,
          responseRate: 96,
          replyTime: '< 2 hours',
          subjects: [
            { name: 'UI/UX Design', grade: 'A', sessions: 30 },
            { name: 'Figma', grade: 'A', sessions: 26 }
          ],
          badges: ['Subject Expert'],
          availability: [
            { day: 'Tuesday', slots: ['3:00 PM', '4:00 PM', '5:00 PM'] },
            { day: 'Thursday', slots: ['3:00 PM', '4:00 PM'] },
            { day: 'Saturday', slots: ['10:00 AM', '11:00 AM', '2:00 PM'] }
          ]
        },
        subjectsCanTeach: ['UI/UX Design', 'Figma', 'Adobe XD', 'Design Thinking']
      }
    ]);

    console.log('Users seeded successfully');

    const modules = await Module.insertMany([
      {
        moduleCode: 'CIT2C20',
        name: 'Full Stack Web Development',
        school: 'School of IT',
        diploma: 'Diploma in IT',
        description: 'Learn to build complete web applications using modern technologies',
        tutors: [users[2]._id, users[1]._id]
      },
      {
        moduleCode: 'CIT2C10',
        name: 'Data Structures & Algorithms',
        school: 'School of IT',
        diploma: 'Diploma in IT',
        description: 'Master fundamental data structures and algorithms',
        tutors: [users[1]._id, users[4]._id]
      },
      {
        moduleCode: 'CIT2C30',
        name: 'Database Management Systems',
        school: 'School of IT',
        diploma: 'Diploma in IT',
        description: 'Learn database design and management',
        tutors: [users[4]._id]
      },
      {
        moduleCode: 'CIT2C40',
        name: 'Object-Oriented Programming',
        school: 'School of IT',
        diploma: 'Diploma in IT',
        description: 'Master OOP concepts using Java and Python',
        tutors: [users[1]._id, users[2]._id]
      },
      {
        moduleCode: 'CIT2C50',
        name: 'UI/UX Design Fundamentals',
        school: 'School of IT',
        diploma: 'Diploma in IT',
        description: 'Learn to design user-friendly interfaces',
        tutors: [users[5]._id]
      },
      {
        moduleCode: 'MAT2C10',
        name: 'Engineering Mathematics',
        school: 'School of Engineering',
        diploma: 'Diploma in Engineering',
        description: 'Advanced mathematics for engineering students',
        tutors: [users[3]._id]
      }
    ]);

    console.log('Modules seeded successfully');

    const sessions = await Session.insertMany([
      {
        sessionId: 'S1001',
        student: users[0]._id,
        tutor: users[1]._id,
        subject: 'Python',
        moduleCode: 'CIT2C40',
        topic: 'Object-Oriented Programming',
        date: new Date('2025-11-04T14:00:00Z'),
        time: '2:00 PM',
        duration: 60,
        location: 'Library Level 5',
        notes: 'Need help with inheritance and polymorphism',
        status: 'Confirmed',
        createdBy: users[0]._id
      },
      {
        sessionId: 'S1002',
        student: users[0]._id,
        tutor: users[2]._id,
        subject: 'Web Development',
        moduleCode: 'CIT2C20',
        topic: 'React Hooks',
        date: new Date('2025-11-05T15:30:00Z'),
        time: '3:30 PM',
        duration: 90,
        location: 'Online - Zoom',
        notes: 'useState and useEffect concepts',
        status: 'Confirmed',
        createdBy: users[0]._id
      },
      {
        sessionId: 'S1003',
        student: users[0]._id,
        tutor: users[1]._id,
        subject: 'Python',
        moduleCode: 'CIT2C40',
        topic: 'Data Structures',
        date: new Date('2025-10-28T14:00:00Z'),
        time: '2:00 PM',
        duration: 60,
        location: 'Library Level 5',
        sessionNotes: 'Covered inheritance, polymorphism, and encapsulation. Great session!',
        status: 'Completed',
        createdBy: users[0]._id
      }
    ]);

    console.log('Sessions seeded successfully');
    console.log('\nSeed data created successfully!');
    console.log('\nTest credentials:');
    console.log('Email: alex.tan@student.tp.edu.sg');
    console.log('Password: password123');
    console.log('\nTutor accounts:');
    console.log('sarah.chen@student.tp.edu.sg - password123');
    console.log('marcus.tan@student.tp.edu.sg - password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

