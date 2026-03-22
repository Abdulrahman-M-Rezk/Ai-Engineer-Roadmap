import { useState, useEffect } from "react";

const STORAGE_KEY = "ai-roadmap-progress";

const phases = [
  {
    id: 0, number: "00", title: "Python Solid", duration: "3–4 أسابيع",
    color: "#00D4FF", glow: "rgba(0,212,255,0.3)", icon: "🐍",
    statusLabel: "✅ خلصته تقريباً",
    topics: [
      { id: "p0_t1", label: "✅ عندك بالفعل", items: [
        { id: "p0_i1", text: "Variables, Loops, Conditions" },
        { id: "p0_i2", text: "Functions & Scope" },
        { id: "p0_i3", text: "NumPy & Pandas أساسيات" },
      ]},
      { id: "p0_t2", label: "🔲 كمّل", items: [
        { id: "p0_i4", text: "OOP كامل (Classes, Inheritance, Dunder methods)" },
        { id: "p0_i5", text: "File Handling + Exception Handling" },
        { id: "p0_i6", text: "List Comprehensions + Generators" },
        { id: "p0_i7", text: "Git & GitHub" },
        { id: "p0_i8", text: "Virtual Environments + pip" },
        { id: "p0_i9", text: "Clean Code Habits (Naming, Structure)" },
      ]},
    ],
    sources: [
      { id: "p0_s1", name: "Elzero Web School — Python", lang: "🇪🇬", type: "يوتيوب", price: "مجاني ✅", note: "عندك — أكمل الباقي", url: "https://www.youtube.com/@ElzeroWebSchool" },
      { id: "p0_s2", name: "CS50P — Harvard", lang: "🌍", type: "كورس", price: "مجاني", note: "الأفضل للـ OOP والـ Clean Code", url: "https://cs50.harvard.edu/python" },
      { id: "p0_s3", name: "Automate the Boring Stuff with Python", lang: "🌍", type: "كتاب / موقع", price: "مجاني", note: "ممتاز للـ OOP والـ Practical Projects", url: "https://automatetheboringstuff.com" },
      { id: "p0_s4", name: "Real Python", lang: "🌍", type: "موقع / مقالات", price: "مجاني جزء منه", note: "مرجع ممتاز للـ Clean Code والـ Best Practices", url: "https://realpython.com" },
      { id: "p0_s5", name: "Git & GitHub — FreeCodeCamp", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "مهم جداً للـ Portfolio", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      { id: "p0_s6", name: "Python Crash Course — Eric Matthes", lang: "🌍", type: "كتاب", price: "مدفوع", note: "كتاب مميز للمبتدئين — شامل وعملي", url: "https://nostarch.com/python-crash-course-3rd-edition" },
    ],
  },
  {
    id: 1, number: "01", title: "Math & Data Essentials", duration: "3–4 أسابيع",
    color: "#A78BFA", glow: "rgba(167,139,250,0.3)", icon: "📐",
    topics: [
      { id: "p1_t1", label: "Linear Algebra", items: [
        { id: "p1_i1", text: "Vectors, Matrices, Dot Product" },
        { id: "p1_i2", text: "Matrix Operations & Transpose" },
        { id: "p1_i3", text: "Eigenvalues & SVD (فكرة عامة)" },
      ]},
      { id: "p1_t2", label: "Calculus & Statistics", items: [
        { id: "p1_i4", text: "Derivatives & Partial Derivatives" },
        { id: "p1_i5", text: "Chain Rule (أساس الـ Backprop)" },
        { id: "p1_i6", text: "Mean, Std, Probability Basics" },
        { id: "p1_i7", text: "Bayes Theorem" },
      ]},
      { id: "p1_t3", label: "Data Tools", items: [
        { id: "p1_i8", text: "NumPy (arrays, broadcasting, indexing)" },
        { id: "p1_i9", text: "Pandas (DataFrame, Filtering, GroupBy, Merge)" },
        { id: "p1_i10", text: "Matplotlib & Seaborn (Visualization)" },
      ]},
    ],
    sources: [
      { id: "p1_s1", name: "د. حاتم العطار — Linear Algebra", lang: "🇪🇬", type: "يوتيوب", price: "مجاني ✅", note: "⭐ عندك — الأفضل عربي بعمق", url: "https://youtube.com/@ArtificialIntelligenceDataScie" },
      { id: "p1_s2", name: "د. حاتم العطار — Statistics & Calculus", lang: "🇪🇬", type: "يوتيوب", price: "مجاني ✅", note: "⭐ عندك — المرجع الأساسي", url: "https://youtube.com/@ArtificialIntelligenceDataScie" },
      { id: "p1_s3", name: "3Blue1Brown — Essence of Linear Algebra", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "Visual جداً — الأجمل في الكون للـ Math", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2ZAgoSUO7RRMB" },
      { id: "p1_s4", name: "3Blue1Brown — Essence of Calculus", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "نفس الأسلوب البصري الرائع", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { id: "p1_s5", name: "StatQuest with Josh Starmer", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "Statistics & ML بأبسط شرح إنجليزي", url: "https://www.youtube.com/@statquest" },
      { id: "p1_s6", name: "Kaggle Learn — Pandas", lang: "🌍", type: "كورس تفاعلي", price: "مجاني", note: "أسرع طريقة للـ Pandas عملياً", url: "https://www.kaggle.com/learn/pandas" },
      { id: "p1_s7", name: "Mathematics for Machine Learning — Deisenroth", lang: "🌍", type: "كتاب PDF", price: "مجاني", note: "المرجع الأعمق — للرجوع إليه", url: "https://mml-book.github.io" },
    ],
  },
  {
    id: 2, number: "02", title: "Classical Machine Learning", duration: "6–8 أسابيع",
    color: "#FB923C", glow: "rgba(251,146,60,0.3)", icon: "⚙️", badge: "أساس قوي",
    topics: [
      { id: "p2_t1", label: "ML Fundamentals", items: [
        { id: "p2_i1", text: "Types: Supervised / Unsupervised / RL" },
        { id: "p2_i2", text: "Train / Validation / Test Split" },
        { id: "p2_i3", text: "Overfitting & Underfitting" },
        { id: "p2_i4", text: "Bias-Variance Tradeoff" },
        { id: "p2_i5", text: "Feature Engineering & Selection" },
        { id: "p2_i6", text: "Data Cleaning & Preprocessing" },
      ]},
      { id: "p2_t2", label: "Supervised Learning", items: [
        { id: "p2_i7", text: "Linear & Polynomial Regression" },
        { id: "p2_i8", text: "Logistic Regression" },
        { id: "p2_i9", text: "Decision Trees & Random Forest" },
        { id: "p2_i10", text: "SVM & KNN" },
        { id: "p2_i11", text: "Gradient Boosting — XGBoost" },
      ]},
      { id: "p2_t3", label: "Unsupervised + Evaluation", items: [
        { id: "p2_i12", text: "K-Means Clustering" },
        { id: "p2_i13", text: "PCA — Dimensionality Reduction" },
        { id: "p2_i14", text: "Accuracy, Precision, Recall, F1" },
        { id: "p2_i15", text: "Confusion Matrix & ROC-AUC" },
        { id: "p2_i16", text: "K-Fold Cross Validation" },
        { id: "p2_i17", text: "Scikit-learn كامل" },
      ]},
    ],
    sources: [
      { id: "p2_s1", name: "د. مصطفى سعد — Classical ML", lang: "🇪🇬", type: "كورس مدفوع", price: "اشتريته ✅", note: "⭐ الأساسي — ابدأ بيه", url: "https://drive.google.com/drive/folders/11prZislvJy0f6vTnd2eWmnCWaF0fJ5m6" },
      { id: "p2_s2", name: "Andrew Ng — ML Specialization", lang: "🌍", type: "Coursera Audit", price: "مجاني ✅", note: "Reference قوي جنب مصطفى سعد", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { id: "p2_s3", name: "StatQuest — ML Playlist", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "تعمق في أي Concept محتاجه", url: "https://www.youtube.com/@statquest" },
      { id: "p2_s4", name: "Kaggle Learn — Intro to ML", lang: "🌍", type: "كورس تفاعلي", price: "مجاني", note: "تدريب عملي سريع بعد الكورس", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
      { id: "p2_s5", name: "Hands-On ML — Aurélien Géron", lang: "🌍", type: "كتاب", price: "مدفوع", note: "الأعمق والأشمل — مرجع لازم تعرفه", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" },
      { id: "p2_s6", name: "Scikit-learn Official Docs", lang: "🌍", type: "موقع / Docs", price: "مجاني", note: "مرجع لكل Algorithm وكل Function", url: "https://scikit-learn.org/stable/user_guide.html" },
      { id: "p2_s7", name: "Hesham Asem — ML Arabic", lang: "🇪🇬", type: "يوتيوب", price: "مجاني", note: "Supplement عربي لو محتاج شرح إضافي", url: "https://www.youtube.com/@HeshamAsem" },
    ],
  },
  {
    id: 3, number: "03", title: "Deep Learning Core", duration: "6–8 أسابيع",
    color: "#34D399", glow: "rgba(52,211,153,0.3)", icon: "🧠",
    topics: [
      { id: "p3_t1", label: "Neural Networks", items: [
        { id: "p3_i1", text: "Perceptron → Multi-layer Perceptron" },
        { id: "p3_i2", text: "Forward Propagation" },
        { id: "p3_i3", text: "Backpropagation & Gradient Descent" },
        { id: "p3_i4", text: "Activation Functions (ReLU, Sigmoid, Softmax)" },
        { id: "p3_i5", text: "Loss Functions (MSE, Cross-Entropy)" },
      ]},
      { id: "p3_t2", label: "PyTorch", items: [
        { id: "p3_i6", text: "Tensors & Autograd" },
        { id: "p3_i7", text: "DataLoader & Dataset" },
        { id: "p3_i8", text: "Building Neural Network من الصفر" },
        { id: "p3_i9", text: "Training Loop كامل" },
        { id: "p3_i10", text: "GPU Training (CUDA)" },
      ]},
      { id: "p3_t3", label: "Architectures", items: [
        { id: "p3_i11", text: "CNNs (Convolution, Pooling, Strides)" },
        { id: "p3_i12", text: "RNNs & LSTMs (فكرة عامة)" },
        { id: "p3_i13", text: "Transfer Learning (ResNet, EfficientNet)" },
        { id: "p3_i14", text: "Image Classification Project كامل" },
        { id: "p3_i15", text: "Attention Mechanism (مقدمة)" },
      ]},
    ],
    sources: [
      { id: "p3_s1", name: "د. مصطفى سعد — Deep Learning Intro", lang: "🇪🇬", type: "كورس مدفوع", price: "اشتريته ✅", note: "⭐ عندك PyTorch + CNN + RNN كامل", url: "https://drive.google.com/drive/folders/11prZislvJy0f6vTnd2eWmnCWaF0fJ5m6" },
      { id: "p3_s2", name: "fast.ai — Practical Deep Learning", lang: "🌍", type: "كورس", price: "مجاني", note: "أفضل Practical Approach بعد مصطفى سعد", url: "https://course.fast.ai" },
      { id: "p3_s3", name: "Andrej Karpathy — Neural Networks Zero to Hero", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "⭐ جوهرة — Backprop بعمق حقيقي", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ" },
      { id: "p3_s4", name: "Andrew Ng — Deep Learning Specialization", lang: "🌍", type: "Coursera Audit", price: "مجاني", note: "الأعمق نظرياً — كـ Reference", url: "https://www.coursera.org/specializations/deep-learning" },
      { id: "p3_s5", name: "PyTorch Official Tutorials", lang: "🌍", type: "Docs / موقع", price: "مجاني", note: "لازم تقراه مع الكورس خطوة بخطوة", url: "https://pytorch.org/tutorials" },
      { id: "p3_s6", name: "Deep Learning — Goodfellow et al.", lang: "🌍", type: "كتاب PDF", price: "مجاني", note: "المرجع النظري الأعمق في الـ DL", url: "https://www.deeplearningbook.org" },
      { id: "p3_s7", name: "d2l.ai — Dive into Deep Learning", lang: "🌍", type: "كتاب تفاعلي", price: "مجاني", note: "كود + نظرية + تمارين — ممتاز", url: "https://d2l.ai" },
    ],
  },
  {
    id: 4, number: "04", title: "Computer Vision", duration: "6–8 أسابيع",
    color: "#F472B6", glow: "rgba(244,114,182,0.3)", icon: "👁️", badge: "تخصصك ⭐",
    topics: [
      { id: "p4_t1", label: "OpenCV", items: [
        { id: "p4_i1", text: "Image Read, Write, Display" },
        { id: "p4_i2", text: "Color Spaces (BGR, RGB, HSV)" },
        { id: "p4_i3", text: "Filters, Edge Detection (Canny, Sobel)" },
        { id: "p4_i4", text: "Contours & Morphological Operations" },
        { id: "p4_i5", text: "Video Processing Frame by Frame" },
      ]},
      { id: "p4_t2", label: "Modern CV Models", items: [
        { id: "p4_i6", text: "YOLO — Object Detection (v8/v11)" },
        { id: "p4_i7", text: "SAM — Segment Anything Model" },
        { id: "p4_i8", text: "CLIP — Image + Text Understanding" },
        { id: "p4_i9", text: "Vision Transformers (ViT)" },
        { id: "p4_i10", text: "Depth Estimation Models" },
      ]},
      { id: "p4_t3", label: "Generative Image AI", items: [
        { id: "p4_i11", text: "GANs (فكرة عامة)" },
        { id: "p4_i12", text: "Diffusion Models — كيف تشتغل" },
        { id: "p4_i13", text: "Stable Diffusion / ComfyUI" },
        { id: "p4_i14", text: "Image Generation APIs (DALL-E, Midjourney)" },
        { id: "p4_i15", text: "ControlNet & Image-to-Image" },
      ]},
    ],
    sources: [
      { id: "p4_s1", name: "PyImageSearch — OpenCV Tutorials", lang: "🌍", type: "موقع / مقالات", price: "مجاني جزء منه", note: "⭐ المرجع الأول للـ OpenCV", url: "https://pyimagesearch.com" },
      { id: "p4_s2", name: "OpenCV Official Docs & Tutorials", lang: "🌍", type: "Docs / موقع", price: "مجاني", note: "المرجع الرسمي لكل Function", url: "https://docs.opencv.org/4.x/d9/df8/tutorial_root.html" },
      { id: "p4_s3", name: "Ultralytics YOLO Docs", lang: "🌍", type: "Docs / موقع", price: "مجاني", note: "أسرع طريقة تشغّل YOLO", url: "https://docs.ultralytics.com" },
      { id: "p4_s4", name: "HuggingFace — Computer Vision Course", lang: "🌍", type: "كورس", price: "مجاني", note: "⭐ ViT + CLIP + SAM بعمق", url: "https://huggingface.co/learn/computer-vision-course" },
      { id: "p4_s5", name: "Roboflow — CV Tutorials & Projects", lang: "🌍", type: "موقع", price: "مجاني", note: "Projects حقيقية + Datasets جاهزة", url: "https://roboflow.com/learn" },
      { id: "p4_s6", name: "fast.ai — CV Part (Lesson 1-7)", lang: "🌍", type: "كورس", price: "مجاني", note: "تطبيقي رائع على الـ CV", url: "https://course.fast.ai" },
      { id: "p4_s7", name: "Programming Computer Vision with Python — Jan Solem", lang: "🌍", type: "كتاب PDF", price: "مجاني", note: "كتاب كلاسيكي للـ CV الأساسيات", url: "http://programmingcomputervision.com" },
      { id: "p4_s8", name: "Practical Deep Learning for CV — O'Reilly", lang: "🌍", type: "كتاب", price: "مدفوع", note: "أشمل كتاب CV عملي حديث", url: "https://www.oreilly.com/library/view/practical-deep-learning/9781492034858/" },
    ],
  },
  {
    id: 5, number: "05", title: "AI Engineer Layer", duration: "4–6 أسابيع",
    color: "#FBBF24", glow: "rgba(251,191,36,0.3)", icon: "🤖",
    topics: [
      { id: "p5_t1", label: "HuggingFace Ecosystem", items: [
        { id: "p5_i1", text: "Models Hub & Pipelines" },
        { id: "p5_i2", text: "Transformers Library" },
        { id: "p5_i3", text: "Tokenizers & Feature Extractors" },
        { id: "p5_i4", text: "HuggingFace Spaces (نشر Projects)" },
        { id: "p5_i5", text: "Fine-tuning Pre-trained Models" },
      ]},
      { id: "p5_t2", label: "Multimodal AI", items: [
        { id: "p5_i6", text: "Image + Text Models (GPT-4V, Gemini Vision)" },
        { id: "p5_i7", text: "Video Understanding APIs" },
        { id: "p5_i8", text: "Whisper — Speech-to-Text" },
        { id: "p5_i9", text: "Text-to-Image APIs (DALL-E, Stability AI)" },
        { id: "p5_i10", text: "LangChain للـ Multimodal Apps" },
      ]},
      { id: "p5_t3", label: "Embeddings & Vector Search", items: [
        { id: "p5_i11", text: "ما هي الـ Embeddings وكيف تشتغل" },
        { id: "p5_i12", text: "Semantic Image Search" },
        { id: "p5_i13", text: "FAISS / Chroma DB" },
        { id: "p5_i14", text: "RAG — Retrieval Augmented Generation (فكرة)" },
      ]},
    ],
    sources: [
      { id: "p5_s1", name: "HuggingFace — NLP / Transformers Course", lang: "🌍", type: "كورس", price: "مجاني", note: "⭐ الأفضل للـ Transformers Ecosystem", url: "https://huggingface.co/learn/nlp-course" },
      { id: "p5_s2", name: "HuggingFace — Computer Vision Course", lang: "🌍", type: "كورس", price: "مجاني", note: "Multimodal AI + Vision Transformers", url: "https://huggingface.co/learn/computer-vision-course" },
      { id: "p5_s3", name: "OpenAI API Docs", lang: "🌍", type: "Docs", price: "مجاني", note: "Vision API + Whisper + DALL-E + Embeddings", url: "https://platform.openai.com/docs" },
      { id: "p5_s4", name: "Andrej Karpathy — YouTube Channel", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "⭐ أعمق فهم لـ LLMs وراء الـ API", url: "https://www.youtube.com/@AndrejKarpathy" },
      { id: "p5_s5", name: "LangChain Docs", lang: "🌍", type: "Docs / موقع", price: "مجاني", note: "للـ Chains + RAG + Multimodal Apps", url: "https://python.langchain.com/docs" },
      { id: "p5_s6", name: "roadmap.sh — AI Engineer", lang: "🌍", type: "موقع", price: "مجاني", note: "مرجع تفاعلي لكل المسار", url: "https://roadmap.sh/ai-engineer" },
    ],
  },
  {
    id: 6, number: "06", title: "Build & Deploy", duration: "4 أسابيع",
    color: "#F87171", glow: "rgba(248,113,113,0.3)", icon: "🚀", badge: "Portfolio",
    topics: [
      { id: "p6_t1", label: "Building Apps", items: [
        { id: "p6_i1", text: "Gradio — أسرع AI App" },
        { id: "p6_i2", text: "Streamlit — Data Apps" },
        { id: "p6_i3", text: "FastAPI للـ Backend & REST API" },
        { id: "p6_i4", text: "Frontend أساسي (HTML/CSS — اختياري)" },
      ]},
      { id: "p6_t2", label: "Deployment & MLOps", items: [
        { id: "p6_i5", text: "Docker — Containerization أساسيات" },
        { id: "p6_i6", text: "HuggingFace Spaces (Deploy مجاناً)" },
        { id: "p6_i7", text: "Google Colab Pro للـ Training" },
        { id: "p6_i8", text: "Model Versioning & Experiment Tracking (MLflow)" },
        { id: "p6_i9", text: "CI/CD أساسيات (GitHub Actions)" },
      ]},
      { id: "p6_t3", label: "Portfolio Projects", items: [
        { id: "p6_i10", text: "Project 1: Real-time Object Detection App" },
        { id: "p6_i11", text: "Project 2: Image Generation / Style Transfer App" },
        { id: "p6_i12", text: "Project 3: Multimodal AI App (Image + Text)" },
        { id: "p6_i13", text: "GitHub Profile + README لكل Project" },
        { id: "p6_i14", text: "LinkedIn Profile محدّث" },
      ]},
    ],
    sources: [
      { id: "p6_s1", name: "Gradio Docs", lang: "🌍", type: "Docs", price: "مجاني", note: "⭐ AI App في 10 دقايق", url: "https://www.gradio.app/guides" },
      { id: "p6_s2", name: "FastAPI Docs", lang: "🌍", type: "Docs", price: "مجاني", note: "أوضح Docs للـ Backend", url: "https://fastapi.tiangolo.com" },
      { id: "p6_s3", name: "Streamlit Docs", lang: "🌍", type: "Docs", price: "مجاني", note: "Data Apps بسرعة", url: "https://docs.streamlit.io" },
      { id: "p6_s4", name: "HuggingFace Spaces Guide", lang: "🌍", type: "Docs", price: "مجاني", note: "Deploy مجاناً للـ Projects", url: "https://huggingface.co/docs/hub/spaces" },
      { id: "p6_s5", name: "TechWithTim — FastAPI + Docker", lang: "🌍", type: "يوتيوب", price: "مجاني", note: "Docker + FastAPI عملي خطوة بخطوة", url: "https://www.youtube.com/@TechWithTim" },
      { id: "p6_s6", name: "Docker Official Docs — Get Started", lang: "🌍", type: "Docs", price: "مجاني", note: "لازم تفهم Docker من المصدر", url: "https://docs.docker.com/get-started/" },
      { id: "p6_s7", name: "MLflow Docs", lang: "🌍", type: "Docs / موقع", price: "مجاني", note: "Experiment Tracking للـ Models", url: "https://mlflow.org/docs/latest/index.html" },
    ],
  },
];

const transferable = [
  { skill: "PyTorch", goes: "NLP, RL, Any DL" },
  { skill: "Transformers", goes: "BERT, GPT, كل حاجة" },
  { skill: "HuggingFace", goes: "NLP Models جاهزة" },
  { skill: "Git + Clean Code", goes: "أي تراك" },
  { skill: "Embeddings", goes: "NLP, Search, Agents" },
  { skill: "FastAPI + Deploy", goes: "أي Product" },
];

export default function Roadmap() {
  const [active, setActive] = useState(null);
  const [tabs, setTabs] = useState({});
  const [checked, setChecked] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) setChecked(JSON.parse(res.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Save to storage
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(checked)); } catch {}
    })();
  }, [checked, loaded]);

  const toggleCheck = (id, e) => {
    e.stopPropagation();
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTab = (id) => tabs[id] || "المحتوى";
  const setTab = (id, t) => setTabs(prev => ({ ...prev, [id]: t }));

  const phaseProgress = (phase) => {
    const all = phase.topics.flatMap(t => t.items);
    const done = all.filter(i => checked[i.id]).length;
    return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  const totalProgress = () => {
    const all = phases.flatMap(p => p.topics.flatMap(t => t.items));
    const done = all.filter(i => checked[i.id]).length;
    return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  const tp = totalProgress();

  const styles = {
    root: { background: "#060A12", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, sans-serif", color: "#E2E8F0", padding: "clamp(20px,4vw,44px) clamp(12px,3vw,24px) 60px", direction: "rtl", boxSizing: "border-box" },
    headerWrap: { textAlign: "center", marginBottom: "clamp(28px,5vw,52px)" },
    subLabel: { fontSize: "clamp(9px,1.8vw,11px)", letterSpacing: 4, color: "#334155", marginBottom: 10, textTransform: "uppercase" },
    h1: { fontSize: "clamp(22px,5vw,48px)", fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#00D4FF 0%,#A78BFA 45%,#F472B6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2 },
    subtitle: { color: "#475569", marginTop: 8, fontSize: "clamp(11px,2vw,13px)" },
    progressBar: { width: "100%", height: 6, background: "#0F1A2E", borderRadius: 99, overflow: "hidden", marginTop: 4 },
    container: { maxWidth: 880, margin: "0 auto" },
    phaseRow: { display: "flex", marginBottom: 6 },
    connector: { display: "flex", flexDirection: "column", alignItems: "center", width: "clamp(40px,6vw,54px)", flexShrink: 0 },
    cardWrap: { flex: 1, marginRight: "clamp(8px,2vw,14px)" },
    tabBtn: (active, color) => ({ background: "none", border: "none", padding: "9px clamp(10px,2vw,16px)", fontSize: "clamp(11px,2vw,13px)", fontWeight: 700, cursor: "pointer", color: active ? color : "#334155", borderBottom: active ? `2px solid ${color}` : "2px solid transparent", transition: "all 0.2s", flexShrink: 0 }),
    topicGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,185px),1fr))", gap: 10 },
    sourceList: { display: "flex", flexDirection: "column", gap: 7 },
    infoBox: { background: "rgba(11,20,32,0.95)", border: "1px solid #192035", borderRadius: 14, padding: "clamp(14px,3vw,22px) clamp(14px,3vw,24px)" },
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.headerWrap}>
        <div style={styles.subLabel}>Personalized · Computer Vision Specialized</div>
        <h1 style={styles.h1}>AI Engineer Roadmap</h1>
        <p style={styles.subtitle}>~8–9 أشهر · 7 مراحل · مصادر مخصصة · اضغط لعرض التفاصيل</p>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {[["🇪🇬 عربي","#FBBF2433","#FBBF24"],["🌍 English","#93C5FD33","#93C5FD"],["✅ عندك","#34D39933","#34D399"],["⭐ أساسي","#F472B633","#F472B6"]].map(([l,bg,c])=>(
            <span key={l} style={{ fontSize: "clamp(10px,1.8vw,11px)", padding: "3px 9px", borderRadius: 20, background: bg, color: c, border:`1px solid ${c}44` }}>{l}</span>
          ))}
        </div>

        {/* Global progress */}
        <div style={{ maxWidth: 460, margin: "18px auto 0", background: "rgba(11,20,32,0.9)", border: "1px solid #192035", borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "clamp(11px,2vw,13px)" }}>
            <span style={{ color: "#94A3B8", fontWeight: 600 }}>التقدم الكلي</span>
            <span style={{ color: "#F1F5F9", fontWeight: 700 }}>{tp.done} / {tp.total} <span style={{ color: "#34D399" }}>({tp.pct}%)</span></span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ width: `${tp.pct}%`, height: "100%", background: "linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={styles.container}>
        {phases.map((phase, idx) => {
          const prog = phaseProgress(phase);
          const isActive = active === phase.id;
          return (
            <div key={phase.id} style={styles.phaseRow}>
              {/* Circle */}
              <div style={styles.connector}>
                <div onClick={() => setActive(isActive ? null : phase.id)} style={{
                  width: "clamp(36px,5vw,42px)", height: "clamp(36px,5vw,42px)", borderRadius: "50%",
                  background: isActive ? `radial-gradient(circle,${phase.glow},transparent 70%)` : "transparent",
                  border: `2px solid ${isActive ? phase.color : phase.color+"44"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(14px,2.5vw,18px)", cursor: "pointer", flexShrink: 0,
                  boxShadow: isActive ? `0 0 18px ${phase.glow}` : "none",
                  transition: "all 0.25s", transform: isActive ? "scale(1.1)" : "scale(1)",
                }}>{phase.icon}</div>
                {idx < phases.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 14, background: `linear-gradient(to bottom,${phase.color}44,${phases[idx+1].color}22)`, margin: "4px 0" }} />
                )}
              </div>

              {/* Card */}
              <div style={styles.cardWrap}>
                {/* Header */}
                <div onClick={() => setActive(isActive ? null : phase.id)} style={{
                  background: isActive ? `linear-gradient(135deg,${phase.glow},#0B1420 100%)` : "rgba(11,20,32,0.95)",
                  border: `1px solid ${isActive ? phase.color+"66" : "#192035"}`,
                  borderRadius: isActive ? "12px 12px 0 0" : 12,
                  padding: "clamp(10px,2.5vw,14px) clamp(12px,3vw,16px)",
                  cursor: "pointer", transition: "all 0.25s",
                  boxShadow: isActive ? `0 0 22px ${phase.glow}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "clamp(9px,1.5vw,10px)", color: phase.color, fontWeight: 800, letterSpacing: 2, flexShrink: 0 }}>PHASE {phase.number}</span>
                      <span style={{ fontSize: "clamp(13px,2.5vw,15px)", fontWeight: 700, color: "#F1F5F9" }}>{phase.title}</span>
                      {phase.badge && <span style={{ background:`${phase.color}18`, border:`1px solid ${phase.color}44`, borderRadius:20, padding:"1px 8px", fontSize:"clamp(9px,1.5vw,10px)", color:phase.color, fontWeight:700 }}>{phase.badge}</span>}
                      {phase.statusLabel && <span style={{ background:"#34D39918", border:"1px solid #34D39944", borderRadius:20, padding:"1px 8px", fontSize:"clamp(9px,1.5vw,10px)", color:"#34D399", fontWeight:700 }}>{phase.statusLabel}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: "clamp(10px,1.8vw,12px)", color: "#334155", whiteSpace:"nowrap" }}>⏱ {phase.duration}</span>
                      <span style={{ color: phase.color, fontSize: 11, transition: "transform 0.3s", display: "inline-block", transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </div>
                  </div>
                  {/* Mini progress */}
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: "#0F1A2E", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${prog.pct}%`, height: "100%", background: phase.color, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: phase.color, fontWeight: 700, whiteSpace:"nowrap" }}>{prog.done}/{prog.total}</span>
                  </div>
                </div>

                {/* Body */}
                {isActive && (
                  <div style={{ background: "rgba(8,14,26,0.98)", border:`1px solid ${phase.color}33`, borderTop:"none", borderRadius:"0 0 12px 12px" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", borderBottom: "1px solid #192035", overflowX:"auto" }}>
                      {["المحتوى","المصادر"].map(t => (
                        <button key={t} onClick={()=>setTab(phase.id,t)} style={styles.tabBtn(getTab(phase.id)===t, phase.color)}>{t}</button>
                      ))}
                    </div>

                    <div style={{ padding: "clamp(12px,3vw,16px)" }}>
                      {getTab(phase.id) === "المحتوى" ? (
                        <div style={styles.topicGrid}>
                          {phase.topics.map(g => (
                            <div key={g.id} style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"11px 13px", borderRight:`3px solid ${phase.color}44` }}>
                              <div style={{ fontSize:"clamp(9px,1.5vw,10px)", color:phase.color, fontWeight:800, marginBottom:8, letterSpacing:1 }}>{g.label}</div>
                              {g.items.map(item => (
                                <div key={item.id} onClick={(e)=>toggleCheck(item.id,e)}
                                  style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6, cursor:"pointer", userSelect:"none" }}>
                                  <div style={{
                                    width:14, height:14, borderRadius:3, flexShrink:0, marginTop:2,
                                    border:`1.5px solid ${checked[item.id] ? phase.color : "#334155"}`,
                                    background: checked[item.id] ? phase.color : "transparent",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    transition:"all 0.2s",
                                  }}>
                                    {checked[item.id] && <span style={{ color:"#060A12", fontSize:9, fontWeight:900, lineHeight:1 }}>✓</span>}
                                  </div>
                                  <span style={{ fontSize:"clamp(11px,2vw,12px)", color: checked[item.id] ? "#475569":"#CBD5E1", lineHeight:1.5, textDecoration: checked[item.id]?"line-through":"none", transition:"all 0.2s" }}>{item.text}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={styles.sourceList}>
                          {phase.sources.map(src => (
                            <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer"
                              style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"clamp(8px,2vw,11px) clamp(10px,2vw,13px)", textDecoration:"none", border:`1px solid ${phase.color}18`, transition:"border-color 0.2s" }}
                              onMouseEnter={e=>e.currentTarget.style.borderColor=phase.color+"55"}
                              onMouseLeave={e=>e.currentTarget.style.borderColor=phase.color+"18"}
                            >
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:4 }}>
                                  <span style={{ fontSize:"clamp(12px,2vw,13px)", fontWeight:700, color:"#E2E8F0" }}>{src.name}</span>
                                  <span style={{ fontSize:"clamp(9px,1.5vw,10px)", padding:"1px 5px", borderRadius:4, background:src.lang==="🇪🇬"?"rgba(251,191,36,0.15)":"rgba(147,197,253,0.12)", color:src.lang==="🇪🇬"?"#FBBF24":"#93C5FD", whiteSpace:"nowrap" }}>
                                    {src.lang==="🇪🇬"?"عربي":"English"}
                                  </span>
                                  <span style={{ fontSize:"clamp(9px,1.5vw,10px)", padding:"1px 5px", borderRadius:4, background:"rgba(255,255,255,0.05)", color:"#475569", whiteSpace:"nowrap" }}>{src.type}</span>
                                </div>
                                <div style={{ fontSize:"clamp(10px,1.8vw,11px)", color:"#475569", marginTop:3 }}>{src.note}</div>
                              </div>
                              <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
                                <span style={{ fontSize:"clamp(9px,1.5vw,10px)", padding:"2px 7px", borderRadius:4, whiteSpace:"nowrap",
                                  background:src.price.includes("مجاني")?"rgba(52,211,153,0.13)":src.price.includes("اشتريته")?"rgba(0,212,255,0.13)":"rgba(251,191,36,0.13)",
                                  color:src.price.includes("مجاني")?"#34D399":src.price.includes("اشتريته")?"#00D4FF":"#FBBF24",
                                }}>{src.price}</span>
                                <span style={{ fontSize:10, color:phase.color }}>↗</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* English Strategy */}
      <div style={{ maxWidth:880, margin:"28px auto 0" }}>
        <div style={styles.infoBox}>
          <div style={{ fontSize:"clamp(9px,1.5vw,10px)", letterSpacing:4, color:"#334155", marginBottom:6 }}>ENGLISH STRATEGY</div>
          <h3 style={{ margin:"0 0 14px", fontSize:"clamp(13px,2.5vw,15px)", color:"#F1F5F9" }}>🌍 خطة التعامل مع الإنجليزي</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))", gap:8 }}>
            {[["Phase 00–02","عربي بالكامل ✅","#34D399"],["Phase 03","عربي أساسي + English Docs","#FBBF24"],["Phase 04–06","English أساسي — لازم","#F472B6"]].map(([p,s,c])=>(
              <div key={p} style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"10px 12px", borderRight:`3px solid ${c}55` }}>
                <div style={{ fontSize:"clamp(9px,1.5vw,10px)", color:c, fontWeight:700, marginBottom:4 }}>{p}</div>
                <div style={{ fontSize:"clamp(11px,2vw,13px)", color:"#CBD5E1" }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:10, fontSize:"clamp(10px,1.8vw,12px)", color:"#334155", lineHeight:1.7 }}>
            💡 ابدأ الـ Concept بعربي → اقرأ الـ Docs إنجليزي → مع الوقت هتتعود تلقائياً
          </div>
        </div>
      </div>

      {/* Transferable */}
      <div style={{ maxWidth:880, margin:"14px auto 0" }}>
        <div style={styles.infoBox}>
          <div style={{ fontSize:"clamp(9px,1.5vw,10px)", letterSpacing:4, color:"#334155", marginBottom:6 }}>FUTURE-PROOF</div>
          <h3 style={{ margin:"0 0 14px", fontSize:"clamp(13px,2.5vw,15px)", color:"#F1F5F9" }}>🔄 مهاراتك قابلة للنقل لأي تراك</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))", gap:7 }}>
            {transferable.map(item=>(
              <div key={item.skill} style={{ background:"rgba(0,0,0,0.25)", border:"1px solid #192035", borderRadius:9, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:4 }}>
                <span style={{ fontWeight:700, fontSize:"clamp(11px,2vw,13px)", color:"#E2E8F0" }}>{item.skill}</span>
                <span style={{ fontSize:11, color:"#1E293B" }}>→</span>
                <span style={{ fontSize:"clamp(10px,1.8vw,11px)", color:"#475569" }}>{item.goes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign:"center", marginTop:28, color:"#1E293B", fontSize:"clamp(10px,1.8vw,11px)" }}>
        اضغط على أي مرحلة ← المحتوى (مع Checkboxes) · المصادر · التقدم محفوظ تلقائياً
      </div>
    </div>
  );
}
