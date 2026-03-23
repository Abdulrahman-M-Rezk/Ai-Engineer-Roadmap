# 🤖 AI Engineer Roadmap

Personalized AI Engineer Roadmap مع تزامن تلقائي بين الأجهزة

---

## الخطوة 1 — إنشاء Firebase (3 دقايق مجاناً)

1. روح على **console.firebase.google.com**
2. **Create a project** → اسمه `ai-roadmap` → Continue
3. Disable Google Analytics → Create project
4. من القايمة: **Build → Realtime Database → Create Database**
5. اختار أقرب region → **Start in test mode** → Enable
6. انسخ الرابط اللي هيظهر:
   `https://ai-roadmap-xxxxx-default-rtdb.firebaseio.com`

---

## الخطوة 2 — ضع الرابط في الكود

افتح `src/firebase-config.js` وبدّل:
```js
const FIREBASE_DB_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```
بالرابط بتاعك.

---

## الخطوة 3 — رفع على GitHub

1. روح **github.com/new** → اسمه `ai-roadmap` → Public → Create
2. اضغط **"uploading an existing file"**
3. ارفع كل محتوى الفولدر (src/, index.html, package.json, package-lock.json, vite.config.js, vercel.json, README.md)
4. Commit changes ✅

---

## الخطوة 4 — Deploy على Vercel

1. روح **vercel.com** → Sign up with GitHub
2. **Add New Project** → Import الـ repo
3. Framework: **Vite** (تلقائي) → **Deploy** ✅
4. بعد دقيقة: `ai-roadmap.vercel.app` 🎉

---

## إزاي بيشتغل التزامن؟

- أول مرة: بيتولد Sync ID تلقائي
- كل تغيير بيتحفظ على Firebase تلقائياً
- على جهاز تاني: اضغط "تغيير ID" وادخل الـ ID بتاعك

---

## تشغيل محلي
```bash
npm install && npm run dev
```
