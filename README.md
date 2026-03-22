# AI Engineer Roadmap 🤖

Personal AI Engineer Roadmap — Computer Vision Specialized

## Deploy to Vercel (5 دقايق)

### الطريقة 1: بدون كود (الأسهل)

1. روح على [github.com](https://github.com) وعمل account لو مش عندك
2. New Repository → اسمه `ai-roadmap` → Public → Create
3. اضغط "uploading an existing file" → ارفع **كل** الملفات دي
4. روح [vercel.com](https://vercel.com) → Sign up with GitHub
5. New Project → Import الـ repo بتاعك
6. كل الـ settings هتبقى automatic → اضغط **Deploy**
7. بعد دقيقة هيديك لينك مثل: `ai-roadmap.vercel.app` 🎉

### الطريقة 2: عن طريق CLI

\`\`\`bash
npm install
npm run dev          # للتجربة على الجهاز
npm run build        # بناء الـ production
npx vercel           # deploy مباشرة
\`\`\`

## ملاحظة مهمة عن التقدم

- التقدم بيتحفظ في **localStorage** على نفس الجهاز والمتصفح
- لو فتحته على موبايل وعلى لاب، التقدم هيبقى منفصل
- لو حبيت تزامن بين الأجهزة، قولي وهنضيف Firebase مجاناً

## Project Structure

\`\`\`
ai-roadmap/
├── src/
│   ├── App.jsx       ← المكون الرئيسي
│   ├── data.js       ← كل بيانات الـ Roadmap
│   ├── main.jsx      ← Entry point
│   └── index.css     ← Global styles
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
\`\`\`
# Ai-Engineer-Roadmap
