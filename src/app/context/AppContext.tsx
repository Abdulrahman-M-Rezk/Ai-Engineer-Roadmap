import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_CHECKED } from '../data/roadmapData';

export interface CustomResource {
  id: string;
  name: string;
  url: string;
  note: string;
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
  const [syncStatus, setSyncStatus]              = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isSearchOpen, setIsSearchOpen]          = useState(false);
  const [activePhase, setActivePhase]            = useState<string | null>('phase-1');

  const unsubRef     = useRef<(() => void) | null>(null);
  const saveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rTopics      = useRef<Record<string, boolean>>({});
  const rTasks       = useRef<Record<string, boolean>>({});
  const rCustom      = useRef<Record<string, CustomResource[]>>({});
  const rOrder       = useRef<Record<string, string[]>>({});

  useEffect(() => { rTopics.current = checkedTopics; }, [checkedTopics]);
  useEffect(() => { rTasks.current  = checkedTasks;  }, [checkedTasks]);
  useEffect(() => { rCustom.current = customResources; }, [customResources]);
  useEffect(() => { rOrder.current = resourceOrder; }, [resourceOrder]);

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
      if (d.pin !== enteredPin) {
        return { success: false, error: 'الرقم السري خاطئ' };
      }
      setCheckedTopics(d.checked || {});
      setCheckedTasks(d.tasks || {});
      setCustomResources(d.customResources || {});
      setResourceOrder(d.resourceOrder || {});
      
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

      await setDoc(ref, { 
        pin: enteredPin,
        recoveryCode,
        checked: {}, 
        tasks: {}, 
        customResources: {}, 
        resourceOrder: {},
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
      return { success: true, pin: d.pin };
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

      await updateDoc(ref, { pin: newPin });
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
    const u = localStorage.getItem('ai-roadmap-username') || username;
    setResourceOrder(prev => {
      const next = { ...prev };
      delete next[phaseId];
      rOrder.current = next;
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
