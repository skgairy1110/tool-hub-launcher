
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadSectionProps {
  convertedFile: string | null;
  fileSize: string;
  outputFormat: string;
  onDownload: () => void;
}

const DownloadSection = ({ convertedFile, fileSize, outputFormat, onDownload }: DownloadSectionProps) => {
  if (!convertedFile) return null;

  return (
    <div className="text-center space-y-4">
      <div className="bg-white p-4 rounded-lg border-2 border-green-200">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <FileText className="h-8 w-8 text-green-600" />
          <div>
            <p className="font-medium text-gray-900">{convertedFile}</p>
            <p className="text-sm text-gray-500">Size: {fileSize}</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onDownload} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download {outputFormat.toUpperCase()}
          </Button>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
