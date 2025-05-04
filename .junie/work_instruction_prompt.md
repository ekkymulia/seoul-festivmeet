# Seoul FestivMeet - Feature Implementation Work Instructions

This document provides comprehensive guidelines for implementing the following new features for the Seoul FestivMeet platform:

1. Real-time chat functionality
2. User profiles with preferences and history
3. Rating system for meeting participants
4. Integration with popular social media platforms
5. Event recommendations based on user preferences
6. Mobile application version

## 1. Real-time Chat Functionality

### Requirements
- Implement real-time messaging within existing chat rooms
- Support text messages, emojis, and image sharing
- Display typing indicators and read receipts
- Implement message history and pagination
- Provide notification for new messages
- Support group and private messaging

### Technical Guidelines
- **Technology Selection**: 
  - Use Supabase Realtime for WebSocket connections
  - Alternatively, consider Socket.io or Firebase Realtime Database if more advanced features are needed
- **Database Schema**:
  ```sql
  -- Messages Table
  CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
  );
  
  -- Create realtime publication
  BEGIN;
    DROP PUBLICATION IF EXISTS supabase_realtime;
    CREATE PUBLICATION supabase_realtime FOR TABLE messages;
  COMMIT;
  ```
- **Component Structure**:
  - Create a `ChatWindow` component in `components/chat/`
  - Create a `MessageInput` component in `components/chat/`
  - Create a `MessageList` component in `components/chat/`
  - Create a `ChatNotification` component in `components/chat/`

### Integration Points
- Extend the existing `app/protected/chatting/` routes
- Add a new page at `app/protected/chatting/[roomId]/page.tsx`
- Create a new API endpoint at `app/api/messages/route.ts`
- Update the Supabase client in `lib/supabase.ts` to support realtime subscriptions

### Testing Guidelines
- Test message sending and receiving in real-time
- Test with multiple users in different browsers
- Test offline behavior and reconnection
- Test with various message types (text, images)
- Test notifications when the chat is not in focus

## 2. User Profiles with Preferences and History

### Requirements
- Create detailed user profiles with personal information
- Allow users to set preferences for events and meetups
- Track user participation history
- Implement profile privacy settings
- Support profile pictures and customization
- Add social links and personal bio

### Technical Guidelines
- **Database Schema**:
  ```sql
  -- User Profiles Table
  CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    privacy_setting SMALLINT DEFAULT 0
  );
  
  -- User Preferences Table
  CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- User Event History Table
  CREATE TABLE user_event_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'attended'
  );
  ```
- **Component Structure**:
  - Create a `ProfileEditor` component in `components/profile/`
  - Create a `PreferenceSelector` component in `components/profile/`
  - Create a `EventHistory` component in `components/profile/`
  - Create a `ProfileView` component in `components/profile/`

### Integration Points
- Add new routes at `app/protected/profile/`
- Create a public profile view at `app/[username]/page.tsx`
- Create API endpoints at `app/api/profile/` and `app/api/preferences/`
- Update the authentication flow to create a profile on signup

### Testing Guidelines
- Test profile creation and editing
- Test preference setting and retrieval
- Test privacy settings and their effects
- Test profile viewing with different permission levels
- Test history tracking accuracy

## 3. Rating System for Meeting Participants

### Requirements
- Allow users to rate other participants after events
- Support numerical ratings (1-5 stars)
- Allow optional text reviews
- Calculate and display average ratings on profiles
- Implement reporting system for inappropriate reviews
- Create moderation tools for administrators

### Technical Guidelines
- **Database Schema**:
  ```sql
  -- Ratings Table
  CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rated_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reviewer_id, rated_user_id, event_id)
  );
  
  -- Reports Table
  CREATE TABLE rating_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating_id UUID REFERENCES ratings(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
  );
  ```
- **Component Structure**:
  - Create a `RatingForm` component in `components/ratings/`
  - Create a `RatingDisplay` component in `components/ratings/`
  - Create a `RatingsSummary` component in `components/ratings/`
  - Create a `ReportForm` component in `components/ratings/`

### Integration Points
- Add a new page at `app/protected/events/[eventId]/rate/page.tsx`
- Create API endpoints at `app/api/ratings/` and `app/api/reports/`
- Integrate rating display in user profiles
- Add rating prompts after event completion

### Testing Guidelines
- Test rating submission and validation
- Test average rating calculation
- Test report submission and handling
- Test permissions (only allow rating after participation)
- Test moderation tools and actions

## 4. Integration with Popular Social Media Platforms

### Requirements
- Allow users to sign in with social media accounts
- Enable sharing events on social media platforms
- Import profile information from social accounts
- Post event participation updates to social media
- Invite friends from social networks to events
- Implement social media feed widgets

### Technical Guidelines
- **Technology Selection**:
  - Use NextAuth.js for social authentication
  - Implement social media SDKs for sharing (Facebook, Twitter, Instagram)
- **Configuration**:
  - Set up OAuth credentials for each platform
  - Configure callback URLs and permissions
