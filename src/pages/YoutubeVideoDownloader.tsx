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

  const getVideoInfo = async () => {
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Try to get video title from OpenGraph data
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      const data = await response.json();
      
      setVideoInfo({
        title: data.title || "YouTube Video",
        duration: "Duration varies",
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      });

      toast({
        title: "Video Found",
        description: "Video information loaded successfully",
      });
    } catch (error) {
      // Fallback if API fails
      setVideoInfo({
        title: "YouTube Video",
        duration: "Duration varies", 
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      });

      toast({
        title: "Video Found",
        description: "Video ready for download",
      });
    }
  };

  const downloadVideo = async () => {
    if (!videoInfo) return;

    try {
      toast({
        title: "Starting Download",
        description: "Processing video download...",
      });

      // Try the Supabase function first
      const response = await fetch('/functions/v1/download-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: youtubeUrl,
          format: selectedFormat
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          // If we get JSON, it means direct download isn't available
          const data = await response.json();
          if (data.downloadUrls) {
            // Open the first download service in a new tab
            window.open(data.downloadUrls[0], '_blank');
            toast({
              title: "Download Service Opened",
              description: "Please use the opened download service to get your video.",
            });
            return;
          }
        } else {
          // Direct download available
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${videoInfo.title}.mp4`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
            title: "Download Complete",
            description: "Video has been downloaded successfully!",
          });
          return;
        }
      }

      // Fallback to download services
      const videoId = extractVideoId(youtubeUrl);
      if (videoId) {
        const downloadServices = [
          `https://y2mate.com/youtube/${videoId}`,
          `https://ssyoutube.com/watch?v=${videoId}`,
          `https://savefrom.net/#url=${encodeURIComponent(youtubeUrl)}`
        ];
        
        // Open the first service
        window.open(downloadServices[0], '_blank');
        
        toast({
          title: "Download Service Opened",
          description: "Please use the opened download service to get your video.",
        });
      }

    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback to external download services
      const videoId = extractVideoId(youtubeUrl);
      if (videoId) {
        window.open(`https://y2mate.com/youtube/${videoId}`, '_blank');
        toast({
          title: "Download Service Opened",
          description: "Direct download failed. Please use the opened service.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Download Failed", 
          description: "Unable to download video. Please check the URL.",
          variant: "destructive",
        });
      }
    }
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

                  <div className="space-y-6">
                    <Button 
                      onClick={downloadVideo}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Try Direct Download
                    </Button>

                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-lg mb-2">Alternative Download Services</h4>
                        <p className="text-sm text-muted-foreground">
                          If direct download doesn't work, try these reliable services
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: "Y2mate", url: `https://y2mate.com/youtube/${extractVideoId(youtubeUrl)}`, color: "bg-blue-500 hover:bg-blue-600" },
                          { name: "SaveFrom", url: `https://savefrom.net/#url=${encodeURIComponent(youtubeUrl)}`, color: "bg-green-500 hover:bg-green-600" },
                          { name: "KeepVid", url: `https://keepvid.com/?url=${encodeURIComponent(youtubeUrl)}`, color: "bg-purple-500 hover:bg-purple-600" },
                          { name: "YTMate", url: `https://ytmate.com/en/youtube-downloader/${extractVideoId(youtubeUrl)}`, color: "bg-indigo-500 hover:bg-indigo-600" },
                          { name: "9xBuddy", url: `https://9xbuddy.com/process?url=${encodeURIComponent(youtubeUrl)}`, color: "bg-pink-500 hover:bg-pink-600" },
                          { name: "VideoGrab", url: `https://videograbber.net/youtube-downloader?url=${encodeURIComponent(youtubeUrl)}`, color: "bg-teal-500 hover:bg-teal-600" },
                          { name: "ClipGrab", url: `https://clipgrab.org/`, color: "bg-orange-500 hover:bg-orange-600" },
                          { name: "YT1s", url: `https://yt1s.com/youtube-to-mp4/${extractVideoId(youtubeUrl)}`, color: "bg-red-500 hover:bg-red-600" },
                          { name: "Converto", url: `https://converto.io/youtube-converter/?url=${encodeURIComponent(youtubeUrl)}`, color: "bg-cyan-500 hover:bg-cyan-600" }
                        ].map((service, index) => (
                          <Button
                            key={index}
                            onClick={() => window.open(service.url, '_blank')}
                            className={`${service.color} text-white text-xs px-3 py-2 h-auto min-h-[3rem] flex flex-col items-center justify-center gap-1`}
                            size="sm"
                          >
                            <Download className="w-3 h-3" />
                            <span className="text-center leading-tight">{service.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
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