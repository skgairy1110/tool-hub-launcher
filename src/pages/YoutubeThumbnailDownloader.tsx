import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Youtube, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const YoutubeThumbnailDownloader = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnails, setThumbnails] = useState<Array<{quality: string, url: string, size: string}>>([]);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const generateThumbnails = () => {
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setVideoId(id);
    const thumbnailData = [
      {
        quality: "Max Resolution",
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        size: "1280x720"
      },
      {
        quality: "Standard Definition",
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
        size: "640x480"
      },
      {
        quality: "High Quality",
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        size: "480x360"
      },
      {
        quality: "Medium Quality",
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        size: "320x180"
      },
      {
        quality: "Default",
        url: `https://img.youtube.com/vi/${id}/default.jpg`,
        size: "120x90"
      }
    ];
    setThumbnails(thumbnailData);
  };

  const downloadThumbnail = (url: string, quality: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `youtube-thumbnail-${videoId}-${quality.toLowerCase().replace(' ', '-')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${quality} thumbnail`,
    });
  };

  const copyThumbnailUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Thumbnail URL copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white mb-4">
              <Youtube className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              YouTube Thumbnail Downloader
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download high-quality thumbnails from any YouTube video in multiple resolutions. Just paste the YouTube URL and get instant access to all available thumbnail sizes.
            </p>
          </div>

          {/* URL Input Section */}
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Enter YouTube URL</CardTitle>
              <CardDescription className="text-center">
                Paste any YouTube video URL to extract thumbnails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={generateThumbnails}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                  disabled={!youtubeUrl.trim()}
                >
                  Generate Thumbnails
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnails Grid */}
          {thumbnails.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Available Thumbnails</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {thumbnails.map((thumbnail, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{thumbnail.quality}</CardTitle>
                      <CardDescription>{thumbnail.size}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={thumbnail.url}
                          alt={`${thumbnail.quality} thumbnail`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadThumbnail(thumbnail.url, thumbnail.quality)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => copyThumbnailUrl(thumbnail.url)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Resolutions</h3>
              <p className="text-sm text-muted-foreground">
                Download thumbnails in all available resolutions from 120x90 to 1280x720
              </p>
            </Card>
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white mx-auto mb-4">
                <Youtube className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Works with Any Video</h3>
              <p className="text-sm text-muted-foreground">
                Extract thumbnails from any public YouTube video instantly
              </p>
            </Card>
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white mx-auto mb-4">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Copy URLs</h3>
              <p className="text-sm text-muted-foreground">
                Easily copy thumbnail URLs to use in your projects
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeThumbnailDownloader;