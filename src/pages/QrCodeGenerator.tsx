
import { useState } from "react";
import { QrCode, Download, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const QrCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQrCode = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate QR code",
        variant: "destructive",
      });
      return;
    }
    
    // Using QR Server API for QR code generation
    const encodedText = encodeURIComponent(text);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
    setQrCodeUrl(url);
    
    toast({
      title: "Success",
      description: "QR code generated successfully!",
    });
  };

  const downloadQrCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded",
        description: "QR code downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
            <p className="text-gray-600">Generate QR codes instantly from any text or URL</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center">Create Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="text-input" className="text-sm font-medium text-gray-700">
                  Enter text or URL
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="text-input"
                    type="text"
                    placeholder="Enter text, URL, or any data..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && generateQrCode()}
                  />
                  <Button onClick={copyToClipboard} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={generateQrCode} className="w-full bg-blue-600 hover:bg-blue-700">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>

              {qrCodeUrl && (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                    <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full h-auto" />
                  </div>
                  <Button onClick={downloadQrCode} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
