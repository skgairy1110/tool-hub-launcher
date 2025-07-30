import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Palette, Copy, Download, Shuffle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

const ColorGenie = () => {
  const [imageColors, setImageColors] = useState<string[]>([]);
  const [trendingPalette, setTrendingPalette] = useState<ColorPalette | null>(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Trending color palettes based on current design trends
  const trendingPalettes: ColorPalette[] = [
    {
      id: '1',
      name: 'Digital Sunset',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    },
    {
      id: '2', 
      name: 'Modern Minimalist',
      colors: ['#2C3E50', '#34495E', '#95A5A6', '#BDC3C7', '#ECF0F1']
    },
    {
      id: '3',
      name: 'Warm Earth',
      colors: ['#D35400', '#E67E22', '#F39C12', '#F4D03F', '#F8C471']
    },
    {
      id: '4',
      name: 'Ocean Breeze',
      colors: ['#1ABC9C', '#16A085', '#2ECC71', '#27AE60', '#3498DB']
    },
    {
      id: '5',
      name: 'Purple Dreams',
      colors: ['#9B59B6', '#8E44AD', '#E74C3C', '#C0392B', '#F39C12']
    },
    {
      id: '6',
      name: 'Forest Vibes',
      colors: ['#27AE60', '#2ECC71', '#16A085', '#1ABC9C', '#F4D03F']
    },
    {
      id: '7',
      name: 'Neon Future',
      colors: ['#00D4FF', '#FF007F', '#39FF14', '#FFFF00', '#FF4500']
    },
    {
      id: '8',
      name: 'Soft Pastels',
      colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C']
    }
  ];

  const extractColorsFromImage = (file: File) => {
    setIsExtractingColors(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size
      const maxSize = 400;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Extract colors using a simple sampling method
        const colorMap = new Map<string, number>();
        const sampleRate = 4; // Sample every 4th pixel
        
        for (let i = 0; i < data.length; i += 4 * sampleRate) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha < 128) continue;
          
          // Convert to hex
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
          
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
        
        // Get the most frequent colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([color]) => color);
        
        setImageColors(sortedColors);
        setIsExtractingColors(false);
        
        toast({
          title: "Colors Extracted!",
          description: `Found ${sortedColors.length} dominant colors from your image.`,
        });
      }
    };
    
    img.onerror = () => {
      setIsExtractingColors(false);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try another file.",
        variant: "destructive",
      });
    };
    
    img.src = URL.createObjectURL(file);
    setUploadedImage(img.src);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        extractColorsFromImage(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a valid image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const generateRandomPalette = () => {
    const randomPalette = trendingPalettes[Math.floor(Math.random() * trendingPalettes.length)];
    setTrendingPalette(randomPalette);
    
    toast({
      title: "New Palette Generated!",
      description: `Generated "${randomPalette.name}" color palette.`,
    });
  };

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${color} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy color to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadPalette = (colors: string[], name: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const swatchSize = 100;
      canvas.width = colors.length * swatchSize;
      canvas.height = swatchSize + 40; // Extra space for text
      
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      colors.forEach((color, index) => {
        // Draw color swatch
        ctx.fillStyle = color;
        ctx.fillRect(index * swatchSize, 0, swatchSize, swatchSize);
        
        // Draw hex code
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(color, index * swatchSize + swatchSize / 2, swatchSize + 20);
      });
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${name.replace(/\s+/g, '_')}_palette.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Downloaded!",
            description: "Color palette saved as PNG.",
          });
        }
      });
    }
  };

  const ColorSwatch = ({ color, size = 'lg' }: { color: string; size?: 'sm' | 'lg' }) => {
    const sizeClasses = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className={`${sizeClasses} rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer transition-transform hover:scale-105`}
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
          role="button"
          aria-label={`Copy color ${color}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              copyToClipboard(color);
            }
          }}
        />
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-muted-foreground">{color}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(color)}
            aria-label={`Copy ${color} to clipboard`}
          >
            {copiedColor === color ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-violet-950/20 dark:via-gray-900 dark:to-pink-950/20">
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

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white mb-4">
            <Palette className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            ColorGenie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Extract beautiful color palettes from images or generate trending color combinations for your next design project.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Image Palette Section */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Image Palette
              </CardTitle>
              <CardDescription>
                Upload any image to extract its dominant colors as a beautiful palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-violet-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload image file"
                />
                
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded image" 
                      className="max-h-32 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-muted-foreground">Click to upload a different image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Upload an image</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {isExtractingColors && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">Extracting colors...</span>
                </div>
              )}

              {/* Extracted Colors */}
              {imageColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Extracted Colors</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPalette(imageColors, 'Image_Palette')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {imageColors.map((color, index) => (
                      <ColorSwatch key={`${color}-${index}`} color={color} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trending Colors Section */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5" />
                Trending Colors
              </CardTitle>
              <CardDescription>
                Generate random color palettes based on current design trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={generateRandomPalette}
                className="w-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Generate Random Palette
              </Button>

              {trendingPalette && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{trendingPalette.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPalette(trendingPalette.colors, trendingPalette.name)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {trendingPalette.colors.map((color, index) => (
                      <ColorSwatch key={`${color}-${index}`} color={color} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Palettes Preview */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Sample Trending Palettes</h4>
                <div className="space-y-2">
                  {trendingPalettes.slice(0, 3).map((palette) => (
                    <div key={palette.id} className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{palette.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Smart Color Extraction</h3>
            <p className="text-sm text-muted-foreground">
              Advanced algorithms extract the most dominant and visually appealing colors from any image
            </p>
          </Card>
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Trending Palettes</h3>
            <p className="text-sm text-muted-foreground">
              Curated color combinations based on current design trends and color theory
            </p>
          </Card>
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-center p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Export & Share</h3>
            <p className="text-sm text-muted-foreground">
              Copy hex codes instantly or download palettes as PNG files for your projects
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorGenie;