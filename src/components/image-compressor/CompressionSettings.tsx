
import React from 'react';
import { Settings, Zap, BarChart3, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { CompressionSettings as SettingsType } from '@/pages/ImageCompressor';

interface CompressionSettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  onCompress: () => void;
  isCompressing: boolean;
  hasImages: boolean;
}

const CompressionSettings = ({ 
  settings, 
  onSettingsChange, 
  onCompress, 
  isCompressing, 
  hasImages 
}: CompressionSettingsProps) => {
  const compressionModes = [
    {
      id: 'lossless' as const,
      title: 'Lossless',
      description: 'No quality loss',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'balanced' as const,
      title: 'Balanced',
      description: 'Good quality & size',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'high' as const,
      title: 'High Compression',
      description: 'Max size reduction',
      icon: Minimize2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Compression Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compression Mode */}
        <div>
          <label className="text-sm font-medium text-gray-900 mb-3 block">
            Compression Mode
          </label>
          <div className="grid grid-cols-1 gap-3">
            {compressionModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <div
                  key={mode.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.mode === mode.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSettingsChange({ ...settings, mode: mode.id })}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${mode.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${mode.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{mode.title}</h4>
                      <p className="text-sm text-gray-600">{mode.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Slider */}
        {settings.mode !== 'lossless' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-900">
                Quality
              </label>
              <span className="text-sm text-gray-600">{settings.quality}%</span>
            </div>
            <Slider
              value={[settings.quality]}
              onValueChange={(value) => onSettingsChange({ ...settings, quality: value[0] })}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Resize Option */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="resize"
              checked={settings.resize}
              onChange={(e) => onSettingsChange({ ...settings, resize: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="resize" className="text-sm font-medium text-gray-900">
              Resize Images
            </label>
          </div>
          
          {settings.resize && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Width (px)</label>
                <Input
                  type="number"
                  placeholder="800"
                  value={settings.width || ''}
                  onChange={(e) => onSettingsChange({ 
                    ...settings, 
                    width: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Height (px)</label>
                <Input
                  type="number"
                  placeholder="600"
                  value={settings.height || ''}
                  onChange={(e) => onSettingsChange({ 
                    ...settings, 
                    height: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Compress Button */}
        <Button
          onClick={onCompress}
          disabled={!hasImages || isCompressing}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isCompressing ? 'Compressing...' : 'Compress Images'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompressionSettings;
