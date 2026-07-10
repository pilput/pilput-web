# pilput-web

A modern, open publishing platform built with Next.js 16+ that allows creators to write, publish, and share articles. Features rich text editing, real-time chat, analytics dashboards, and comprehensive content management.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwind-css)

## ✨ Features

- **Rich Text Editor** – TipTap-based editor with headings, images, YouTube embeds, links, code blocks with highlight.js/lowlight syntax highlighting, and slash commands
- **Authentication** – JWT-based auth with cookie storage, automatic session refresh, login, register, password reset, and OAuth callbacks
- **Blog System** – Create, edit, and publish articles with tags, cover images, view counts, likes, comments, and bookmarks
- **Analytics Dashboard** – User analytics with charts and post performance metrics
- **Real-time Chat** – Live messaging with AI model selection
- **User Profiles** – Custom profile pages with `/[username]` routing and a user directory
- **Tags System** – Content categorization and discovery with `/tags`
- **Bookmarks** – Save posts for later reading
- **Static Pages** – About, contact, and privacy pages
- **Dark/Light Mode** – Automatic theme switching via `next-themes`
- **SEO Optimized** – Comprehensive metadata, OpenGraph, Twitter cards, sitemap, and robots.txt
- **Accessibility** – ARIA attributes, keyboard navigation, focus indicators, and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.1+
- npm or Bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-turbo

# Install dependencies (Bun recommended)
bun install
# or
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Development

```bash
# Run development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
bun run build
# or
npm run build

# Start production server
bun run start
# or
npm run start
```

## 🌐 Deployment

This app can be deployed to various platforms.

### Vercel (Recommended)

The easiest way to deploy a Next.js app:

1. Push the repository to GitHub/GitLab
2. Import the project at [vercel.com](https://vercel.com)
3. Set the environment variables in the Vercel dashboard
4. Deploy automatically on every push to the `main` branch

### Netlify

1. Push the repository to GitHub/GitLab
2. Import the project at [netlify.com](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add the environment variables in the Netlify dashboard

### AWS (Amplify / EC2 / ECS)

- **AWS Amplify** – Import repo, set build settings, and deploy automatically
- **EC2** – Run `bun run build && bun run start` on the instance
- **ECS/Fargate** – Use a containerized deployment with the `Dockerfile-bun` if available

Make sure all environment variables are configured for the selected platform.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── [username]/           # Dynamic user profile pages
│   ├── about/                # About page
│   ├── account/              # Account settings
│   ├── auth/                 # Authentication helpers
│   ├── blog/                 # Blog listing and post pages
│   ├── bookmarks/            # Saved bookmarks
│   ├── callback/             # OAuth callback
│   ├── chat/                 # Chat interface
│   ├── contact/              # Contact page
│   ├── dashboard/            # User analytics dashboard
│   ├── forbidden/            # Forbidden error page
│   ├── forgot-password/      # Forgot password page
│   ├── login/                # Login page
│   ├── posts/                # Post creation and editing
│   ├── privacy/              # Privacy policy page
│   ├── profile/              # Current user profile
│   ├── register/             # Registration page
│   ├── reset-password/       # Reset password page
│   ├── tags/                 # Tag browsing
│   ├── users/                # User directory
│   ├── global.css            # Global styles
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # 404 page
│   ├── page.tsx              # Home page
│   ├── robots.ts             # robots.txt generator
│   └── sitemap.ts            # sitemap.xml generator
├── components/               # React components
│   ├── account/              # Account components
│   ├── animations/           # Animation components
│   ├── auth/                 # Auth components
│   ├── blog/                 # Blog components
│   ├── chat/                 # Chat interface components
│   ├── common/               # Shared/common components
│   ├── dashboard/            # Dashboard components
│   ├── error/                # Error UI components
│   ├── footer/               # Footer components
│   ├── header/               # Header/navigation components
│   ├── home/                 # Home page components
│   ├── icons/                # Custom icons
│   ├── landing/              # Landing page components
│   ├── layouts/              # Layout components
│   ├── post/                 # Post editor and display
│   ├── profile/              # Profile components
│   ├── tags/                 # Tag components
│   ├── ui/                   # Shadcn UI primitives
│   ├── user/                 # User components
│   └── writer/               # Writer components
├── hooks/                    # Custom React hooks
├── lib/                      # Shared libraries and utilities
│   ├── code-highlight.ts     # Code highlighting helpers (highlight.js)
│   ├── code-block-highlight.ts # TipTap lowlight code-block extension
│   ├── utils.ts              # General utilities
│   └── validation.ts         # Zod validation schemas
├── stores/                   # Zustand state management
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
│   ├── Auth.ts               # Auth helpers
│   ├── bookmarks.ts          # Bookmarks helpers
│   ├── ErrorHandler.ts       # Error handling
│   ├── fetch.ts              # API fetch wrapper
│   ├── getConfig.ts          # Config/env helpers
│   ├── getImage.ts           # Image URL helpers
│   ├── sanitize.ts           # Sanitization helpers
│   └── slug.ts               # Slug helpers
└── test/                     # Test utilities/fixtures
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16+ with App Router |
| **Language** | TypeScript 5.9+ (strict mode) |
| **Runtime** | React 19 |
| **Styling** | Tailwind CSS 4 + Shadcn UI |
| **Animations** | Framer Motion, Pixi.js |
| **State** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Editor** | TipTap with custom extensions and lowlight/highlight.js syntax highlighting |
| **HTTP** | Native fetch with custom `apiClient` wrappers |
| **Charts** | Recharts |
| **Theme** | next-themes |
| **Notifications** | Sonner |
| **Markdown** | react-markdown + remark-gfm + rehype-prism-plus |

## 📝 Available Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run ESLint
bunx tsc --noEmit # Type checking
```

## 🔐 Environment Variables

Configure the following environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=<main-api-url>
NEXT_PUBLIC_API_URL_2=<app-api-url-auth-users-chat-feed>
NEXT_PUBLIC_STORAGE_URL=<storage-url>
NEXT_PUBLIC_MAIN_URL=<main-url>
NEXT_PUBLIC_DOMAIN=<domain>
```

See `.env.local.example` for reference and default values for development against the production APIs.

## 🧪 Testing & Linting

```bash
# Run linter
bun run lint

# Type checking
bunx tsc --noEmit
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow existing React/Next.js best practices
2. Maintain accessibility standards (WCAG)
3. Use TypeScript with strict types
4. Add Zod validation for all forms in `src/lib/validation.ts`
5. Include loading states and error handling
6. Test with both light and dark themes
7. Follow Tailwind CSS v4 syntax (no `tailwind.config.*` or `@tailwind` directives)

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using Next.js and TypeScript
