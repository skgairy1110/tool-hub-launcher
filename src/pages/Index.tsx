import { Link } from "react-router-dom";
import { Calculator, PiggyBank, Receipt, TrendingUp, Wallet, ArrowRight, QrCode, FileText, ImageIcon, Type, BarChart3, Sparkles, Download, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const digitalTools = [
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
      id: 'image-compressor',
      title: 'Image Compressor',
      description: 'Compress JPG, PNG, WebP images with customizable quality settings',
      icon: ImageIcon,
      path: '/image-compressor',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    },
    {
      id: 'case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, and more',
      icon: Type,
      path: '/case-converter',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    },
    {
      id: 'chart-generator',
      title: 'Chart Generator',
      description: 'Create beautiful charts and graphs with customizable options and export as SVG or PNG',
      icon: BarChart3,
      path: '/chart-generator',
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-100',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-cyan-700'
    },
    {
      id: 'image-enhance-pro',
      title: 'Image Enhance Pro',
      description: 'AI-powered image enhancement: sharpen, denoise, upscale up to 4x, and auto color correction',
      icon: Sparkles,
      path: '/image-enhance-pro',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-100',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700'
    },
    {
      id: 'sip-calculator',
      title: 'SIP Calculator',
      description: 'Calculate future value of your Systematic Investment Plan with compound interest',
      icon: TrendingUp,
      path: '/sip-calculator',
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-green-700'
    },
    {
      id: 'youtube-thumbnail-downloader',
      title: 'YouTube Thumbnail Downloader',
      description: 'Download high-quality YouTube thumbnails in multiple resolutions instantly',
      icon: Download,
      path: '/youtube-thumbnail-downloader',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      hoverColor: 'hover:from-red-600 hover:to-pink-700'
    },
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
            Complete suite of digital tools for your daily needs. Generate QR codes, compress images, convert text, and more.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>All tools are free to use</span>
          </div>
        </div>

        {/* Digital Tools Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Digital Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {digitalTools.map((tool) => {
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
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Tools</h3>
              <p className="text-gray-600 text-sm">Digital utilities and financial calculators all in one platform for your convenience.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate & Fast</h3>
              <p className="text-gray-600 text-sm">Lightning-fast processing with precise calculations and reliable results every time.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free & Secure</h3>
              <p className="text-gray-600 text-sm">No registration required. Your data stays private and secure on your device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
