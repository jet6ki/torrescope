'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpDown, SortAsc } from 'lucide-react';

import type { ProcessedGenome } from '@/types/torre';

interface EnhancedSkillsProps {
  data: ProcessedGenome;
  compareData?: ProcessedGenome | null;
}

type SortMode = 'name' | 'percentile';

export function EnhancedSkills({ data, compareData }: EnhancedSkillsProps) {
  const [sortMode, setSortMode] = useState<SortMode>('percentile');

  if (!data.skills || data.skills.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted" style={{ fontSize: '16px', lineHeight: '1.5' }}>
          No skills data available
        </div>
      </div>
    );
  }

  const sortedSkills = [...data.skills].sort((a, b) => {
    if (sortMode === 'name') {
      return a.name.localeCompare(b.name);
    }
    return b.percentile - a.percentile;
  });

  const toggleSortMode = () => {
    setSortMode(prev => prev === 'name' ? 'percentile' : 'name');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Sort Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl font-semibold text-foreground"
          style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}
        >
          Skills
        </motion.h3>
        <motion.button
          onClick={toggleSortMode}
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-border hover:bg-accent hover:text-accent-foreground rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95, rotate: -1 }}
          style={{ fontSize: '14px', color: '#FF9500' }}
        >
          <motion.div
            animate={{ rotate: sortMode === 'name' ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {sortMode === 'name' ? <SortAsc className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
          </motion.div>
          Sort by {sortMode === 'name' ? 'Name (A-Z)' : 'Percentile'}
        </motion.button>
      </motion.div>

      {/* Skills List */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <AnimatePresence mode="wait">
          {sortedSkills.map((skill, index) => {
            const compareSkill = compareData?.skills?.find(s => s.name === skill.name);

            return (
              <motion.div
                key={`${skill.name}-${sortMode}`}
                layout
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{
                  opacity: 0,
                  y: -40,
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1
                  },
                  opacity: { duration: 0.5, delay: index * 0.08 },
                  y: { duration: 0.6, delay: index * 0.08, ease: "easeOut" },
                  scale: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
                  filter: { duration: 0.4, delay: index * 0.08 }
                }}
                style={{
                  zIndex: sortedSkills.length - index
                }}
                whileHover={{
                  scale: 1.02,
                  y: -6,
                  transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground" style={{ fontSize: '16px', lineHeight: '1.5', color: 'hsl(var(--foreground))' }}>
                      {skill.name}
                    </h4>
                    {skill.source && (
                      <p className="text-muted-foreground mt-1" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                        {skill.source}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Primary Percentile */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground" style={{ fontSize: '24px', lineHeight: '1.2', color: 'hsl(var(--foreground))' }}>
                        {skill.percentile}th
                      </div>
                      <div className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                        percentile
                      </div>
                    </div>

                    {/* Compare Percentile */}
                    {compareSkill && (
                      <>
                        <div className="text-right">
                          <div className="text-xl font-semibold text-muted-foreground" style={{ fontSize: '20px', lineHeight: '1.2', color: 'hsl(var(--muted-foreground))' }}>
                            {compareSkill.percentile}th
                          </div>
                          <div className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                            compare
                          </div>
                        </div>

                        {/* Difference Indicator */}
                        <div className="w-1 h-12 rounded-full"
                             style={{
                               background: skill.percentile > compareSkill.percentile
                                 ? 'var(--accent)'
                                 : skill.percentile < compareSkill.percentile
                                 ? '#ef4444'
                                 : 'var(--muted)'
                             }} />
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-end mb-2" style={{ fontSize: '14px' }}>
                    <span className="text-foreground font-medium" style={{ color: 'hsl(var(--foreground))' }}>{skill.percentile}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#FF9500' }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: `${skill.percentile}%`, opacity: 1 }}
                      transition={{
                        width: { duration: 1.2, delay: index * 0.08 + 0.5, ease: "easeOut" },
                        opacity: { duration: 0.3, delay: index * 0.08 + 0.4 }
                      }}
                    />
                  </div>

                  {/* Compare Progress Bar */}
                  {compareSkill && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 + 0.6 }}
                      className="mt-3"
                    >
                      <div className="flex items-center justify-end mb-2" style={{ fontSize: '14px' }}>
                        <span className="text-foreground font-medium" style={{ color: 'hsl(var(--foreground))' }}>{compareSkill.percentile}%</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: '#6B7280' }}
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: `${compareSkill.percentile}%`, opacity: 1 }}
                          transition={{
                            width: { duration: 1.2, delay: index * 0.08 + 0.7, ease: "easeOut" },
                            opacity: { duration: 0.3, delay: index * 0.08 + 0.6 }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
