'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Briefcase, Users } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'skills', label: 'Skills', icon: TrendingUp },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'compare', label: 'Compare', icon: Users },
];

interface CenteredTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export function CenteredTabs({ activeTab, onTabChange, children }: CenteredTabsProps) {
  return (
    <div className="space-y-8">
      {/* Centered Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-8 bg-card border border-border/50 rounded-2xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{
                  color: isActive
                    ? 'hsl(var(--foreground))'
                    : 'hsl(var(--muted-foreground))',
                  fontSize: '15px'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                
                {/* Orange underline for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#FF9500' }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      duration: 0.25
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

import { cn } from '@/lib/utils';