- **Component Structure**:
  - Create a `SocialLogin` component in `components/auth/`
  - Create a `SocialShare` component in `components/social/`
  - Create a `SocialInvite` component in `components/social/`
  - Create a `SocialFeed` component in `components/social/`

### Integration Points
- Update authentication flow in `app/auth/` to support social logins
- Add social sharing buttons to event pages
- Create API endpoints at `app/api/social/` for social interactions
- Integrate social widgets in the dashboard

### Testing Guidelines
- Test social authentication flows
- Test sharing functionality on each platform
- Test permissions and privacy settings
- Test social invitations and tracking
- Test with different social accounts and permissions

## 5. Event Recommendations Based on User Preferences

### Requirements
- Analyze user preferences and history
- Recommend events based on user interests
- Implement a recommendation algorithm
- Display personalized event suggestions
- Allow users to provide feedback on recommendations
- Track recommendation effectiveness

### Technical Guidelines
- **Algorithm Approach**:
  - Implement collaborative filtering for recommendations
  - Use content-based filtering based on event categories
  - Consider hybrid approaches for better results
- **Database Schema**:
  ```sql
  -- Recommendation Feedback Table
  CREATE TABLE recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    is_relevant BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- User-Event Interaction Strength Table
  CREATE TABLE user_event_interactions (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_category TEXT NOT NULL,
    interaction_strength FLOAT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, event_category)
  );
  ```
- **Component Structure**:
  - Create a `RecommendationEngine` service in `lib/recommendations/`
  - Create a `RecommendedEvents` component in `components/events/`
  - Create a `RecommendationFeedback` component in `components/events/`

### Integration Points
- Add a new page at `app/protected/recommendations/page.tsx`
- Create API endpoints at `app/api/recommendations/`
- Integrate recommendations in the dashboard
- Add recommendation sections to event browsing pages

### Testing Guidelines
- Test recommendation quality and relevance
- Test with different user profiles and preferences
- Test feedback collection and algorithm adjustment
- Test performance with large datasets
- Test cold start scenarios (new users)

## 6. Mobile Application Version

### Requirements
- Create a responsive mobile interface
- Implement native-like features using PWA capabilities
- Support push notifications
- Optimize performance for mobile devices
- Implement offline capabilities
- Support both iOS and Android platforms

### Technical Guidelines
- **Technology Selection**:
  - Use Next.js with responsive design for web-based approach
  - Consider React Native for a fully native experience
  - Implement PWA features for web-based approach
- **Mobile-Specific Features**:
  - Implement service workers for offline support
  - Set up push notification infrastructure
  - Create mobile-optimized layouts
- **Component Structure**:
  - Create mobile-specific components in `components/mobile/`
  - Implement responsive variants of existing components
  - Create a `NotificationHandler` component

### Integration Points
- Update existing layouts to be responsive
- Create mobile-specific routes if needed
- Implement a service worker at `public/sw.js`
- Create API endpoints for push notification registration

### Testing Guidelines
- Test on various mobile devices and screen sizes
- Test offline functionality and data synchronization
- Test push notifications on different platforms
- Test performance and battery usage
- Test touch interactions and mobile gestures

## Implementation Prioritization

Recommended implementation order:

1. **Real-time Chat Functionality** - Core feature that enhances user engagement
2. **User Profiles with Preferences** - Foundation for personalization features
3. **Rating System** - Builds trust in the community
4. **Event Recommendations** - Leverages profiles to enhance user experience
5. **Social Media Integration** - Expands reach and simplifies onboarding
6. **Mobile Application** - Extends platform accessibility

## Development Process Guidelines

### Code Quality Standards
- Follow TypeScript best practices with proper typing
- Write unit tests for all new components and services
- Maintain consistent code style using the project's ESLint and Prettier configuration
- Document all new components and functions with JSDoc comments
- Follow the existing component structure and naming conventions

### Internationalization
- Add all user-facing strings to translation files in `messages/`
- Support both English and Korean for all new features
- Use translation keys instead of hardcoded strings
- Test all features in both languages

### Performance Considerations
- Optimize database queries with proper indexes
- Implement pagination for large data sets
- Use React Query or SWR for data fetching and caching
- Implement lazy loading for images and heavy components
- Monitor and optimize bundle size

### Security Guidelines
- Implement proper authentication and authorization checks
- Sanitize user inputs to prevent XSS attacks
- Use Supabase RLS policies for database security
- Implement rate limiting for API endpoints
- Follow OWASP security best practices

## Deliverables

For each feature, the following deliverables are expected:

1. Database schema changes (SQL scripts)
2. New components and pages
3. API endpoints and services
4. Unit and integration tests
5. Documentation updates
6. Internationalization updates

## Conclusion

This work instruction provides a comprehensive guide for implementing the six new features for Seoul FestivMeet. Each feature has been broken down into detailed requirements, technical guidelines, integration points, and testing guidelines to ensure successful implementation.

Follow the prioritization order to maximize the impact of each feature on the user experience. Regular code reviews and testing will help maintain code quality and ensure that the features meet the requirements.