import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  Home, 
  Sparkles, 
  Settings, 
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ImageFile {
  file: File;
  url: string;
  width: number;
  height: number;
}

const ImageEnhancePro = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoColorEnhance, setAutoColorEnhance] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fullView, setFullView] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      setOriginalImage({
        file,
        url,
        width: img.width,
        height: img.height
      });
      setEnhancedImage(null);
      setShowComparison(false);
      setProgress(0);
    };
    
    img.src = url;
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const simulateAIEnhancement = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = async () => {
      // Set canvas size (simulate upscaling)
      const scaleFactor = 2; // 2x upscale for demo
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      // Progress simulation
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Draw and enhance image
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the original image scaled up
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply simulated enhancements
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simulate sharpening and noise reduction
      for (let i = 0; i < data.length; i += 4) {
        if (autoColorEnhance) {
          // Enhance colors (increase saturation and contrast)
          data[i] = Math.min(255, data[i] * 1.1);     // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL
      const enhancedDataUrl = canvas.toDataURL('image/png', 0.95);
      setEnhancedImage(enhancedDataUrl);
      setShowComparison(true);
      setIsProcessing(false);
      
      toast({
        title: "Enhancement Complete!",
        description: `Image enhanced successfully with ${scaleFactor}x upscaling`,
      });
    };

    img.src = originalImage.url;
  }, [originalImage, autoColorEnhance, toast]);

  const downloadEnhanced = useCallback((format: 'png' | 'jpg') => {
    if (!enhancedImage) return;

    const link = document.createElement('a');
    link.download = `enhanced-image.${format}`;
    
    if (format === 'jpg') {
      // Convert PNG to JPG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill with white background for JPG
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      };
      
      img.src = enhancedImage;
    } else {
      link.href = enhancedImage;
      link.click();
    }

    toast({
      title: "Download Started",
      description: `Enhanced image downloaded as ${format.toUpperCase()}`,
    });
  }, [enhancedImage, toast]);

  const handleSliderDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, [isDragging]);

  const handleSliderStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleSliderEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetAll = useCallback(() => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setShowComparison(false);
    setFullView(false);
    setProgress(0);
    setIsProcessing(false);
    setSliderPosition(50);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                Image Enhance Pro
              </h1>
              <p className="text-white/80 mt-2">
                AI-powered image enhancement with 4x upscaling and smart optimization
              </p>
            </div>
          </div>
          {originalImage && (
            <Button onClick={resetAll} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {!originalImage ? (
            // Upload Section
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-12">
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragOver
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">
                        Upload Your Image
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Drag and drop your image here, or click to browse. Supports JPG, PNG, WebP up to 10MB.
                      </p>
                    </div>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg"
                    >
                      Choose Image
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            // Enhancement Section
            <div className="space-y-8">
              {/* Settings Card */}
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Enhancement Settings</h3>
                        <p className="text-muted-foreground">Configure your image enhancement options</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <Label htmlFor="auto-color" className="text-sm font-medium">
                          Auto Color Enhance
                        </Label>
                        <Switch
                          id="auto-color"
                          checked={autoColorEnhance}
                          onCheckedChange={setAutoColorEnhance}
                        />
                      </div>
                      
                      <Button
                        onClick={simulateAIEnhancement}
                        disabled={isProcessing}
                        size="lg"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Enhance Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Processing...</span>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Preview */}
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {!showComparison ? (
                    // Original Image Only
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Original Image</h3>
                        <div className="text-sm text-muted-foreground">
                          {originalImage.width} × {originalImage.height} pixels
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={originalImage.url}
                          alt="Original"
                          className="w-full h-auto max-h-96 object-contain bg-muted"
                        />
                      </div>
                    </div>
                  ) : (
                    // Interactive Comparison Slider
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Enhancement Complete
                        </h3>
                        <div className="flex items-center space-x-4">
                          <Button
                            onClick={() => setFullView(!fullView)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            {fullView ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {fullView ? 'Show Comparison' : 'Full View'}
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => downloadEnhanced('png')}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PNG
                            </Button>
                            <Button
                              onClick={() => downloadEnhanced('jpg')}
                              size="sm"
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              JPG
                            </Button>
                          </div>
                        </div>
                      </div>

                      {fullView ? (
                        // Full Enhanced Image View
                        <div className="transition-all duration-500 ease-in-out">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Enhanced Image</h4>
                          <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
                            <img
                              src={enhancedImage!}
                              alt="Enhanced"
                              className="w-full h-auto object-contain bg-muted"
                            />
                          </div>
                        </div>
                      ) : (
                        // Interactive Slider Comparison
                        <div className="max-w-4xl mx-auto">
                          <div className="text-center mb-4">
                            <p className="text-sm text-muted-foreground">
                              Drag the slider to compare original vs enhanced
                            </p>
                          </div>
                          
                          <div 
                            className="relative rounded-2xl overflow-hidden shadow-lg cursor-col-resize select-none"
                            style={{ aspectRatio: `${originalImage.width}/${originalImage.height}` }}
                            onMouseDown={handleSliderStart}
                            onMouseUp={handleSliderEnd}
                            onMouseMove={handleSliderDrag}
                            onTouchStart={handleSliderStart}
                            onTouchEnd={handleSliderEnd}
                            onTouchMove={handleSliderDrag}
                            onMouseLeave={handleSliderEnd}
                          >
                            {/* Enhanced Image (Background) */}
                            <img
                              src={enhancedImage!}
                              alt="Enhanced"
                              className="absolute inset-0 w-full h-full object-contain bg-muted"
                              draggable={false}
                            />
                            
                            {/* Original Image (Overlay with clip-path) */}
                            <div 
                              className="absolute inset-0 transition-all duration-75"
                              style={{ 
                                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                              }}
                            >
                              <img
                                src={originalImage.url}
                                alt="Original"
                                className="w-full h-full object-contain bg-muted"
                                draggable={false}
                              />
                              
                              {/* Original Label */}
                              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Original
                              </div>
                            </div>
                            
                            {/* Enhanced Label */}
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Enhanced
                            </div>
                            
                            {/* Slider Handle */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-75"
                              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                            >
                              {/* Slider Thumb */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize border-2 border-gray-200 hover:border-indigo-500 transition-colors">
                                <ArrowLeft className="h-3 w-3 text-gray-600 absolute left-2" />
                                <ArrowRight className="h-3 w-3 text-gray-600 absolute right-2" />
                              </div>
                            </div>
                            
                            {/* Hint Animation (Initial Load) */}
                            {sliderPosition === 50 && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm animate-pulse">
                                  ← Drag to compare →
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageEnhancePro;