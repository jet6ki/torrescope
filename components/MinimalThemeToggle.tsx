'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MinimalThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    document.documentElement.style.transition = 'background-color 150ms ease-out, color 150ms ease-out';
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 150);
  };

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full flex items-center justify-center">
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait" initial={false}>
          {resolvedTheme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                duration: 0.15
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-5 w-5 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                duration: 0.15
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-5 w-5 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
