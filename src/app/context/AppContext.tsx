import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { db, auth } from '../../firebase';

export interface CustomResource {
  id: string;
  name: string;
  url: string;
  note: string;
}

export type TopicDetails = {
  startDate?: string;
  endDate?: string;
  note?: string;
};

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface AppContextType {
  isAuthenticated: boolean;
  username: string;
  email: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkedTopics: Record<string, boolean>;
  checkedTasks: Record<string, boolean>;
  toggleTopic: (id: string) => void;
  toggleTask: (id: string) => void;
  syncStatus: 'synced' | 'syncing' | 'error';
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activePhase: string | null;
  setActivePhase: (phase: string | null) => void;
  customResources: Record<string, CustomResource[]>;
  resourceOrder: Record<string, string[]>;
  addCustomResource: (phaseId: string, resource: { name: string; url: string; note: string }) => void;
  removeCustomResource: (phaseId: string, resourceId: string) => void;
  updateResourceOrder: (phaseId: string, newOrder: string[]) => void;
  resetResourceOrder: (phaseId: string) => void;
  topicDetails: Record<string, TopicDetails>;
  updateTopicDetails: (topicId: string, details: Partial<TopicDetails>) => void;
  dailyTasks: Record<string, DailyTask[]>;
  addDailyTask: (date: string, text: string, priority?: 'high' | 'medium' | 'low') => void;
  toggleDailyTask: (date: string, taskId: string) => void;
  deleteDailyTask: (date: string, taskId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
  'auth/user-not-found': 'لا يوجد حساب بهذا البريد',
  'auth/wrong-password': 'كلمة المرور غير صحيحة',
  'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/email-already-in-use': 'هذا البريد الإلكتروني مسجّل بالفعل',
  'auth/weak-password': 'كلمة المرور ضعيفة — على الأقل 6 أحرف',
  'auth/too-many-requests': 'محاولات كثيرة — حاول بعد قليل',
  'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
  'auth/missing-password': 'أدخل كلمة المرور',
  'auth/api-key-not-valid': 'مفتاح Firebase API غير صالح أو محجوب — تحقق من قيود المفتاح في Google Cloud (يجب السماح بـ localhost)',
  'auth/invalid-api-key': 'مفتاح Firebase API غير صالح أو محجوب — تحقق من قيود المفتاح في Google Cloud (يجب السماح بـ localhost)',
  'auth/unauthorized-domain': 'هذا النطاق غير مسموح به — أضفه في Firebase Auth → Authorized domains',
  'auth/operation-not-allowed': 'تسجيل الدخول بالبريد/كلمة المرور غير مفعّل — فعّله في Firebase → Authentication → Sign-in method',
  'auth/internal-error': 'خطأ داخلي في Firebase — حاول مرة أخرى',
};

function authError(code?: string): string {
  if (code) {
    console.error(`Firebase Auth error: ${code}`);
    if (code.startsWith('auth/requests-from-referer-') || code === 'auth/request-blocked') {
      return 'مفتاح Firebase API يحجب هذا النطاق — أضف localhost أو نطاقك في قيود المفتاح (Website restrictions) في Google Cloud';
    }
    return AUTH_ERRORS[code] || 'حدث خطأ في الاتصال';
  }
  return 'حدث خطأ في الاتصال';
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [username, setUsername]                  = useState('');
  const [email, setEmail]                        = useState('');
  const [checkedTopics, setCheckedTopics]        = useState<Record<string, boolean>>({});
  const [checkedTasks, setCheckedTasks]          = useState<Record<string, boolean>>({});
  const [customResources, setCustomResources]    = useState<Record<string, CustomResource[]>>({});
  const [resourceOrder, setResourceOrder]        = useState<Record<string, string[]>>({});
  const [topicDetails, setTopicDetails]          = useState<Record<string, TopicDetails>>({});
  const [dailyTasks, setDailyTasks]              = useState<Record<string, DailyTask[]>>({});
  const [syncStatus, setSyncStatus]              = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isSearchOpen, setIsSearchOpen]          = useState(false);
  const [activePhase, setActivePhase]            = useState<string | null>('phase-1');

  const unsubRef      = useRef<(() => void) | null>(null);
  const saveTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rTopics       = useRef<Record<string, boolean>>({});
  const rTasks        = useRef<Record<string, boolean>>({});
  const rCustom       = useRef<Record<string, CustomResource[]>>({});
  const rOrder        = useRef<Record<string, string[]>>({});
  const rTopicDetails = useRef<Record<string, TopicDetails>>({});
  const rDailyTasks   = useRef<Record<string, DailyTask[]>>({});

  useEffect(() => { rTopics.current = checkedTopics; }, [checkedTopics]);
  useEffect(() => { rTasks.current  = checkedTasks;  }, [checkedTasks]);
  useEffect(() => { rCustom.current = customResources; }, [customResources]);
  useEffect(() => { rOrder.current = resourceOrder; }, [resourceOrder]);
  useEffect(() => { rTopicDetails.current = topicDetails; }, [topicDetails]);
  useEffect(() => { rDailyTasks.current = dailyTasks; }, [dailyTasks]);

  const resetProgress = () => {
    setCheckedTopics({});
    setCheckedTasks({});
    setCustomResources({});
    setResourceOrder({});
    setTopicDetails({});
    setDailyTasks({});
  };

  /* ── Firestore listener (keyed by Auth UID) ── */
  const attachListener = useCallback((uid: string) => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    const ref = doc(db, 'progress', uid);
    unsubRef.current = onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          const d = snap.data() as any;
          setCheckedTopics(d.checked         || {});
          setCheckedTasks(d.tasks            || {});
          setCustomResources(d.customResources || {});
          setResourceOrder(d.resourceOrder || {});
          setTopicDetails(d.topicDetails || {});
          setDailyTasks(d.dailyTasks || {});
        }
        setSyncStatus('synced');
      },
      () => setSyncStatus('error')
    );
  }, []);

  /* ── Auth state observer (session persistence handled by Firebase) ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || user.email?.split('@')[0] || '');
        setEmail(user.email || '');
        attachListener(user.uid);
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setEmail('');
        if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
        resetProgress();
      }
    });
    return unsub;
  }, [attachListener]);

  /* ── Debounced save ── */
  const save = useCallback(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus('syncing');
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, 'progress', uid),
          {
            checked: rTopics.current,
            tasks: rTasks.current,
            customResources: rCustom.current,
            resourceOrder: rOrder.current,
            topicDetails: rTopicDetails.current,
            dailyTasks: rDailyTasks.current,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    }, 700);
  }, []);

  /* ── Login ── */
  const login = useCallback(async (enteredEmail: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, enteredEmail.trim(), password);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: authError(e?.code) };
    }
  }, []);

  /* ── Signup ── */
  const signup = useCallback(async (enteredEmail: string, password: string, displayName?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, enteredEmail.trim(), password);
      if (displayName && displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      await setDoc(
        doc(db, 'progress', cred.user.uid),
        {
          checked: {},
          tasks: {},
          customResources: {},
          resourceOrder: {},
          topicDetails: {},
          dailyTasks: {},
          createdAt: Date.now(),
        }
      );
      return { success: true };
    } catch (e: any) {
      return { success: false, error: authError(e?.code) };
    }
  }, []);

  /* ── Password reset (standard Firebase email flow) ── */
  const resetPassword = useCallback(async (enteredEmail: string) => {
    try {
      await sendPasswordResetEmail(auth, enteredEmail.trim());
      return { success: true };
    } catch (e: any) {
      return { success: false, error: authError(e?.code) };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  /* ── Toggles ── */
  const toggleTopic = useCallback((id: string) => {
    setCheckedTopics(prev => ({ ...prev, [id]: !prev[id] }));
    save();
  }, [save]);

  const toggleTask = useCallback((id: string) => {
    setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }));
    save();
  }, [save]);

  /* ── Custom Resources ── */
  const addCustomResource = useCallback((phaseId: string, resource: { name: string; url: string; note: string }) => {
    const newRes: CustomResource = { ...resource, id: `cr-${Date.now()}` };
    setCustomResources(prev => ({ ...prev, [phaseId]: [...(prev[phaseId] || []), newRes] }));
    save();
  }, [save]);

  const removeCustomResource = useCallback((phaseId: string, resourceId: string) => {
    setCustomResources(prev => ({ ...prev, [phaseId]: (prev[phaseId] || []).filter(r => r.id !== resourceId) }));
    save();
  }, [save]);

  const updateResourceOrder = useCallback((phaseId: string, newOrder: string[]) => {
    setResourceOrder(prev => ({ ...prev, [phaseId]: newOrder }));
    save();
  }, [save]);

  const resetResourceOrder = useCallback((phaseId: string) => {
    setResourceOrder(prev => {
      const next = { ...prev };
      delete next[phaseId];
      return next;
    });
    save();
  }, [save]);

  const updateTopicDetails = useCallback((topicId: string, details: Partial<TopicDetails>) => {
    setTopicDetails(prev => ({ ...prev, [topicId]: { ...prev[topicId], ...details } }));
    rTopicDetails.current = { ...rTopicDetails.current, [topicId]: { ...rTopicDetails.current[topicId], ...details } };
    save();
  }, [save]);

  /* ── Daily Tasks ── */
  const addDailyTask = useCallback((date: string, text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const newTask: DailyTask = { id: `dt-${Date.now()}`, text, completed: false, priority };
    setDailyTasks(prev => ({ ...prev, [date]: [...(prev[date] || []), newTask] }));
    save();
  }, [save]);

  const toggleDailyTask = useCallback((date: string, taskId: string) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: (prev[date] || []).map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
    save();
  }, [save]);

  const deleteDailyTask = useCallback((date: string, taskId: string) => {
    setDailyTasks(prev => ({
      ...prev,
      [date]: (prev[date] || []).filter(t => t.id !== taskId),
    }));
    save();
  }, [save]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, username, email, login, signup, resetPassword, logout,
      checkedTopics, checkedTasks, toggleTopic, toggleTask,
      syncStatus, isSearchOpen, setIsSearchOpen,
      activePhase, setActivePhase,
      customResources, resourceOrder, addCustomResource, removeCustomResource,
      updateResourceOrder, resetResourceOrder,
      topicDetails, updateTopicDetails,
      dailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}