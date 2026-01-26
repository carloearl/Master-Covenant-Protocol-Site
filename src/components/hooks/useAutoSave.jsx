import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-save hook for preserving user state across refreshes
 * @param {string} key - localStorage key
 * @param {*} data - data to save
 * @param {number} delay - debounce delay in ms
 */
export function useAutoSave(key, data, delay = 1000) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key, data, delay]);
}

/**
 * Restore saved state from localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - fallback if nothing saved
 */
export function useRestoreState(key, defaultValue = null) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Restore failed:', e);
    return defaultValue;
  }
}

/**
 * Prevent accidental navigation away
 */
export function usePreventNavigation(isDirty) {
  useEffect(() => {
    if (!isDirty) return;
    
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}