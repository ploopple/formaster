import { useState, useCallback, useRef, useEffect } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  lastAction: string | null;
}

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 500; // Auto-save after 500ms of no changes

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastActionRef = useRef<string | null>(null);
  const lastSavedStateRef = useRef<T>(initialState);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<T | null>(null);

  // Save snapshot to history
  const commitToHistory = useCallback((stateToSave: T) => {
    setHistory((prev) => {
      // Don't save if nothing changed since last save
      if (JSON.stringify(stateToSave) === JSON.stringify(lastSavedStateRef.current)) {
        return prev;
      }

      lastActionRef.current = 'Edit';
      const previousState = lastSavedStateRef.current;
      lastSavedStateRef.current = stateToSave;

      return {
        past: [...prev.past, previousState].slice(-MAX_HISTORY),
        present: stateToSave,
        future: [],
      };
    });
  }, []);

  // Update state and auto-save with debounce
  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setHistory((prev) => {
        const resolvedState = typeof newState === 'function' ? (newState as (prev: T) => T)(prev.present) : newState;

        // Clear existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Store pending state for debounced save
        pendingStateRef.current = resolvedState;

        // Set new debounce timer to auto-save
        debounceTimerRef.current = setTimeout(() => {
          if (pendingStateRef.current !== null) {
            commitToHistory(pendingStateRef.current);
            pendingStateRef.current = null;
          }
        }, DEBOUNCE_MS);

        return {
          ...prev,
          present: resolvedState,
          future: [], // Clear future on new changes
        };
      });
    },
    [commitToHistory]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const undo = useCallback(() => {
    // Commit any pending changes before undo
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (pendingStateRef.current !== null) {
      commitToHistory(pendingStateRef.current);
      pendingStateRef.current = null;
    }

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
  }, [commitToHistory]);

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
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    lastAction: lastActionRef.current,
  };
}
