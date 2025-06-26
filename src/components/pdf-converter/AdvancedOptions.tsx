
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  compressionLevel: string;
  onCompressionChange: (value: string) => void;
  outputFormat: string;
  onFormatChange: (value: string) => void;
}

const AdvancedOptions = ({
  showAdvanced,
  onToggleAdvanced,
  compressionLevel,
  onCompressionChange,
  outputFormat,
  onFormatChange
}: AdvancedOptionsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onToggleAdvanced}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Advanced Options</span>
        </Button>
      </div>

      {showAdvanced && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Compression Level
              </label>
              <Select value={compressionLevel} onValueChange={onCompressionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select compression level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Default)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High (Max Compression)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Output Format
              </label>
              <Select value={outputFormat} onValueChange={onFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pptx">PPTX (PowerPoint)</SelectItem>
                  <SelectItem value="ppt">PPT (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AdvancedOptions;
