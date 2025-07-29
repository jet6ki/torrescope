'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SkillRadar } from '@/components/SkillRadar';
import { CompareDropzone } from '@/components/CompareDropzone';
import { useQuery } from '@tanstack/react-query';
import { fetchGenome } from '@/lib/api';
import { useCompareStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [primaryUsername, setPrimaryUsername] = useState<string>('');
  const [showCompare, setShowCompare] = useState(false);
  const { compareUsername, setCompareUsername } = useCompareStore();

  const {
    data: primaryData,
    isLoading: primaryLoading,
    error: primaryError,
  } = useQuery({
    queryKey: ['genome', primaryUsername],
    queryFn: () => fetchGenome(primaryUsername),
    enabled: !!primaryUsername,
  });

  const {
    data: compareData,
    isLoading: compareLoading,
    error: compareError,
  } = useQuery({
    queryKey: ['genome', compareUsername],
    queryFn: () => fetchGenome(compareUsername!),
    enabled: !!compareUsername,
  });

  const handleSearch = (username: string) => {
    setPrimaryUsername(username);
  };

  const handleAddComparison = () => {
    setShowCompare(true);
  };

  const handleRemoveComparison = () => {
    setShowCompare(false);
    setCompareUsername(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Visualize Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {' '}
            Skills
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover your Torre skill profile with interactive radar charts,
          percentile analysis, and powerful comparison tools.
        </p>
      </div>

      {/* Search Section */}
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <SearchBar onSearch={handleSearch} />
        </CardContent>
      </Card>

      {/* Results Section */}
      {primaryUsername && (
        <div className="space-y-6">
          {/* Loading State */}
          {primaryLoading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-96 w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {primaryError && (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
                <div className="text-destructive space-y-2">
                  <h3 className="text-lg font-semibold">User Not Found</h3>
                  <p className="text-sm">
                    Could not find Torre profile for "{primaryUsername}". Please
                    check the username and try again.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {primaryData && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{primaryData.username}</h2>
                <p className="text-muted-foreground">
                  {primaryData.skills.length} skills analyzed
                </p>
              </div>

              {/* Comparison Controls */}
              <div className="flex justify-center space-x-4">
                {!showCompare ? (
                  <Button onClick={handleAddComparison} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Comparison
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Button onClick={handleRemoveComparison} variant="outline">
                      Remove Comparison
                    </Button>
                    {compareUsername && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        Comparing with {compareUsername}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Compare Dropzone */}
              {showCompare && !compareUsername && (
                <Card>
                  <CardContent className="p-6">
                    <CompareDropzone />
                  </CardContent>
                </Card>
              )}

              {/* Radar Chart */}
              <Card>
                <CardContent className="p-6">
                  <SkillRadar
                    primaryData={primaryData}
                    compareData={compareData}
                    isCompareLoading={compareLoading}
                    compareError={compareError}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!primaryUsername && (
        <div className="text-center space-y-4 py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ready to explore?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter any Torre username above to visualize their skill profile
              and see how they compare to the global population.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}