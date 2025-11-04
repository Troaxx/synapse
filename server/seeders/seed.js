const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Module = require('../models/Module');
const Session = require('../models/Session');

dotenv.config({ path: path.join(__dirname, '../../.env') });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const firstNames = [
  'Alex', 'Sarah', 'Marcus', 'Priya', 'David', 'Emily', 'Ryan', 'Jessica', 'Michael', 'Sophia',
  'James', 'Olivia', 'Daniel', 'Emma', 'Matthew', 'Ava', 'Christopher', 'Isabella', 'Andrew', 'Mia',
  'Joshua', 'Charlotte', 'Benjamin', 'Amelia', 'William', 'Harper', 'Joseph', 'Evelyn', 'John', 'Abigail',
  'Richard', 'Elizabeth', 'Thomas', 'Sofia', 'Charles', 'Aria', 'Edward', 'Grace', 'Robert', 'Chloe',
  'Jennifer', 'Lucas', 'Natalie', 'Ethan', 'Hannah', 'Noah', 'Lily', 'Jacob', 'Zoe', 'Mason'
];

const lastNames = [
  'Tan', 'Chen', 'Lim', 'Wong', 'Kumar', 'Ng', 'Lee', 'Singh', 'Koh', 'Ong',
  'Teo', 'Chua', 'Goh', 'Yap', 'Chong', 'Ho', 'Ang', 'Toh', 'Low', 'Yeo',
  'Sim', 'Pang', 'Chia', 'Quek', 'Tay', 'Foo', 'Khoo', 'Loh', 'Toh', 'Gan',
  'Mah', 'Seah', 'Soh', 'Tan', 'Yong', 'Zheng', 'Huang', 'Zhang', 'Liu', 'Wang',
  'Kim', 'Park', 'Choi', 'Kumar', 'Patel', 'Sharma', 'Rao', 'Nair', 'Iyer', 'Menon'
];

const subjects = [
  'Cybersecurity Fundamentals',
  'Logic and Mathematics',
  'Data Visualisation and Analytics',
  'Computational Thinking',
  'User Experience and Interface Design',
  'Network and Cloud Technology',
  'Database Application Development',
  'Data Structures and Algorithms',
  'Application Development Project',
  'Mobile App Development',
  'Agile Methodology and Design Thinking',
  'Cloud Application Development',
  'Application Security',
  'Machine Learning for Developers',
  'Full Stack Web Development',
  'DevOps Essentials',
  'IoT Application Development'
];

const courses = [
  'Common ICT Program',
  'Information Technology'
];

const years = ['Year 1', 'Year 2', 'Year 3'];

const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-'];

const badges = ['Top Tutor', 'Subject Expert', 'Quick Responder', 'Highly Rated'];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

const locations = [
  'Library Level 5', 'Library Level 3', 'Online - Zoom', 'Online - Teams',
  'Study Room 3A', 'Study Room 4B', 'Cafeteria Study Area', 'Lab 2-01'
];

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min, max, decimals = 1) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const generateStudentId = () => {
  const digits = String(Math.floor(Math.random() * 1000000) + 2000000).padStart(7, '0');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = getRandomElement(letters.split(''));
  return `${digits}${letter}`;
};

const generateUserId = (studentId) => {
  return studentId;
};

const generateEmail = (studentId) => {
  return `${studentId}@student.tp.edu.sg`;
};

const generatePhone = () => {
  const prefix = '+65';
  const num = Math.floor(Math.random() * 90000000) + 80000000;
  return `${prefix} ${String(num).slice(0, 4)} ${String(num).slice(4)}`;
};

const generateAvailability = () => {
  const numDays = getRandomNumber(2, 5);
  const selectedDays = getRandomElements(days, numDays);
  return selectedDays.map(day => ({
    day,
    slots: getRandomElements(timeSlots, getRandomNumber(1, 4))
  }));
};

const generateTutorProfile = () => {
  const numSubjects = getRandomNumber(2, 5);
  const tutorSubjects = getRandomElements(subjects, numSubjects);
  
  return {
    rating: getRandomFloat(3.5, 5.0),
    reviewCount: getRandomNumber(5, 150),
    totalSessions: getRandomNumber(10, 200),
    hoursTaught: getRandomFloat(15, 300),
    responseRate: getRandomNumber(75, 100),
    replyTime: getRandomElement(['< 1 hour', '< 2 hours', '< 3 hours', '< 4 hours', '< 24 hours']),
    subjects: tutorSubjects.map(subject => ({
      name: subject,
      grade: getRandomElement(grades),
      sessions: getRandomNumber(5, 50)
    })),
    badges: getRandomElements(badges, getRandomNumber(0, 3)),
    availability: generateAvailability()
  };
};

