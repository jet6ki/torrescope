'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchGenome } from '@/lib/api';
import { useCompareStore } from '@/lib/store';
import { SkillRadar } from '@/components/SkillRadar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import type { Metadata } from 'next';

interface PageParams {
  slugs: string[];
}

export default function RadarPage() {
  const params = useParams() as PageParams;
  const router = useRouter();
  const { setCompareUsername } = useCompareStore();
  const [usernames, setUsernames] = useState<{
    primary: string;
    compare?: string;
  }>({ primary: '' });

  useEffect(() => {
    if (!params.slugs || params.slugs.length === 0) {
      router.push('/');
      return;
    }

    const slug = params.slugs[0];
    const parts = slug.split('+');

    if (parts.length === 1) {
      setUsernames({ primary: parts[0] });
    } else if (parts.length === 2) {
      setUsernames({ primary: parts[0], compare: parts[1] });
      setCompareUsername(parts[1]);
    } else {
      router.push('/');
    }
  }, [params.slugs, router, setCompareUsername]);

  const {
    data: primaryData,
    isLoading: primaryLoading,
    error: primaryError,
  } = useQuery({
    queryKey: ['genome', usernames.primary],
    queryFn: () => fetchGenome(usernames.primary),
    enabled: !!usernames.primary,
  });

  const {
    data: compareData,
    isLoading: compareLoading,
    error: compareError,
  } = useQuery({
    queryKey: ['genome', usernames.compare],
    queryFn: () => fetchGenome(usernames.compare!),
    enabled: !!usernames.compare,
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleBackToSearch = () => {
    router.push('/');
  };

  if (!usernames.primary) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBackToSearch}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* User Info */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{usernames.primary}</h1>
            {primaryData && (
              <p className="text-muted-foreground">
                {primaryData.skills.length} skills
              </p>
            )}
          </div>

          {usernames.compare && (
            <>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold">{usernames.compare}</h1>
                {compareData && (
                  <p className="text-muted-foreground">
                    {compareData.skills.length} skills
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {(primaryLoading || (usernames.compare && compareLoading)) && (
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
      {(primaryError || compareError) && (
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <div className="text-destructive space-y-2">
              <h3 className="text-lg font-semibold">Error Loading Profile</h3>
              <p className="text-sm">
                {primaryError
                  ? `Could not find Torre profile for "${usernames.primary}"`
                  : `Could not find Torre profile for "${usernames.compare}"`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Radar Chart */}
      {primaryData && !primaryError && (
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
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!params.slugs || params.slugs.length === 0) {
    return {
      title: 'TorreScope',
      description: 'Skill visualization for Torre users',
    };
  }

  const slug = params.slugs[0];
  const parts = slug.split('+');
  const primary = parts[0];
  const compare = parts[1];

  const title = compare
    ? `${primary} vs ${compare} - TorreScope`
    : `${primary} - TorreScope`;

  const description = compare
    ? `Compare skill profiles between ${primary} and ${compare} on TorreScope`
    : `View ${primary}'s skill radar chart with percentile analysis`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://torre-radar.vercel.app/radar/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}