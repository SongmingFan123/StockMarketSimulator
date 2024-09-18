import { VerticalTradeCardSkeleton } from "@/app/ui/skeletons";
import { HorizontalTradeCardSkeleton } from "@/app/ui/skeletons";

export default function Loading() {
  return (
    <div>
      <div className="hidden md:block">
        <HorizontalTradeCardSkeleton />
      </div>
      <div className="block md:hidden">
        <VerticalTradeCardSkeleton />
      </div>
    </div>
  );
}
