import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="skeleton size-6" />
          <span className="font-medium hidden lg:block skeleton w-24 h-4" />
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input type="checkbox" disabled className="checkbox checkbox-sm" />
            <span className="text-sm skeleton w-32 h-4" />
          </label>
          <span className="text-xs text-zinc-500 skeleton w-20 h-4" />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <button
            key={index}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors`}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton rounded-full size-10" />
            </div>
            <span className="skeleton w-full h-4" />
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
