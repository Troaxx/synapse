const { GoogleGenerativeAI } = require('@google/generative-ai');
const Session = require('../models/Session');
const User = require('../models/User');

class AIRecommendationService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeAI();
  }

  initializeAI() {
    if (process.env.GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      } catch (error) {
        console.warn('Error initializing Gemini AI:', error.message);
        this.model = null;
      }
    } else {
      console.warn('Gemini API key not found. AI recommendations will be disabled.');
    }
  }

  async getPersonalizedRecommendations(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const recentSessions = await Session.find({
        student: userId,
        status: 'Completed'
      })
        .populate('tutor', 'name tutorProfile')
        .sort({ date: -1 })
        .limit(10);

      const userPreferences = await this.analyzeUserPreferences(user, recentSessions);

      const availableTutors = await User.find({
        isTutor: true,
        _id: { $ne: userId }
      }).select('-password');

      if (!this.model) {
        return this.fallbackRecommendation(userPreferences, availableTutors);
      }

      const aiRecommendations = await this.getAIRecommendations(
        user,
        userPreferences,
        availableTutors,
        recentSessions
      );

      return aiRecommendations;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }

  async analyzeUserPreferences(user, recentSessions) {
    const subjectFrequency = {};
    const tutorRatings = {};
    const preferredLocations = {};
    const preferredTimes = {};

    recentSessions.forEach(session => {
      subjectFrequency[session.subject] = (subjectFrequency[session.subject] || 0) + 1;

      if (session.location) {
        preferredLocations[session.location] = (preferredLocations[session.location] || 0) + 1;
      }

      if (session.time) {
        const timeSlot = this.categorizeTimeSlot(session.time);
        preferredTimes[timeSlot] = (preferredTimes[timeSlot] || 0) + 1;
      }

      if (session.review && session.review.rating) {
        const tutorId = session.tutor._id.toString();
        if (!tutorRatings[tutorId]) {
          tutorRatings[tutorId] = {
            ratings: [],
            tutorName: session.tutor.name
          };
        }
        tutorRatings[tutorId].ratings.push(session.review.rating);
      }
    });

    const mostFrequentSubjects = Object.entries(subjectFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject]) => subject);

    const preferredLocation = Object.entries(preferredLocations)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Any';

    const preferredTimeSlot = Object.entries(preferredTimes)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Any';

    return {
      mostFrequentSubjects,
      preferredLocation,
      preferredTimeSlot,
      tutorRatings,
      subjectsNeedHelp: user.subjectsNeedHelp || [],
      totalSessions: recentSessions.length
    };
  }

  categorizeTimeSlot(time) {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

    if (hour24 >= 6 && hour24 < 12) return 'Morning';
    if (hour24 >= 12 && hour24 < 17) return 'Afternoon';
    if (hour24 >= 17 && hour24 < 21) return 'Evening';
    return 'Night';
  }

  async getAIRecommendations(user, preferences, availableTutors, recentSessions) {
    const prompt = this.buildPrompt(user, preferences, availableTutors, recentSessions);

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Generation Timeout')), 10000)
      );

      // Race the generation against the timeout
      const result = await Promise.race([
        this.model.generateContent(prompt),
        timeoutPromise
      ]);

      const response = await result.response;
      const text = response.text();

      console.log('✅ AI Service successfully generated recommendations using model:', this.model.model);

      const recommendations = this.parseAIResponse(text, availableTutors);

      return {
        recommendations: recommendations.slice(0, 5),
        reasoning: text,
        preferences: {
          subjects: preferences.mostFrequentSubjects,
          location: preferences.preferredLocation,
          timeSlot: preferences.preferredTimeSlot
        }
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.fallbackRecommendation(preferences, availableTutors);
    }
  }

  buildPrompt(user, preferences, tutors, recentSessions) {
    const tutorsList = tutors.map(t => ({
      name: t.name,
      subjects: t.tutorProfile?.subjects?.map(s => s.name) || [],
      rating: t.tutorProfile?.rating || 0,
      totalSessions: t.tutorProfile?.totalSessions || 0,
      badges: t.tutorProfile?.badges || [],
      availability: t.tutorProfile?.availability?.length || 0
    }));

    const recentSubjects = recentSessions.map(s => s.subject).join(', ');
    const recentTopics = recentSessions.map(s => s.topic).join(', ');

    return `You are an AI tutor recommendation system for a peer tutoring platform at Temasek Polytechnic.

User Profile:
- Name: ${user.name}
- Year: ${user.year}
- Course: ${user.course}
- Subjects they need help with: ${preferences.subjectsNeedHelp.join(', ') || 'Not specified'}

User's Learning History:
- Total completed sessions: ${preferences.totalSessions}
- Most frequently studied subjects: ${preferences.mostFrequentSubjects.join(', ') || 'None yet'}
- Recent subjects: ${recentSubjects || 'None'}
- Recent topics: ${recentTopics || 'None'}
- Preferred location: ${preferences.preferredLocation}
- Preferred time slot: ${preferences.preferredTimeSlot}

Available Tutors:
${JSON.stringify(tutorsList, null, 2)}

Task: Analyze the user's learning patterns and recommend the TOP 5 tutors that would be most beneficial for this student. Consider:
1. Subject match with user's recent sessions and needs
2. Tutor's rating and experience (total sessions)
3. Tutor's specialization badges
4. Continuity - if user studied a subject recently, they might want to continue
5. Diversity - also suggest tutors for subjects the user expressed interest in but hasn't tried yet

Provide your response in this EXACT format:
RECOMMENDED_TUTORS: [tutor name 1], [tutor name 2], [tutor name 3], [tutor name 4], [tutor name 5]

REASONING:
- [Tutor Name]: [Specific strength 1] | [Specific strength 2] | [Specific strength 3]

Use the '|' character to separate distinct points. Keep each point concise (under 10 words).`;
  }

  parseAIResponse(text, availableTutors) {
    const recommendedNames = [];

    const tutorLine = text.match(/RECOMMENDED_TUTORS:\s*(.+)/i);
    if (tutorLine) {
      const names = tutorLine[1].split(',').map(name =>
        name.trim().replace(/[\[\]]/g, '')
      );
      recommendedNames.push(...names);
    }

    const recommendations = [];
    for (const name of recommendedNames) {
      const tutor = availableTutors.find(t =>
        t.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(t.name.toLowerCase())
      );
      if (tutor && !recommendations.find(r => r._id.equals(tutor._id))) {
        recommendations.push(tutor);
      }
    }

    if (recommendations.length < 5) {
      const remaining = availableTutors
        .filter(t => !recommendations.find(r => r._id.equals(t._id)))
        .sort((a, b) => (b.tutorProfile?.rating || 0) - (a.tutorProfile?.rating || 0))
        .slice(0, 5 - recommendations.length);
      recommendations.push(...remaining);
    }

    return recommendations;
  }

  fallbackRecommendation(preferences, availableTutors) {
    console.log('⚠️ Using Fallback Recommendation System');
    const subjectMatch = availableTutors.filter(tutor => {
      const tutorSubjects = tutor.tutorProfile?.subjects?.map(s => s.name.toLowerCase()) || [];
      return preferences.mostFrequentSubjects.some(subject =>
        tutorSubjects.some(ts => ts.includes(subject.toLowerCase()) || subject.toLowerCase().includes(ts))
      );
    });

    const sortedTutors = [...subjectMatch, ...availableTutors.filter(t => !subjectMatch.includes(t))]
      .sort((a, b) => {
        const ratingA = a.tutorProfile?.rating || 0;
        const ratingB = b.tutorProfile?.rating || 0;
        return ratingB - ratingA;
      });

    return {
      recommendations: sortedTutors.slice(0, 5),
      reasoning: `Based on your recent sessions in ${preferences.mostFrequentSubjects.join(', ')}:\n\n` +
        sortedTutors.slice(0, 5).map(t => `- **${t.name}**: Highly rated (${t.tutorProfile?.rating || 0}★) | Expertise matches your subjects | proven track record`).join('\n') +
        `\n\n(Note: These are rule-based recommendations pending AI service availability)`,
      preferences: {
        subjects: preferences.mostFrequentSubjects,
        location: preferences.preferredLocation,
        timeSlot: preferences.preferredTimeSlot
      }
    };
  }

  async getSubjectRecommendations(userId) {
    try {
      const recentSessions = await Session.find({
        student: userId,
        status: 'Completed'
      })
        .sort({ date: -1 })
        .limit(10);

      const user = await User.findById(userId);

      if (!this.model) {
        return this.fallbackSubjectRecommendation(recentSessions, user);
      }

      const subjects = recentSessions.map(s => s.subject);
      const topics = recentSessions.map(s => s.topic);

      const prompt = `Based on a student's recent tutoring sessions, suggest 3-5 related subjects or topics they should consider learning next.

Recent subjects studied: ${subjects.join(', ')}
Recent topics: ${topics.join(', ')}
Student's year: ${user.year}
Student's course: ${user.course}

Provide suggestions that:
1. Build upon their current knowledge
2. Are relevant to their course
3. Follow a logical learning progression

Format: List 3-5 subjects/topics, one per line, with a brief reason (one sentence each).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        suggestions: text.split('\n').filter(line => line.trim()),
        reasoning: 'AI-generated suggestions based on your learning journey'
      };
    } catch (error) {
      console.error('Error getting subject recommendations:', error);
      return this.fallbackSubjectRecommendation(recentSessions, user);
    }
  }

  fallbackSubjectRecommendation(recentSessions, user) {
    const commonProgression = {
      'Python': ['Data Structures', 'Web Development', 'Machine Learning'],
      'Java': ['Object-Oriented Programming', 'Data Structures', 'Android Development'],
      'Web Development': ['JavaScript', 'React', 'Full Stack Development'],
      'Database': ['SQL', 'NoSQL', 'Database Design'],
      'Mathematics': ['Statistics', 'Calculus', 'Linear Algebra']
    };

    const recentSubjects = [...new Set(recentSessions.map(s => s.subject))];
    const suggestions = [];

    recentSubjects.forEach(subject => {
      if (commonProgression[subject]) {
        suggestions.push(...commonProgression[subject]);
      }
    });

    return {
      suggestions: [...new Set(suggestions)].slice(0, 5),
      reasoning: 'Suggested based on common learning progressions'
    };
  }
}

module.exports = new AIRecommendationService();

