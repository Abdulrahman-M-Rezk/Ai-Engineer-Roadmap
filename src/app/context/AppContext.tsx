import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  pin: string;
  authenticate: (enteredPin: string) => Promise<boolean>;
  setNewPin: (newPin: string) => void;
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
  addCustomResource: (phaseId: string, resource: { name: string; url: string; note: string }) => void;
  removeCustomResource: (phaseId: string, resourceId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [pin, setPinState]                       = useState<string>(() => localStorage.getItem('ai-roadmap-pin') || '');
  const [checkedTopics, setCheckedTopics]        = useState<Record<string, boolean>>(DEFAULT_CHECKED);
  const [checkedTasks, setCheckedTasks]          = useState<Record<string, boolean>>({});
  const [customResources, setCustomResources]    = useState<Record<string, CustomResource[]>>({});
  const [syncStatus, setSyncStatus]              = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isSearchOpen, setIsSearchOpen]          = useState(false);
  const [activePhase, setActivePhase]            = useState<string | null>('phase-1');

  const unsubRef     = useRef<(() => void) | null>(null);
  const saveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rTopics      = useRef<Record<string, boolean>>(DEFAULT_CHECKED);
  const rTasks       = useRef<Record<string, boolean>>({});
  const rCustom      = useRef<Record<string, CustomResource[]>>({});

  useEffect(() => { rTopics.current = checkedTopics; }, [checkedTopics]);
  useEffect(() => { rTasks.current  = checkedTasks;  }, [checkedTasks]);
  useEffect(() => { rCustom.current = customResources; }, [customResources]);

  /* ── Firestore listener ── */
  const attachListener = useCallback((p: string) => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    const ref = doc(db, 'progress', p);
    unsubRef.current = onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          const d = snap.data() as any;
          setCheckedTopics(d.checked         || DEFAULT_CHECKED);
          setCheckedTasks(d.tasks            || {});
          setCustomResources(d.customResources || {});
        }
        setSyncStatus('synced');
      },
      () => setSyncStatus('error')
    );
  }, []);

  /* ── Debounced save ── */
  const save = useCallback((p: string) => {
    if (!p) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus('syncing');
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, 'progress', p),
          {
            checked: rTopics.current,
            tasks: rTasks.current,
            customResources: rCustom.current,
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

  /* ── Authenticate ── */
  const authenticate = useCallback(async (enteredPin: string): Promise<boolean> => {
    try {
      const ref  = doc(db, 'progress', enteredPin);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { checked: DEFAULT_CHECKED, tasks: {}, customResources: {}, createdAt: Date.now() });
        setCheckedTopics(DEFAULT_CHECKED);
        setCheckedTasks({});
        setCustomResources({});
      } else {
        const d = snap.data() as any;
        setCheckedTopics(d.checked           || DEFAULT_CHECKED);
        setCheckedTasks(d.tasks              || {});
        setCustomResources(d.customResources || {});
      }
      localStorage.setItem('ai-roadmap-pin', enteredPin);
      setPinState(enteredPin);
      setIsAuthenticated(true);
      attachListener(enteredPin);
      return true;
    } catch (e) {
      console.error('Auth error:', e);
      return false;
    }
  }, [attachListener]);

  /* ── Auto-login ── */
  useEffect(() => {
    const savedPin = localStorage.getItem('ai-roadmap-pin');
    if (savedPin) authenticate(savedPin);
    return () => { unsubRef.current?.(); };
  }, []); // eslint-disable-line

  /* ── Change PIN ── */
  const setNewPin = useCallback((newPin: string) => {
    localStorage.setItem('ai-roadmap-pin', newPin);
    setPinState(newPin);
    setDoc(
      doc(db, 'progress', newPin),
      { checked: rTopics.current, tasks: rTasks.current, customResources: rCustom.current, updatedAt: Date.now() },
      { merge: true }
    );
    attachListener(newPin);
  }, [attachListener]);

  /* ── Toggles ── */
  const toggleTopic = useCallback((id: string) => {
    const p = localStorage.getItem('ai-roadmap-pin') || pin;
    setCheckedTopics(prev => {
      const next = { ...prev, [id]: !prev[id] };
      rTopics.current = next;
      save(p);
      return next;
    });
  }, [pin, save]);

  const toggleTask = useCallback((id: string) => {
    const p = localStorage.getItem('ai-roadmap-pin') || pin;
    setCheckedTasks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      rTasks.current = next;
      save(p);
      return next;
    });
  }, [pin, save]);

  /* ── Custom Resources ── */
  const addCustomResource = useCallback((phaseId: string, resource: { name: string; url: string; note: string }) => {
    const p = localStorage.getItem('ai-roadmap-pin') || pin;
    const newRes: CustomResource = { ...resource, id: `cr-${Date.now()}` };
    setCustomResources(prev => {
      const next = { ...prev, [phaseId]: [...(prev[phaseId] || []), newRes] };
      rCustom.current = next;
      save(p);
      return next;
    });
  }, [pin, save]);

  const removeCustomResource = useCallback((phaseId: string, resourceId: string) => {
    const p = localStorage.getItem('ai-roadmap-pin') || pin;
    setCustomResources(prev => {
      const next = { ...prev, [phaseId]: (prev[phaseId] || []).filter(r => r.id !== resourceId) };
      rCustom.current = next;
      save(p);
      return next;
    });
  }, [pin, save]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, pin, authenticate, setNewPin,
      checkedTopics, checkedTasks, toggleTopic, toggleTask,
      syncStatus, isSearchOpen, setIsSearchOpen,
      activePhase, setActivePhase,
      customResources, addCustomResource, removeCustomResource,
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
