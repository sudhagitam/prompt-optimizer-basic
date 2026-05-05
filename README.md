# Prompt Optimizer

A beautifully designed AI prompt optimization tool with a paper/parchment aesthetic. Built with Next.js and Claude AI.

## Features

- 📄 Paper texture design with progressive disclosure
- 🔢 Step-by-step numbered flow (input → optimize → result → refine)
- 🎯 Optimization goals: Maximize accuracy, Minimize tokens, Deterministic, Creative
- 🏷️ Task type chips: Code, UI gen, Debugging, Writing, Research, Email
- ⚙️ Advanced options: model selection, output style
- ✂️ One-click copy of optimized result
- 🔁 Refine chips: More concise, Add CoT, More specific

## Deploy to Vercel (3 steps)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/prompt-optimizer.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Vercel auto-detects Next.js — click **Deploy**

### 3. Add your API key

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = `your_key_here`
3. Click **Redeploy** (Deployments tab → ⋯ → Redeploy)

Get your API key at [console.anthropic.com](https://console.anthropic.com)

## Local Development

```bash
# Install dependencies
npm install

# Create env file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
prompt-optimizer/
├── pages/
│   ├── api/
│   │   └── optimize.js     # Server-side API route (keeps key secure)
│   ├── _app.js
│   └── index.js            # Main UI
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── .env.example
├── next.config.js
└── package.json
```

## Security

Your `ANTHROPIC_API_KEY` is only used server-side in `/pages/api/optimize.js` — it is **never** exposed to the browser.
