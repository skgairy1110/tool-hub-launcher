import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Youtube, Video, Music, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const YoutubeVideoDownloader = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<{title: string, duration: string, thumbnail: string} | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('mp4-720p');
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVideoInfo = () => {
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    // Simulate getting video info (in real implementation, you'd use YouTube API)
    setVideoInfo({
      title: "Sample Video Title",
      duration: "10:30",
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    });

    toast({
      title: "Video Found",
      description: "Video information loaded successfully",
    });
  };

  const downloadVideo = () => {
    if (!videoInfo) return;

    // Note: This is a UI simulation. Actual downloading would require a backend service
    // that complies with YouTube's Terms of Service and copyright laws
    toast({
      title: "Download Started",
      description: `Downloading video in ${selectedFormat} format. Please note: This is a demonstration interface.`,
    });
  };

  const formatOptions = [
    { value: 'mp4-1080p', label: 'MP4 - 1080p (High Quality)', icon: Video },
    { value: 'mp4-720p', label: 'MP4 - 720p (Standard)', icon: Video },
    { value: 'mp4-480p', label: 'MP4 - 480p (Medium)', icon: Video },
    { value: 'mp3-320', label: 'MP3 - 320kbps (Audio Only)', icon: Music },
    { value: 'mp3-128', label: 'MP3 - 128kbps (Audio Only)', icon: Music },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white mb-4">
              <Youtube className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              YouTube Video Downloader
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download YouTube videos in various formats and quality options. Support for MP4 video downloads and MP3 audio extraction.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <FileText className="w-4 h-4 inline mr-2" />
              <strong>Legal Notice:</strong> Please ensure you have permission to download content and comply with YouTube's Terms of Service and copyright laws.
            </div>
          </div>

          {/* URL Input Section */}
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Enter YouTube URL</CardTitle>
              <CardDescription className="text-center">
                Paste any YouTube video URL to start the download process
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
                  onClick={getVideoInfo}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  disabled={!youtubeUrl.trim()}
                >
                  Get Video Info
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Video Info & Download Section */}
          {videoInfo && (
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Video Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={videoInfo.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{videoInfo.title}</h3>
                    <p className="text-muted-foreground">Duration: {videoInfo.duration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Format & Quality</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formatOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={downloadVideo}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Download in MP4 video formats or extract audio as MP3 files
              </p>
            </Card>
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Quality Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose from various quality settings from 480p to 1080p
              </p>
            </Card>
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-4">
                <Youtube className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Simply paste the YouTube URL and select your preferred format
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideoDownloader;