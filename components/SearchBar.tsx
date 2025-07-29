'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface SearchBarProps {
  onSearch: (username: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Enter Torre username...',
  disabled = false,
}: SearchBarProps) {
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedInput] = useDebounce(input, 300);

  // Handle debounced search
  useEffect(() => {
    if (debouncedInput.trim() && debouncedInput.length >= 2) {
      setIsSearching(true);
      onSearch(debouncedInput.trim());
      setIsSearching(false);
    }
  }, [debouncedInput, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && input.length >= 2) {
      setIsSearching(true);
      onSearch(input.trim());
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic input sanitization
    const sanitized = value.replace(/[^a-zA-Z0-9._-]/g, '');
    setInput(sanitized);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          disabled={disabled}
          className="pr-10"
          maxLength={50}
          minLength={2}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <Button
        type="submit"
        disabled={disabled || !input.trim() || input.length < 2}
        size="default"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}