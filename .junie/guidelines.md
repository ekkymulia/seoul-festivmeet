# Project Guidelines for Junie

## Project Structure

Seoul FestivMeet is a Next.js application with the following structure:

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

## Testing Guidelines

When implementing changes to the codebase:

1. Run the development server to test your changes:
   ```bash
   npm run dev
   ```

2. Verify that your changes work as expected by navigating to the relevant pages in the application.

3. Ensure that the application works correctly in both English and Korean languages.

4. Test all user interactions, especially form validations and state changes.

## Building the Project

Before submitting your changes, build the project to ensure there are no compilation errors:

```bash
npm run build
```

Fix any errors that occur during the build process before submitting your changes.

## Code Style Guidelines

1. **TypeScript**: Use proper typing for all variables, parameters, and return values.

2. **React Components**:
   - Use functional components with hooks
   - Keep components small and focused on a single responsibility
   - Use proper prop validation

3. **Naming Conventions**:
   - Use camelCase for variables and functions
   - Use PascalCase for components and interfaces
   - Use kebab-case for file names

4. **Formatting**:
   - Use 2 spaces for indentation
   - Use semicolons at the end of statements
   - Use single quotes for strings

5. **Comments**:
   - Add comments for complex logic
   - Use JSDoc comments for functions and components

6. **Internationalization**:
   - Use translation keys instead of hardcoded strings
   - Keep translation files organized and up-to-date

## Pull Request Guidelines

When submitting a pull request:

1. Provide a clear description of the changes
2. Reference any related issues
3. Include screenshots or videos for UI changes
4. Ensure all tests pass
5. Make sure the code builds without errors

## Additional Resources

For more detailed information about the project, refer to the PROJECT_DOCUMENTATION.md file in the root directory.