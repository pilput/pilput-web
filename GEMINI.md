# GEMINI.md

## Project Overview

This is a Next.js application that serves as a publishing platform. It's built with TypeScript, Tailwind CSS, and Shadcn UI. The application is designed with a focus on performance, SEO, and user experience. It includes features like a blog, user authentication, a chat interface, and a dashboard with analytics. The application uses Zustand for state management and Zod for form validation.

## Building and Running

To get the application running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

*   **Build for production:**
    ```bash
    npm run build
    ```

*   **Start the production server:**
    ```bash
    npm run start
    ```

*   **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. It also uses `clsx` for conditionally applying classes.
*   **Components:** Components are organized in the `src/components` directory. It uses Shadcn UI components, which are located in `src/components/ui`.
*   **State Management:** The project uses Zustand for state management. Stores are located in the `src/stores` directory.
*   **Data Fetching:** The project uses `axios` for making API requests.
*   **Typing:** The project is written in TypeScript. Type definitions are located in the `src/types` directory.
*   **Validation:** The project uses Zod for form and data validation. Validation schemas are located in the `src/lib/validation.ts` file.
*   **Linting:** The project uses ESLint for linting. The configuration is in `.eslintrc.json`.
