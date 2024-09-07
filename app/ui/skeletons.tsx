export default function Skeleton() {
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
  