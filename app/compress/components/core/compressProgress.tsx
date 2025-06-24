import { Loader, XCircle } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { formatTime } from "~/utils/convert";

type CompressProgressProps = {
  seconds: number;
  progress: number;
};

export const CompressProgress = ({
  progress,
  seconds,
}: CompressProgressProps) => (
  <div className="flex justify-between items-center gap-2 p-0.5">
    <div className="flex-1">
      <div className="flex justify-between text-sm mb-2">
        <div className="flex gap-2 items-center">
          {progress ? <p>Compressing</p> : <p>Loading</p>}
          <Loader className="animate-spin w-4 h-4" />
        </div>
        <p className="text-sm">{formatTime(seconds / 1000)}</p>
      </div>
      {progress && <Progress value={progress} />}
    </div>
  </div>
);
