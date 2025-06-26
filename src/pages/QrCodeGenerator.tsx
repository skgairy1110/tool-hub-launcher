import { useState } from "react";
import { QrCode, Download, Copy, ArrowLeft, Upload, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
const QrCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bottomText, setBottomText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [qrSize, setQrSize] = useState("300");
  const generateQrCode = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate QR code",
        variant: "destructive"
      });
      return;
    }

    // Using QR Server API for QR code generation with logo support
    const encodedText = encodeURIComponent(text);
    let url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedText}`;

    // Add logo if provided
    if (logoUrl.trim()) {
      const encodedLogo = encodeURIComponent(logoUrl);
      url += `&logo=${encodedLogo}`;
    }
    setQrCodeUrl(url);
    toast({
      title: "Success",
      description: "QR code generated successfully!"
    });
  };
  const downloadQrCode = async (format: string) => {
    if (!qrCodeUrl) return;
    try {
      // Create URL with specific format
      let downloadUrl = qrCodeUrl;
      if (format === 'svg') {
        downloadUrl += '&format=svg';
      }
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Downloaded",
        description: `QR code downloaded as ${format.toUpperCase()}!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive"
      });
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard!"
    });
  };
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  <Input id="text-input" type="text" placeholder="Enter text, URL, or any data..." value={text} onChange={e => setText(e.target.value)} className="flex-1" onKeyPress={e => e.key === 'Enter' && generateQrCode()} />
                  <Button onClick={copyToClipboard} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center space-x-2">
                <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Advanced Options</span>
                </Button>
              </div>

              {/* Advanced Options Panel */}
              {showAdvanced && <Card className="bg-gray-50">
                  <CardContent className="pt-6 space-y-4">
                    {/* QR Code Size */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        QR Code Size
                      </label>
                      <Select value={qrSize} onValueChange={setQrSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">200x200 (Small)</SelectItem>
                          <SelectItem value="300">300x300 (Medium)</SelectItem>
                          <SelectItem value="400">400x400 (Large)</SelectItem>
                          <SelectItem value="500">500x500 (Extra Large)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Text Below QR Code */}
                    <div className="space-y-2">
                      <label htmlFor="bottom-text" className="text-sm font-medium text-gray-700">
                        Text Below QR Code (Optional)
                      </label>
                      <Input id="bottom-text" type="text" placeholder="Enter text to appear below QR code..." value={bottomText} onChange={e => setBottomText(e.target.value)} />
                    </div>

                    {/* Logo Upload/URL */}
                    <div className="space-y-2">
                      
                      <div className="space-y-2">
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Or upload file:</span>
                          <label className="cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Logo
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>}

              <Button onClick={generateQrCode} className="w-full bg-blue-600 hover:bg-blue-700">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>

              {qrCodeUrl && <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                    <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full h-auto" />
                    {bottomText && <p className="mt-2 text-sm text-gray-700 font-medium">{bottomText}</p>}
                  </div>
                  
                  {/* Download Options - Side by Side */}
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => downloadQrCode('png')} className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </Button>
                    <Button onClick={() => downloadQrCode('svg')} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      <Download className="mr-2 h-4 w-4" />
                      Download SVG
                    </Button>
                  </div>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default QrCodeGenerator;