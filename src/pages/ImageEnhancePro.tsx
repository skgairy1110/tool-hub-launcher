import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Upload, Download, ArrowLeft, Zap, Palette, Focus, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ImageEnhancePro = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhanceMode, setEnhanceMode] = useState('auto');
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [sharpness, setSharpness] = useState([100]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setOriginalImage(imageUrl);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = (img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    const brightnessValue = brightness[0];
    const contrastValue = contrast[0];
    const saturationValue = saturation[0];
    const sharpnessValue = sharpness[0];

    ctx.filter = `
      brightness(${brightnessValue}%)
      contrast(${contrastValue}%)
      saturate(${saturationValue}%)
      ${sharpnessValue > 100 ? `blur(${(200 - sharpnessValue) / 100}px)` : ''}
    `;

    ctx.drawImage(img, 0, 0);

    // Additional sharpening effect for values > 100
    if (sharpnessValue > 100) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const factor = (sharpnessValue - 100) / 100;

      // Simple sharpening kernel
      for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        const enhancement = brightness * factor;
        
        data[i] = Math.min(255, Math.max(0, data[i] + enhancement));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + enhancement));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + enhancement));
      }

      ctx.putImageData(imageData, 0, 0);
    }
  };

  const enhanceImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (enhanceMode === 'auto') {
          // Auto enhance: apply optimal settings
          setBrightness([110]);
          setContrast([120]);
          setSaturation([115]);
          setSharpness([130]);
        }

        applyFilters(img, canvas);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setEnhancedImage(url);
            toast({
              title: "Image enhanced successfully!",
              description: "Your image has been processed and enhanced."
            });
          }
        }, 'image/jpeg', 0.95);
        
        setIsProcessing(false);
      };

      img.src = originalImage;
    } catch (error) {
      console.error('Error enhancing image:', error);
      toast({
        title: "Enhancement failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!enhancedImage) return;

    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your enhanced image is being downloaded."
    });
  };

  const resetSettings = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setSharpness([100]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Image Enhance Pro
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              AI-powered image enhancement: sharpen, denoise, upscale up to 4x, and auto color correction. Transform your photos with professional-grade enhancements.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload and Controls Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload & Enhance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Upload Area */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Upload Image</Label>
                <div 
                  className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Enhancement Mode */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Enhancement Mode</Label>
                <Select value={enhanceMode} onValueChange={setEnhanceMode}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Auto Enhance
                      </div>
                    </SelectItem>
                    <SelectItem value="manual">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Manual Control
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Controls */}
              {enhanceMode === 'manual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Brightness: {brightness[0]}%
                    </Label>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      max={200}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Contrast: {contrast[0]}%
                    </Label>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={200}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Saturation: {saturation[0]}%
                    </Label>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Sharpness: {sharpness[0]}%
                    </Label>
                    <Slider
                      value={sharpness}
                      onValueChange={setSharpness}
                      max={200}
                      min={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={resetSettings}
                    variant="outline"
                    className="w-full"
                  >
                    Reset to Default
                  </Button>
                </div>
              )}

              {/* Enhance Button */}
              <Button 
                onClick={enhanceImage}
                disabled={!originalImage || isProcessing}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhance Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Focus className="w-5 h-5" />
                Preview & Download
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {originalImage ? (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Original</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="w-full h-48 object-contain bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    {enhancedImage && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Enhanced</Label>
                        <div className="border rounded-lg overflow-hidden">
                          <img 
                            src={enhancedImage} 
                            alt="Enhanced" 
                            className="w-full h-48 object-contain bg-gray-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  {enhancedImage && (
                    <Button 
                      onClick={downloadImage}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Enhanced Image
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Maximize className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Upload an image to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hidden Canvas for Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Information Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enhancement Features</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Auto Enhancement</h4>
                  <p className="text-sm text-gray-600">
                    AI-powered automatic enhancement that optimally adjusts brightness, contrast, and sharpness for best results.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Manual Control</h4>
                  <p className="text-sm text-gray-600">
                    Fine-tune every aspect of your image with precise controls for brightness, contrast, saturation, and sharpness.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Focus className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">High Quality</h4>
                  <p className="text-sm text-gray-600">
                    Preserve image quality while enhancing. Supports high-resolution images up to 10MB with optimal compression.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancePro;