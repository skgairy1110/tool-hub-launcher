import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Video, AlertCircle, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const InstagramDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const { toast } = useToast();

  const validateInstagramUrl = (url: string) => {
    const instagramPattern = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
    return instagramPattern.test(url);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an Instagram video URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateInstagramUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Instagram video URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in real implementation, this would call a backend service
    setTimeout(() => {
      setVideoData({
        title: "Sample Instagram Video",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
        duration: "0:45",
        quality: "HD",
        size: "12.5 MB",
        formats: [
          { quality: "HD (1080p)", size: "12.5 MB", format: "MP4" },
          { quality: "SD (720p)", size: "8.2 MB", format: "MP4" },
          { quality: "Mobile (480p)", size: "4.1 MB", format: "MP4" }
        ]
      });
      setIsLoading(false);
      toast({
        title: "Video Found!",
        description: "Select your preferred quality to download",
      });
    }, 2000);
  };

  const handleFormatDownload = (format: any) => {
    toast({
      title: "Download Started",
      description: `Downloading ${format.quality} video...`,
    });
    
    // Create a mock download using free sample video service
    const mockVideoUrl = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
    const fileName = `instagram_video_${format.quality.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mp4`;
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = mockVideoUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearResults = () => {
    setVideoData(null);
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
            <Video className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Instagram Video Downloader
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Download Instagram videos, reels, and stories in high quality. Just paste the URL and get your video instantly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Free • No watermarks • High quality</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {!videoData ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram Video URL</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="https://www.instagram.com/p/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                      />
                      <Button 
                        onClick={handleDownload} 
                        disabled={isLoading}
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? 'Processing...' : 'Download'}
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">How to use:</h3>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Open Instagram and find the video you want to download</li>
                      <li>2. Copy the video URL from your browser or the share menu</li>
                      <li>3. Paste the URL above and click Download</li>
                      <li>4. Choose your preferred quality and download</li>
                    </ol>
                  </div>

                  {/* Supported Types */}
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
                      <Video className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-medium">Video Posts</h4>
                      <p className="text-sm text-muted-foreground">Regular video posts</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <Play className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium">Reels</h4>
                      <p className="text-sm text-muted-foreground">Short-form videos</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <ExternalLink className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">IGTV</h4>
                      <p className="text-sm text-muted-foreground">Long-form content</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Video Preview & Download Options */
            <div className="space-y-6">
              {/* Video Preview */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={videoData.thumbnail} 
                        alt="Video thumbnail"
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{videoData.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Duration: {videoData.duration}</span>
                        <Badge variant="secondary">{videoData.quality}</Badge>
                        <span>Size: {videoData.size}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={clearResults}>
                      Try Another
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Download Options */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Choose Quality & Download</h3>
                  <div className="space-y-3">
                    {videoData.formats.map((format: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="font-medium">{format.quality}</div>
                          <div className="text-sm text-muted-foreground">
                            {format.format} • {format.size}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleFormatDownload(format)}
                          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Privacy & Terms</p>
                      <p className="text-yellow-700">
                        Only download videos you have permission to use. Respect copyright and Instagram's terms of service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Choose Our Downloader?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">High Quality</h3>
              <p className="text-muted-foreground text-sm">Download videos in original quality up to 1080p HD</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">All Formats</h3>
              <p className="text-muted-foreground text-sm">Supports posts, reels, IGTV, and stories</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">No Registration</h3>
              <p className="text-muted-foreground text-sm">Use instantly without any sign-up required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramDownloader;