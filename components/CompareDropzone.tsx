'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, User, FileText, X } from 'lucide-react';
import { useCompareStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { ProcessedGenome } from '@/types/torre';

export function CompareDropzone() {
  const [uploadedData, setUploadedData] = useState<ProcessedGenome | null>(null);
  const { setCompareUsername, setCompareData } = useCompareStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('Please upload a JSON file');
      return;
    }

    if (file.size > 1024 * 1024) {
      // 1MB limit
      toast.error('File too large. Please upload a file smaller than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // Validate the JSON structure
        if (!jsonData.username || !Array.isArray(jsonData.skills)) {
          toast.error('Invalid genome format. Expected {username, skills}');
          return;
        }

        // Validate skills structure
        const isValidSkills = jsonData.skills.every(
          (skill: any) =>
            skill.name &&
            typeof skill.proficiency === 'number' &&
            typeof skill.percentile === 'number'
        );

        if (!isValidSkills) {
          toast.error('Invalid skills format in JSON file');
          return;
        }

        const processedData: ProcessedGenome = {
          username: jsonData.username,
          skills: jsonData.skills.slice(0, 20), // Limit to 20 skills
        };

        setUploadedData(processedData);
        setCompareData(processedData);
        toast.success(`Loaded genome for ${processedData.username}`);
      } catch (error) {
        toast.error('Failed to parse JSON file');
        console.error('JSON parse error:', error);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  }, [setCompareData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
    maxSize: 1024 * 1024, // 1MB
  });

  const handleUsernameSearch = (username: string) => {
    setCompareUsername(username);
    setUploadedData(null);
  };

  const handleRemoveUpload = () => {
    setUploadedData(null);
    setCompareData(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Add Comparison</h3>
        <p className="text-sm text-muted-foreground">
          Compare with another user or upload a JSON genome file
        </p>
      </div>

      <Tabs defaultValue="username" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="username" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>By Username</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload JSON</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="username" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <SearchBar
                onSearch={handleUsernameSearch}
                placeholder="Enter second Torre username..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          {uploadedData ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">{uploadedData.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {uploadedData.skills.length} skills loaded
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleRemoveUpload}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent
                {...getRootProps()}
                className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-4">
                  <Upload
                    className={`mx-auto h-12 w-12 ${
                      isDragActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isDragActive
                        ? 'Drop the JSON file here'
                        : 'Drag & drop a JSON file here, or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports Torre genome JSON files (max 1MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* JSON Format Example */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View expected JSON format
            </summary>
            <Card className="mt-2">
              <CardContent className="p-3">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(
                    {
                      username: 'johndoe',
                      skills: [
                        {
                          name: 'JavaScript',
                          proficiency: 4.5,
                          percentile: 85,
                        },
                        {
                          name: 'React',
                          proficiency: 4.2,
                          percentile: 78,
                        },
                      ],
                    },
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>
          </details>
        </TabsContent>
      </Tabs>
    </div>
  );
}