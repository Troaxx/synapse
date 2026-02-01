# Additional Feature: AI Recommendations
This web application implements AI recommendations service to provide personalized suggestions to users based on their past activity or preferences, enhancing the relevance of the web application.

The AI Recommendation feature provides personalised suggestions of "recommended" tutors based on past user activities. For example, if a tutor has mostly positive reviews, the AI Recommendation feature will suggest that tutor to other users who have similar interests or preferences.

In turn, this feature improves user experience by providing a more seamless and 'easy' way for users to look for tutors who really match what they might be looking for if they can't find a suitable one on the web application.

# Implementation
The following prompt is used for the service (can be found in `server/services/aiRecommendationService.js`):

```
You are an AI tutor recommendation system for a peer tutoring platform at Temasek Polytechnic.

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

Task: Analyze the user's learning patterns and recommend the TOP 3 tutors that would be most beneficial for this student. Consider:
1. Subject match with user's recent sessions and needs
2. Tutor's rating and experience (total sessions)
3. Tutor's specialization badges
4. Continuity - if user studied a subject recently, they might want to continue
5. Diversity - also suggest tutors for subjects the user expressed interest in but hasn't tried yet

Provide your response in this EXACT format:
RECOMMENDED_TUTORS: [tutor name 1], [tutor name 2], [tutor name 3]

REASONING:
- [Tutor Name]: [Specific strength 1] | [Specific strength 2] | [Specific strength 3]

Use the '|' character to separate distinct points. Keep each point concise (under 10 words).
```

# Other Notes
If an API key is not provided, the AI recommendation service will use a 'fallback' version, which is manually calculated based on the following criteria:

1. Subject Relevance (Primary Priority)
The system first prioritizes tutors who match the user's learning history:

It looks at the user's mostFrequentSubjects (derived from their completed sessions).
It filters the list of available tutors to find those whose `tutorProfile.subjects` contain a match (using case-insensitive partial string matching). Tutors who teach these relevant subjects are placed at the top of the matched list.

2. Tutor Rating (Secondary Priority)
After prioritizing by subject match, the system sorts the tutors based on quality:

Both the "Subject Matched" group and the "Remaining Tutors" group are internally sorted by their rating (tutorProfile.rating) in descending order.
This ensures that among tutors who teach the same subject, the highest-rated ones are recommended first.

Code Snippet of the fallback recommendation code (found in `server/services/aiRecommendationService.js`):
```  
  fallbackRecommendation(preferences, availableTutors) {
    console.log('⚠️ Using Fallback Recommendation System');
    const subjectMatch = availableTutors.filter(tutor => {
      const tutorSubjects = tutor.tutorProfile?.subjects?.map(s => s.name.toLowerCase()) || [];
      return preferences.mostFrequentSubjects.some(subject =>
        tutorSubjects.some(ts => ts.includes(subject.toLowerCase()) || subject.toLowerCase().includes(ts))
      ); // Check if tutor teaches user's frequent subjects
    });

    const sortedTutors = [...subjectMatch, ...availableTutors.filter(t => !subjectMatch.includes(t))]
      .sort((a, b) => {
        const ratingA = a.tutorProfile?.rating || 0;
        const ratingB = b.tutorProfile?.rating || 0;
        return ratingB - ratingA;
      }); // Sort by rating high to low (in general, not specified reviews/ratings)

    return {
      recommendations: sortedTutors.slice(0, 3),
      reasoning: `Based on your recent sessions in ${preferences.mostFrequentSubjects.join(', ')}:\n\n` +
        sortedTutors.slice(0, 3).map(t => `- **${t.name}**: Highly rated (${t.tutorProfile?.rating || 0}★) | Expertise matches your subjects | proven track record`).join('\n') +
        `\n\n(Note: These are rule-based recommendations pending AI service availability)`,
      preferences: {
        subjects: preferences.mostFrequentSubjects,
        location: preferences.preferredLocation,
        timeSlot: preferences.preferredTimeSlot
      }
    };
  }
  ```
