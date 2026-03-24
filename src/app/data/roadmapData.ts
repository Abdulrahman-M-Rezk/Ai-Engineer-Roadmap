export interface Topic {
  id: string;
  nameAr: string;
  nameEn: string;
  essential: boolean;
}

export interface TopicGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  topics: Topic[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'video' | 'book' | 'article';
  lang: 'ar' | 'en';
  price: 'free' | 'paid';
  url?: string;
  groupId?: string;
  desc?: string;
}

export interface Task {
  id: string;
  type: 'build' | 'deploy' | 'read';
  textAr: string;
  link?: string;
}

export interface Phase {
  id: string;
  number: number;
  emoji: string;
  nameAr: string;
  nameEn: string;
  color: string;
  duration: string;
  topicGroups: TopicGroup[];
  resources: Resource[];
  tasks: Task[];
}

export const phases: Phase[] = [
  /* ═══════════════════════════════════════════ PHASE 1 ══ */
  {
    id: 'phase-1',
    number: 1,
    emoji: '🐍',
    nameAr: 'Python والرياضيات',
    nameEn: 'Python & Math Fundamentals',
    color: '#00D4FF',
    duration: '6-8 أسابيع',
    topicGroups: [
      {
        id: 'p1-g1',
        nameAr: 'أساسيات Python',
        nameEn: 'Python Basics',
        topics: [
          { id: 'p1-g1-t1', nameAr: 'المتغيرات وأنواع البيانات', nameEn: 'Variables & Data Types', essential: true },
          { id: 'p1-g1-t2', nameAr: 'التحكم في التدفق (if/for/while)', nameEn: 'Control Flow', essential: true },
          { id: 'p1-g1-t3', nameAr: 'الـ Functions والـ Lambda', nameEn: 'Functions & Lambda', essential: true },
          { id: 'p1-g1-t4', nameAr: 'OOP (Classes & Inheritance)', nameEn: 'OOP', essential: true },
          { id: 'p1-g1-t5', nameAr: 'File I/O ومعالجة الأخطاء', nameEn: 'File I/O & Error Handling', essential: false },
        ],
      },
      {
        id: 'p1-g2',
        nameAr: 'الرياضيات للـ AI',
        nameEn: 'Math for AI',
        topics: [
          { id: 'p1-g2-t1', nameAr: 'الجبر الخطي (Vectors & Matrices)', nameEn: 'Linear Algebra', essential: true },
          { id: 'p1-g2-t2', nameAr: 'التفاضل والتكامل (Derivatives)', nameEn: 'Calculus', essential: true },
          { id: 'p1-g2-t3', nameAr: 'الإحصاء (Mean, Std, Distributions)', nameEn: 'Statistics', essential: true },
          { id: 'p1-g2-t4', nameAr: 'الاحتمالات (Bayes Theorem)', nameEn: 'Probability', essential: true },
          { id: 'p1-g2-t5', nameAr: 'الـ Optimization و Gradient Descent', nameEn: 'Optimization', essential: true },
        ],
      },
      {
        id: 'p1-g3',
        nameAr: 'مكتبات Python',
        nameEn: 'Python Libraries',
        topics: [
          { id: 'p1-g3-t1', nameAr: 'NumPy للحسابات العددية', nameEn: 'NumPy', essential: true },
          { id: 'p1-g3-t2', nameAr: 'Pandas لتحليل البيانات', nameEn: 'Pandas', essential: true },
          { id: 'p1-g3-t3', nameAr: 'Matplotlib & Seaborn للرسم البياني', nameEn: 'Matplotlib & Seaborn', essential: false },
          { id: 'p1-g3-t4', nameAr: 'Scikit-learn (أساسيات)', nameEn: 'Scikit-learn Basics', essential: false },
        ],
      },
    ],
    resources: [
      // ── Arabic (from backup) ──
      { id: 'p1-s1', groupId: 'p1-g2', name: 'د. حاتم العطار — Linear Algebra', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/playlist?list=PLJM7jJIw2GC2I5gFd7fFMM5sXBCVOkXbB' },
      { id: 'p1-s2', groupId: 'p1-g2', name: 'د. حاتم العطار — Statistics & Calculus', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/playlist?list=PLJM7jJIw2GC2Ihr__bRSeMxzsiFMZEsx7' },
      { id: 'p1-hatem-3', groupId: 'p1-g2', name: 'د. حاتم العطار — Probability for AI', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/playlist?list=PLJM7jJIw2GC2Ihr__bRSeMxzsiFMZEsx7' },
      { id: 'p0-s1', groupId: 'p1-g1', name: 'Elzero Web School — Python', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/@ElzeroWebSchool' },
      // ── English: Python ──
      { id: 'p0-s2', groupId: 'p1-g1', name: 'CS50P — Harvard (Python)', type: 'video', lang: 'en', price: 'free', url: 'https://cs50.harvard.edu/python' },
      { id: 'p0-s3', groupId: 'p1-g1', name: 'Automate the Boring Stuff with Python', type: 'book', lang: 'en', price: 'free', url: 'https://automatetheboringstuff.com' },
      { id: 'p0-s4', groupId: 'p1-g1', name: 'Real Python — مقالات', type: 'article', lang: 'en', price: 'free', url: 'https://realpython.com' },
      { id: 'p0-s5', name: 'Git & GitHub — FreeCodeCamp', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { id: 'p0-s6', groupId: 'p1-g1', name: 'Python Crash Course — Eric Matthes', type: 'book', lang: 'en', price: 'paid', url: 'https://nostarch.com/python-crash-course-3rd-edition' },
      // ── English: Math ──
      { id: 'p1-s3', groupId: 'p1-g2', name: '3Blue1Brown — Essence of Linear Algebra', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2ZAgoSUO7RRMB' },
      { id: 'p1-s4', groupId: 'p1-g2', name: '3Blue1Brown — Essence of Calculus', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
      { id: 'p1-s5', groupId: 'p1-g2', name: 'StatQuest with Josh Starmer', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/@statquest' },
      { id: 'p1-s6', groupId: 'p1-g3', name: 'Kaggle Learn — Pandas', type: 'article', lang: 'en', price: 'free', url: 'https://www.kaggle.com/learn/pandas' },
      { id: 'p1-s7', groupId: 'p1-g2', name: 'Mathematics for Machine Learning (Deisenroth)', type: 'book', lang: 'en', price: 'free', url: 'https://mml-book.github.io' },
      { id: 'p1-s8', groupId: 'p1-g2', name: 'Probability Bootcamp — Dr. Steve', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLMrJAkhIeNNR3sNYvfgiKgcStwuPSts9V' },
      { id: 'p1-s9', groupId: 'p1-g2', name: 'Mathematics for ML — Andrew Ng (Coursera)', type: 'video', lang: 'en', price: 'free', url: 'https://www.coursera.org/specializations/mathematics-for-machine-learning-and-data-science' },
      { id: 'p1-s10', groupId: 'p1-g3', name: 'Corey Schafer — Pandas', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/watch?v=ZyhVh-qRZPA&list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS' },
      { id: 'p1-s11', groupId: 'p1-g3', name: 'NumPy Tutorial — Keith Galli', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/watch?v=5-5CrLmf2vk&list=PLIA_seGogbkGDYq-dnVCsELEIq_7HK7Ca' },
    ],
    tasks: [
      { id: 'p1-task1', type: 'build', textAr: 'ابني data analysis project بـ Pandas على dataset من Kaggle', link: 'https://kaggle.com' },
      { id: 'p1-task2', type: 'read', textAr: 'اقرأ Chapter 2 من Mathematics for Machine Learning', link: 'https://mml-book.github.io' },
      { id: 'p1-task3', type: 'build', textAr: 'حل 20 مسألة على NumPy و Linear Algebra — Khan Academy', link: 'https://www.khanacademy.org/math/linear-algebra' },
      { id: 'p1-task4', type: 'deploy', textAr: 'ارفع الـ projects على GitHub بـ README واضح', link: 'https://github.com' },
      { id: 'p1-task5', type: 'build', textAr: 'حلل Dataset بـ Pandas وطلع 5 insights', link: 'https://www.kaggle.com/datasets' },
      { id: 'p1-task6', type: 'build', textAr: 'ارسم 10 أنواع مختلفة من الـ Charts بـ Matplotlib' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 2 ══ */
  {
    id: 'phase-2',
    number: 2,
    emoji: '🤖',
    nameAr: 'Machine Learning',
    nameEn: 'Machine Learning',
    color: '#A78BFA',
    duration: '8-10 أسابيع',
    topicGroups: [
      {
        id: 'p2-g1',
        nameAr: 'Supervised Learning',
        nameEn: 'Supervised Learning',
        topics: [
          { id: 'p2-g1-t1', nameAr: 'Linear Regression', nameEn: 'Linear Regression', essential: true },
          { id: 'p2-g1-t2', nameAr: 'Logistic Regression', nameEn: 'Logistic Regression', essential: true },
          { id: 'p2-g1-t3', nameAr: 'Decision Trees & Random Forest', nameEn: 'Decision Trees', essential: true },
          { id: 'p2-g1-t4', nameAr: 'Support Vector Machines (SVM)', nameEn: 'SVM', essential: true },
          { id: 'p2-g1-t5', nameAr: 'K-Nearest Neighbors (KNN)', nameEn: 'KNN', essential: false },
          { id: 'p2-g1-t6', nameAr: 'Gradient Boosting — XGBoost', nameEn: 'XGBoost', essential: true },
        ],
      },
      {
        id: 'p2-g2',
        nameAr: 'Unsupervised Learning',
        nameEn: 'Unsupervised Learning',
        topics: [
          { id: 'p2-g2-t1', nameAr: 'K-Means Clustering', nameEn: 'K-Means Clustering', essential: true },
          { id: 'p2-g2-t2', nameAr: 'PCA (تقليل الأبعاد)', nameEn: 'PCA', essential: true },
          { id: 'p2-g2-t3', nameAr: 'DBSCAN', nameEn: 'DBSCAN', essential: false },
        ],
      },
      {
        id: 'p2-g3',
        nameAr: 'تقييم الموديل',
        nameEn: 'Model Evaluation',
        topics: [
          { id: 'p2-g3-t1', nameAr: 'Train/Validation/Test Split', nameEn: 'Data Splitting', essential: true },
          { id: 'p2-g3-t2', nameAr: 'Cross-validation', nameEn: 'Cross-validation', essential: true },
          { id: 'p2-g3-t3', nameAr: 'الـ Metrics (Accuracy, F1, AUC-ROC)', nameEn: 'ML Metrics', essential: true },
          { id: 'p2-g3-t4', nameAr: 'Overfitting و Regularization', nameEn: 'Overfitting & Regularization', essential: true },
          { id: 'p2-g3-t5', nameAr: 'Feature Engineering & Selection', nameEn: 'Feature Engineering', essential: true },
        ],
      },
    ],
    resources: [
      // ── Arabic ──
      { id: 'p2-mostafa-1', name: 'د. مصطفى سعد — Classical ML كامل', type: 'video', lang: 'ar', price: 'paid', url: 'https://t.me/mostvision/1179', desc: 'لدعم الكورس والحصول على الخصم، اذكر للدكتور أنك من طرف Abdulrahman Rizk والإيميل: abdulrahman.m.rezk@gmail.com' },
      { id: 'p2-s7', name: 'Hesham Asem — ML Arabic', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/@HeshamAsem' },
      // ── English ──
      { id: 'p2-s1', name: 'StatQuest with Josh Starmer — ML Playlist', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/@statquest' },
      { id: 'p2-s2', name: 'Andrew Ng — ML Specialization (Coursera)', type: 'video', lang: 'en', price: 'free', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { id: 'p2-s3', name: 'Kaggle Learn — Intro to ML', type: 'article', lang: 'en', price: 'free', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
      { id: 'p2-s4', name: 'Hands-On Machine Learning (Aurélien Géron)', type: 'book', lang: 'en', price: 'paid', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/' },
      { id: 'p2-s5', name: 'Scikit-learn Official Docs', type: 'article', lang: 'en', price: 'free', url: 'https://scikit-learn.org/stable/user_guide.html' },
      { id: 'p2-s8', name: 'ML From Scratch — Python Engineer', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/watch?v=ngLyX54e1LU&list=PLqnslRFeH2Upcrywf-u2etjdxxkL8nl7E' },
      { id: 'p2-s9', name: 'Hands-On ML — كتاب (3 نسخ مجانية)', type: 'book', lang: 'en', price: 'free', url: 'https://github.com/ageron/handson-ml3' },
      { id: 'p2-extra-3', name: 'Moataz Elmesmary — DS Roadmap Resources', type: 'article', lang: 'ar', price: 'free', url: 'https://github.com/Moataz-Elmesmary/Data-Science-Roadmap' },
      { id: 'p2-r4', name: 'Machine Learning Mastery Blog', type: 'article', lang: 'en', price: 'free', url: 'https://machinelearningmastery.com' },
    ],
    tasks: [
      { id: 'p2-task1', type: 'build', textAr: 'ابني classification model على Titanic dataset', link: 'https://www.kaggle.com/c/titanic' },
      { id: 'p2-task2', type: 'build', textAr: 'طبّق Linear Regression من الصفر بـ NumPy' },
      { id: 'p2-task3', type: 'build', textAr: 'قارن بين 3 algorithms مختلفة على نفس dataset' },
      { id: 'p2-task4', type: 'read', textAr: 'افهم كل metric واتى بتستخدمها فين', link: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
      { id: 'p2-task5', type: 'deploy', textAr: 'ارفع التحليل الكامل على Kaggle Notebook', link: 'https://www.kaggle.com' },
      { id: 'p2-task6', type: 'build', textAr: 'شارك في أول Kaggle Competition', link: 'https://www.kaggle.com/competitions' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 3 ══ */
  {
    id: 'phase-3',
    number: 3,
    emoji: '🧠',
    nameAr: 'Deep Learning',
    nameEn: 'Deep Learning',
    color: '#FB923C',
    duration: '8-10 أسابيع',
    topicGroups: [
      {
        id: 'p3-g1',
        nameAr: 'الشبكات العصبية',
        nameEn: 'Neural Networks',
        topics: [
          { id: 'p3-g1-t1', nameAr: 'Perceptron والـ Layers', nameEn: 'Perceptron & Layers', essential: true },
          { id: 'p3-g1-t2', nameAr: 'Backpropagation', nameEn: 'Backpropagation', essential: true },
          { id: 'p3-g1-t3', nameAr: 'Activation Functions (ReLU, Sigmoid)', nameEn: 'Activation Functions', essential: true },
          { id: 'p3-g1-t4', nameAr: 'Optimizers (Adam, SGD, RMSProp)', nameEn: 'Optimizers', essential: true },
        ],
      },
      {
        id: 'p3-g2',
        nameAr: 'Convolutional Networks (CNN)',
        nameEn: 'CNNs',
        topics: [
          { id: 'p3-g2-t1', nameAr: 'Convolutional Layers والـ Filters', nameEn: 'Conv Layers', essential: true },
          { id: 'p3-g2-t2', nameAr: 'Pooling و Stride و Padding', nameEn: 'Pooling & Stride', essential: true },
          { id: 'p3-g2-t3', nameAr: 'المعماريات الشهيرة (ResNet, VGG, EfficientNet)', nameEn: 'Famous Architectures', essential: true },
          { id: 'p3-g2-t4', nameAr: 'Transfer Learning', nameEn: 'Transfer Learning', essential: true },
        ],
      },
      {
        id: 'p3-g3',
        nameAr: 'RNNs والسلاسل',
        nameEn: 'RNNs & Sequences',
        topics: [
          { id: 'p3-g3-t1', nameAr: 'Recurrent Neural Networks (RNN)', nameEn: 'RNNs', essential: true },
          { id: 'p3-g3-t2', nameAr: 'LSTM & GRU', nameEn: 'LSTM & GRU', essential: true },
        ],
      },
      {
        id: 'p3-g4',
        nameAr: 'الـ Frameworks',
        nameEn: 'DL Frameworks',
        topics: [
          { id: 'p3-g4-t1', nameAr: 'PyTorch — الأساسيات والتدريب', nameEn: 'PyTorch Basics', essential: true },
          { id: 'p3-g4-t2', nameAr: 'TensorFlow / Keras', nameEn: 'TensorFlow/Keras', essential: false },
          { id: 'p3-g4-t3', nameAr: 'GPU & CUDA (أساسيات)', nameEn: 'GPU & CUDA Basics', essential: false },
        ],
      },
    ],
    resources: [
      // ── Arabic ──
      { id: 'p3-mostafa-1', name: 'د. مصطفى سعد — Deep Learning Intro', type: 'video', lang: 'ar', price: 'paid', url: 'https://t.me/mostvision/1179', desc: 'لدعم الكورس والحصول على الخصم، اذكر للدكتور أنك من طرف Abdulrahman Rizk والإيميل: abdulrahman.m.rezk@gmail.com' },
      // ── English ──
      { id: 'p3-s2', name: 'fast.ai — Practical Deep Learning', type: 'video', lang: 'en', price: 'free', url: 'https://course.fast.ai' },
      { id: 'p3-s3', name: 'Andrej Karpathy — Neural Networks Zero to Hero', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ' },
      { id: 'p3-s4', name: 'Andrew Ng — Deep Learning Specialization', type: 'video', lang: 'en', price: 'free', url: 'https://www.coursera.org/specializations/deep-learning' },
      { id: 'p3-s5', groupId: 'p3-g4', name: 'PyTorch Official Tutorials', type: 'article', lang: 'en', price: 'free', url: 'https://pytorch.org/tutorials' },
      { id: 'p3-s6', name: 'Deep Learning Book — Goodfellow et al.', type: 'book', lang: 'en', price: 'free', url: 'https://www.deeplearningbook.org' },
      { id: 'p3-s7', name: 'd2l.ai — Dive into Deep Learning', type: 'book', lang: 'en', price: 'free', url: 'https://d2l.ai' },
      { id: 'p3-s8', name: 'MIT — Intro to Deep Learning', type: 'video', lang: 'en', price: 'free', url: 'http://introtodeeplearning.com' },
      { id: 'p3-s9', name: 'Deep Learning — UC Berkeley', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLZSO_6-bSqHQHBCoGaObUljoXAyyqhpFW' },
      { id: 'p3-extra-3', name: 'Deep Learning for Coders — fast.ai (book)', type: 'book', lang: 'en', price: 'free', url: 'https://course.fast.ai' },
    ],
    tasks: [
      { id: 'p3-task1', type: 'build', textAr: 'ابني CNN لتصنيف الصور على CIFAR-10', link: 'https://www.cs.toronto.edu/~kriz/cifar.html' },
      { id: 'p3-task2', type: 'build', textAr: 'ابني Neural Network من الصفر بـ NumPy (بدون PyTorch)' },
      { id: 'p3-task3', type: 'build', textAr: 'صنّف MNIST Dataset بـ PyTorch ووصل لـ 99% accuracy', link: 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html' },
      { id: 'p3-task4', type: 'build', textAr: 'طبق Transfer Learning بـ ResNet على custom dataset', link: 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html' },
      { id: 'p3-task5', type: 'read', textAr: 'اقرأ ورقة بحثية — Attention is All You Need', link: 'https://arxiv.org/abs/1706.03762' },
      { id: 'p3-task6', type: 'deploy', textAr: 'نشر الموديل على Hugging Face Spaces', link: 'https://huggingface.co/spaces' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 4 ══ */
  {
    id: 'phase-4',
    number: 4,
    emoji: '👁️',
    nameAr: 'Computer Vision',
    nameEn: 'Computer Vision',
    color: '#F472B6',
    duration: '6-8 أسابيع',
    topicGroups: [
      {
        id: 'p4-g1',
        nameAr: 'OpenCV والأساسيات',
        nameEn: 'OpenCV & Basics',
        topics: [
          { id: 'p4-g1-t1', nameAr: 'Image Read, Write, Display', nameEn: 'Image I/O', essential: true },
          { id: 'p4-g1-t2', nameAr: 'Color Spaces (BGR, RGB, HSV)', nameEn: 'Color Spaces', essential: true },
          { id: 'p4-g1-t3', nameAr: 'Filters, Edge Detection (Canny, Sobel)', nameEn: 'Filters & Edge Detection', essential: true },
          { id: 'p4-g1-t4', nameAr: 'Video Processing Frame by Frame', nameEn: 'Video Processing', essential: true },
        ],
      },
      {
        id: 'p4-g2',
        nameAr: 'Modern CV Models',
        nameEn: 'Modern CV Models',
        topics: [
          { id: 'p4-g2-t1', nameAr: 'YOLO — Object Detection (v8/v11)', nameEn: 'YOLO', essential: true },
          { id: 'p4-g2-t2', nameAr: 'SAM — Segment Anything Model', nameEn: 'SAM', essential: true },
          { id: 'p4-g2-t3', nameAr: 'CLIP — Image + Text Understanding', nameEn: 'CLIP', essential: true },
          { id: 'p4-g2-t4', nameAr: 'Vision Transformers (ViT)', nameEn: 'ViT', essential: true },
          { id: 'p4-g2-t5', nameAr: 'Transfer Learning للـ CV', nameEn: 'CV Transfer Learning', essential: true },
        ],
      },
      {
        id: 'p4-g3',
        nameAr: 'Generative Image AI',
        nameEn: 'Generative Image AI',
        topics: [
          { id: 'p4-g3-t1', nameAr: 'Diffusion Models — كيف تشتغل', nameEn: 'Diffusion Models', essential: true },
          { id: 'p4-g3-t2', nameAr: 'Stable Diffusion / ComfyUI', nameEn: 'Stable Diffusion', essential: true },
          { id: 'p4-g3-t3', nameAr: 'ControlNet & Image-to-Image', nameEn: 'ControlNet', essential: false },
          { id: 'p4-g3-t4', nameAr: 'Image Generation APIs (DALL-E)', nameEn: 'Image Gen APIs', essential: false },
        ],
      },
    ],
    resources: [
      { id: 'p4-s1', groupId: 'p4-g1', name: 'PyImageSearch — OpenCV Tutorials', type: 'article', lang: 'en', price: 'free', url: 'https://pyimagesearch.com' },
      { id: 'p4-s2', groupId: 'p4-g1', name: 'OpenCV Official Docs', type: 'article', lang: 'en', price: 'free', url: 'https://docs.opencv.org/4.x/d9/df8/tutorial_root.html' },
      { id: 'p4-s3', groupId: 'p4-g2', name: 'Ultralytics YOLO Docs', type: 'article', lang: 'en', price: 'free', url: 'https://docs.ultralytics.com' },
      { id: 'p4-s4', groupId: 'p4-g2', name: 'HuggingFace — Computer Vision Course', type: 'video', lang: 'en', price: 'free', url: 'https://huggingface.co/learn/computer-vision-course' },
      { id: 'p4-s5', groupId: 'p4-g2', name: 'Roboflow — CV Tutorials & Projects', type: 'article', lang: 'en', price: 'free', url: 'https://roboflow.com/learn' },
      { id: 'p4-s6', name: 'fast.ai — CV Part', type: 'video', lang: 'en', price: 'free', url: 'https://course.fast.ai' },
      { id: 'p4-s7', name: 'Programming Computer Vision — Jan Solem', type: 'book', lang: 'en', price: 'free', url: 'http://programmingcomputervision.com' },
      { id: 'p4-s8', name: 'Practical Deep Learning for CV — O\'Reilly', type: 'book', lang: 'en', price: 'paid', url: 'https://www.oreilly.com/library/view/practical-deep-learning/9781492034858/' },
      { id: 'p4-s9', name: 'Deep Learning for CV — Michigan', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PL5-TkQAfAZFbzxjBHtzdVCWE0Zbhomg7r' },
      { id: 'p4-s10', groupId: 'p4-g2', name: 'Modern CV — UC Berkeley CS198', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/playlist?list=PLzWRmD0Vi2KVsrCqA4VnztE4t71KnTnP5' },
    ],
    tasks: [
      { id: 'p4-task1', type: 'build', textAr: 'اعمل Real-time Face Detection بـ OpenCV' },
      { id: 'p4-task2', type: 'build', textAr: 'شغّل YOLO على فيديو من اختيارك', link: 'https://docs.ultralytics.com' },
      { id: 'p4-task3', type: 'build', textAr: 'ابني Image Classifier بـ CLIP', link: 'https://github.com/openai/CLIP' },
      { id: 'p4-task4', type: 'build', textAr: 'اعمل Style Transfer app بـ Stable Diffusion', link: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui' },
      { id: 'p4-task5', type: 'deploy', textAr: 'شارك في Kaggle CV Competition', link: 'https://www.kaggle.com/competitions?hostSegment=featured' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 5 ══ */
  {
    id: 'phase-5',
    number: 5,
    emoji: '🔗',
    nameAr: 'AI Engineer Layer — LLMs & Multimodal',
    nameEn: 'NLP & LLMs',
    color: '#34D399',
    duration: '6-8 أسابيع',
    topicGroups: [
      {
        id: 'p5-g1',
        nameAr: 'HuggingFace Ecosystem',
        nameEn: 'HuggingFace',
        topics: [
          { id: 'p5-g1-t1', nameAr: 'Models Hub & Pipelines', nameEn: 'Models Hub', essential: true },
          { id: 'p5-g1-t2', nameAr: 'Transformers Library', nameEn: 'Transformers Library', essential: true },
          { id: 'p5-g1-t3', nameAr: 'Tokenizers & Feature Extractors', nameEn: 'Tokenizers', essential: true },
          { id: 'p5-g1-t4', nameAr: 'HuggingFace Spaces (نشر Projects)', nameEn: 'HF Spaces', essential: true },
          { id: 'p5-g1-t5', nameAr: 'Fine-tuning Pre-trained Models', nameEn: 'Fine-tuning', essential: true },
        ],
      },
      {
        id: 'p5-g2',
        nameAr: 'الشغل على LLMs',
        nameEn: 'Working with LLMs',
        topics: [
          { id: 'p5-g2-t1', nameAr: 'OpenAI API (Chat, Embeddings, Function Calling)', nameEn: 'OpenAI API', essential: true },
          { id: 'p5-g2-t2', nameAr: 'Prompt Engineering (أساسيات)', nameEn: 'Prompt Engineering', essential: true },
          { id: 'p5-g2-t3', nameAr: 'Fine-tuning LLMs (LoRA, QLoRA)', nameEn: 'Fine-tuning LLMs', essential: true },
          { id: 'p5-g2-t4', nameAr: 'RLHF والـ Alignment', nameEn: 'RLHF & Alignment', essential: false },
        ],
      },
      {
        id: 'p5-g3',
        nameAr: 'Embeddings & Vector Search',
        nameEn: 'Embeddings & Search',
        topics: [
          { id: 'p5-g3-t1', nameAr: 'ما هي الـ Embeddings وكيف تشتغل', nameEn: 'Embeddings Basics', essential: true },
          { id: 'p5-g3-t2', nameAr: 'Semantic Image Search', nameEn: 'Semantic Search', essential: true },
          { id: 'p5-g3-t3', nameAr: 'FAISS / ChromaDB', nameEn: 'Vector DBs', essential: true },
          { id: 'p5-g3-t4', nameAr: 'RAG — Retrieval Augmented Generation', nameEn: 'RAG', essential: true },
        ],
      },
    ],
    resources: [
      { id: 'p5-s1', groupId: 'p5-g1', name: 'HuggingFace — Transformers Course', type: 'video', lang: 'en', price: 'free', url: 'https://huggingface.co/learn/nlp-course' },
      { id: 'p5-s2', groupId: 'p5-g1', name: 'HuggingFace — Computer Vision Course', type: 'video', lang: 'en', price: 'free', url: 'https://huggingface.co/learn/computer-vision-course' },
      { id: 'p5-s3', groupId: 'p5-g2', name: 'OpenAI API Docs', type: 'article', lang: 'en', price: 'free', url: 'https://platform.openai.com/docs' },
      { id: 'p5-s4', groupId: 'p5-g2', name: 'Andrej Karpathy — YouTube Channel', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/@AndrejKarpathy' },
      { id: 'p5-s5', groupId: 'p5-g3', name: 'LangChain Docs', type: 'article', lang: 'en', price: 'free', url: 'https://python.langchain.com/docs' },
      { id: 'p5-s7', groupId: 'p5-g2', name: 'LLM Bootcamp — Full Stack Deep Learning', type: 'video', lang: 'en', price: 'free', url: 'https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/' },
      { id: 'p5-s8', name: 'Moataz Elmesmary — DS Roadmap Resources', type: 'article', lang: 'ar', price: 'free', url: 'https://github.com/Moataz-Elmesmary/Data-Science-Roadmap' },
      { id: 'p5-s9', name: 'Speech & Language Processing — Jurafsky', type: 'book', lang: 'en', price: 'free', url: 'https://web.stanford.edu/~jurafsky/slp3/' },
      { id: 'p5-s10', groupId: 'p5-g1', name: 'The Illustrated Transformer — Jay Alammar', type: 'article', lang: 'en', price: 'free', url: 'https://jalammar.github.io/illustrated-transformer/' },
      { id: 'p5-s11', name: 'roadmap.sh — AI Engineer', type: 'article', lang: 'en', price: 'free', url: 'https://roadmap.sh/ai-engineer' },
    ],
    tasks: [
      { id: 'p5-task1', type: 'build', textAr: 'ابني Image Search Engine بـ CLIP + FAISS' },
      { id: 'p5-task2', type: 'build', textAr: 'اعمل Multimodal Chatbot بـ GPT-4V API', link: 'https://platform.openai.com/docs/guides/vision' },
      { id: 'p5-task3', type: 'build', textAr: 'Fine-tune HuggingFace model على Custom Data', link: 'https://huggingface.co/docs/transformers/training' },
      { id: 'p5-task4', type: 'deploy', textAr: 'انشر Model على HuggingFace Spaces', link: 'https://huggingface.co/spaces' },
      { id: 'p5-task5', type: 'build', textAr: 'ابني RAG system على PDF files بـ ChromaDB', link: 'https://docs.trychroma.com' },
      { id: 'p5-task6', type: 'build', textAr: 'استخدم OpenAI API عشان تبني chatbot بسيط', link: 'https://platform.openai.com/docs/guides/text-generation' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 6 ══ */
  {
    id: 'phase-6',
    number: 6,
    emoji: '⚙️',
    nameAr: 'MLOps والـ Deployment',
    nameEn: 'MLOps & Deployment',
    color: '#FBBF24',
    duration: '4-6 أسابيع',
    topicGroups: [
      {
        id: 'p6-g1',
        nameAr: 'بناء وتشغيل التطبيقات',
        nameEn: 'Building Apps',
        topics: [
          { id: 'p6-g1-t1', nameAr: 'Gradio — أسرع AI App', nameEn: 'Gradio', essential: true },
          { id: 'p6-g1-t2', nameAr: 'Streamlit — Data Apps', nameEn: 'Streamlit', essential: true },
          { id: 'p6-g1-t3', nameAr: 'FastAPI للـ Backend & REST API', nameEn: 'FastAPI', essential: true },
          { id: 'p6-g1-t4', nameAr: 'Docker & Containers', nameEn: 'Docker', essential: true },
          { id: 'p6-g1-t5', nameAr: 'Kubernetes (أساسيات)', nameEn: 'Kubernetes Basics', essential: false },
        ],
      },
      {
        id: 'p6-g2',
        nameAr: 'Cloud Platforms',
        nameEn: 'Cloud Platforms',
        topics: [
          { id: 'p6-g2-t1', nameAr: 'HuggingFace Spaces (Deploy مجاناً)', nameEn: 'HF Spaces', essential: true },
          { id: 'p6-g2-t2', nameAr: 'AWS SageMaker (أساسيات)', nameEn: 'AWS SageMaker', essential: false },
          { id: 'p6-g2-t3', nameAr: 'Railway / Fly.io للـ Deploy', nameEn: 'Railway/Fly.io', essential: true },
        ],
      },
      {
        id: 'p6-g3',
        nameAr: 'دورة حياة الـ ML',
        nameEn: 'ML Lifecycle',
        topics: [
          { id: 'p6-g3-t1', nameAr: 'MLflow — تتبع التجارب والموديلات', nameEn: 'MLflow', essential: true },
          { id: 'p6-g3-t2', nameAr: 'CI/CD لـ ML Pipelines (GitHub Actions)', nameEn: 'CI/CD for ML', essential: true },
          { id: 'p6-g3-t3', nameAr: 'Model Versioning & Experiment Tracking', nameEn: 'Model Versioning', essential: true },
        ],
      },
    ],
    resources: [
      { id: 'p6-s1', groupId: 'p6-g1', name: 'Gradio Docs', type: 'article', lang: 'en', price: 'free', url: 'https://www.gradio.app/guides' },
      { id: 'p6-s2', groupId: 'p6-g1', name: 'FastAPI Docs', type: 'article', lang: 'en', price: 'free', url: 'https://fastapi.tiangolo.com' },
      { id: 'p6-s3', groupId: 'p6-g1', name: 'Streamlit Docs', type: 'article', lang: 'en', price: 'free', url: 'https://docs.streamlit.io' },
      { id: 'p6-s4', groupId: 'p6-g2', name: 'HuggingFace Spaces Guide', type: 'article', lang: 'en', price: 'free', url: 'https://huggingface.co/docs/hub/spaces' },
      { id: 'p6-s5', groupId: 'p6-g1', name: 'TechWithTim — FastAPI + Docker', type: 'video', lang: 'en', price: 'free', url: 'https://www.youtube.com/@TechWithTim' },
      { id: 'p6-s6', groupId: 'p6-g1', name: 'Docker Official Docs — Get Started', type: 'article', lang: 'en', price: 'free', url: 'https://docs.docker.com/get-started/' },
      { id: 'p6-s7', groupId: 'p6-g3', name: 'MLflow Docs', type: 'article', lang: 'en', price: 'free', url: 'https://mlflow.org/docs/latest/index.html' },
      { id: 'p6-s8', name: 'MLOps Zoomcamp — DataTalks.Club', type: 'video', lang: 'en', price: 'free', url: 'https://github.com/DataTalksClub/mlops-zoomcamp' },
      { id: 'p6-s9', groupId: 'p6-g1', name: 'FastAPI بالعربي — Codezilla', type: 'video', lang: 'ar', price: 'free', url: 'https://www.youtube.com/@Codezilla' },
      { id: 'p6-s10', groupId: 'p6-g3', name: 'Designing Machine Learning Systems — Chip Huyen', type: 'book', lang: 'en', price: 'paid', url: 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/' },
    ],
    tasks: [
      { id: 'p6-task1', type: 'build', textAr: 'ابني AI App كاملة بـ Gradio وانشرها', link: 'https://www.gradio.app' },
      { id: 'p6-task2', type: 'build', textAr: 'ابني ML API بـ FastAPI وـ Docker' },
      { id: 'p6-task3', type: 'deploy', textAr: 'انشر الـ API على Railway أو Fly.io', link: 'https://railway.app' },
      { id: 'p6-task4', type: 'build', textAr: 'اعمل MLflow Tracking لـ experiments', link: 'https://mlflow.org/docs/latest/quickstart.html' },
      { id: 'p6-task5', type: 'read', textAr: 'اكتب README احترافي لكل Project', link: 'https://github.com/othneildrew/Best-README-Template' },
    ],
  },

  /* ═══════════════════════════════════════════ PHASE 7 ══ */
  {
    id: 'phase-7',
    number: 7,
    emoji: '🎯',
    nameAr: 'Projects والـ Career',
    nameEn: 'Real-world Projects & Career',
    color: '#F87171',
    duration: '4-6 أسابيع',
    topicGroups: [
      {
        id: 'p7-g1',
        nameAr: 'مشاريع Portfolio',
        nameEn: 'Portfolio Projects',
        topics: [
          { id: 'p7-g1-t1', nameAr: 'مشروع ML كامل (End-to-End)', nameEn: 'Full ML Project', essential: true },
          { id: 'p7-g1-t2', nameAr: 'تطبيق CV (Object Detection / Segmentation)', nameEn: 'CV Application', essential: true },
          { id: 'p7-g1-t3', nameAr: 'تطبيق LLM-powered (Chatbot/Assistant)', nameEn: 'LLM App', essential: true },
          { id: 'p7-g1-t4', nameAr: 'Kaggle Competition (Top 20%)', nameEn: 'Kaggle Competition', essential: false },
        ],
      },
      {
        id: 'p7-g2',
        nameAr: 'Open Source والـ Research',
        nameEn: 'Open Source & Research',
        topics: [
          { id: 'p7-g2-t1', nameAr: 'GitHub Portfolio مرتب ومكتمل', nameEn: 'GitHub Portfolio', essential: true },
          { id: 'p7-g2-t2', nameAr: 'قراءة وتلخيص 5 أوراق بحثية', nameEn: 'Research Papers', essential: false },
          { id: 'p7-g2-t3', nameAr: 'المساهمة في HuggingFace أو مكتبة مشهورة', nameEn: 'Open Source', essential: false },
        ],
      },
      {
        id: 'p7-g3',
        nameAr: 'الاستعداد للـ Career',
        nameEn: 'Career Preparation',
        topics: [
          { id: 'p7-g3-t1', nameAr: 'أسئلة ML Interviews التقنية', nameEn: 'ML Interview Questions', essential: true },
          { id: 'p7-g3-t2', nameAr: 'System Design for AI Systems', nameEn: 'AI System Design', essential: true },
          { id: 'p7-g3-t3', nameAr: 'LinkedIn وـ Resume للـ AI Engineer', nameEn: 'LinkedIn & Resume', essential: true },
          { id: 'p7-g3-t4', nameAr: 'Networking في الـ AI Community', nameEn: 'Networking', essential: false },
        ],
      },
    ],
    resources: [
      { id: 'p7-r1', groupId: 'p7-g3', name: 'ML Interview Guide — Chip Huyen', type: 'book', lang: 'en', price: 'free', url: 'https://huyenchip.com/ml-interviews-book/' },
      { id: 'p7-r2', groupId: 'p7-g3', name: 'System Design Interview for AI', type: 'video', lang: 'en', price: 'paid', url: 'https://www.educative.io/courses/grokking-the-machine-learning-interview' },
      { id: 'p7-r3', groupId: 'p7-g1', name: 'How to Build an ML Portfolio — TDS', type: 'article', lang: 'en', price: 'free', url: 'https://towardsdatascience.com/how-to-build-a-data-science-portfolio-5f566517c79c' },
      { id: 'p7-r4', groupId: 'p7-g3', name: 'LeetCode — ML & Coding Interview', type: 'article', lang: 'en', price: 'free', url: 'https://leetcode.com' },
      { id: 'p7-r5', name: 'roadmap.sh — AI Engineer', type: 'article', lang: 'en', price: 'free', url: 'https://roadmap.sh/ai-engineer' },
    ],
    tasks: [
      { id: 'p7-task1', type: 'build', textAr: 'اعمل مشروع Capstone يجمع كل المراحل' },
      { id: 'p7-task2', type: 'build', textAr: 'حضّر LinkedIn profile وـ Resume احترافي', link: 'https://www.linkedin.com' },
      { id: 'p7-task3', type: 'read', textAr: 'راجع أهم 50 سؤال ML Interview', link: 'https://huyenchip.com/ml-interviews-book/' },
      { id: 'p7-task4', type: 'deploy', textAr: 'انشر Portfolio website على Vercel أو GitHub Pages', link: 'https://vercel.com' },
      { id: 'p7-task5', type: 'build', textAr: 'ابعت apply على 5 وظايف AI وسجل الـ Feedback', link: 'https://www.linkedin.com/jobs/search/?keywords=AI+Engineer' },
    ],
  },
];

export const TOTAL_TOPICS = phases.reduce(
  (acc, phase) => acc + phase.topicGroups.reduce((a, g) => a + g.topics.length, 0),
  0
);

export const DEFAULT_CHECKED: Record<string, boolean> = {
  'p1-g1-t1': true,
  'p1-g1-t2': true,
  'p1-g1-t3': true,
  'p1-g1-t4': true,
};
