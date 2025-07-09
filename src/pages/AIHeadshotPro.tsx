import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Upload, Download, RotateCcw, Sparkles, User, Camera, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProcessingStep {
  id: string;
  label: string;
  completed: boolean;
}

const AIHeadshotPro = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('business-formal');
  const [selectedBackground, setSelectedBackground] = useState('white');
  const [isComparisonMode, setIsComparisonMode] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [autoColorEnhance, setAutoColorEnhance] = useState(true);
  const [smilingEnhancement, setSmilingEnhancement] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const processingSteps: ProcessingStep[] = [
    { id: 'detect', label: 'Detecting face and alignment', completed: false },
    { id: 'crop', label: 'Cropping to headshot framing', completed: false },
    { id: 'background', label: 'Removing background', completed: false },
    { id: 'enhance', label: 'Enhancing lighting and skin tone', completed: false },
    { id: 'retouch', label: 'Applying professional retouching', completed: false },
    { id: 'finalize', label: 'Finalizing professional headshot', completed: false }
  ];

  const styles = [
    { id: 'business-formal', name: 'Business Formal', description: 'Clean, corporate look' },
    { id: 'creative-soft', name: 'Creative Soft', description: 'Artistic, warm tone' },
    { id: 'warm-lighting', name: 'Warm Lighting', description: 'Natural, inviting glow' }
  ];

  const backgrounds = [
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'light-grey', name: 'Light Grey', color: '#f5f5f5' },
    { id: 'gradient', name: 'Studio Gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  ];

  const handleImageUpload = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setEnhancedImage(null);
      setCurrentStep(0);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const simulateProcessing = useCallback(async () => {
    setIsProcessing(true);
    setCurrentStep(0);

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep(i + 1);
    }

    // Simulate enhanced result (in real implementation, this would be AI processing)
    setEnhancedImage(uploadedImage);
    setIsProcessing(false);
    setIsComparisonMode(true);
    setSliderPosition(50);

    toast({
      title: "Headshot Generated!",
      description: "Your professional headshot is ready for download.",
    });
  }, [uploadedImage, toast]);

  const handleSliderMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  }, []);

  const downloadImage = useCallback(() => {
    if (!enhancedImage) return;
    
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'professional-headshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your professional headshot is being downloaded.",
    });
  }, [enhancedImage, toast]);

  const retakePhoto = useCallback(() => {
    setUploadedImage(null);
    setEnhancedImage(null);
    setCurrentStep(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Headshot Pro
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your selfies into studio-quality professional headshots in minutes. 
            Perfect for LinkedIn, resumes, and personal branding.
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Upload', 'Enhance', 'Compare', 'Download'].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < (enhancedImage ? 4 : uploadedImage ? 1 : 0) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < (enhancedImage ? 4 : uploadedImage ? 1 : 0) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
              {index < 3 && <div className="w-8 h-px bg-muted mx-2" />}
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          {!uploadedImage ? (
            // Upload Section
            <Card className="border-dashed border-2 border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div
                  className="text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="mb-6">
                    <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Upload Your Selfie</h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop your photo here, or click to browse
                    </p>
                  </div>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Choose Photo
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="mt-6 text-sm text-muted-foreground space-y-1">
                    <p><strong>Best results:</strong> Clear, front-facing photos with good lighting</p>
                    <p>Supported: JPG, PNG (max 10MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Style Options</h3>
                    <div className="space-y-3">
                      {styles.map((style) => (
                        <div
                          key={style.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedStyle === style.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-muted hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <div className="font-medium">{style.name}</div>
                          <div className="text-sm text-muted-foreground">{style.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Background</h3>
                    <div className="space-y-3">
                      {backgrounds.map((bg) => (
                        <div
                          key={bg.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedBackground === bg.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-muted hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedBackground(bg.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ background: bg.color }}
                            />
                            <span className="font-medium">{bg.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Enhancement Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Auto Color Enhance</div>
                          <div className="text-sm text-muted-foreground">Improve colors and lighting</div>
                        </div>
                        <Switch
                          checked={autoColorEnhance}
                          onCheckedChange={setAutoColorEnhance}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Smiling Enhancement</div>
                          <div className="text-sm text-muted-foreground">Subtle expression adjustment</div>
                        </div>
                        <Switch
                          checked={smilingEnhancement}
                          onCheckedChange={setSmilingEnhancement}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Background Blur</div>
                          <div className="text-sm text-muted-foreground">Subtle depth effect</div>
                        </div>
                        <Switch
                          checked={backgroundBlur}
                          onCheckedChange={setBackgroundBlur}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!enhancedImage && (
                  <Button
                    onClick={simulateProcessing}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate My Headshot
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Preview Area */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Preview</h3>
                      {enhancedImage && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsComparisonMode(!isComparisonMode)}
                          >
                            {isComparisonMode ? 'Full View' : 'Compare'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={retakePhoto}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake
                          </Button>
                          <Button
                            onClick={downloadImage}
                            className="bg-[#0077B5] hover:bg-[#005885] text-white"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>

                    {isProcessing ? (
                      <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center">
                        <Sparkles className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                        <div className="text-center space-y-2">
                          <div className="font-medium">Processing your headshot...</div>
                          <div className="text-sm text-muted-foreground">
                            {processingSteps[Math.min(currentStep, processingSteps.length - 1)]?.label}
                          </div>
                          <div className="flex items-center gap-1 mt-4">
                            {processingSteps.map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                                  index < currentStep ? 'bg-blue-600' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : enhancedImage && isComparisonMode ? (
                      <div
                        ref={containerRef}
                        className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-ew-resize"
                        onMouseMove={handleSliderMove}
                        onTouchMove={handleSliderMove}
                      >
                        {/* Original Image */}
                        <img
                          src={uploadedImage!}
                          alt="Original"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Enhanced Image with Clip Path */}
                        <div
                          className="absolute inset-0 transition-all duration-100"
                          style={{
                            clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                          }}
                        >
                          <img
                            src={enhancedImage}
                            alt="Enhanced"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Slider Line */}
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-100"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <div className="flex gap-1">
                              <div className="w-1 h-3 bg-muted rounded-full" />
                              <div className="w-1 h-3 bg-muted rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            Original
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            Enhanced
                          </Badge>
                        </div>
                      </div>
                    ) : enhancedImage ? (
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={enhancedImage}
                          alt="Enhanced headshot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={uploadedImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHeadshotPro;