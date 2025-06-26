
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploadZone from '@/components/image-compressor/ImageUploadZone';
import CompressionSettings from '@/components/image-compressor/CompressionSettings';
import ImagePreview from '@/components/image-compressor/ImagePreview';
import CompressionSummary from '@/components/image-compressor/CompressionSummary';
import DownloadSection from '@/components/image-compressor/DownloadSection';
import { useToast } from '@/hooks/use-toast';

export interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
  name: string;
}

export interface CompressionSettings {
  mode: 'lossless' | 'balanced' | 'high';
  quality: number;
  resize: boolean;
  width?: number;
  height?: number;
}

const ImageCompressor = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [settings, setSettings] = useState<CompressionSettings>({
    mode: 'balanced',
    quality: 80,
    resize: false,
  });
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const handleImagesUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Only JPG, PNG, and WebP files are supported.",
        variant: "destructive",
      });
    }

    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setCompressedImages(prev => prev.filter((_, i) => i !== index));
  };

  const compressImages = async () => {
    if (uploadedImages.length === 0) return;

    setIsCompressing(true);
    const compressed: CompressedImage[] = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const file = uploadedImages[i];
        const compressedBlob = await compressImage(file, settings);
        
        compressed.push({
          id: `${file.name}-${Date.now()}-${i}`,
          originalFile: file,
          originalSize: file.size,
          compressedBlob,
          compressedSize: compressedBlob.size,
          compressionRatio: ((file.size - compressedBlob.size) / file.size) * 100,
          name: file.name,
        });
      }

      setCompressedImages(compressed);
      toast({
        title: "Compression complete!",
        description: `Successfully compressed ${compressed.length} image(s).`,
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing images.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = (file: File, settings: CompressionSettings): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (settings.resize && settings.width && settings.height) {
          width = settings.width;
          height = settings.height;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        let quality = settings.quality / 100;
        if (settings.mode === 'lossless') quality = 1;
        if (settings.mode === 'high') quality = Math.min(quality * 0.7, 0.6);

        canvas.toBlob(
          (blob) => resolve(blob!),
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <ImageIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Image Compressor</h1>
              <p className="text-gray-600 mt-1">Compress JPG, PNG, WebP images with customizable settings</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadZone 
                  onImagesUpload={handleImagesUpload}
                  uploadedImages={uploadedImages}
                  onRemoveImage={removeImage}
                />
              </CardContent>
            </Card>

            <CompressionSettings 
              settings={settings}
              onSettingsChange={setSettings}
              onCompress={compressImages}
              isCompressing={isCompressing}
              hasImages={uploadedImages.length > 0}
            />
          </div>

          {/* Right Column - Preview & Results */}
          <div className="space-y-6">
            {uploadedImages.length > 0 && (
              <ImagePreview 
                uploadedImages={uploadedImages}
                compressedImages={compressedImages}
              />
            )}

            {compressedImages.length > 0 && (
              <>
                <CompressionSummary compressedImages={compressedImages} />
                <DownloadSection compressedImages={compressedImages} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
