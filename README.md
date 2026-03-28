<div align="center">
  <img src="src/assets/platedai_logo.png" alt="PlatedAI Logo" width="120" />
  <h1>Plated.ai</h1>
  <p><strong>Create a brand that looks as good as your food tastes.</strong></p>
  <p>
    <a href="https://plated-ai-ruby.vercel.app/" target="_blank"><strong>View Live Demo</strong></a>
  </p>
</div>

## Overview
Plated.ai is an intelligent, AI-driven photography studio built for restaurants, cafes, and artisan creators. Transform simple, everyday food photos into breathtaking, professional-grade menu and social media assets in seconds.

Instead of expensive photoshoots and complex lighting setups, Plated.ai utilizes Google's Gemini generative vision models to seamlessly blend your dish into a highly customizable environment.

## Features
- **Effortless Generation:** Upload up to 20 raw food photos at once and let AI do the heavy lifting.
- **Complete Creative Control:** Customize the exact lighting, camera angle, color grading, surface material, and aspect ratio.
- **Pro Props:** Select plates, bowls, glassware, cutlery styles, and dynamic decorative accents (herbs, drizzles, powders) perfectly tailored to your culinary aesthetic.
- **Batch Downloads:** Once generated, seamlessly review side-by-side comparisons and download all your stunning new assets in a single `.zip` file.
- **Private Workspaces:** Pick up where you left off. Projects save automatically and seamlessly to your unique device ID without requiring an account.

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Framer Motion
- **Backend/Database:** Convex
- **Storage:** Convex File Storage
- **AI Vision Model:** Google Gemini GenAI SDK (`gemini-3.1-flash-image-preview`)

## Quick Start

First, ensure you have your `NEXT_PUBLIC_CONVEX_URL` and `GEMINI_API_KEY` defined in a `.env.local` file.

```bash
# 1. Install dependencies
npm install

# 2. Start the Convex backend in a separate terminal window
npx convex dev

# 3. Spin up the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.
