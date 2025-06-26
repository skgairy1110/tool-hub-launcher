
import React, { useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadZoneProps {
  onImagesUpload: (files: File[]) => void;
  uploadedImages: File[];
  onRemoveImage: (index: number) => void;
}

const ImageUploadZone = ({ onImagesUpload, uploadedImages, onRemoveImage }: ImageUploadZoneProps) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onImagesUpload(files);
  }, [onImagesUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onImagesUpload(files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-purple-50/50"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop images here or click to browse
        </h3>
        <p className="text-gray-600 mb-4">
          Supports JPG, PNG, WebP files (multiple files allowed)
        </p>
        <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
          Choose Files
        </Button>
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Uploaded Images ({uploadedImages.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedImages.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveImage(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
