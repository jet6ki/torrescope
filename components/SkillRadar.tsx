'use client';

import { useMemo, useRef } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptySkillsState } from './EmptySkillsState';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import type { ProcessedGenome } from '@/types/torre';

interface SkillRadarProps {
  primaryData: ProcessedGenome;
  compareData?: ProcessedGenome | null;
  isCompareLoading?: boolean;
  compareError?: any;
  onRetry?: () => void;
  maxSkills?: number;
  showPercentiles?: boolean;
}

interface RadarDataPoint {
  skill: string;
  fullName: string;
  primary: number;
  compare?: number;
  primaryPercentile: number;
  comparePercentile?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm mb-2">{data.fullName}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-medium">
              {entry.value.toFixed(1)}/5.0
            </span>
            <span className="text-muted-foreground">
              ({entry.dataKey === 'primary' ? data.primaryPercentile : data.comparePercentile}th percentile)
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SkillRadar({
  primaryData,
  compareData,
  isCompareLoading,
  compareError,
  onRetry,
  maxSkills = 12,
  showPercentiles = true,
}: SkillRadarProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!primaryData.skills || primaryData.skills.length === 0) {
    return <EmptySkillsState userData={primaryData} onRetry={onRetry} />;
  }

  const radarData = useMemo(() => {
    if (!primaryData) return [];

    const allSkills = new Set([
      ...primaryData.skills.map((s) => s.name),
      ...(compareData?.skills.map((s) => s.name) || []),
    ]);

    const data: RadarDataPoint[] = Array.from(allSkills)
      .slice(0, 12) 
      .map((skillName) => {
        const primarySkill = primaryData.skills.find((s) => s.name === skillName);
        const compareSkill = compareData?.skills.find((s) => s.name === skillName);

        return {
          skill: skillName.length > 20 ? `${skillName.slice(0, 20)}...` : skillName,
          fullName: skillName,
          primary: primarySkill?.proficiency || 0,
          compare: compareSkill?.proficiency,
          primaryPercentile: primarySkill?.percentile || 0,
          comparePercentile: compareSkill?.percentile,
        };
      })
      .sort((a, b) => b.primary - a.primary);

    return data;
  }, [primaryData, compareData]);

  const handleExportPNG = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `torre-radar-${primaryData.person.username}${
        compareData ? `-vs-${compareData.person.username}` : ''
      }.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Chart exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export chart');
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 96) return '#f59e0b'; 
    if (percentile >= 80) return '#10b981'; 
    if (percentile >= 50) return '#0ea5e9'; 
    return '#6b7280'; // gray-500
  };

  if (!primaryData || radarData.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Skill Radar Chart</h3>
          <p className="text-sm text-muted-foreground">
            Showing top {radarData.length} skills with percentile analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportPNG} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PNG
          </Button>
        </div>
      </div>

      {/* Loading state for compare data */}
      {isCompareLoading && (
        <div className="text-center text-sm text-muted-foreground">
          Loading comparison data...
        </div>
      )}

      {/* Error state for compare data */}
      {compareError && (
        <div className="text-center text-sm text-destructive">
          Failed to load comparison data
        </div>
      )}

      {/* Data Source Info */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Data Source</p>
            <p className="text-muted-foreground">
              Skills data is sourced from Torre.ai profiles. Percentiles are calculated based on
              skill proficiency levels (0-5 scale) compared to global Torre user distribution.
            </p>
            {radarData.length > 0 && (
              <p className="text-muted-foreground mt-1">
                Showing {radarData.length} skills for {primaryData.person.name || primaryData.person.username}
                {compareData && ` and ${compareData.person.name || compareData.person.username}`}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartRef} className="w-full">
        <div className="h-96 sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                className="text-xs"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tickCount={6}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name={primaryData.person.name}
                dataKey="primary"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={compareData ? 0.3 : 0.6}
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              {compareData && compareData.skills.length > 0 && (
                <Radar
                  name={compareData.person.name}
                  dataKey="compare"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              )}
              <Legend
                wrapperStyle={{
                  fontSize: '14px',
                  paddingTop: '20px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {radarData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border bg-card"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate" title={item.skill}>
                {item.skill}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{item.primary.toFixed(1)}/5</span>
                <span
                  className="px-1 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${getPercentileColor(item.primaryPercentile)}20`,
                    color: getPercentileColor(item.primaryPercentile),
                  }}
                >
                  {item.primaryPercentile}%
                </span>
              </div>
            </div>
            {compareData && item.compare !== undefined && (
              <div className="text-right text-xs">
                <div className="text-muted-foreground">{item.compare.toFixed(1)}/5</div>
                <span
                  className="px-1 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${getPercentileColor(item.comparePercentile || 0)}20`,
                    color: getPercentileColor(item.comparePercentile || 0),
                  }}
                >
                  {item.comparePercentile || 0}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Percentile Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>&lt;50% (Below Average)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
          <span>50-79% (Above Average)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>80-95% (High)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>96-100% (Expert)</span>
        </div>
      </div>

      {/* Mobile Responsive List */}
      <div className="sm:hidden space-y-4">
        <h4 className="font-medium">Skill Breakdown</h4>
        <div className="space-y-2">
          {radarData.map((item, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{item.skill}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.primary.toFixed(1)}/5</div>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${getPercentileColor(item.primaryPercentile)}20`,
                      color: getPercentileColor(item.primaryPercentile),
                    }}
                  >
                    {item.primaryPercentile}% percentile
                  </span>
                </div>
              </div>
              {compareData && item.compare !== undefined && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {compareData.person.username}:
                  </span>
                  <div className="text-right">
                    <div className="text-sm">{item.compare.toFixed(1)}/5</div>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${getPercentileColor(item.comparePercentile || 0)}20`,
                        color: getPercentileColor(item.comparePercentile || 0),
                      }}
                    >
                      {item.comparePercentile || 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}