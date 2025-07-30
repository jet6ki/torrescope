'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpDown, SortAsc, Plus, X } from 'lucide-react';
import { FastSearchBar } from './FastSearchBar';

import type { ProcessedGenome } from '@/types/torre';

interface EnhancedCompareProps {
  primaryData: ProcessedGenome;
  compareData?: ProcessedGenome | null;
  onAddCompare: (username: string) => void;
  onRemoveCompare: () => void;
}

type SortMode = 'name' | 'percentile';

export function EnhancedCompare({ 
  primaryData, 
  compareData, 
  onAddCompare, 
  onRemoveCompare 
}: EnhancedCompareProps) {
  const [sortMode, setSortMode] = useState<SortMode>('percentile');
  const [showSearch, setShowSearch] = useState(!compareData);

  const handleAddCompare = (username: string) => {
    onAddCompare(username);
    setShowSearch(false);
  };

  const handleRemoveCompare = () => {
    onRemoveCompare();
    setShowSearch(true);
  };

  if (!primaryData.skills || primaryData.skills.length === 0) {
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontSize: '20px', lineHeight: '1.4' }}>
          Compare Skills
        </h3>
        <div className="text-center py-16">
          <div className="text-muted" style={{ fontSize: '16px', lineHeight: '1.5' }}>
            No skills data available for comparison
          </div>
        </div>
      </div>
    );
  }

  const commonSkills = compareData
    ? primaryData.skills.filter(skill =>
        compareData.skills?.some(compareSkill => compareSkill.name === skill.name)
      )
    : primaryData.skills;

  const sortedSkills = [...commonSkills].sort((a, b) => {
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl font-semibold text-foreground"
          style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}
        >
          Compare Skills
        </motion.h3>
        {compareData && (
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
        )}
      </motion.div>

      {/* Compare Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Primary User */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-400 dark:via-orange-500 dark:to-orange-600 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 dark:to-white/10" />
              <span className="relative z-10 text-white font-bold text-lg drop-shadow-lg">
                {primaryData.person.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-muted-foreground mb-1" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                Primary
              </div>
              <div className="font-semibold text-foreground" style={{ fontSize: '16px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                {primaryData.person.name}
              </div>
              <div className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                @{primaryData.person.username}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compare User */}
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                opacity: { duration: 0.3 },
                y: { duration: 0.4 },
                scale: { duration: 0.3 }
              }}
              className="bg-card border border-dashed border-border rounded-2xl p-8 flex items-center justify-center min-h-[140px] hover:border-accent/30 transition-colors duration-300"
            >
              <div className="w-full text-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <div className="text-muted-foreground mb-4" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                    Add someone to compare
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="max-w-sm mx-auto"
                >
                  <FastSearchBar
                    onSearch={handleAddCompare}
                    placeholder="Enter username..."
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : compareData ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 relative hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200"
            >
              <motion.button
                onClick={handleRemoveCompare}
                className="absolute top-4 right-4 w-8 h-8 bg-secondary hover:bg-destructive hover:text-destructive-foreground rounded-xl flex items-center justify-center transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Remove comparison"
              >
                <X className="w-4 h-4" />
              </motion.button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                  <span className="relative z-10 text-white font-bold text-lg drop-shadow-lg">
                    {compareData.person.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                    Compare
                  </div>
                  <div className="font-semibold text-foreground" style={{ fontSize: '16px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                    {compareData.person.name}
                  </div>
                  <div className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                    @{compareData.person.username}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Skills Comparison */}
      {compareData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {sortedSkills.map((skill, index) => {
              const compareSkill = compareData.skills?.find(s => s.name === skill.name);
              if (!compareSkill) return null;

              const primaryHigher = skill.percentile > compareSkill.percentile;
              const difference = Math.abs(skill.percentile - compareSkill.percentile);

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
                  whileHover={{
                    scale: 1.02,
                    y: -6,
                    transition: { duration: 0.15, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-6">
                    {/* Skill Name */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground" style={{ fontSize: '16px', lineHeight: '1.5', color: 'hsl(var(--foreground))' }}>
                        {skill.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        {difference > 10 && (
                          <span className="text-xs px-3 py-1 rounded-xl font-medium" style={{ backgroundColor: '#FF9500', color: 'white' }}>
                            {difference}pt difference
                          </span>
                        )}
                        {/* Winner accent bar */}
                        <div className="w-1 h-8 rounded-full"
                             style={{
                               background: primaryHigher
                                 ? '#FF9500'  // Orange for primary winner
                                 : !primaryHigher && compareSkill.percentile > skill.percentile
                                 ? '#3B82F6'  // Blue for compare winner
                                 : '#6B7280'  // Gray for tie
                             }} />
                      </div>
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Primary */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                            {primaryData.person.name}
                          </span>
                          <span className="font-bold text-lg" style={{
                            fontSize: '18px',
                            lineHeight: '1.2',
                            color: primaryHigher ? '#FF9500' : 'hsl(var(--muted-foreground))'
                          }}>
                            {skill.percentile}th
                          </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: primaryHigher ? '#FF9500' : '#6B7280' }}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: `${skill.percentile}%`, opacity: 1 }}
                            transition={{
                              width: { duration: 1.2, delay: index * 0.08 + 0.5, ease: "easeOut" },
                              opacity: { duration: 0.3, delay: index * 0.08 + 0.4 }
                            }}
                          />
                        </div>
                      </div>

                      {/* Compare */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                            {compareData.person.name}
                          </span>
                          <span className="font-bold text-lg" style={{
                            fontSize: '18px',
                            lineHeight: '1.2',
                            color: !primaryHigher ? '#FF9500' : 'hsl(var(--muted-foreground))'
                          }}>
                            {compareSkill.percentile}th
                          </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: !primaryHigher ? '#FF9500' : '#6B7280' }}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: `${compareSkill.percentile}%`, opacity: 1 }}
                            transition={{
                              width: { duration: 1.2, delay: index * 0.08 + 0.7, ease: "easeOut" },
                              opacity: { duration: 0.3, delay: index * 0.08 + 0.6 }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!compareData && !showSearch && (
        <div className="text-center py-12">
          <Plus className="w-12 h-12 text-muted mx-auto mb-4" />
          <div className="text-muted text-sm">Add a user to compare skills</div>
        </div>
      )}
    </motion.div>
  );
}
