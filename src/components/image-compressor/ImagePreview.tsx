
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { CompressedImage } from '@/pages/ImageCompressor';

interface ImagePreviewProps {
  uploadedImages: File[];
  compressedImages: CompressedImage[];
}

const ImagePreview = ({ uploadedImages, compressedImages }: ImagePreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompressed, setShowCompressed] = useState(false);

  const hasCompressed = compressedImages.length > 0;
  const currentFile = uploadedImages[currentIndex];
  const currentCompressed = compressedImages[currentIndex];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % uploadedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + uploadedImages.length) % uploadedImages.length);
  };

  if (!currentFile) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Preview</span>
          </CardTitle>
          {uploadedImages.length > 1 && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {uploadedImages.length}
              </span>
              <Button variant="outline" size="sm" onClick={nextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCompressed && (
          <div className="flex space-x-2">
            <Button
              variant={!showCompressed ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompressed(false)}
            >
              Original
            </Button>
            <Button
              variant={showCompressed ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompressed(true)}
            >
              Compressed
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {/* Image Display */}
          <div className="relative">
            <img
              src={showCompressed && currentCompressed 
                ? URL.createObjectURL(currentCompressed.compressedBlob)
                : URL.createObjectURL(currentFile)
              }
              alt={currentFile.name}
              className="w-full max-h-64 object-contain rounded-lg border"
            />
            {showCompressed && currentCompressed && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                -{Math.round(currentCompressed.compressionRatio)}%
              </div>
            )}
          </div>

          {/* Image Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{currentFile.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Original Size:</span>
                <div className="font-medium">{formatFileSize(currentFile.size)}</div>
              </div>
              {currentCompressed && (
                <div>
                  <span className="text-gray-600">Compressed Size:</span>
                  <div className="font-medium text-green-600">
                    {formatFileSize(currentCompressed.compressedSize)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
