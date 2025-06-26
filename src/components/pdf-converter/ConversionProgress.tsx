
import { Progress } from "@/components/ui/progress";

interface ConversionProgressProps {
  isConverting: boolean;
  progress: number;
}

const ConversionProgress = ({ isConverting, progress }: ConversionProgressProps) => {
  if (!isConverting) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Converting PDF to PowerPoint...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default ConversionProgress;
