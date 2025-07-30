'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MinimalThemeToggle } from './MinimalThemeToggle';

interface MinimalHeaderProps {
  isVisible: boolean;
  onLogoClick: () => void;
}

export function MinimalHeader({ isVisible, onLogoClick }: MinimalHeaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-6 h-16">
            <motion.button
              onClick={onLogoClick}
              className="text-2xl font-semibold text-foreground hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg px-2 py-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{
                color: 'hsl(var(--foreground))',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontFeatureSettings: '"cv11", "ss01"',
                fontVariationSettings: '"opsz" 32'
              }}
            >
              torre<span style={{ color: '#FF9500' }}>scope</span>
            </motion.button>
            
            <MinimalThemeToggle />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
