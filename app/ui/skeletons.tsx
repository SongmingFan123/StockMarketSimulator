export function TableSkeleton() {
  return (
    <div role="status" className="w-full animate-pulse flex flex-col gap-2 p-2">
      <div className="h-9 bg-gray-300 rounded-lg w-full"></div>
      <div className="h-9 bg-gray-200 rounded-full w-full"></div>
      <div className="h-9 bg-gray-200 rounded-full w-1/2"></div>
      <div className="h-9 bg-gray-200 rounded-full w-3/4"></div>
      <div className="h-9 bg-gray-200 rounded-full w-full"></div>
      <div className="h-9 bg-gray-200 rounded-full w-full"></div>
      <div className="h-9 bg-gray-200 rounded-full w-full"></div>
    </div>
  );
}
export function HorizontalTradeCardSkeleton() {
  return (
    <div role="status" className="h-full w-full animate-pulse p-2 grid gap-2">
      <div className="h-full bg-gray-300 rounded-lg shadow-md"></div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-full bg-gray-300 rounded-lg"></div>
        <div className="h-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
export function VerticalTradeCardSkeleton() {
  return (
    <div role="status" className="h-full w-full animate-pulse p-2 grid gap-2">
      <div className="h-full bg-gray-300 rounded-lg shadow-md"></div>
      <div className="h-full bg-gray-300 rounded-lg shadow-md"></div>
      <div className="h-full bg-gray-300 rounded-lg shadow-md"></div>
      <div className="h-full bg-gray-300 rounded-lg shadow-md"></div>
    </div>
  );
}
