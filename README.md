# 🚀 AI Engineer Roadmap Tracker

A professional, real-time synchronized learning tracker designed specifically for aspiring AI & Computer Vision Engineers. Built with modern web technologies to ensure your progress is securely saved and accessible anywhere.

## ✨ Features

- **Secure Authentication:** Username + PIN system with recovery codes (No email required).
- **Real-Time Sync:** Powered by Firebase Firestore, your progress updates instantly across devices.
- **Custom Resources:** Add your own private courses and links to any phase.
- **Dark Mode UI:** A beautiful, focus-driven interface tailored for long study sessions.
- **RTL Support:** Native Arabic right-to-left layout for perfect readability.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Database:** Firebase Firestore
- **Deployment:** Vercel

## 🚀 Local Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-roadmap.git
   cd ai-roadmap
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your Firebase credentials:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

## 📝 License

This project is open-source and available under the MIT License.
