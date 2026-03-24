# 🤖 AI Engineer Roadmap Tracker

<div align="center">

![AI Engineer Roadmap](https://img.shields.io/badge/AI_Engineer-Roadmap-00D4FF?style=for-the-badge&logo=robot&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-A78BFA?style=for-the-badge)
![Built With Vibe Coding](https://img.shields.io/badge/Built_With-Vibe_Coding_⚡-F472B6?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FBBF24?style=for-the-badge&logo=firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**خريطة طريق شخصية لتعلم الـ AI Engineering — متخصصة في Computer Vision**

[🚀 الموقع المباشر](https://ai-engineer-roadmap-phi.vercel.app) • [📊 Firebase Console](https://console.firebase.google.com) • [🗺️ roadmap.sh](https://roadmap.sh/ai-engineer)

</div>

---

## 📸 لقطات الشاشة

| PIN Entry | Dashboard | Phase Details |
|-----------|-----------|---------------|
| صفحة تسجيل الدخول الآمنة | لوحة التحكم الرئيسية | تفاصيل كل مرحلة |

---

## ✨ المميزات

- 🔐 **نظام مصادقة آمن** — Username + PIN + Recovery Code
- 🔄 **تزامن فوري** — Firebase Firestore real-time sync عبر كل الأجهزة
- 📊 **7 مراحل تعليمية** — من Python الأساسيات وحتى الـ Career
- 📚 **76+ مصدر تعليمي** — فيديوهات، كتب، ومقالات بروابط مباشرة
- ✅ **تتبع التقدم** — Checkboxes محفوظة مع Progress Bars تفاعلية
- 📝 **ملاحظات شخصية** — أضف تواريخ بداية وانتهاء وملاحظات لكل موضوع
- 🔀 **Drag & Drop** — رتب المصادر حسب أولوياتك الشخصية
- ➕ **مصادر مخصصة** — أضف كورساتك ومصادرك الخاصة لكل مرحلة
- 💬 **اقتباسات تحفيزية** — آيات قرآنية وأحاديث تشجعك على الاستمرار
- 📱 **Responsive** — يعمل بنفس الكفاءة على الموبايل واللاب

---

## 🗺️ الـ Roadmap

```
Phase 1 🐍  Python والرياضيات          (6-8 أسابيع)
Phase 2 🤖  Machine Learning            (8-10 أسابيع)
Phase 3 🧠  Deep Learning               (8-10 أسابيع)
Phase 4 👁️  Computer Vision ⭐ تخصصك   (6-8 أسابيع)
Phase 5 🔗  AI Engineer Layer           (6-8 أسابيع)
Phase 6 ⚙️  MLOps & Deployment          (4-6 أسابيع)
Phase 7 🎯  Projects & Career           (4-6 أسابيع)
                              ──────────────────────
                              الإجمالي: ~8-9 أشهر
```

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **React 18 + TypeScript** | Frontend Framework |
| **Vite** | Build Tool |
| **Tailwind CSS v4** | Styling |
| **Firebase Firestore** | Real-time Database |
| **React Router v7** | Navigation |
| **@dnd-kit** | Drag & Drop |
| **react-type-animation** | Welcome Animation |
| **@radix-ui** | UI Components |
| **Vercel** | Deployment |
| **Cairo Font** | Arabic Typography |

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات
- Node.js v18+
- Firebase Project (مجاني)

### الخطوات

```bash
# 1. Clone المشروع
git clone https://github.com/Abdulrahman-M-Rezk/Ai-Engineer-Roadmap.git
cd Ai-Engineer-Roadmap

# 2. تثبيت الـ Dependencies
npm install

# 3. إضافة متغيرات البيئة
cp .env.example .env.local
# افتح .env.local وأضف قيم Firebase بتاعتك

# 4. تشغيل المشروع
npm run dev
```

### إعداد Firebase

1. روح [console.firebase.google.com](https://console.firebase.google.com)
2. أنشئ مشروع جديد
3. فعّل Firestore Database في **test mode**
4. أضف Web App واحصل على الـ config
5. أضف الـ Security Rules دي:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if true;
    }
  }
}
```

6. أضف الـ config في `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 هيكل المشروع

```
src/
├── firebase.js                        ← Firebase config
├── app/
│   ├── context/
│   │   └── AppContext.tsx             ← Global state + Firebase sync
│   ├── data/
│   │   └── roadmapData.ts             ← كل بيانات الـ Roadmap
│   ├── pages/
│   │   ├── PinEntry.tsx               ← صفحة Login / Sign Up
│   │   └── Dashboard.tsx              ← الصفحة الرئيسية
│   └── components/
│       ├── PhaseCard.tsx              ← كارت كل مرحلة
│       ├── BottomNav.tsx              ← Navigation الموبايل
│       └── SearchModal.tsx            ← موديل البحث
└── styles/
    ├── index.css                      ← Tailwind + Animations
    └── fonts.css                      ← Cairo Font
```

---

## 🔐 نظام المصادقة

```
التسجيل (Sign Up):
  ① اختر username فريد
  ② اختار PIN من 4 أرقام
  ③ احفظ Recovery Code (6 أحرف) — مهم جداً!

تسجيل الدخول (Login):
  ① ادخل username + PIN

الاسترجاع (Recovery):
  ① ادخل username + Recovery Code
  ② اختار PIN جديد
```

---

## 🗄️ Firestore Data Structure

```javascript
/progress/{username}
  ├── pin: string                          // مشفر
  ├── recoveryCode: string                 // للاسترجاع
  ├── checkedTopics: { [topicId]: bool }   // المواضيع المكتملة
  ├── checkedTasks: { [taskId]: bool }     // التكاليف المكتملة
  ├── customResources: { [phaseId]: [] }   // مصادر شخصية
  ├── resourceOrder: { [phaseId]: [] }     // ترتيب المصادر
  └── topicDetails: {                      // تفاصيل كل موضوع
        [topicId]: {
          startDate: string,
          endDate: string,
          note: string
        }
      }
```

---

## 🚢 الـ Deployment على Vercel

```bash
# Build المشروع
npm run build

# أو Deploy مباشرة من GitHub
# Vercel بيتابع main branch تلقائياً
```

**Environment Variables على Vercel:**
أضف نفس الـ 6 Variables من `.env.local` في Settings → Environment Variables

---

## 📚 مصادر بناء الـ Roadmap

| المصدر | الوصف |
|--------|-------|
| [roadmap.sh/ai-engineer](https://roadmap.sh/ai-engineer) | المرجع التقني الأساسي |
| [Moataz Elmesmary DS Roadmap](https://github.com/Moataz-Elmesmary/Data-Science-Roadmap) | 4.2k ⭐ أشمل Roadmap عربي |
| [Mariam Ahmed IEEE ManCSC 2025](https://github.com/Mariam-Ahmed15/Data-Science-Roadmap-IEEEManCSC-2025) | Roadmap منظم بالأسابيع |

---

## ⚡ Built With Vibe Coding

هذا المشروع بُني بالكامل باستخدام **Vibe Coding** — أسلوب تطوير حديث يعتمد على التعاون بين المبرمج والذكاء الاصطناعي لبناء تطبيقات احترافية بسرعة وكفاءة.

```
الأدوات المستخدمة في الـ Vibe Coding:
  🤖 Claude (Anthropic)   ← التخطيط والـ Architecture
  🔧 Antigravity          ← تنفيذ الكود محلياً
  🎨 Figma AI             ← تصميم الواجهة
  🚀 Vercel               ← Deploy تلقائي
```

---

## 🤝 المساهمة

هذا مشروع شخصي، لكن لو عندك اقتراحات:
1. افتح Issue بالاقتراح
2. أو تواصل مباشرة

---

## 📄 الترخيص

هذا المشروع للاستخدام الشخصي والتعليمي.

---

<div align="center">

**وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ**

*صُنع بـ ❤️ و ☕ في مصر*

</div>
