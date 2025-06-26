
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Archive, ImageIcon } from 'lucide-react';
import { CompressedImage } from '@/pages/ImageCompressor';

interface DownloadSectionProps {
  compressedImages: CompressedImage[];
}

const DownloadSection = ({ compressedImages }: DownloadSectionProps) => {
  const downloadSingleImage = (image: CompressedImage) => {
    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    // Simple ZIP creation using basic implementation
    // In a real-world scenario, you'd use a library like JSZip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    compressedImages.forEach((image) => {
      zip.file(`compressed_${image.name}`, image.compressedBlob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (compressedImages.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Download Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download All Button */}
        <Button
          onClick={downloadAllAsZip}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <Archive className="mr-2 h-5 w-5" />
          Download All as ZIP
        </Button>

        {/* Individual Downloads */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Individual Downloads</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {compressedImages.map((image, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">
                      {image.name}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{formatFileSize(image.compressedSize)}</span>
                      <span className="text-green-600 font-medium">
                        -{Math.round(image.compressionRatio)}%
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSingleImage(image)}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadSection;
