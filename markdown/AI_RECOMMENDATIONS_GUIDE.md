# AI-Powered Recommendations Feature Guide

## Overview

The Synapse platform now includes **AI-Powered Personalized Tutor Recommendations** using Google's Gemini API. This feature analyzes each student's learning history, preferences, and patterns to suggest the most suitable tutors.

---

## Features

### 1. Personalized Tutor Recommendations
- Analyzes student's completed session history
- Considers subjects studied, frequency, and recency
- Matches with tutors based on expertise and ratings
- Provides AI-generated reasoning for each recommendation
- Shows top 5 most relevant tutors

### 2. Learning Insights Dashboard
- Total sessions completed
- Most studied subject
- Learning streak status
- Preferred time slots
- Favorite locations

### 3. Subject Progression Suggestions
- Suggests next subjects to learn based on current progress
- Follows logical learning pathways
- Considers course requirements and prerequisites

---

## How It Works

### Data Analysis Process

1. **User History Collection**
   - Fetches last 10 completed sessions
   - Extracts subjects, topics, tutors, and ratings
   - Identifies patterns in booking preferences

2. **Preference Extraction**
   ```javascript
   {
     mostFrequentSubjects: ["Python", "Web Development"],
     preferredLocation: "Library Level 5",
     preferredTimeSlot: "Afternoon",
     tutorRatings: {...},
     totalSessions: 12
   }
   ```

3. **AI Processing**
   - Sends structured prompt to Gemini API
   - Includes user profile, learning history, and available tutors
   - AI analyzes patterns and generates personalized recommendations

4. **Recommendation Generation**
   - AI returns top 5 tutor names with reasoning
   - System matches names to actual tutor profiles
   - Fallback to rule-based recommendations if AI unavailable

### AI Prompt Structure

The system sends a detailed prompt to Gemini including:
- User's academic profile (name, year, course)
- Learning history (subjects, topics, frequency)
- Preferences (location, time, subjects needed)
- Available tutors with their specializations
- Request for top 5 recommendations with reasoning

---

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment

Add to your `.env` file in the `server` directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
cd server
npm install @google/generative-ai
```

### 4. Restart Server

```bash
npm run dev
```

---

## API Endpoints

### Get Personalized Tutor Recommendations
```http
GET /api/recommendations/tutors
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "_id": "...",
        "name": "Sarah Chen",
        "tutorProfile": {
          "rating": 4.9,
          "subjects": [...],
          "badges": ["Top Tutor"]
        }
      }
    ],
    "reasoning": "Based on your recent Python sessions...",
    "preferences": {
      "subjects": ["Python", "Web Development"],
      "location": "Library Level 5",
      "timeSlot": "Afternoon"
    }
  }
}
```

### Get Subject Suggestions
```http
GET /api/recommendations/subjects
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Data Structures - Build upon your Python knowledge",
      "Web Development - Complement your programming skills"
    ],
    "reasoning": "AI-generated suggestions based on your learning journey"
  }
}
```

### Get Learning Insights
```http
GET /api/recommendations/insights
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 12,
    "mostStudiedSubject": "Python",
    "recentSubjects": ["Python", "Web Development"],
    "favoriteTime": "2:00 PM",
    "learningStreak": "Active learner"
  }
}
```

---

## Frontend Integration

### Using the AIRecommendations Component

```jsx
import AIRecommendations from '../components/AIRecommendations';

function Dashboard() {
  return (
    <div>
      <AIRecommendations />
    </div>
  );
}
```

### Component Features

- **Loading State**: Shows animated spinner while fetching data
- **Error Handling**: Displays error message with retry button
- **Insights Panel**: Shows learning statistics
- **Recommendations Grid**: Displays top 5 tutors with badges
- **Click to View**: Navigate to tutor profile on click
- **Refresh Button**: Manually refresh recommendations

---

## Fallback Mechanism

If Gemini API is not configured or fails, the system automatically falls back to a rule-based recommendation system:

1. **Subject Matching**: Finds tutors teaching subjects user has studied
2. **Rating Sort**: Prioritizes highly-rated tutors
3. **Experience Weight**: Considers total sessions completed
4. **Diversity**: Includes tutors from different specializations

This ensures the feature always works, even without AI.

---

## Recommendation Algorithm

### AI-Powered (When API Key Available)

```
1. Analyze user's session history
2. Extract learning patterns and preferences
3. Generate contextual prompt for Gemini
4. AI evaluates all tutors against user profile
5. Returns top 5 matches with reasoning
6. System validates and enriches recommendations
```

### Rule-Based Fallback

```
1. Filter tutors by subject match
2. Calculate compatibility score:
   - Subject match: 40%
   - Rating: 30%
   - Experience: 20%
   - Availability: 10%
3. Sort by score
4. Return top 5
```

---

## Customization Options

### Adjusting Recommendation Count

In `aiRecommendationService.js`:
```javascript
return {
  recommendations: recommendations.slice(0, 5), // Change 5 to desired count
  // ...
};
```

### Modifying AI Prompt

Edit the `buildPrompt` method in `aiRecommendationService.js`:
```javascript
buildPrompt(user, preferences, tutors, recentSessions) {
  // Customize the prompt structure
  // Add more context or change weighting
}
```

### Changing Time Slot Categories

In `categorizeTimeSlot` method:
```javascript
categorizeTimeSlot(time) {
  // Modify time ranges
  if (hour24 >= 6 && hour24 < 12) return 'Morning';
  // Add more categories
}
```

---

## Performance Considerations

### Caching Recommendations

Consider implementing caching to reduce API calls:
```javascript
// Cache recommendations for 1 hour
const cacheKey = `recommendations:${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Generate new recommendations
const recommendations = await generateRecommendations();
await redis.setex(cacheKey, 3600, JSON.stringify(recommendations));
```

### Rate Limiting

Gemini API has rate limits. Consider:
- Caching results
- Limiting refresh frequency
- Implementing request queuing

---

## Testing

### Test with Sample Data

1. Create test user with session history:
```bash
npm run seed
```

2. Login with test account:
```
Email: alex.tan@student.tp.edu.sg
Password: password123
```

3. View dashboard to see AI recommendations

### Test Without API Key

1. Remove `GEMINI_API_KEY` from `.env`
2. Restart server
3. Verify fallback recommendations work

---

## Troubleshooting

### Issue: "AI recommendations unavailable"

**Solution:**
- Check if `GEMINI_API_KEY` is set in `.env`
- Verify API key is valid at [Google AI Studio](https://makersuite.google.com)
- Check server logs for API errors
- Ensure `@google/generative-ai` package is installed

### Issue: Recommendations not updating

**Solution:**
- Click the "Refresh" button
- Complete more sessions to improve recommendations
- Clear browser cache and localStorage
- Check if user has completed sessions

### Issue: Generic recommendations

**Solution:**
- Ensure user has completed at least 2-3 sessions
- Verify session data includes subject and topic
- Check if tutors have properly configured profiles
- Review AI prompt for specificity

---

## Future Enhancements

### Planned Features

1. **Real-time Learning Path Suggestions**
   - Dynamic curriculum recommendations
   - Skill gap analysis

2. **Tutor Matching Score**
   - Percentage match display
   - Detailed compatibility breakdown

3. **Learning Style Analysis**
   - Identify preferred learning methods
   - Match with tutor teaching styles

4. **Predictive Analytics**
   - Predict optimal study times
   - Suggest session duration

5. **Multi-language Support**
   - AI recommendations in multiple languages
   - Localized learning paths

---

## Privacy & Data Usage

### Data Collected for AI

- Session subjects and topics
- Booking times and locations
- Review ratings (anonymous)
- User's stated preferences

### Data NOT Shared

- Personal messages
- Payment information
- Contact details
- Session notes content

### User Control

Users can opt-out of AI recommendations in settings (future feature).

---

## Cost Considerations

### Gemini API Pricing

- Free tier: 60 requests per minute
- Suitable for small to medium deployments
- Monitor usage in Google Cloud Console

### Optimization Tips

1. Cache recommendations for 1-6 hours
2. Batch user requests
3. Use fallback for non-critical requests
4. Implement request queuing

---

## Example Use Cases

### New Student
- No session history
- Shows top-rated tutors
- Suggests popular subjects

### Active Learner
- Multiple completed sessions
- AI identifies learning pattern
- Recommends progression path

### Focused Student
- Studies one subject intensively
- AI suggests advanced topics
- Recommends specialist tutors

### Diverse Learner
- Studies multiple subjects
- AI balances recommendations
- Suggests complementary skills

---

## Support & Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://makersuite.google.com
- **API Status**: https://status.cloud.google.com

---

## Conclusion

The AI-Powered Recommendations feature significantly enhances the user experience by:
- Reducing time to find suitable tutors
- Improving tutor-student matching
- Providing personalized learning guidance
- Increasing platform engagement

Simply add your Gemini API key to start leveraging AI-powered recommendations!

