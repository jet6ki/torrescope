'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Briefcase, Award, Github, Linkedin, Twitter, Globe, ExternalLink, MapPin, BadgeCheck, Languages } from 'lucide-react';
import { useState } from 'react';
import type { ProcessedGenome } from '@/types/torre';

interface EnhancedOverviewProps {
  data: ProcessedGenome;
}

const linkIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  portfolio: Globe,
  other: ExternalLink,
};

const detectLanguage = (text: string): string => {
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'];

  const words = text.toLowerCase().split(/\s+/);
  const englishWordCount = words.filter(word => englishWords.includes(word.replace(/[^\w]/g, ''))).length;
  const englishRatio = englishWordCount / words.length;

  return englishRatio < 0.1 ? 'non-english' : 'english';
};

export function EnhancedOverview({ data }: EnhancedOverviewProps) {
  const [translatedBio, setTranslatedBio] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const bioLanguage = data.person.bio ? detectLanguage(data.person.bio) : 'english';
  const showTranslateOption = bioLanguage === 'non-english' && data.person.bio;

  const isLongBio = data.person.bio && data.person.bio.length > 150;
  const displayBio = showOriginal ? data.person.bio : (translatedBio || data.person.bio);
  const truncatedBio = isLongBio && !isExpanded ? displayBio?.substring(0, 150) + '...' : displayBio;

  const handleTranslate = async () => {
    if (!data.person.bio || isTranslating) return;

    if (translatedBio && !showOriginal) {
      setShowOriginal(true);
      return;
    }

    if (showOriginal) {
      setShowOriginal(false);
      return;
    }

    setIsTranslating(true);
    try {
      const encodedText = encodeURIComponent(data.person.bio);
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodedText}`;

      const response = await fetch(translateUrl);
      const result = await response.json();

      if (result && result[0] && result[0][0] && result[0][0][0]) {
        setTranslatedBio(result[0][0][0]);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      const encodedText = encodeURIComponent(data.person.bio);
      window.open(`https://translate.google.com/?sl=auto&tl=en&text=${encodedText}`, '_blank');
    } finally {
      setIsTranslating(false);
    }
  };
  const stats = [
    {
      icon: TrendingUp,
      label: 'Skills',
      value: data.skills?.length || 0,
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: data.experiences?.length || 0,
    },
    {
      icon: Award,
      label: 'Complete',
      value: `${Math.round((data.person.completion || 0) * 100)}%`,
    }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{
          scale: 1.01,
          y: -2,
          transition: { duration: 0.15, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.99 }}
        className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
        tabIndex={0}
      >
        <div className="flex items-start gap-6">
          {/* Info */}
          <div className="flex-1 space-y-4 text-left">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontSize: '24px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
                  {data.person.name}
                </h2>
                {data.person.verified && (
                  <div className="relative">
                    <BadgeCheck className="w-6 h-6 text-blue-500" fill="currentColor" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-base" style={{ fontSize: '16px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>
                @{data.person.username}
              </p>
            </div>

            {data.person.professionalHeadline && (
              <p className="text-foreground text-base" style={{ fontSize: '16px', lineHeight: '1.5', color: 'hsl(var(--foreground))' }}>
                {data.person.professionalHeadline}
              </p>
            )}

            {/* Bio/Intro */}
            {data.person.bio && data.person.bio.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4 space-y-2"
              >
                <div className="relative group">
                  <motion.div
                    onClick={showTranslateOption ? handleTranslate : undefined}
                    className={`text-muted-foreground leading-relaxed relative ${
                      showTranslateOption ? 'cursor-pointer' : ''
                    }`}
                    style={{ fontSize: '15px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))' }}
                    whileHover={showTranslateOption ? { scale: 1.005 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Subtle highlight for translatable text */}
                    {showTranslateOption && (
                      <motion.div
                        className="absolute inset-0 bg-accent/5 rounded-lg -m-2 p-2"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Bio text with animation */}
                    <motion.span
                      key={showOriginal ? 'original' : 'translated'}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      {isTranslating ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          Translating...
                        </span>
                      ) : (
                        truncatedBio
                      )}
                    </motion.span>

                    {/* Small translate indicator */}
                    {showTranslateOption && !isTranslating && (
                      <motion.span
                        className="inline-flex items-center ml-2 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Languages className="w-3 h-3" />
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Show more/less for long bios */}
                  {isLongBio && (
                    <motion.button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-sm font-medium hover:underline transition-all duration-200 mt-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded text-accent dark:text-accent"
                      style={{ color: '#FF7A00' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </motion.button>
                  )}
                </div>

                {/* Translation status */}
                {translatedBio && !showOriginal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-xs text-accent"
                  >
                    <Languages className="w-3 h-3" />
                    <span>Translated • Click to show original</span>
                  </motion.div>
                )}

                {translatedBio && showOriginal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <span>Original text • Click to show translation</span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Location */}
            {data.person.location?.name && (
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span style={{ fontSize: '15px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>
                  {data.person.location.name}
                </span>
              </div>
            )}

            {/* Social Links - Icons Only */}
            {data.person.links && data.person.links.length > 0 && (
              <div className="flex gap-3">
                {data.person.links.slice(0, 5).map((link) => {
                  const IconComponent = linkIcons[link.icon || 'other'];
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-secondary hover:bg-accent hover:text-accent-foreground rounded-xl flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Visit ${link.name}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
            {/* Dynamic gradient based on theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-300 dark:via-orange-400 dark:to-orange-500 transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 dark:to-white/5" />
            <span className="relative z-10 text-white font-bold text-2xl drop-shadow-lg">
              {data.person.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{
                scale: 1.01,
                y: -2,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.99 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
              tabIndex={0}
            >
              <Icon className="w-8 h-8 mx-auto mb-4" style={{ color: '#FF9500' }} />
              <div className="text-3xl font-bold text-foreground mb-2" style={{ fontSize: '28px', lineHeight: '1.2', color: 'hsl(var(--foreground))' }}>
                {stat.value}
              </div>
              <div className="text-muted-foreground" style={{ fontSize: '15px', lineHeight: '1.4', color: 'hsl(var(--muted-foreground))' }}>
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top Skills Preview */}
      {data.skills && data.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{
            scale: 1.01,
            y: -2,
            transition: { duration: 0.15, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.99 }}
          className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
          tabIndex={0}
        >
          <h3 className="text-xl font-semibold mb-6 text-foreground" style={{ fontSize: '20px', lineHeight: '1.4', color: 'hsl(var(--foreground))' }}>
            Top Skills
          </h3>
          <div className="space-y-4">
            {data.skills.slice(0, 5).map((skill, index) => (
              <div key={skill.name} className="flex items-center justify-between">
                <span className="text-foreground font-normal" style={{ fontSize: '15px', lineHeight: '1.5', color: 'hsl(var(--foreground))' }}>
                  {skill.name}
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#FF9500' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.max((skill.percentile / 100) * 100, 8), 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-muted-foreground font-medium w-12 text-right" style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
                    {skill.percentile}th
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
