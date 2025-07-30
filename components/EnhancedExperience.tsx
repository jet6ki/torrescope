'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProcessedGenome } from '@/types/torre';

interface EnhancedExperienceProps {
  data: ProcessedGenome;
  isLoading?: boolean;
}

function ExperienceSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

export function EnhancedExperience({ data, isLoading = false }: EnhancedExperienceProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
          Experience
        </h3>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <ExperienceSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data.experiences || data.experiences.length === 0) {
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
          Experience
        </h3>
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <div className="text-muted-foreground" style={{ fontSize: '16px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>
            No experience data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-semibold text-foreground"
        style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}
      >
        Experience
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-6"
      >
        {data.experiences.map((experience, index) => (
          <motion.div
            key={`${experience.id}-${index}`}
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
            transition={{
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
            className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            tabIndex={0}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {experience.title && (
                    <h4 className="font-semibold text-foreground" style={{ fontSize: '18px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                      {experience.title}
                    </h4>
                  )}
                  {experience.organization?.name && (
                    <div className="flex items-center gap-2 mt-2">
                      <Building className="w-4 h-4" style={{ color: '#FF9500' }} />
                      <span className="text-muted-foreground" style={{ fontSize: '15px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                        {experience.organization.name}
                      </span>
                    </div>
                  )}
                </div>

                {experience.type && (
                  <span className="px-3 py-1 text-xs rounded-xl font-medium capitalize" style={{ backgroundColor: '#FF9500', color: 'white' }}>
                    {experience.type}
                  </span>
                )}
              </div>

              {/* Details */}
              {experience.startDate && (
                <div className="flex flex-wrap gap-4 text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {experience.startDate.month && experience.startDate.year ? (
                        `${experience.startDate.month}/${experience.startDate.year}`
                      ) : experience.startDate.year ? (
                        experience.startDate.year
                      ) : null}
                      {experience.endDate ? (
                        experience.endDate.month && experience.endDate.year ? (
                          ` - ${experience.endDate.month}/${experience.endDate.year}`
                        ) : experience.endDate.year ? (
                          ` - ${experience.endDate.year}`
                        ) : null
                      ) : ' - Present'}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary - One line brief */}
              {(experience.description || (experience.responsibilities && experience.responsibilities.length > 0)) && (
                <div className="text-foreground" style={{ fontSize: '15px', lineHeight: '1.5', color: 'hsl(var(--foreground))' }}>
                  {experience.description ? (
                    <p className="line-clamp-2">
                      {experience.description.length > 120
                        ? `${experience.description.substring(0, 120)}...`
                        : experience.description
                      }
                    </p>
                  ) : experience.responsibilities && experience.responsibilities.length > 0 ? (
                    <p className="line-clamp-2">
                      {experience.responsibilities[0].length > 120
                        ? `${experience.responsibilities[0].substring(0, 120)}...`
                        : experience.responsibilities[0]
                      }
                    </p>
                  ) : null}
                </div>
              )}

              {/* Additional responsibilities */}
              {experience.responsibilities && experience.responsibilities.length > 1 && (
                <div className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                  <p>• {experience.responsibilities.slice(1, 3).join(' • ')}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