const generateBio = (name, isTutor, subjectsCanTeach) => {
  if (isTutor) {
    return `Hi! I'm ${name}, passionate about ${getRandomElements(subjectsCanTeach, 2).join(' and ')}. I love helping students succeed and breaking down complex concepts into easy-to-understand explanations.`;
  }
  return `${name} is a student looking to improve their skills and collaborate with peers.`;
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...\n');
    
    await User.deleteMany({});
    await Module.deleteMany({});
    await Session.deleteMany({});

    console.log('Cleared existing data\n');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const totalUsers = 50;
    const users = [];

    const usedStudentIds = new Set();
    
    for (let i = 0; i < totalUsers; i++) {
      let studentId;
      do {
        studentId = generateStudentId();
      } while (usedStudentIds.has(studentId));
      usedStudentIds.add(studentId);

      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      const isTutor = Math.random() > 0.3;
      const numSubjectsCanTeach = isTutor ? getRandomNumber(2, 5) : 0;
      const subjectsCanTeach = isTutor ? getRandomElements(subjects, numSubjectsCanTeach) : [];
      const numSubjectsNeedHelp = !isTutor || Math.random() > 0.5 ? getRandomNumber(1, 4) : 0;
      const subjectsNeedHelp = numSubjectsNeedHelp > 0 ? getRandomElements(subjects, numSubjectsNeedHelp) : [];

      const userData = {
        userId: generateUserId(studentId),
        email: generateEmail(studentId),
        password: hashedPassword,
        name,
        phone: generatePhone(),
        year: getRandomElement(years),
        course: getRandomElement(courses),
        bio: generateBio(name, isTutor, subjectsCanTeach),
        isTutor,
        subjectsNeedHelp,
        subjectsCanTeach,
        memberSince: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      };

      if (isTutor) {
        userData.tutorProfile = generateTutorProfile();
      }

      users.push(userData);
    }

    const insertedUsers = await User.insertMany(users);
    console.log(`✓ Created ${insertedUsers.length} users\n`);

    const modules = await Module.insertMany([
      {
        moduleCode: 'CCF1C03',
        name: 'Cybersecurity Fundamentals',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 1,
        description: 'Fundamental concepts of cybersecurity',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Cybersecurity Fundamentals')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIA1C07',
        name: 'Logic and Mathematics',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 1,
        description: 'Fundamental logic and mathematical concepts for computing',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Logic and Mathematics')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIA1C11',
        name: 'Data Visualisation and Analytics',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 1,
        description: 'Learn to visualize and analyze data effectively',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Data Visualisation and Analytics')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT1C18',
        name: 'Computational Thinking',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 1,
        description: 'Develop computational thinking and problem-solving skills',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Computational Thinking')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT1C19',
        name: 'User Experience and Interface Design',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 1,
        description: 'Design user-friendly interfaces and experiences',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'User Experience and Interface Design')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CCF1C04',
        name: 'Network and Cloud Technology',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 2,
        description: 'Understand network fundamentals and cloud computing',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Network and Cloud Technology')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIA1C06',
        name: 'Database Application Development',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 2,
        description: 'Develop database applications and manage data',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Database Application Development')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT1C14',
        name: 'Data Structures and Algorithms',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 2,
        description: 'Master fundamental data structures and algorithms',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Data Structures and Algorithms')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT1C21',
        name: 'Application Development Project',
        school: 'School of IT',
        diploma: 'Common ICT Program',
        year: 1,
        semester: 2,
        description: 'Practical application development project',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Application Development Project')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C18',
        name: 'Mobile App Development',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 1,
        description: 'Build mobile applications for iOS and Android',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Mobile App Development')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C23',
        name: 'Agile Methodology and Design Thinking',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 1,
        description: 'Learn agile development practices and design thinking',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Agile Methodology and Design Thinking')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C24',
        name: 'Cloud Application Development',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 1,
        description: 'Develop applications for cloud platforms',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Cloud Application Development')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C29',
        name: 'Application Security',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 1,
        description: 'Secure applications and understand security fundamentals',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Application Security' || s.name === 'Cybersecurity Fundamentals')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CAI2C08',
        name: 'Machine Learning for Developers',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 2,
        description: 'Introduction to machine learning for application developers',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Machine Learning for Developers')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C20',
        name: 'Full Stack Web Development',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 2,
        description: 'Learn to build complete web applications using modern technologies',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'Full Stack Web Development')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CIT2C22',
        name: 'DevOps Essentials',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 2,
        description: 'Essential DevOps practices and tools',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'DevOps Essentials')).slice(0, 5).map(u => u._id)
      },
      {
        moduleCode: 'CMC2C16',
        name: 'IoT Application Development',
        school: 'School of IT',
        diploma: 'Information Technology',
        year: 2,
        semester: 2,
        description: 'Develop applications for Internet of Things devices',
        tutors: insertedUsers.filter(u => u.isTutor && u.tutorProfile?.subjects?.some(s => s.name === 'IoT Application Development')).slice(0, 5).map(u => u._id)
      }
    ]);

    console.log(`✓ Created ${modules.length} modules\n`);

    const sessions = [];
    const studentUsers = insertedUsers.filter(u => !u.isTutor || Math.random() > 0.3);
    const tutorUsers = insertedUsers.filter(u => u.isTutor);

    for (let i = 0; i < 30; i++) {
      const student = getRandomElement(studentUsers);
      const tutor = getRandomElement(tutorUsers);
      if (!tutor || !tutor.tutorProfile || !tutor.tutorProfile.subjects || tutor.tutorProfile.subjects.length === 0) continue;

      const subject = getRandomElement(tutor.tutorProfile.subjects);
      const isPast = Math.random() > 0.4;
      const daysAgo = getRandomNumber(0, 60);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const statuses = isPast ? ['Completed', 'Cancelled'] : ['Pending', 'Confirmed'];
      const status = getRandomElement(statuses);

      const sessionData = {
        sessionId: `S${String(1000 + i).padStart(4, '0')}`,
        student: student._id,
        tutor: tutor._id,
        subject: subject.name,
        moduleCode: getRandomElement(['CCF1C03', 'CIA1C07', 'CIA1C11', 'CIT1C18', 'CIT1C19', 'CCF1C04', 'CIA1C06', 'CIT1C14', 'CIT1C21', 'CIT2C18', 'CIT2C23', 'CIT2C24', 'CIT2C29', 'CAI2C08', 'CIT2C20', 'CIT2C22', 'CMC2C16']),
        topic: `${subject.name} - ${getRandomElement(['Basics', 'Advanced', 'Practice', 'Review', 'Exam Prep'])}`,
        date: date,
        time: getRandomElement(timeSlots),
        duration: getRandomElement([60, 90, 120]),
        location: getRandomElement(locations),
        notes: `Session for ${subject.name}`,
        status,
        createdBy: student._id
      };

      if (status === 'Completed') {
        sessionData.sessionNotes = `Great session covering ${subject.name} topics.`;
      }

      sessions.push(sessionData);
    }

    const insertedSessions = await Session.insertMany(sessions);
    console.log(`✓ Created ${insertedSessions.length} sessions\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('Database seeded successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`Total Users: ${insertedUsers.length}`);
    console.log(`  - Students only: ${insertedUsers.filter(u => !u.isTutor).length}`);
    console.log(`  - Tutors (dual role): ${insertedUsers.filter(u => u.isTutor).length}`);
    console.log(`Total Modules: ${modules.length}`);
    console.log(`Total Sessions: ${insertedSessions.length}\n`);
    console.log('Test credentials (all users):');
    console.log('  Email: <any user email from the list>');
    console.log('  Password: password123\n');
    console.log('Sample user emails:');
    insertedUsers.slice(0, 10).forEach(user => {
      console.log(`  - ${user.email} (${user.isTutor ? 'Tutor' : 'Student'})`);
    });
    console.log('\n');

    const credentialsPath = path.join(__dirname, '../../USER_CREDENTIALS.md');
    let markdown = '# User Login Credentials\n\n';
    markdown += `**Generated on:** ${new Date().toLocaleString()}\n\n`;
    markdown += `**Total Users:** ${insertedUsers.length}\n`;
    markdown += `- Students only: ${insertedUsers.filter(u => !u.isTutor).length}\n`;
    markdown += `- Tutors (dual role): ${insertedUsers.filter(u => u.isTutor).length}\n\n`;
    markdown += `**Default Password:** password123\n\n`;
    markdown += `**Email Format:** {studentId}@student.tp.edu.sg\n`;
    markdown += `**Student ID Format:** 7 digits + 1 letter (e.g., 2404908B)\n\n`;
    markdown += '---\n\n';
    markdown += '## All User Credentials\n\n';
    markdown += '| Student ID | Email | Name | Role | Course | Year |\n';
    markdown += '|------------|-------|------|------|--------|------|\n';

    insertedUsers.forEach(user => {
      const role = user.isTutor ? 'Tutor' : 'Student';
      markdown += `| ${user.userId} | ${user.email} | ${user.name} | ${role} | ${user.course || 'N/A'} | ${user.year || 'N/A'} |\n`;
    });

    markdown += '\n---\n\n';
    markdown += '## Quick Access Examples\n\n';
    markdown += '### Students Only (5 examples)\n\n';
    insertedUsers.filter(u => !u.isTutor).slice(0, 5).forEach(user => {
      markdown += `- **Email:** ${user.email}\n`;
      markdown += `  - **Password:** password123\n`;
      markdown += `  - **Name:** ${user.name}\n`;
      markdown += `  - **Course:** ${user.course || 'N/A'}\n\n`;
    });

    markdown += '### Tutors (5 examples)\n\n';
    insertedUsers.filter(u => u.isTutor).slice(0, 5).forEach(user => {
      markdown += `- **Email:** ${user.email}\n`;
      markdown += `  - **Password:** password123\n`;
      markdown += `  - **Name:** ${user.name}\n`;
      markdown += `  - **Course:** ${user.course || 'N/A'}\n`;
      markdown += `  - **Rating:** ${user.tutorProfile?.rating || 0}/5.0\n`;
      markdown += `  - **Total Sessions:** ${user.tutorProfile?.totalSessions || 0}\n\n`;
    });

    fs.writeFileSync(credentialsPath, markdown, 'utf8');
    console.log(`✓ Credentials file created: USER_CREDENTIALS.md\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
