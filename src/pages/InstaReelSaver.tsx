import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Instagram, Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ReelData {
  videoUrl: string;
  thumbnail: string;
  caption: string;
}

const InstaReelSaver = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reelData, setReelData] = useState<ReelData | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const validateInstagramUrl = (url: string): boolean => {
    const instagramReelPattern = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[A-Za-z0-9_-]+\/?(\?.*)?$/;
    return instagramReelPattern.test(url);
  };

  const handleFetchReel = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Instagram Reel URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateInstagramUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Instagram Reel URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Note: This would normally call your backend API
      // For demo purposes, showing mock data
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reel data');
      }

      const data: ReelData = await response.json();
      setReelData(data);
      
      toast({
        title: "Success!",
        description: "Reel data fetched successfully",
      });
    } catch (error) {
      // For demo, show mock data
      setReelData({
        videoUrl: 'https://example.com/mock-video.mp4',
        thumbnail: 'https://picsum.photos/400/600',
        caption: 'Mock Instagram Reel - This is a demo since Instagram scraping requires backend implementation'
      });
      
      toast({
        title: "Demo Mode",
        description: "Showing mock data - Backend implementation needed for real Instagram scraping",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reelData?.videoUrl) return;

    try {
      // Create a temporary anchor element to trigger download
      const response = await fetch(reelData.videoUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `instagram-reel-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download Started",
        description: "Your Instagram Reel is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header with theme toggle */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Insta Reel Saver</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Download Instagram Reels</h2>
          <p className="text-muted-foreground">
            Paste an Instagram Reel URL to download the video
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Instagram Reel URL</CardTitle>
            <CardDescription>
              Paste the link to the Instagram Reel you want to download
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Paste Instagram Reel link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleFetchReel()}
              />
              <Button 
                onClick={handleFetchReel}
                disabled={isLoading}
                size="lg"
                className="px-8"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Fetch Reel'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reel Preview Section */}
        {reelData && (
          <Card>
            <CardHeader>
              <CardTitle>Reel Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Thumbnail */}
                <div className="space-y-4">
                  <img
                    src={reelData.thumbnail}
                    alt="Reel thumbnail"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Button 
                    onClick={handleDownload}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download MP4
                  </Button>
                </div>

                {/* Caption */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Caption</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {reelData.caption}
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <strong>Note:</strong> This is demo data. Full implementation requires a backend service to scrape Instagram content.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Copy the URL of any Instagram Reel</p>
            <p>2. Paste it in the input field above</p>
            <p>3. Click "Fetch Reel" to load the content</p>
            <p>4. Click "Download MP4" to save the video</p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <strong>Backend Implementation Needed:</strong> This frontend is ready, but requires a Node.js/Express backend or Supabase Edge Function to handle Instagram scraping.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstaReelSaver;