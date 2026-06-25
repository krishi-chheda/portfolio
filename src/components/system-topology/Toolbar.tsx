import { ZoomIn, ZoomOut, RefreshCw, Keyboard } from "lucide-react";

interface ToolbarProps {
  activeGroupFilter: string;
  onFilterChange: (filter: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  showKeyboardGuide: boolean;
  onToggleKeyboardGuide: () => void;
}

export default function Toolbar({
  activeGroupFilter,
  onFilterChange,
  onZoomIn,
  onZoomOut,
  onRecenter,
  showKeyboardGuide,
  onToggleKeyboardGuide
}: ToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0d1321]/45 backdrop-blur-md border border-slate-900/80 p-4 rounded-xl mb-6 font-mono text-xs">
      {/* Node Category Filters */}
      <div className="flex flex-wrap gap-1.5 select-none">
        {[
          { id: "all", label: "ALL" },
          { id: "domains", label: "DOMAINS" },
          { id: "projects", label: "PROJECTS" }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeGroupFilter === filter.id
                ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30 font-bold"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            [{filter.label}]
          </button>
        ))}
      </div>

      {/* Camera Action Tools */}
      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
        >
          <ZoomIn size={12} />
        </button>

        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
        >
          <ZoomOut size={12} />
        </button>

        <button
          onClick={onRecenter}
          title="Recenter camera coordinates view"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition uppercase tracking-wider text-[10px] cursor-pointer"
        >
          <RefreshCw size={10} className="animate-spin-slow" />
          <span>Recenter</span>
        </button>

        <button
          onClick={onToggleKeyboardGuide}
          title="Keyboard shortcuts guide"
          className={`p-1.5 rounded transition cursor-pointer ${
            showKeyboardGuide
              ? "bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4]"
              : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Keyboard size={12} />
        </button>
      </div>
    </div>
  );
}
