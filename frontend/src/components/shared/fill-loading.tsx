import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const FillLoading = () => {
  return (
    <Skeleton className="absolute inset-0 flex h-full justify-center items-center bg-opacity-10 w-full z-50">
      <Loader2 className="animate-spin" />
    </Skeleton>
  );
};

export default FillLoading;
