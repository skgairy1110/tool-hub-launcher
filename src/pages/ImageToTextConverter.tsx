
import { useState, useRef } from "react";
import { Image, Upload, Copy, ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const ImageToTextConverter = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
      }
    }
  };

  const extractText = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate OCR processing (in a real app, you'd use an OCR service)
    setTimeout(() => {
      setExtractedText("This is a demo text extraction. In a real application, this would use an OCR service like Tesseract.js, Google Vision API, or similar service to extract actual text from the uploaded image.");
      setIsProcessing(false);
      toast({
        title: "Success",
        description: "Text extracted successfully!",
      });
    }, 2000);
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Copied",
      description: "Text copied to clipboard!",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Image to Text Converter</h1>
            <p className="text-gray-600">Extract text from images using advanced OCR technology</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="max-w-full h-auto max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">Click to upload an image</p>
                      <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={extractText} 
                  disabled={!selectedImage || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Extract Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Extracted Text
                  </span>
                  {extractedText && (
                    <Button onClick={copyText} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  className="min-h-64 resize-none"
                  readOnly={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToTextConverter;
