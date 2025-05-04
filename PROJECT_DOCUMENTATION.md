# Seoul FestivMeet

Seoul FestivMeet is a platform for organizing meetups and gatherings at festivals or events in Seoul. The application allows users to create chat rooms with specific parameters to find companions with matching criteria for attending events together.

## Project Overview

This application serves as a social platform where users can:
- Browse upcoming festivals and events in Seoul
- Create chat rooms for specific events with detailed parameters
- Join existing chat rooms based on their preferences
- Communicate with potential meetup companions

## Technology Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Features

### Event Browsing
- View upcoming festivals and events in Seoul
- See event details including dates, descriptions, and images

### Chat Room Creation
- Create chat rooms for specific events with detailed parameters:
  - Event date selection (with a calendar that respects event dates and holidays)
  - Group size specification
  - Chat room naming
  - Age restrictions (min/max or no limit)
  - Gender preferences (male, female, or both)

### User Authentication
- Sign up and login functionality powered by Supabase
- Protected routes for authenticated users

### Internationalization
- Support for multiple languages (currently English and Korean)
- Easy switching between languages

## Application Structure

```
seoul-festivmeet/
├── app/                    # Next.js App Router pages
│   ├── protected/          # Protected routes (requires authentication)
│   │   ├── events/         # Event-related pages
│   │   └── chatting/       # Chat-related pages
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Other components
├── i18n/                   # Internationalization configuration
├── messages/               # Translation messages
│   ├── en.json            # English translations
│   └── kor.json           # Korean translations
├── lib/                    # Utility functions and libraries
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seoul-festivmeet.git
   cd seoul-festivmeet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase project at [https://app.supabase.com/](https://app.supabase.com/)
   - Copy your Supabase URL and anon key
   - Create a `.env.local` file in the root directory with the following content:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Examples

### Creating a Chat Room

1. Browse to an event page
2. Click on "방 생성" (Create Room) button
3. Fill in the required details:
   - Select an event date
   - Specify the number of participants
   - Name your chat room
   - Set age restrictions (or select no limit)
   - Choose gender preferences
4. Click the "생성" (Create) button to create your chat room

## Internationalization

The application supports multiple languages. Currently, English and Korean are implemented.

Translation files are located in the `messages/` directory:
- `en.json` for English
- `kor.json` for Korean

To add support for additional languages, create a new JSON file in the `messages/` directory with the appropriate language code.

## Development Guidelines

### Code Style
- Follow the TypeScript coding standards
- Use functional components with React hooks
- Implement proper error handling
- Write meaningful comments for complex logic

### Component Structure
- Keep components small and focused on a single responsibility
- Use composition to build complex UIs
- Implement proper prop validation

### State Management
- Use React's built-in state management (useState, useContext) for simple state
- Consider using more robust state management solutions for complex state

### Internationalization
- Always use translation keys instead of hardcoded strings
- Keep translation files organized and up-to-date

## Future Enhancements

Potential features for future development:
- Real-time chat functionality
- User profiles with preferences and history
- Rating system for meetup participants
- Integration with popular social media platforms
- Event recommendations based on user preferences
- Mobile application version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.