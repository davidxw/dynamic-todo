'use client';

/**
 * ThemeProvider - Context for dark/light mode with system preference detection
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { Theme, DEFAULT_THEME, STORAGE_KEYS } from '@/constants';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return DEFAULT_THEME;
}

// Subscribe to localStorage changes
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

// Subscribe to mounted state (returns true on client, false on server)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribeMounted(_: () => void) {
  // Already mounted, no need to subscribe
  return () => {};
}

function getMounted() {
  return true;
}

function getServerMounted() {
  return false;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use useSyncExternalStore for localStorage to avoid hydration mismatch
  const storedTheme = useSyncExternalStore(
    subscribeToStorage,
    getStoredTheme,
    () => DEFAULT_THEME
  );
  
  // Use useSyncExternalStore for mounted state
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMounted,
    getServerMounted
  );

  // Compute resolved theme
  const resolvedTheme: 'light' | 'dark' = storedTheme === 'system' 
    ? (mounted ? getSystemTheme() : 'light')
    : storedTheme;

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    // Update document class
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    
    // Trigger storage event for useSyncExternalStore
    window.dispatchEvent(new Event('storage'));
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // Update document class when theme changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (storedTheme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newResolved = getSystemTheme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newResolved);
      // Force re-render
      window.dispatchEvent(new Event('storage'));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme: storedTheme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
