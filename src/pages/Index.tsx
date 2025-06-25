
import { Link } from "react-router-dom";
import { QrCode, FileText, ArrowRight, File } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const tools = [
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes instantly from any text or URL',
      icon: QrCode,
      path: '/qr-generator',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      id: 'image-to-text',
      title: 'Image to Text Converter',
      description: 'Extract text from images using advanced OCR technology',
      icon: FileText,
      path: '/image-to-text',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      id: 'pdf-to-ppt',
      title: 'PDF to PPT Converter',
      description: 'Convert PDF files to PowerPoint presentations with compression',
      icon: File,
      path: '/pdf-to-ppt',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Digital Tools Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Powerful, easy-to-use tools for your digital needs. Generate QR codes, convert images to text, and more - all in one place.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>All tools are free to use</span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${tool.gradient}`}></div>
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className={`${tool.iconBg} p-3 rounded-xl`}>
                        <IconComponent className={`h-8 w-8 ${tool.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">Ready to use</span>
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${tool.gradient} ${tool.hoverColor} text-white rounded-lg transition-all duration-300 group-hover:shadow-lg`}>
                        <span className="text-sm font-medium">Try Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Tools?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600 text-sm">Lightning-fast processing with reliable results every time.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-pink-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Registration</h3>
              <p className="text-gray-600 text-sm">Use all tools instantly without any sign-up or registration.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">Your data stays secure and private. We don't store your files.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
