# College Tracker 🎓

A modern, full-stack React admissions operating system for seamlessly tracking and managing university applications, deadlines, documents, and acceptance analytics.

Developed by [Abhishek](https://abhiishek.is-a.dev/) · [Portfolio](https://abhiishek.is-a.dev/) · [GitHub](https://github.com/codewithabhiishek)

---

## ✨ Key Features & Architecture

- **Multi-User Data Isolation:** Complete account segmentation with Clerk-authenticated `userId` scoping across TanStack Query keys (`["universities", userId]`, `["globalDocs", userId]`), server-side parameterized PostgreSQL queries (`WHERE user_id = $1`), and automatic client-side cache purging upon account switch or sign-out (`AuthSync`).
- **Tactile Mobile Haptics:** Custom mobile haptic vibration feedback engine (`src/lib/haptics.js`) with patterns for card taps, sorting selections, status changes, document toggles, and item deletions with SSR-safe browser detection.
- **0 npm Vulnerabilities:** Clean security audit status with pure `date-fns` calendar localization replacing legacy dependencies and automated selector parser overrides.
- **Application Dashboard:** Multi-view workflow with Table View (with multi-program collapsible groups), Kanban Board, and interactive Calendar View.
- **Shared Documents Vault:** Global and per-application tracking for Statements of Purpose, Transcripts, Recommendations, and Portfolios.
- **Rigorous Automated Testing:** Automated unit test suites covering multi-user cache boundaries, session purging, haptic engines, and deadline logic.

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/)
- **Calendar:** [react-big-calendar](https://github.com/jquense/react-big-calendar) with [date-fns](https://date-fns.org/)
- **State & Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **Database:** [Vercel Postgres](https://vercel.com/storage/postgres)
- **Authentication:** [Clerk](https://clerk.dev/)

## 🚀 Getting Started

### Prerequisites

Node.js (v18+) and npm.

### Installation

```bash
# Clone the repository
git clone https://github.com/codewithabhiishek/College-Tracker.git
cd College-Tracker

# Install dependencies
npm install

# Run automated tests
npm test

# Run type check and lint
npm run typecheck
npm run lint

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
```

## 🧪 Testing

```bash
npm test
```
Runs the automated unit test suites (`tests/dataIsolation.test.mjs`, `tests/haptics.test.mjs`, `tests/tracker.test.mjs`) via Node's native test runner.

## 👤 Author

**Abhishek**
- Website & Portfolio: [https://abhiishek.is-a.dev/](https://abhiishek.is-a.dev/)
- GitHub: [@codewithabhiishek](https://github.com/codewithabhiishek)

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
