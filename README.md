# Prompt Optimizer — Groq Edition

A beautifully designed AI prompt optimization tool with a paper/parchment aesthetic. Built with Next.js and powered by **Groq** (Llama 3.3 70B, Mixtral, Gemma, DeepSeek).

## Models Available

| Model | ID |
|---|---|
| Llama 3.3 70B | `llama-3.3-70b-versatile` |
| Llama 3.1 8B Instant | `llama-3.1-8b-instant` |
| Mixtral 8x7B | `mixtral-8x7b-32768` |
| Gemma 2 9B | `gemma2-9b-it` |
| DeepSeek R1 70B | `deepseek-r1-distill-llama-70b` |

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

### 3. Add your Groq API key

1. Get your free key at [console.groq.com](https://console.groq.com)
2. In Vercel dashboard → **Settings** → **Environment Variables**
3. Add: `GROQ_API_KEY` = `your_key_here`
4. Click **Redeploy** (Deployments tab → ⋯ → Redeploy)

## Local Development

```bash
# Install dependencies
npm install

# Create env file
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

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

Your `GROQ_API_KEY` is only used server-side in `/pages/api/optimize.js` — it is **never** exposed to the browser.
