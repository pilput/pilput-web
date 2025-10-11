# Project QWEN.md

## Project Overview

This is a Next.js application named "next-turbo" with the version 1.0.1. It's a comprehensive web application using modern technologies like React 19, Next.js 15, Tailwind CSS, and TypeScript. The project follows the App Router pattern and is styled using shadcn/ui components with the New York design system. It appears to be a social platform or content sharing site called "pilput" based on the metadata and component structure.

Key technologies and features:
- Next.js 15 with App Router and server components
- React 19 with TypeScript
- Tailwind CSS for styling with custom CSS variables
- shadcn/ui component library
- Radix UI primitives for accessible components
- Tiptap for rich text editing
- Zustand for state management
- React Hook Form with Zod for form validation
- Tailwind CSS animations and typography
- Dark mode support using next-themes
- Authentication middleware for protected routes
- Google Analytics integration
- Responsive design with mobile-first approach

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [username]/         # Dynamic user profile routes
│   ├── about/              # About page
│   ├── blog/               # Blog functionality
│   ├── chat/               # Chat feature
│   ├── contact/            # Contact page
│   ├── dashboard/          # Dashboard for authenticated users
│   ├── forum/              # Forum functionality
│   ├── login/              # Login page
│   ├── privacy/            # Privacy policy
│   ├── profile/            # User profile
│   ├── register/           # Registration page
│   └── tags/               # Tag-based content organization
├── components/             # Reusable React components
│   ├── analitics/          # Analytics components
│   ├── footer/             # Footer components
│   ├── header/             # Navigation and header components
│   ├── landing/            # Landing page components
│   ├── post/               # Post-related components
│   └── ui/                 # shadcn/ui components
├── examples/               # Example implementations
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and libraries
├── middleware/             # Middleware functions
├── stores/                 # State management stores (Zustand)
├── test/                   # Test files
├── types/                  # TypeScript type definitions
├── utils/                  # General utility functions
├── middleware.ts           # Global middleware for authentication
└── app/                    # App Router structure
```

## Building and Running

### Development
To run the development server:
```bash
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```
The application will be available at http://localhost:3000.

### Production
To build the application for production:
```bash
bun run build
```

To start the production server:
```bash
bun run start
```

### Linting
To lint the code:
```bash
bun run lint
```

### Package Management
This project uses Bun for package management:
- To install dependencies: `bun install`
- To add a dependency: `bun add [package-name]`
- To add a dev dependency: `bun add --dev [package-name]`
- To run scripts: `bun run [script-name]`

## Key Features

1. **Authentication System**: Implemented with middleware to protect certain routes like `/chat` and `/dashboard`. Uses cookie-based authentication.

2. **Rich Text Editing**: Uses Tiptap for rich text editing capabilities across the application.

3. **Responsive Design**: Fully responsive layout with mobile-first approach using Tailwind CSS.

4. **Dark Mode**: Implemented with next-themes for seamless light/dark mode switching.

5. **Component Library**: Uses shadcn/ui with Radix UI primitives for accessible components.

6. **Analytics**: Google Analytics integration for tracking user behavior.

7. **SEO Optimized**: Proper metadata implementation for SEO.

## Development Conventions

- Uses TypeScript for type safety throughout the application
- Component organization follows the shadcn/ui pattern
- CSS variables for consistent theming (using oklch color space)
- Absolute imports using @/* paths (configured in tsconfig.json)
- ESLint for code linting with Next.js recommended rules
- Tailwind CSS for styling with custom configuration
- Modern React patterns with hooks and server components
- API routes protected under /api path (excluded from middleware)

## Environment Configuration

The project includes an `.env.local.example` file, suggesting environment variables are used for sensitive configurations like API keys, database URLs, etc.

## Security Features

- Middleware protection for sensitive routes
- Secure cookie handling for authentication
- Input validation with Zod schemas
- Content Security Policy considerations through Next.js headers