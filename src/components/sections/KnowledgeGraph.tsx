"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  initialNodes, 
  initialLinks, 
  detailNodes, 
  detailLinks, 
  GraphNode, 
  GraphLink 
} from "@/lib/graphData";
import { RefreshCw, Layers, ZoomIn, ZoomOut, Keyboard, Info, Check, Eye } from "lucide-react";

// Dynamic import for react-force-graph-2d to prevent SSR failures
const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex flex-col items-center justify-center font-mono border border-slate-900 bg-slate-950/40 rounded-xl relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_70%)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping mb-3" />
        <span className="text-slate-400 text-xs tracking-widest animate-pulse uppercase">
          Initializing OS Knowledge Simulation Engine...
        </span>
      </div>
    ),
  }
);

export default function KnowledgeGraph() {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core graph dataset state
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [links, setLinks] = useState<GraphLink[]>(initialLinks);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Interactive UI state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [pinNodes, setPinNodes] = useState(false);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [blink, setBlink] = useState(true);

  // Keyboard navigation & Accessibility state
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Manual double-click detection variables
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  // Detect media query for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Update simulation velocity and alpha decays based on reduced motion settings
  useEffect(() => {
    if (fgRef.current) {
      if (prefersReducedMotion) {
        // Fast cooldown, minimum movement for accessibility
        fgRef.current.d3AlphaDecay(0.12);
        fgRef.current.d3VelocityDecay(0.85);
      } else {
        // Fluid floating layout physics
        fgRef.current.d3AlphaDecay(0.018);
        fgRef.current.d3VelocityDecay(0.28);
      }
    }
  }, [prefersReducedMotion, nodes]);

  // Terminal cursor blinking interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  // Responsive canvas size adjustment
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        width: containerRef.current?.clientWidth || 800,
        height: isMobile ? 380 : 500
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fit graph bounds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(500, 80);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // D3 force configurations: Repulsion and dynamic link distances
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("charge").strength(-140);
      fgRef.current.d3Force("link").distance((link: any) => {
        const sId = typeof link.source === 'object' ? link.source.id : link.source;
        const tId = typeof link.target === 'object' ? link.target.id : link.target;
        const sGroup = typeof link.source === 'object' ? link.source.group : '';
        const tGroup = typeof link.target === 'object' ? link.target.group : '';

        // Shorter link to keep categories grouped near root
        if (sId === "root" || tId === "root") return 75;

        // Long connection wires to link skills/projects and reduce visual overlapping
        if ((sGroup === "project" && tGroup === "ai") || (sGroup === "ai" && tGroup === "project")) {
          return 125;
        }

        return 90;
      });
      // Gravity center pull strength
      fgRef.current.d3Force("center").strength(0.75);
    }
  }, [nodes]);

  // Expand categories and draw child detail nodes
  const handleNodeDoubleClick = (node: any) => {
    // Only Category nodes and Root node trigger details expansion/collapse
    if (node.group !== "category" && node.id !== "root") return;

    const nextExpanded = new Set(expandedCategories);

    if (node.id === "root") {
      // Root Node double click: Toggles expand/collapse all categories
      const allCategoryIds = ["cat_ai", "cat_projects", "cat_swe", "cat_leadership", "cat_education", "cat_future"];
      const allAlreadyExpanded = allCategoryIds.every((id) => nextExpanded.has(id));

      if (allAlreadyExpanded) {
        // Collapse all
        allCategoryIds.forEach((id) => nextExpanded.delete(id));
        const nodesToRemove = detailNodes.map((dn) => dn.id);
        setNodes((prev) => prev.filter((n) => !nodesToRemove.includes(n.id)));
        setLinks((prev) => prev.filter((l) => {
          const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
          return !nodesToRemove.includes(s) && !nodesToRemove.includes(t);
        }));
      } else {
        // Expand all categories
        allCategoryIds.forEach((id) => nextExpanded.add(id));
        
        // Spawn detail nodes close to parent positions for fluid flyout transition
        const newNodesList = detailNodes.map((dn) => {
          const parentNode = nodes.find((p) => p.id === dn.parentId) as any;
          return {
            ...dn,
            x: parentNode ? parentNode.x + (Math.random() - 0.5) * 30 : undefined,
            y: parentNode ? parentNode.y + (Math.random() - 0.5) * 30 : undefined
          };
        });

        let updatedNodes: GraphNode[] = [];
        setNodes((prev) => {
          const activeIds = new Set(prev.map((p) => p.id));
          const filteredNew = newNodesList.filter((n) => !activeIds.has(n.id));
          updatedNodes = [...prev, ...filteredNew];
          return updatedNodes;
        });

        setLinks((prev) => {
          const activeIds = new Set(updatedNodes.map((p) => p.id));
          const newSubLinks = detailLinks.filter((l) => {
            return activeIds.has(l.source) && activeIds.has(l.target);
          });

          const linkKey = (lk: GraphLink) => {
            const s = typeof lk.source === 'object' ? (lk.source as any).id : lk.source;
            const t = typeof lk.target === 'object' ? (lk.target as any).id : lk.target;
            return `${s}-${t}`;
          };
          const activeKeys = new Set(prev.map(linkKey));
          const filteredLinks = newSubLinks.filter((l) => !activeKeys.has(linkKey(l)));
          return [...prev, ...filteredLinks];
        });
      }
      setExpandedCategories(nextExpanded);
      return;
    }

    // Individual category expansion
    const isCurrentlyExpanded = nextExpanded.has(node.id);

    if (isCurrentlyExpanded) {
      // Contract category
      nextExpanded.delete(node.id);
      const nodesToRemove = detailNodes.filter((dn) => dn.parentId === node.id).map((dn) => dn.id);
      
      setNodes((prev) => prev.filter((n) => !nodesToRemove.includes(n.id)));
      setLinks((prev) => prev.filter((l) => {
        const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return !nodesToRemove.includes(s) && !nodesToRemove.includes(t);
      }));
    } else {
      // Expand category
      nextExpanded.add(node.id);
      const parentNode = nodes.find((p) => p.id === node.id) as any;
      const newSubNodes = detailNodes.filter((dn) => dn.parentId === node.id).map((dn) => ({
        ...dn,
        // Spawn close to category parent node
        x: parentNode ? parentNode.x + (Math.random() - 0.5) * 20 : undefined,
        y: parentNode ? parentNode.y + (Math.random() - 0.5) * 20 : undefined
      }));

      let updatedNodes: GraphNode[] = [];
      setNodes((prev) => {
        const activeIds = new Set(prev.map((p) => p.id));
        const filteredNew = newSubNodes.filter((n) => !activeIds.has(n.id));
        updatedNodes = [...prev, ...filteredNew];
        return updatedNodes;
      });

      setLinks((prev) => {
        const activeIds = new Set(updatedNodes.map((p) => p.id));
        const newSubLinks = detailLinks.filter((l) => {
          const s = l.source;
          const t = l.target;
          const involvesNewNode = newSubNodes.some((sn) => sn.id === s || sn.id === t);
          return involvesNewNode && activeIds.has(s) && activeIds.has(t);
        });

        const linkKey = (lk: GraphLink) => {
          const s = typeof lk.source === 'object' ? (lk.source as any).id : lk.source;
          const t = typeof lk.target === 'object' ? (lk.target as any).id : lk.target;
          return `${s}-${t}`;
        };
        const activeKeys = new Set(prev.map(linkKey));
        const filteredLinks = newSubLinks.filter((l) => !activeKeys.has(linkKey(l)));
        return [...prev, ...filteredLinks];
      });
    }

    setExpandedCategories(nextExpanded);
  };

  // Center camera and set selected node state
  const focusNode = (node: any) => {
    setSelectedNode(node);
    setFocusedNodeId(node.id);
    if (fgRef.current) {
      const zoomLevel = node.group === "root" ? 1.8 : node.group === "category" ? 2.2 : 2.6;
      const duration = prefersReducedMotion ? 0 : 800;
      fgRef.current.centerAt(node.x, node.y, duration);
      fgRef.current.zoom(zoomLevel, duration);
    }

    const parentText = node.parentId ? ` under category ${node.parentId.replace("cat_", "").replace("_", " ")}` : "";
    setAccessibilityAnnouncement(`Focused node: ${node.label}. Group: ${node.group}${parentText}. Description: ${node.description}`);
  };

  // Handle manual single/double click parsing to ensure cross-device consistency
  const handleNodeClick = (node: any) => {
    const now = Date.now();
    const lastClick = lastClickRef.current;

    if (lastClick && lastClick.id === node.id && (now - lastClick.time) < 320) {
      // Double click registered
      handleNodeDoubleClick(node);
      lastClickRef.current = null;
    } else {
      // Single click registered
      focusNode(node);
      lastClickRef.current = { id: node.id, time: now };
    }
  };

  // Reset graph view to center fitting all active elements
  const handleRecenter = () => {
    setSelectedNode(null);
    setFocusedNodeId(null);
    if (fgRef.current) {
      const duration = prefersReducedMotion ? 0 : 800;
      fgRef.current.zoomToFit(duration, 70);
    }
    setAccessibilityAnnouncement("Recentered knowledge graph camera view.");
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (fgRef.current) {
      const duration = prefersReducedMotion ? 0 : 400;
      fgRef.current.zoom(fgRef.current.zoom() * 1.35, duration);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      const duration = prefersReducedMotion ? 0 : 400;
      fgRef.current.zoom(fgRef.current.zoom() / 1.35, duration);
    }
  };

  // Release node pin constraints if pinNodes is false, otherwise lock positions
  const handleNodeDragEnd = (node: any) => {
    if (!pinNodes) {
      node.fx = undefined;
      node.fy = undefined;
    } else {
      node.fx = node.x;
      node.fy = node.y;
    }
  };

  // Unpins all manually dragged nodes
  const unpinAllNodes = () => {
    nodes.forEach((n: any) => {
      n.fx = undefined;
      n.fy = undefined;
    });
    // Trigger simulation reboot
    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }
    setAccessibilityAnnouncement("Released all pinned node physics constraints.");
  };

  // Dynamic filter lists
  const filteredNodes = nodes.filter((node) => {
    if (activeGroupFilter === "all") return true;
    if (activeGroupFilter === "domains") return node.group === "category";
    if (activeGroupFilter === "projects") return node.group === "project" || node.group === "leadership";
    return true;
  });

  const filteredLinks = links.filter((link) => {
    const srcId = typeof link.source === "object" ? (link.source as any).id : link.source;
    const tgtId = typeof link.target === "object" ? (link.target as any).id : link.target;
    return filteredNodes.some((n) => n.id === srcId) && filteredNodes.some((n) => n.id === tgtId);
  });

  // Highlight connections linked to the active node
  const isLinkedNode = (nodeId: string) => {
    const active = hoveredNode || selectedNode;
    if (!active) return false;
    if (nodeId === active.id) return true;
    return links.some((l) => {
      const srcId = typeof l.source === "object" ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === "object" ? (l.target as any).id : l.target;
      return (srcId === active.id && tgtId === nodeId) || (tgtId === active.id && srcId === nodeId);
    });
  };

  const getLinkColor = (link: any) => {
    const active = hoveredNode || selectedNode;
    if (active) {
      const isHoveredLink = (link.source.id === active.id) || (link.target.id === active.id);
      return isHoveredLink ? "rgba(245, 158, 11, 0.65)" : "rgba(245, 158, 11, 0.04)";
    }
    return "rgba(245, 158, 11, 0.12)";
  };

  const getLinkWidth = (link: any) => {
    const active = hoveredNode || selectedNode;
    if (active) {
      const isHoveredLink = (link.source.id === active.id) || (link.target.id === active.id);
      return isHoveredLink ? 2.2 : 0.6;
    }
    return 1;
  };

  // Keyboard navigation event hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      // Do not capture key events if user is currently typing in input boxes
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const activeNodes = filteredNodes;
      if (activeNodes.length === 0) return;

      // Cycling node focus
      if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        
        const currentIndex = activeNodes.findIndex((n) => n.id === focusedNodeId);
        let nextIndex = 0;

        if (e.key === "Tab") {
          if (e.shiftKey) {
            nextIndex = currentIndex <= 0 ? activeNodes.length - 1 : currentIndex - 1;
          } else {
            nextIndex = currentIndex === -1 || currentIndex === activeNodes.length - 1 ? 0 : currentIndex + 1;
          }
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIndex = currentIndex === -1 || currentIndex === activeNodes.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? activeNodes.length - 1 : currentIndex - 1;
        }

        const nextNode = activeNodes[nextIndex];
        focusNode(nextNode);
      }

      // Toggle category expansion
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentNode = activeNodes.find((n) => n.id === focusedNodeId);
        if (currentNode) {
          if (currentNode.group === "category" || currentNode.id === "root") {
            handleNodeDoubleClick(currentNode);
          } else {
            focusNode(currentNode);
          }
        }
      }

      // Zoom Hotkeys
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }

      // Escape to recenter
      if (e.key === "Escape") {
        e.preventDefault();
        handleRecenter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedNodeId, filteredNodes, prefersReducedMotion]);

  // Custom canvas node renderer
  const drawNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label || node.id;
    const isRoot = node.group === "root";
    const isCat = node.group === "category";

    let fontSize = 11;
    if (isRoot) fontSize = 13.5;
    else if (isCat) fontSize = 11.5;

    // Load canvas text font
    ctx.font = `${isRoot ? "bold" : "normal"} ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

    // Construct OS terminal representation label
    let terminalLabel = label;
    if (isRoot) {
      terminalLabel = `[SYS] ${label}`;
    } else if (isCat) {
      terminalLabel = `dir/${label.toLowerCase().replace(" & ", "-").replace(" ", "-")}`;
    } else {
      terminalLabel = `○ ${label}`;
    }

    // Append cursor cursor segment to denote interactive states
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;
    const isFocused = focusedNodeId === node.id;
    const isActive = isHovered || isSelected || isFocused;

    if (isActive && blink) {
      terminalLabel += " █";
    }

    const textWidth = ctx.measureText(terminalLabel).width;
    const paddingX = 7.5;
    const paddingY = 4.5;
    const r = 3; // Border radius

    const x = node.x - textWidth / 2 - paddingX;
    const y = node.y - fontSize / 2 - paddingY;
    const w = textWidth + paddingX * 2;
    const h = fontSize + paddingY * 2;

    // Premium styling config: dark panel base with muted border
    let fillColor = "rgba(8, 12, 20, 0.95)";
    let borderColor = "#1e293b";
    let textColor = "#8892b0"; // Dim slate

    if (isRoot) {
      borderColor = "rgba(16, 185, 129, 0.4)";
      textColor = "#10b981";
      fillColor = "rgba(16, 185, 129, 0.05)";
    } else if (isCat) {
      borderColor = "rgba(245, 158, 11, 0.4)";
      textColor = "#f59e0b";
      fillColor = "rgba(245, 158, 11, 0.03)";
    }

    // Active nodes styling (green terminal glow or amber selection highlights)
    if (isActive) {
      const glowColor = isCat || isSelected ? "#f59e0b" : "#10b981";
      borderColor = glowColor;
      textColor = isRoot ? "#10b981" : isCat ? "#f59e0b" : "#f8fafc";
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isSelected ? 12 : 7;
      ctx.lineWidth = isSelected || isFocused ? 2 : 1.2;
    } else if (isLinkedNode(node.id)) {
      // Muted highlight for linked neighboring nodes
      borderColor = "rgba(16, 185, 129, 0.3)";
      textColor = "#ccd6f6";
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
    } else {
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
    }

    // Draw canvas rounded bounding card
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    if (w < 2 * r) {
      ctx.rect(x, y, w, h);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw node terminal text
    ctx.shadowBlur = 0;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(terminalLabel, node.x, node.y);
  };

  const activeNode = hoveredNode || selectedNode;

  return (
    <section id="system-map" className="w-full bg-[#080c14] py-20 px-4 border-t border-slate-900/60 relative overflow-hidden select-none">
      
      {/* Visual Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {accessibilityAnnouncement}
      </div>

      {/* Grid overlay terminal bg */}
      <div className="absolute inset-0 grid-bg pointer-events-none select-none opacity-20" />
      <div 
        className="absolute inset-0 pointer-events-none select-none z-10"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.012) 0%, rgba(8, 12, 20, 0) 80%)"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">open system-map</span>
        </div>

        {/* Section Info Block */}
        <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg mb-8 font-mono">
          <div className="flex items-center space-x-2 text-[10px] text-[#10b981] uppercase tracking-wider mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>system-map // simulation_engine</span>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            Knowledge Network
          </h2>
          <p className="mt-2 text-slate-400 text-xs leading-relaxed select-text font-sans">
            An interactive node mapping visualizing how my academic foundation, software projects, leadership experiences, and future targets interlock. Explore nodes to discover cross-connections. Double click categories to expand/collapse.
          </p>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0d1321]/45 backdrop-blur-md border border-slate-900/80 p-4 rounded-xl mb-6 font-mono text-xs">
          
          {/* Node Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "ALL" },
              { id: "domains", label: "DOMAINS" },
              { id: "projects", label: "PROJECTS" }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveGroupFilter(filter.id);
                  setAccessibilityAnnouncement(`Filtered graph view by ${filter.label}`);
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  activeGroupFilter === filter.id
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-bold"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                [{filter.label}]
              </button>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setPinNodes(!pinNodes)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-[10px] uppercase tracking-wider transition cursor-pointer ${
                pinNodes 
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-500" 
                  : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
              title="Toggle node position lock on drag"
            >
              <Check size={10} className={pinNodes ? "opacity-100" : "opacity-30"} />
              <span>Pin Nodes</span>
            </button>

            {pinNodes && (
              <button
                onClick={unpinAllNodes}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-900 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-[10px] uppercase tracking-wider transition cursor-pointer"
                title="Release all pinned nodes back to simulation"
              >
                <RefreshCw size={10} />
                <span>Unpin All</span>
              </button>
            )}

            <span className="w-px h-4 bg-slate-900" />

            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
            >
              <ZoomIn size={12} />
            </button>
            
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
            >
              <ZoomOut size={12} />
            </button>

            <button
              onClick={handleRecenter}
              title="Recenter simulation camera view"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <RefreshCw size={10} className="animate-spin-slow" />
              <span>Recenter</span>
            </button>
            
            <button
              onClick={() => setShowKeyboardGuide(!showKeyboardGuide)}
              title="Keyboard controls guide"
              className={`p-1.5 rounded transition cursor-pointer ${
                showKeyboardGuide
                  ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]"
                  : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Keyboard size={12} />
            </button>
          </div>
        </div>

        {/* Dynamic Keyboard Navigation Instruction Guide */}
        <AnimatePresence>
          {showKeyboardGuide && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-4 rounded-xl border border-[#10b981]/20 bg-[#0d1321]/80 backdrop-blur-md font-mono text-[11px] text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <span className="text-[#10b981] font-bold block mb-1">⌨️ Tab / Arrow keys</span>
                Navigate and cycle through currently visible nodes sequentially.
              </div>
              <div>
                <span className="text-[#10b981] font-bold block mb-1">⌨️ Enter / Space</span>
                Select focused node and center/zoom graph camera on it.
              </div>
              <div>
                <span className="text-[#10b981] font-bold block mb-1">⌨️ Shift+Enter / Dbl-Click</span>
                Expand/collapse category nodes dynamically to reveal subnodes.
              </div>
              <div>
                <span className="text-[#10b981] font-bold block mb-1">⌨️ Esc / +/- Keys</span>
                Zoom in (+), zoom out (-), or reset simulation to center view (Esc).
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualizer Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Force Graph Interactive Window */}
          <div 
            ref={containerRef}
            className="lg:col-span-3 border border-slate-900/80 bg-slate-950/20 rounded-xl relative overflow-hidden h-[380px] md:h-[500px] cursor-grab active:cursor-grabbing shadow-inner flex terminal-highlight"
          >
            {/* Visual scanline element to simulate old terminal interface */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,24,38,0)_97%,rgba(0,0,0,0.22)_97%)] bg-[size:100%_4px] opacity-10 z-10" />

            <ForceGraph2D
              ref={fgRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={{ nodes: filteredNodes, links: filteredLinks }}
              nodeCanvasObject={drawNode}
              nodeRelSize={4.5}
              linkWidth={getLinkWidth}
              linkColor={getLinkColor}
              cooldownTicks={prefersReducedMotion ? 5 : 120}
              d3AlphaDecay={prefersReducedMotion ? 0.15 : 0.02}
              d3VelocityDecay={prefersReducedMotion ? 0.85 : 0.3}
              onNodeClick={handleNodeClick}
              onNodeHover={(node) => setHoveredNode(node as GraphNode | null)}
              onNodeDragEnd={handleNodeDragEnd}
              enableZoomInteraction={true}
              enablePanInteraction={true}
            />

            {/* Quick Helper Floating UI Guide */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500 pointer-events-none select-none uppercase tracking-wider space-y-1 z-10">
              <div className="flex items-center gap-1 text-slate-400">
                <Info size={8} />
                <span>Dbl-Click Categories to Expand details</span>
              </div>
              <div>⚡ Scroll: Zoom | Click & Drag: Orbit Graph</div>
            </div>
            
            {prefersReducedMotion && (
              <div className="absolute top-4 left-4 font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide z-10">
                Reduced Motion Active
              </div>
            )}
          </div>

          {/* Node Metadata Terminal Inspector Panel */}
          <div className="lg:col-span-1 flex flex-col h-full min-h-[220px]">
            {/* Panel Frame Header */}
            <div className="bg-slate-950/80 px-4 py-2 border border-slate-900 flex justify-between items-center rounded-t-xl select-none font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                Node Inspector
              </span>
            </div>

            {/* Panel Body */}
            <div className="flex-1 border border-t-0 border-slate-900 bg-[#0d1321]/20 backdrop-blur-md rounded-b-xl overflow-hidden relative min-h-[200px] flex flex-col justify-stretch">
              <AnimatePresence mode="wait">
                {activeNode ? (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="p-5 flex flex-col justify-between h-full relative"
                  >
                    {/* Glowing Accent Top Bar matching category colors */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300" 
                      style={{
                        backgroundColor: 
                          activeNode.group === "root" ? "#10b981" :
                          activeNode.group === "category" ? "#f59e0b" :
                          activeNode.group === "project" ? "#06b6d4" :
                          activeNode.group === "ai" ? "#10b981" :
                          activeNode.group === "leadership" ? "#818cf8" :
                          activeNode.group === "swe" ? "#3b82f6" :
                          activeNode.group === "education" ? "#64748b" : "#ea580c"
                      }}
                    />

                    <div className="space-y-4">
                      {/* Node Header Metadata */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                          {activeNode.group} segment
                        </span>
                        {expandedCategories.has(activeNode.id) && (
                          <span className="font-mono text-[8px] bg-[#10b981]/15 text-[#10b981] px-1.5 py-0.5 rounded border border-[#10b981]/20 uppercase font-bold tracking-wide">
                            Expanded
                          </span>
                        )}
                      </div>

                      {/* Node Title */}
                      <h3 className="text-lg font-bold text-slate-100 tracking-tight font-heading leading-tight">
                        {activeNode.label}
                      </h3>

                      {/* Node Description */}
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        {activeNode.description}
                      </p>

                      {/* Related Bullet Info */}
                      {activeNode.details && activeNode.details.length > 0 && (
                        <div className="pt-3 border-t border-slate-900/60 space-y-2">
                          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block">
                            Key contexts:
                          </span>
                          <ul className="space-y-1.5">
                            {activeNode.details.map((detail, idx) => (
                              <li key={idx} className="font-mono text-[10px] text-slate-300 flex items-start space-x-1.5 leading-normal">
                                <span className="text-[#f59e0b] select-none text-[8px] mt-0.5">■</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Expand Category Interaction Prompt */}
                    <div className="mt-8 pt-4 border-t border-slate-900/50 font-mono text-[9px] text-slate-500 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <Eye size={10} className="text-slate-600" />
                      {activeNode.group === "category" ? (
                        <span>Double-Click node to toggle sub-elements</span>
                      ) : activeNode.id === "root" ? (
                        <span>Double-Click to toggle all branches</span>
                      ) : (
                        <span>Select categories to unfold connections</span>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-6 flex-1 flex flex-col justify-center items-center text-center select-none font-mono">
                    <Layers className="text-slate-800 w-6 h-6 mb-3 animate-pulse" />
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest max-w-[150px] leading-relaxed">
                      Awaiting node focus connection... select a node to inspect variables
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
