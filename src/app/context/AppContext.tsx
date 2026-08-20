import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_CHECKED } from '../data/roadmapData';
import bcrypt from 'bcryptjs';

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
  pin: string;
  login: (username: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, pin: string) => Promise<{ success: boolean; error?: string; recoveryCode?: string }>;
  recoverPin: (username: string, recoveryCode: string) => Promise<{ success: boolean; error?: string; pin?: string }>;
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
  setNewPin: (newPin: string, recoveryCode: string) => Promise<{ success: boolean; error?: string }>;
  topicDetails: Record<string, TopicDetails>;
  updateTopicDetails: (topicId: string, details: Partial<TopicDetails>) => void;
  dailyTasks: Record<string, DailyTask[]>;
  addDailyTask: (date: string, text: string, priority?: 'high' | 'medium' | 'low') => void;
  toggleDailyTask: (date: string, taskId: string) => void;
  deleteDailyTask: (date: string, taskId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [username, setUsername]                  = useState<string>(() => localStorage.getItem('ai-roadmap-username') || '');
  const [pin, setPinState]                       = useState<string>(() => localStorage.getItem('ai-roadmap-pin') || '');
  const [checkedTopics, setCheckedTopics]        = useState<Record<string, boolean>>({});
  const [checkedTasks, setCheckedTasks]          = useState<Record<string, boolean>>({});
  const [customResources, setCustomResources]    = useState<Record<string, CustomResource[]>>({});
  const [resourceOrder, setResourceOrder]        = useState<Record<string, string[]>>({});
  const [topicDetails, setTopicDetails]          = useState<Record<string, TopicDetails>>({});
  const [dailyTasks, setDailyTasks]              = useState<Record<string, DailyTask[]>>({});
  const [syncStatus, setSyncStatus]              = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isSearchOpen, setIsSearchOpen]          = useState(false);
  const [activePhase, setActivePhase]            = useState<string | null>('phase-1');

  const unsubRef     = useRef<(() => void) | null>(null);
  const saveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rTopics      = useRef<Record<string, boolean>>({});
  const rTasks       = useRef<Record<string, boolean>>({});
  const rCustom      = useRef<Record<string, CustomResource[]>>({});
  const rOrder       = useRef<Record<string, string[]>>({});
  const rTopicDetails = useRef<Record<string, TopicDetails>>({});
  const rDailyTasks   = useRef<Record<string, DailyTask[]>>({});

  useEffect(() => { rTopics.current = checkedTopics; }, [checkedTopics]);
  useEffect(() => { rTasks.current  = checkedTasks;  }, [checkedTasks]);
  useEffect(() => { rCustom.current = customResources; }, [customResources]);
  useEffect(() => { rOrder.current = resourceOrder; }, [resourceOrder]);
  useEffect(() => { rTopicDetails.current = topicDetails; }, [topicDetails]);
  useEffect(() => { rDailyTasks.current = dailyTasks; }, [dailyTasks]);

  /* ── Firestore listener ── */
  const attachListener = useCallback((pUsername: string) => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    const ref = doc(db, 'progress', pUsername);
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

  /* ── Debounced save ── */
  const save = useCallback((pUsername: string) => {
    if (!pUsername) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus('syncing');
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, 'progress', pUsername),
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

  /* ── Login Logic ── */
  const login = useCallback(async (enteredUsername: string, enteredPin: string) => {
    try {
      const ref = doc(db, 'progress', enteredUsername);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return { success: false, error: 'اسم المستخدم غير صحيح' };
      }
      const d = snap.data() as any;
      const storedPin = d.pin;
      
      let pinValid = false;
      // Case 1: Plaintext PIN (old user, 4-digit)
      if (typeof storedPin === 'string' && storedPin.length === 4) {
        pinValid = storedPin === enteredPin;
        if (pinValid) {
          // Migrate: re-hash the PIN immediately
          const newHash = bcrypt.hashSync(enteredPin, 10);
          await setDoc(ref, { pin: newHash }, { merge: true });
        }
      } else {
        // Case 2: Hashed PIN (bcrypt)
        pinValid = bcrypt.compareSync(enteredPin, storedPin);
      }
      
      if (!pinValid) {
        return { success: false, error: 'الرقم السري خاطئ' };
      }
      
      setCheckedTopics(d.checked || {});
      setCheckedTasks(d.tasks || {});
      setCustomResources(d.customResources || {});
      setResourceOrder(d.resourceOrder || {});
      setTopicDetails(d.topicDetails || {});
      setDailyTasks(d.dailyTasks || {});
      
      localStorage.setItem('ai-roadmap-username', enteredUsername);
      localStorage.setItem('ai-roadmap-pin', enteredPin);
      setUsername(enteredUsername);
      setPinState(enteredPin);
      setIsAuthenticated(true);
      attachListener(enteredUsername);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  }, [attachListener]);

  /* ── Signup Logic ── */
  const signup = useCallback(async (enteredUsername: string, enteredPin: string) => {
    try {
      const ref = doc(db, 'progress', enteredUsername);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { success: false, error: 'اسم المستخدم محجوز، اختر اسماً آخر' };
      }
      
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let recoveryCode = '';
      for (let i = 0; i < 6; i++) {
        recoveryCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const hashedPin = bcrypt.hashSync(enteredPin, 10);

      await setDoc(ref, { 
        pin: hashedPin,
        recoveryCode,
        checked: {}, 
        tasks: {}, 
        customResources: {}, 
        resourceOrder: {},
        topicDetails: {},
        dailyTasks: {},
        createdAt: Date.now() 
      });

      return { success: true, recoveryCode };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  }, []);

  /* ── Account Recovery ── */
  const recoverPin = useCallback(async (enteredUsername: string, enteredRecoveryCode: string) => {
    try {
      const ref = doc(db, 'progress', enteredUsername);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return { success: false, error: 'اسم المستخدم غير صحيح' };
      }
      const d = snap.data() as any;
      if (d.recoveryCode !== enteredRecoveryCode) {
        return { success: false, error: 'كود الاسترجاع غير صحيح' };
      }
      const storedPin = d.pin;
      // If hashed (bcrypt hash > 4 chars), generate new temporary PIN
      if (typeof storedPin === 'string' && storedPin.length > 4) {
        const newPin = Math.floor(1000 + Math.random() * 9000).toString();
        const newHash = bcrypt.hashSync(newPin, 10);
        await setDoc(ref, { pin: newHash }, { merge: true });
        return { success: true, pin: newPin };
      }
      return { success: true, pin: storedPin };
    } catch (error) {
      console.error('Recovery error:', error);
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  }, []);

  /* ── Change PIN ── */
  const setNewPin = useCallback(async (newPin: string, recoveryCode: string) => {
    try {
      if (!username) return { success: false, error: 'غير مسجل الدخول' };
      const ref = doc(db, 'progress', username);
      const snap = await getDoc(ref);
      if (!snap.exists()) return { success: false, error: 'لم يتم العثور على الحساب' };
      
      const d = snap.data() as any;
      if (d.recoveryCode !== recoveryCode) {
        return { success: false, error: 'كود الاسترجاع غير صحيح' };
      }

      const newHash = bcrypt.hashSync(newPin, 10);
      await updateDoc(ref, { pin: newHash });
      localStorage.setItem('ai-roadmap-pin', newPin);
      setPinState(newPin);
      return { success: true };
    } catch (error) {
      console.error('Change PIN error:', error);
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  }, [username]);

  /* ── Auto-login ── */
  useEffect(() => {
    const savedUsername = localStorage.getItem('ai-roadmap-username');
    const savedPin = localStorage.getItem('ai-roadmap-pin');
    if (savedUsername && savedPin) {
      login(savedUsername, savedPin);
    }
    return () => { unsubRef.current?.(); };
  }, [login]);

  /* ── Toggles ── */
  const toggleTopic = useCallback((id: string) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setCheckedTopics(prev => {
      const next = { ...prev, [id]: !prev[id] };
      rTopics.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const toggleTask = useCallback((id: string) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setCheckedTasks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      rTasks.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  /* ── Custom Resources ── */
  const addCustomResource = useCallback((phaseId: string, resource: { name: string; url: string; note: string }) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    const newRes: CustomResource = { ...resource, id: `cr-${Date.now()}` };
    setCustomResources(prev => {
      const next = { ...prev, [phaseId]: [...(prev[phaseId] || []), newRes] };
      rCustom.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const removeCustomResource = useCallback((phaseId: string, resourceId: string) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setCustomResources(prev => {
      const next = { ...prev, [phaseId]: (prev[phaseId] || []).filter(r => r.id !== resourceId) };
      rCustom.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const updateResourceOrder = useCallback((phaseId: string, newOrder: string[]) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setResourceOrder(prev => {
      const next = { ...prev, [phaseId]: newOrder };
      rOrder.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const resetResourceOrder = useCallback((phaseId: string) => {
    setResourceOrder(prev => {
      const next = { ...prev };
      delete next[phaseId];
      rOrder.current = next;
      save(username);
      return next;
    });
  }, [save, username]);

  const updateTopicDetails = useCallback((topicId: string, details: Partial<TopicDetails>) => {
    setTopicDetails(prev => ({ ...prev, [topicId]: { ...prev[topicId], ...details } }));
    rTopicDetails.current = { ...rTopicDetails.current, [topicId]: { ...rTopicDetails.current[topicId], ...details } };
    save(username);
  }, [save, username]);

  /* ── Daily Tasks ── */
  const addDailyTask = useCallback((date: string, text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    const newTask: DailyTask = { id: `dt-${Date.now()}`, text, completed: false, priority };
    setDailyTasks(prev => {
      const next = { ...prev, [date]: [...(prev[date] || []), newTask] };
      rDailyTasks.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const toggleDailyTask = useCallback((date: string, taskId: string) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setDailyTasks(prev => {
      const tasks = (prev[date] || []).map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const next = { ...prev, [date]: tasks };
      rDailyTasks.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  const deleteDailyTask = useCallback((date: string, taskId: string) => {
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setDailyTasks(prev => {
      const tasks = (prev[date] || []).filter(t => t.id !== taskId);
      const next = { ...prev, [date]: tasks };
      rDailyTasks.current = next;
      save(u);
      return next;
    });
  }, [username, save]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, username, pin, login, signup, recoverPin, setNewPin,
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
