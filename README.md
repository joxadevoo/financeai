# FinanceAI

A modern, responsive, and beautifully designed personal finance management application built with **Next.js 14**, **React**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features

- **Dashboard:** At-a-glance overview of your finances with Recharts-powered graphs and AI-generated insights.
- **Income & Expense Tracking:** Easily record, categorize, and track your daily transactions.
- **Budgeting Planner:** Set monthly budgets across various categories and monitor your spending limits.
- **Savings Simulator:** Project your future wealth and savings using advanced visual calculators.
- **Investment Portfolio:** Track asset allocations, returns on investments, and visualize asset growth.
- **Multi-Language Support:** Seamlessly switch between English, Russian, and Uzbek.
- **Dark Mode:** Elegant glassmorphism themes integrated with light/dark modes.
- **Secure Data Storage:** Fully integrated with Supabase for persistent auth and robust Row Level Security (RLS).

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **State Management:** Zustand
- **Database Backend:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui-inspired)
- **Charts:** Recharts
- **Icons:** Lucide React

## 📦 Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:joxadevoo/financeai.git
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
   *(or `npm install`, `yarn install`, `pnpm install`)*

3. Supabase Setup:
   - Create a Supabase project and get the API keys.
   - Run the provided `supabase_setup.sql` script in your Supabase SQL Editor to provision tables and policies.
   - Fill in your `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
