
import { useState, useRef } from "react";
import { FileText, Download, ArrowLeft, Upload, Settings, Eye, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const PdfToPptConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("basic");
  const [outputFormat, setOutputFormat] = useState("pptx");
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFile = droppedFiles.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      if (pdfFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select a PDF file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setFile(pdfFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a PDF file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const simulateConversion = async () => {
    setIsConverting(true);
    setConversionProgress(0);
    
    // Simulate conversion progress
    const intervals = [10, 25, 45, 65, 80, 95, 100];
    
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConversionProgress(intervals[i]);
    }
    
    // Simulate file creation
    const originalSize = file!.size;
    const compressionRatio = compressionLevel === 'basic' ? 0.8 : compressionLevel === 'medium' ? 0.6 : 0.4;
    const compressedSize = Math.floor(originalSize * compressionRatio);
    
    setFileSize(`${(compressedSize / (1024 * 1024)).toFixed(1)} MB`);
    setConvertedFile(`converted-presentation.${outputFormat}`);
    setIsConverting(false);
    
    toast({
      title: "Conversion completed successfully!",
      description: `Your PDF has been converted to ${outputFormat.toUpperCase()} format`,
    });
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert",
        variant: "destructive",
      });
      return;
    }
    
    simulateConversion();
  };

  const handleDownload = () => {
    // This would normally trigger the actual download
    toast({
      title: "Download started",
      description: `Downloading ${convertedFile} (${fileSize})`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF to PPT Converter</h1>
            <p className="text-gray-600">Convert PDF files to PowerPoint presentations with compression</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center">Upload & Convert Your PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-green-500 bg-green-50'
                    : file
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <Button 
                      onClick={() => setFile(null)} 
                      variant="outline" 
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag & drop your PDF file here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse (max 50MB)
                      </p>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Advanced Options</span>
                </Button>
              </div>

              {/* Advanced Options Panel */}
              {showAdvanced && (
                <Card className="bg-gray-50">
                  <CardContent className="pt-6 space-y-4">
                    {/* Compression Level */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Compression Level
                      </label>
                      <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select compression level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (Default)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High (Max Compression)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Output Format */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Output Format
                      </label>
                      <Select value={outputFormat} onValueChange={setOutputFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select output format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pptx">PPTX (PowerPoint)</SelectItem>
                          <SelectItem value="ppt">PPT (Legacy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Convert Button */}
              <Button 
                onClick={handleConvert} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!file || isConverting}
              >
                {isConverting ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Convert to PPT
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Converting PDF to PowerPoint...</span>
                    <span>{conversionProgress}%</span>
                  </div>
                  <Progress value={conversionProgress} className="w-full" />
                </div>
              )}

              {/* Download Section */}
              {convertedFile && !isConverting && (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{convertedFile}</p>
                        <p className="text-sm text-gray-500">Size: {fileSize}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button 
                        onClick={handleDownload} 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download {outputFormat.toUpperCase()}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfToPptConverter;
