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
      { id: 'p1-r1', name: 'Python for Everybody — Dr. Chuck (Coursera)', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p1-r2', name: 'Python بالعربي — أكاديمية حسوب', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p1-r3', name: 'Mathematics for Machine Learning (Deisenroth)', type: 'book', lang: 'en', price: 'free', url: '#' },
      { id: 'p1-r4', name: 'Numpy & Pandas — Kaggle Learn', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p1-task1', type: 'build', textAr: 'ابني data analysis project بـ Pandas على dataset من Kaggle', link: 'https://kaggle.com' },
      { id: 'p1-task2', type: 'read', textAr: 'اقرأ Chapter 2 من Mathematics for Machine Learning' },
      { id: 'p1-task3', type: 'build', textAr: 'حل 20 مسألة على NumPy و Linear Algebra' },
      { id: 'p1-task4', type: 'deploy', textAr: 'ارفع الـ projects على GitHub بـ README واضح' },
    ],
  },
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
          { id: 'p2-g1-t6', nameAr: 'Naive Bayes', nameEn: 'Naive Bayes', essential: false },
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
          { id: 'p2-g2-t4', nameAr: 'Autoencoders (مقدمة)', nameEn: 'Autoencoders Intro', essential: false },
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
        ],
      },
    ],
    resources: [
      { id: 'p2-r1', name: 'StatQuest with Josh Starmer — YouTube', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p2-r2', name: 'Hands-On Machine Learning (Aurélien Géron)', type: 'book', lang: 'en', price: 'paid', url: '#' },
      { id: 'p2-r3', name: 'ML بالعربي — قناة Arabic Competitive Programming', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p2-r4', name: 'Machine Learning Mastery Blog', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p2-task1', type: 'build', textAr: 'ابني classification model على Titanic dataset', link: 'https://kaggle.com' },
      { id: 'p2-task2', type: 'build', textAr: 'قارن بين 3 algorithms مختلفة على نفس dataset' },
      { id: 'p2-task3', type: 'read', textAr: 'افهم كل metric واتى بتستخدمها فين' },
      { id: 'p2-task4', type: 'deploy', textAr: 'ارفع التحليل الكامل على Kaggle Notebook' },
      { id: 'p2-task5', type: 'build', textAr: 'شارك في أول Kaggle Competition' },
    ],
  },
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
          { id: 'p3-g3-t3', nameAr: 'Seq2Seq Models', nameEn: 'Seq2Seq', essential: false },
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
      { id: 'p3-r1', name: 'fast.ai Practical Deep Learning', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p3-r2', name: 'Deep Learning (Goodfellow, Bengio, Courville)', type: 'book', lang: 'en', price: 'free', url: '#' },
      { id: 'p3-r3', name: 'Deep Learning بالعربي — قناة Hesham Asem', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p3-r4', name: 'PyTorch Official Tutorials', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p3-task1', type: 'build', textAr: 'ابني CNN لتصنيف الصور على CIFAR-10' },
      { id: 'p3-task2', type: 'build', textAr: 'طبق Transfer Learning بـ ResNet على custom dataset' },
      { id: 'p3-task3', type: 'read', textAr: 'اقرأ ورقة بحثية — Attention is All You Need' },
      { id: 'p3-task4', type: 'deploy', textAr: 'نشر الموديل على Hugging Face Spaces', link: 'https://huggingface.co/spaces' },
      { id: 'p3-task5', type: 'build', textAr: 'ابني LSTM لـ sentiment analysis' },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    emoji: '💬',
    nameAr: 'NLP والـ LLMs',
    nameEn: 'NLP & Large Language Models',
    color: '#34D399',
    duration: '6-8 أسابيع',
    topicGroups: [
      {
        id: 'p4-g1',
        nameAr: 'أساسيات NLP',
        nameEn: 'NLP Basics',
        topics: [
          { id: 'p4-g1-t1', nameAr: 'Text Preprocessing (Tokenization, Stemming)', nameEn: 'Text Preprocessing', essential: true },
          { id: 'p4-g1-t2', nameAr: 'Word Embeddings (Word2Vec, GloVe)', nameEn: 'Word Embeddings', essential: true },
          { id: 'p4-g1-t3', nameAr: 'Bag of Words & TF-IDF', nameEn: 'BoW & TF-IDF', essential: true },
          { id: 'p4-g1-t4', nameAr: 'Named Entity Recognition (NER)', nameEn: 'NER', essential: false },
        ],
      },
      {
        id: 'p4-g2',
        nameAr: 'الـ Transformers',
        nameEn: 'Transformers',
        topics: [
          { id: 'p4-g2-t1', nameAr: 'Attention Mechanism', nameEn: 'Attention Mechanism', essential: true },
          { id: 'p4-g2-t2', nameAr: 'Self-Attention & Multi-Head Attention', nameEn: 'Multi-Head Attention', essential: true },
          { id: 'p4-g2-t3', nameAr: 'Positional Encoding', nameEn: 'Positional Encoding', essential: true },
          { id: 'p4-g2-t4', nameAr: 'BERT وتطبيقاته', nameEn: 'BERT', essential: true },
          { id: 'p4-g2-t5', nameAr: 'GPT Architecture وكيف يعمل', nameEn: 'GPT Architecture', essential: true },
        ],
      },
      {
        id: 'p4-g3',
        nameAr: 'الشغل على LLMs',
        nameEn: 'Working with LLMs',
        topics: [
          { id: 'p4-g3-t1', nameAr: 'OpenAI API (Chat, Embeddings, Function Calling)', nameEn: 'OpenAI API', essential: true },
          { id: 'p4-g3-t2', nameAr: 'Hugging Face Transformers Library', nameEn: 'HuggingFace Transformers', essential: true },
          { id: 'p4-g3-t3', nameAr: 'Prompt Engineering (أساسيات)', nameEn: 'Prompt Engineering Basics', essential: true },
          { id: 'p4-g3-t4', nameAr: 'Fine-tuning LLMs (LoRA, QLoRA)', nameEn: 'Fine-tuning LLMs', essential: true },
          { id: 'p4-g3-t5', nameAr: 'RLHF والـ Alignment', nameEn: 'RLHF & Alignment', essential: false },
        ],
      },
    ],
    resources: [
      { id: 'p4-r1', name: 'NLP with Transformers — Hugging Face Course', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p4-r2', name: 'Speech & Language Processing (Jurafsky)', type: 'book', lang: 'en', price: 'free', url: '#' },
      { id: 'p4-r3', name: 'NLP بالعربي — Arabic NLP Community', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p4-r4', name: 'The Illustrated Transformer — Jay Alammar', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p4-task1', type: 'build', textAr: 'ابني sentiment analysis classifier بـ BERT' },
      { id: 'p4-task2', type: 'build', textAr: 'استخدم OpenAI API عشان تبني chatbot بسيط' },
      { id: 'p4-task3', type: 'build', textAr: 'Fine-tune نموذج على Arabic text بـ LoRA' },
      { id: 'p4-task4', type: 'read', textAr: 'اقرأ ورقتين بحثيتين — BERT و GPT-3' },
      { id: 'p4-task5', type: 'deploy', textAr: 'انشر chatbot على Hugging Face Spaces', link: 'https://huggingface.co' },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    emoji: '⚙️',
    nameAr: 'MLOps والـ Deployment',
    nameEn: 'MLOps & Deployment',
    color: '#F472B6',
    duration: '4-6 أسابيع',
    topicGroups: [
      {
        id: 'p5-g1',
        nameAr: 'APIs والـ Deployment',
        nameEn: 'APIs & Deployment',
        topics: [
          { id: 'p5-g1-t1', nameAr: 'FastAPI — بناء REST APIs', nameEn: 'FastAPI', essential: true },
          { id: 'p5-g1-t2', nameAr: 'Docker & Containers', nameEn: 'Docker', essential: true },
          { id: 'p5-g1-t3', nameAr: 'Streamlit & Gradio للـ Demo', nameEn: 'Streamlit & Gradio', essential: true },
          { id: 'p5-g1-t4', nameAr: 'Kubernetes (أساسيات)', nameEn: 'Kubernetes Basics', essential: false },
          { id: 'p5-g1-t5', nameAr: 'NGINX & Load Balancing', nameEn: 'NGINX Basics', essential: false },
        ],
      },
      {
        id: 'p5-g2',
        nameAr: 'Cloud Platforms',
        nameEn: 'Cloud Platforms',
        topics: [
          { id: 'p5-g2-t1', nameAr: 'AWS SageMaker (تدريب ونشر الموديلات)', nameEn: 'AWS SageMaker', essential: true },
          { id: 'p5-g2-t2', nameAr: 'Google Cloud AI Platform', nameEn: 'Google Cloud AI', essential: false },
          { id: 'p5-g2-t3', nameAr: 'Azure Machine Learning', nameEn: 'Azure ML', essential: false },
          { id: 'p5-g2-t4', nameAr: 'Serverless Functions (Lambda)', nameEn: 'Serverless Functions', essential: false },
        ],
      },
      {
        id: 'p5-g3',
        nameAr: 'دورة حياة الـ ML',
        nameEn: 'ML Lifecycle',
        topics: [
          { id: 'p5-g3-t1', nameAr: 'MLflow — تتبع التجارب والموديلات', nameEn: 'MLflow', essential: true },
          { id: 'p5-g3-t2', nameAr: 'DVC — إدارة البيانات والكود', nameEn: 'DVC', essential: false },
          { id: 'p5-g3-t3', nameAr: 'CI/CD لـ ML Pipelines', nameEn: 'CI/CD for ML', essential: true },
          { id: 'p5-g3-t4', nameAr: 'Monitoring & Data Drift Detection', nameEn: 'Model Monitoring', essential: true },
        ],
      },
    ],
    resources: [
      { id: 'p5-r1', name: 'MLOps Zoomcamp — DataTalks.Club', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p5-r2', name: 'Designing Machine Learning Systems (Huyen)', type: 'book', lang: 'en', price: 'paid', url: '#' },
      { id: 'p5-r3', name: 'FastAPI بالعربي — Codezilla', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p5-r4', name: 'Docker Curriculum — Docker Docs', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p5-task1', type: 'build', textAr: 'ابني ML API بـ FastAPI وـ Docker' },
      { id: 'p5-task2', type: 'deploy', textAr: 'انشر الـ API على AWS أو Railway', link: 'https://railway.app' },
      { id: 'p5-task3', type: 'build', textAr: 'اعمل MLflow Tracking لـ experiments' },
      { id: 'p5-task4', type: 'read', textAr: 'ادرس Designing ML Systems Chapter 7' },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    emoji: '🚀',
    nameAr: 'Advanced AI — RAG & Agents',
    nameEn: 'Advanced AI',
    color: '#FBBF24',
    duration: '4-6 أسابيع',
    topicGroups: [
      {
        id: 'p6-g1',
        nameAr: 'RAG Systems',
        nameEn: 'RAG Systems',
        topics: [
          { id: 'p6-g1-t1', nameAr: 'Vector Databases (Pinecone, ChromaDB, Qdrant)', nameEn: 'Vector Databases', essential: true },
          { id: 'p6-g1-t2', nameAr: 'Text Embeddings وـ Similarity Search', nameEn: 'Text Embeddings', essential: true },
          { id: 'p6-g1-t3', nameAr: 'Retrieval Strategies (Dense, Sparse, Hybrid)', nameEn: 'Retrieval Strategies', essential: true },
          { id: 'p6-g1-t4', nameAr: 'RAG Pipeline Design وـ Evaluation', nameEn: 'RAG Pipeline', essential: true },
        ],
      },
      {
        id: 'p6-g2',
        nameAr: 'AI Agents',
        nameEn: 'AI Agents',
        topics: [
          { id: 'p6-g2-t1', nameAr: 'LangChain Framework', nameEn: 'LangChain', essential: true },
          { id: 'p6-g2-t2', nameAr: 'ReAct Pattern (Reasoning + Acting)', nameEn: 'ReAct Pattern', essential: true },
          { id: 'p6-g2-t3', nameAr: 'Tool Use & Function Calling', nameEn: 'Tool Use', essential: true },
          { id: 'p6-g2-t4', nameAr: 'Multi-Agent Systems (CrewAI, AutoGen)', nameEn: 'Multi-Agent Systems', essential: false },
          { id: 'p6-g2-t5', nameAr: 'LlamaIndex وـ Knowledge Graphs', nameEn: 'LlamaIndex', essential: false },
        ],
      },
      {
        id: 'p6-g3',
        nameAr: 'تقنيات متقدمة',
        nameEn: 'Advanced Techniques',
        topics: [
          { id: 'p6-g3-t1', nameAr: 'Chain-of-Thought Prompting', nameEn: 'Chain-of-Thought', essential: true },
          { id: 'p6-g3-t2', nameAr: 'Few-shot & Zero-shot Learning', nameEn: 'Few/Zero-shot', essential: true },
          { id: 'p6-g3-t3', nameAr: 'Evaluation Frameworks (RAGAS, DeepEval)', nameEn: 'LLM Evaluation', essential: true },
          { id: 'p6-g3-t4', nameAr: 'Constitutional AI وـ Guardrails', nameEn: 'AI Safety & Guardrails', essential: false },
        ],
      },
    ],
    resources: [
      { id: 'p6-r1', name: 'LangChain Official Course — DeepLearning.AI', type: 'video', lang: 'en', price: 'free', url: '#' },
      { id: 'p6-r2', name: 'Building LLM Applications — Chip Huyen', type: 'book', lang: 'en', price: 'free', url: '#' },
      { id: 'p6-r3', name: 'RAG بالعربي — AI بالعربي Channel', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p6-r4', name: 'Pinecone Learning Center', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p6-task1', type: 'build', textAr: 'ابني RAG system على PDF files بـ ChromaDB' },
      { id: 'p6-task2', type: 'build', textAr: 'ابني AI agent بـ LangChain يستخدم 3 tools على الأقل' },
      { id: 'p6-task3', type: 'build', textAr: 'قيّم الـ RAG system بـ RAGAS Framework' },
      { id: 'p6-task4', type: 'deploy', textAr: 'انشر الـ RAG App على Cloud مع واجهة Streamlit', link: '#' },
    ],
  },
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
          { id: 'p7-g1-t2', nameAr: 'تطبيق NLP أو CV', nameEn: 'NLP/CV Application', essential: true },
          { id: 'p7-g1-t3', nameAr: 'تطبيق LLM-powered (Chatbot/Assistant)', nameEn: 'LLM App', essential: true },
          { id: 'p7-g1-t4', nameAr: 'Kaggle Competition (Top 20%)', nameEn: 'Kaggle Competition', essential: false },
        ],
      },
      {
        id: 'p7-g2',
        nameAr: 'Open Source والـ Research',
        nameEn: 'Open Source & Research',
        topics: [
          { id: 'p7-g2-t1', nameAr: 'المساهمة في HuggingFace أو مكتبة مشهورة', nameEn: 'Open Source Contribution', essential: false },
          { id: 'p7-g2-t2', nameAr: 'GitHub Portfolio مرتب ومكتمل', nameEn: 'GitHub Portfolio', essential: true },
          { id: 'p7-g2-t3', nameAr: 'قراءة وتلخيص 5 أوراق بحثية', nameEn: 'Research Papers', essential: false },
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
          { id: 'p7-g3-t4', nameAr: 'Network بالـ AI Community', nameEn: 'Networking', essential: false },
          { id: 'p7-g3-t5', nameAr: 'Salary Negotiation للـ AI roles', nameEn: 'Salary Negotiation', essential: false },
        ],
      },
    ],
    resources: [
      { id: 'p7-r1', name: 'ML Interview Guide — Chip Huyen', type: 'book', lang: 'en', price: 'free', url: '#' },
      { id: 'p7-r2', name: 'System Design Interview for AI', type: 'video', lang: 'en', price: 'paid', url: '#' },
      { id: 'p7-r3', name: 'Career في AI بالعربي — Podcast', type: 'video', lang: 'ar', price: 'free', url: '#' },
      { id: 'p7-r4', name: 'How to Build an ML Portfolio — Towards Data Science', type: 'article', lang: 'en', price: 'free', url: '#' },
    ],
    tasks: [
      { id: 'p7-task1', type: 'build', textAr: 'اعمل مشروع Capstone يجمع كل المراحل' },
      { id: 'p7-task2', type: 'build', textAr: 'حضّر LinkedIn profile وـ Resume احترافي' },
      { id: 'p7-task3', type: 'read', textAr: 'راجع أهم 50 سؤال ML Interview' },
      { id: 'p7-task4', type: 'deploy', textAr: 'انشر Portfolio website على Vercel أو GitHub Pages', link: 'https://vercel.com' },
      { id: 'p7-task5', type: 'build', textAr: 'ابعت apply على 5 وظايف AI وسجل الـ Feedback' },
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
