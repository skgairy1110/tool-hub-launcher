
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingDown, FileImage } from 'lucide-react';
import { CompressedImage } from '@/pages/ImageCompressor';

interface CompressionSummaryProps {
  compressedImages: CompressedImage[];
}

const CompressionSummary = ({ compressedImages }: CompressionSummaryProps) => {
  const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;
  const averageCompressionRatio = compressedImages.reduce((sum, img) => sum + img.compressionRatio, 0) / compressedImages.length;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Compression Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <FileImage className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{compressedImages.length}</div>
            <div className="text-sm text-blue-600">Images Processed</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {Math.round(averageCompressionRatio)}%
            </div>
            <div className="text-sm text-green-600">Average Reduction</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatFileSize(totalSavings)}
            </div>
            <div className="text-sm text-purple-600">Total Space Saved</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Original Total Size:</span>
            <span className="font-medium">{formatFileSize(totalOriginalSize)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Compressed Total Size:</span>
            <span className="font-medium text-green-600">{formatFileSize(totalCompressedSize)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(averageCompressionRatio, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompressionSummary;
