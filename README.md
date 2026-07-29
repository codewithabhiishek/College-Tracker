# College Tracker 🎓

A modern, full-stack React application for seamlessly tracking and managing your college applications. Built with performance, accessibility, and user experience in mind.

## ✨ Features

- **Secure Authentication:** User sign-up and login powered by [Clerk](https://clerk.dev/).
- **Application Dashboard:** Keep track of your university applications, their statuses, deadlines, and requirements.
- **Interactive UI:** Beautiful, accessible components built with [Radix UI](https://www.radix-ui.com/) and styled with [Tailwind CSS](https://tailwindcss.com/).
- **Data Visualization:** Clear insights into your application progress using [Recharts](https://recharts.org/).
- **Calendar & Deadlines:** Manage important dates seamlessly with integrated calendar views.
- **Document Management:** Organize essays, transcripts, and recommendation letters.
- **Payments Integration:** Built-in support for [Stripe](https://stripe.com/).

## 🛠️ Tech Stack

- **Frontend Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) for animations
- **UI Components:** shadcn/ui (Radix) + [Lucide Icons](https://lucide.dev/)
- **State/Data Fetching:** [React Query](https://tanstack.com/query/latest)
- **Database:** [Vercel Postgres](https://vercel.com/storage/postgres)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Payments:** [Stripe](https://stripe.com/)

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd College-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   You will need a `.env.local` file in the root directory to configure the external services. Check the provided `.env.local` (or create one) to add your keys for Clerk, Stripe, and Postgres.
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
   # Add other required API keys here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will typically be running on `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/`: Reusable, generic UI components (like Buttons, Dialogs, etc.).
- `src/api/`: Handles external data fetching and API communication.
- `src/public/`: Static files and images.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
