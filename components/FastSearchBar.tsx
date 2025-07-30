'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BadgeCheck } from 'lucide-react';
import type { SearchResult, User } from '@/types';
import { searchUsers } from '@/lib/constants';

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-primary/10 text-primary font-semibold px-1 rounded">
        {part}
      </span>
    ) : part
  );
};

interface FastSearchBarProps {
  onSearch: (username: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FastSearchBar({
  onSearch,
  placeholder = 'Search Torre profiles...',
  disabled = false,
}: FastSearchBarProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isLoadingAllUsers, setIsLoadingAllUsers] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [debouncedInput] = useDebounce(input, 150);

  useEffect(() => {
    if (debouncedInput) {
      const results = searchUsers(debouncedInput);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;

    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      onSearch(input.trim());
      setInput('');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setInput(suggestion.username);
    setShowSuggestions(false);
    onSearch(suggestion.username);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const fetchAllUsers = async () => {
    if (allUsers.length > 0) {
      setShowAllUsers(!showAllUsers);
      return;
    }

    setIsLoadingAllUsers(true);
    try {
      const response = await fetch('/api/users/all');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users || []);
        setShowAllUsers(true);
      } else {
        console.error('Failed to fetch all users');
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setIsLoadingAllUsers(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowAllUsers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="pl-10 h-12 rounded-xl border-2 bg-input text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
          />
        </div>
        
        <Button
          type="submit"
          disabled={!input.trim() || isSearching}
          className="h-12 px-6 bg-[#FF9500] hover:bg-[#FF9500]/90 text-white rounded-xl dark:bg-[#FF9F0A] dark:hover:bg-[#FF9F0A]/90"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="mt-3 text-center">
        <Button
          type="button"
          onClick={fetchAllUsers}
          disabled={isLoadingAllUsers}
          variant="outline"
          className="text-sm text-muted-foreground hover:text-primary hover:border-primary/50"
        >
          {isLoadingAllUsers ? 'Loading...' : showAllUsers ? 'Hide All Users' : 'Show All Users'}
        </Button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            const isFallback = suggestion.professionalHeadline === 'Torre profile lookup';

            return (
              <div
                key={suggestion.username}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`p-3 cursor-pointer border-b border-border/50 last:border-b-0 hover:bg-accent/10 ${
                  index === selectedIndex ? 'bg-accent/10' : ''
                } ${isFallback ? 'border-t-2 border-primary/30 bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm ${
                    isFallback ? 'bg-muted-foreground' : 'bg-primary'
                  }`}>
                    {isFallback ? '🔍' : suggestion.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${
                      isFallback ? 'text-muted-foreground' : 'text-card-foreground'
                    }`}>
                      {isFallback ? suggestion.name : highlightMatch(suggestion.name, input)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {isFallback ? (
                        `Try searching for username "${suggestion.username}"`
                      ) : (
                        <>@{highlightMatch(suggestion.username, input)} • {suggestion.location}</>
                      )}
                    </div>
                    {!isFallback && (
                      <div className="text-xs text-muted-foreground/70 truncate">
                        {highlightMatch(suggestion.professionalHeadline, input)}
                      </div>
                    )}
                  </div>
                  {suggestion.verified && !isFallback && (
                    <div className="relative">
                      <BadgeCheck className="w-5 h-5 text-primary" fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showAllUsers && allUsers.length > 0 && (
        <div className="mt-4 bg-card border-2 border-border rounded-xl shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 bg-muted border-b border-border rounded-t-xl">
            <h3 className="text-sm font-semibold text-card-foreground">
              All Torre Users ({allUsers.length})
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {allUsers.map((user) => (
              <div
                key={user.username}
                onClick={() => onSearch(user.username)}
                className="p-3 cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-card-foreground truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      @{user.username} • {user.location}
                    </div>
                    <div className="text-xs text-muted-foreground/70 truncate">
                      {user.professionalHeadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.verified && (
                      <div className="relative">
                        <BadgeCheck className="w-4 h-4 text-primary" fill="currentColor" />
                      </div>
                    )}
                    {user.completion && (
                      <div className="text-xs text-muted-foreground/70">
                        {user.completion}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
