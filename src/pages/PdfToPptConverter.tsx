
import { useState } from "react";
import { FileText, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import FileUploadZone from "@/components/pdf-converter/FileUploadZone";
import AdvancedOptions from "@/components/pdf-converter/AdvancedOptions";
import ConversionProgress from "@/components/pdf-converter/ConversionProgress";
import DownloadSection from "@/components/pdf-converter/DownloadSection";
import {
  createDownloadableFile,
  simulateConversion,
  calculateCompressedSize,
  formatFileSize
} from "@/utils/pdfConverter";

const PdfToPptConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("basic");
  const [outputFormat, setOutputFormat] = useState("pptx");
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleConvert = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert",
        variant: "destructive",
      });
      return;
    }
    
    performConversion();
  };

  const performConversion = async () => {
    setIsConverting(true);
    setConversionProgress(0);
    
    await simulateConversion(setConversionProgress);
    
    // Create downloadable file
    const blob = createDownloadableFile(file!, compressionLevel, outputFormat);
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    
    const fileName = `converted-presentation.${outputFormat}`;
    setConvertedFile(fileName);
    
    // Calculate compressed file size
    const compressedSize = calculateCompressedSize(file!.size, compressionLevel);
    setFileSize(formatFileSize(compressedSize));
    
    setIsConverting(false);
    
    toast({
      title: "Conversion completed successfully!",
      description: `Your PDF has been converted to ${outputFormat.toUpperCase()} format`,
    });
  };

  const handleDownload = () => {
    if (!downloadUrl || !convertedFile) {
      toast({
        title: "Download not ready",
        description: "Please convert a file first",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = convertedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Downloading ${convertedFile} (${fileSize})`,
    });
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
              <FileUploadZone file={file} onFileSelect={setFile} />

              <AdvancedOptions
                showAdvanced={showAdvanced}
                onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                compressionLevel={compressionLevel}
                onCompressionChange={setCompressionLevel}
                outputFormat={outputFormat}
                onFormatChange={setOutputFormat}
              />

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

              <ConversionProgress isConverting={isConverting} progress={conversionProgress} />

              {!isConverting && (
                <DownloadSection
                  convertedFile={convertedFile}
                  fileSize={fileSize}
                  outputFormat={outputFormat}
                  onDownload={handleDownload}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfToPptConverter;
