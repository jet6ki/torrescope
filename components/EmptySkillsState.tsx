'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ExternalLink, RefreshCw } from 'lucide-react';
import type { ProcessedGenome } from '@/types/torre';

interface EmptySkillsStateProps {
  userData: ProcessedGenome;
  onRetry?: () => void;
}

export function EmptySkillsState({ userData, onRetry }: EmptySkillsStateProps) {
  const handleOpenTorreProfile = () => {
    window.open(`https://torre.ai/${userData.person.username}`, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold">No Skills Data Available</h3>

          {/* User info */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{userData.person.name}</p>
            <p className="text-sm text-muted-foreground">@{userData.person.username}</p>
            {userData.person.professionalHeadline && userData.person.professionalHeadline !== 'No headline' && (
              <p className="text-sm text-muted-foreground italic">
                {userData.person.professionalHeadline}
              </p>
            )}
            {userData.person.location && userData.person.location.name && (
              <p className="text-sm text-muted-foreground">
                📍 {userData.person.location.name}
              </p>
            )}
          </div>

          {/* Explanation */}
          <div className="max-w-md space-y-3 text-sm text-muted-foreground">
            <p>
              This Torre user hasn't added any skills to their profile yet, or their skills data isn't publicly available.
            </p>
            <p>
              Profile completion: <span className="font-medium">{userData.stats.completionPercentage}%</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleOpenTorreProfile}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Torre Profile</span>
            </Button>
            
            {onRetry && (
              <Button
                variant="ghost"
                onClick={onRetry}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </Button>
            )}
          </div>

          {/* Suggestion */}
          <div className="text-xs text-muted-foreground max-w-sm">
            <p>
              Tip: Try searching for users with more complete profiles, like "sr" or "renan"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
