'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FastSearchBar } from '@/components/FastSearchBar';
import { MinimalHeader } from '@/components/MinimalHeader';
import { CenteredTabs } from '@/components/CenteredTabs';
import { EnhancedOverview } from '@/components/EnhancedOverview';
import { EnhancedSkills } from '@/components/EnhancedSkills';
import { EnhancedExperience } from '@/components/EnhancedExperience';
import { EnhancedCompare } from '@/components/EnhancedCompare';
import { fetchGenome } from '@/lib/api';
import { useCompareStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { ProcessedGenome } from '@/types/torre';

export default function HomePage() {
  const queryClient = useQueryClient();
  const [primaryUsername, setPrimaryUsername] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { compareUsername, setCompareUsername } = useCompareStore();

  const {
    data: primaryData,
    isLoading: primaryLoading,
    error: primaryError,
    refetch: refetchPrimary,
  } = useQuery<ProcessedGenome>({
    queryKey: ['genome', primaryUsername],
    queryFn: () => fetchGenome(primaryUsername),
    enabled: !!primaryUsername && primaryUsername.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: compareData,
    isLoading: compareLoading,
    error: compareError,
  } = useQuery<ProcessedGenome>({
    queryKey: ['genome', compareUsername],
    queryFn: () => fetchGenome(compareUsername!),
    enabled: !!compareUsername && compareUsername.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleSearch = (username: string) => {
    setPrimaryUsername(username);
    setIsInitialLoad(false);
    setActiveTab('overview');
  };

  const handleLogoClick = () => {
    setPrimaryUsername('');
    setCompareUsername(null);
    setActiveTab('overview');
    setIsInitialLoad(true);
  };

  const handleAddCompare = (username: string) => {
    setCompareUsername(username);
  };

  const handleRemoveCompare = () => {
    setCompareUsername(null);
  };

  if (!primaryUsername) {
    return (
      <>
        <MinimalHeader isVisible={false} onLogoClick={handleLogoClick} />
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: isInitialLoad ? 0.2 : 0 }}
            className="w-full max-w-3xl"
          >
            <FastSearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <MinimalHeader isVisible={true} onLogoClick={handleLogoClick} />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pt-20 pb-12 px-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Loading State */}
          {primaryLoading && (
            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-8 w-48 rounded-lg" />
                  <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          )}

          {/* Error State */}
          {primaryError && !primaryLoading && !primaryData && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Profile Not Found</h3>
              <p className="text-muted">
                Could not find Torre profile for "{primaryUsername}". Please check the username and try again.
              </p>
            </div>
          )}

          {/* Success State */}
          {primaryData && !primaryLoading && !primaryError && (
            <CenteredTabs activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === 'overview' && (
                <EnhancedOverview data={primaryData} />
              )}
              
              {activeTab === 'skills' && (
                <EnhancedSkills 
                  data={primaryData} 
                  compareData={compareData} 
                />
              )}
              
              {activeTab === 'experience' && (
                <EnhancedExperience 
                  data={primaryData} 
                  isLoading={primaryLoading}
                />
              )}
              
              {activeTab === 'compare' && (
                <EnhancedCompare
                  primaryData={primaryData}
                  compareData={compareData}
                  onAddCompare={handleAddCompare}
                  onRemoveCompare={handleRemoveCompare}
                />
              )}
            </CenteredTabs>
          )}
        </div>
      </motion.main>
    </>
  );
}
