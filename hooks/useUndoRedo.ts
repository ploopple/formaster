import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  saveSnapshot: (actionName?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  lastAction: string | null;
}

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });
  
  const lastActionRef = useRef<string | null>(null);
  // Track the last saved state to know if there are unsaved changes
  const lastSavedStateRef = useRef<T>(initialState);

  // Update state without creating history entry
  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const resolvedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.present) 
        : newState;
      
      return {
        ...prev,
        present: resolvedState,
      };
    });
  }, []);

  // Save current state as a snapshot in history (call this on "Save" button click)
  const saveSnapshot = useCallback((actionName?: string) => {
    setHistory((prev) => {
      // Don't save if nothing changed since last save
      if (JSON.stringify(prev.present) === JSON.stringify(lastSavedStateRef.current)) {
        return prev;
      }

      lastActionRef.current = actionName || 'Save';
      const previousState = lastSavedStateRef.current;
      lastSavedStateRef.current = prev.present;
      
      return {
        past: [...prev.past, previousState].slice(-MAX_HISTORY),
        present: prev.present,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      
      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;
      
      lastActionRef.current = 'Undo';
      lastSavedStateRef.current = newPresent;
      
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      
      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;
      
      lastActionRef.current = 'Redo';
      lastSavedStateRef.current = newPresent;
      
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return {
    state: history.present,
    setState,
    saveSnapshot,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    lastAction: lastActionRef.current,
  };
}
