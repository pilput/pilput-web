# pilput

A modern, open publishing platform built with Next.js 16+ that allows creators to write, publish, and share articles. Features rich text editing, real-time chat, analytics dashboards, and comprehensive content management.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Rich Text Editor** – TipTap-based editor with headings, images, YouTube embeds, links, and slash commands
- **Authentication** – JWT-based auth with cookie storage and automatic session refresh
- **Blog System** – Create, edit, and publish articles with tags, cover images, view counts, likes, and comments
- **Analytics Dashboard** – User analytics with charts and post performance metrics
- **Real-time Chat** – Live messaging with AI model selection
- **User Profiles** – Custom profile pages with `/[username]` routing
- **Tags System** – Content categorization with up to 5 tags per post
- **Dark/Light Mode** – Automatic theme switching
- **SEO Optimized** – Comprehensive metadata, OpenGraph, Twitter cards, sitemap, and robots.txt
- **Accessibility** – ARIA attributes, keyboard navigation, focus indicators, and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
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

### Docker (Production-Ready)

```bash
# Build Docker image
docker build -t pilput -f Dockerfile-bun .

# Run container
docker run -p 3000:3000 pilput
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── [username]/           # Dynamic user profile pages
│   ├── blog/                 # Blog listing and post pages
│   ├── chat/                 # Chat interface
│   ├── dashboard/            # User analytics dashboard
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── global.css            # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── post/                 # Post editor and display
│   ├── ui/                   # Shadcn UI primitives
│   ├── chat/                 # Chat interface components
│   ├── dashboard/            # Dashboard components
│   └── ...                   # Other components
├── stores/                   # Zustand state management
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── lib/                      # Shared libraries (validation)
└── hooks/                    # Custom React hooks
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16+ with App Router |
| **Language** | TypeScript 5.9+ (strict mode) |
| **Styling** | Tailwind CSS 4 + Shadcn UI |
| **Animations** | Framer Motion, React Three Fiber |
| **State** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Editor** | TipTap with custom extensions |
| **HTTP** | Axios with custom instances |
| **Charts** | Recharts |
| **Theme** | next-themes |

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
NEXT_PUBLIC_API_URL=<your-api-url>
NEXT_PUBLIC_API_URL_2=<app-api-url>
NEXT_PUBLIC_STORAGE_URL=<storage-url>
NEXT_PUBLIC_MAIN_URL=<main-url>
NEXT_PUBLIC_DOMAIN=<domain>
```

See `.env.local.example` for reference.

## 🧪 Testing & Linting

```bash
# Run linter
bun run lint

# Type checking
bunx tsc --noEmit
```

## 📄 License

This project is based on the [pilput](https://github.com/pilput) platform and follows its licensing terms.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow existing React/Next.js best practices
2. Maintain accessibility standards (WCAG)
3. Use TypeScript with strict types
4. Add Zod validation for all forms
5. Include loading states and error handling
6. Test with both light and dark themes

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using Next.js and TypeScript
