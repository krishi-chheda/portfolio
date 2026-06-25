"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  initialNodes, 
  initialLinks, 
  GraphNode, 
  GraphLink 
} from "@/lib/graphData";
import { RefreshCw, ZoomIn, ZoomOut, Keyboard, Info, Check, Eye } from "lucide-react";

// Custom coordinates restoring forces for D3 simulation
const forceXRestoring = () => {
  let nodesList: any[] = [];
  const force = (alpha: number) => {
    for (let i = 0; i < nodesList.length; i++) {
      const node = nodesList[i];
      if (node.baseX !== undefined) {
        node.vx += (node.baseX - node.x) * 0.08 * alpha;
      }
    }
  };
  force.initialize = (_nodes: any[]) => {
    nodesList = _nodes;
  };
  return force as any;
};

const forceYRestoring = () => {
  let nodesList: any[] = [];
  const force = (alpha: number) => {
    for (let i = 0; i < nodesList.length; i++) {
      const node = nodesList[i];
      if (node.baseY !== undefined) {
        node.vy += (node.baseY - node.y) * 0.08 * alpha;
      }
    }
  };
  force.initialize = (_nodes: any[]) => {
    nodesList = _nodes;
  };
  return force as any;
};

// Dynamic import for react-force-graph-2d to prevent SSR failures
const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex flex-col items-center justify-center font-mono border border-slate-900 bg-slate-950/40 rounded-xl relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_0%,transparent_70%)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-ping mb-3" />
        <span className="text-slate-400 text-xs tracking-widest animate-pulse uppercase">
          Initializing OS Knowledge Simulation Engine...
        </span>
      </div>
    ),
  }
);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export default function KnowledgeGraph() {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core graph dataset state
  const [nodes] = useState<GraphNode[]>(initialNodes);
  const [links] = useState<GraphLink[]>(initialLinks);

  // Interactive UI state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [blink, setBlink] = useState(true);

  // Keyboard navigation & Accessibility state
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState("");

  // Refs for tracking drag state synchronously and timing settle timeouts
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize 25 ambient background particles
  useEffect(() => {
    const tempParticles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      tempParticles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.25 + 0.08
      });
    }
    particlesRef.current = tempParticles;
  }, []);

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

  // Set up initial D3 force configuration and pause simulation to start fully stable
  useEffect(() => {
    if (fgRef.current) {
      // Configure default D3 forces
      fgRef.current.d3Force("charge").strength(-70);
      fgRef.current.d3Force("link").distance(110).strength(0.8);
      fgRef.current.d3Force("center", null); // Remove default center pull to honor absolute layout

      // Register custom coordinates restoring forces
      fgRef.current.d3Force("restore-x", forceXRestoring());
      fgRef.current.d3Force("restore-y", forceYRestoring());

      // Zoom to fit layout centered initially
      const timer = setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(0, 80);
          fgRef.current.pauseAnimation();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [nodes]);

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

  // Track if node is connected to active node
  const isNodeConnected = (nodeId1: string, nodeId2: string) => {
    return filteredLinks.some((l) => {
      const sId = typeof l.source === "object" ? (l.source as any).id : l.source;
      const tId = typeof l.target === "object" ? (l.target as any).id : l.target;
      return (sId === nodeId1 && tId === nodeId2) || (sId === nodeId2 && tId === nodeId1);
    });
  };

  // Check if link is connected to current hover/selected node
  const isLinkActive = (link: any) => {
    const active = hoveredNode || selectedNode;
    if (!active) return false;
    const sId = typeof link.source === "object" ? link.source.id : link.source;
    const tId = typeof link.target === "object" ? link.target.id : link.target;
    return sId === active.id || tId === active.id;
  };

  // Hover node listener
  const handleNodeHover = (node: any) => {
    setHoveredNode(node);
    if (fgRef.current) {
      if (node) {
        // Resume simulation loop to render dynamic edge flow particles
        fgRef.current.resumeAnimation();
      } else {
        // Pause simulation loop if no node is selected or hovered
        if (!isDraggingRef.current && !selectedNode) {
          fgRef.current.pauseAnimation();
        }
      }
    }
  };

  // Node Drag events
  const handleNodeDrag = (node: any) => {
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);

      // Unpin all other nodes coordinates so they follow elastic forces
      filteredNodes.forEach((n: any) => {
        if (n.id !== node.id) {
          n.fx = undefined;
          n.fy = undefined;
        }
      });

      if (fgRef.current) {
        fgRef.current.resumeAnimation();
        fgRef.current.d3ReheatSimulation();
      }
    }

    // Dragged node locks to current mouse pointer coordinate
    node.fx = node.x;
    node.fy = node.y;
  };

  const handleNodeDragEnd = (node: any) => {
    isDraggingRef.current = false;
    setIsDragging(false);

    // Release dragged node pin
    node.fx = undefined;
    node.fy = undefined;

    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }

    // Settle loop back into stability within 500ms
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current) {
        // Lock all nodes back to their predefined coordinates
        filteredNodes.forEach((n: any) => {
          n.x = n.baseX;
          n.y = n.baseY;
          n.fx = n.baseX;
          n.fy = n.baseY;
          n.vx = 0;
          n.vy = 0;
        });

        if (fgRef.current) {
          fgRef.current.pauseAnimation();
        }
      }
    }, 500);
  };

  // Focus node center and zoom (800ms camera transition)
  const focusNode = (node: any) => {
    setSelectedNode(node);
    setFocusedNodeId(node.id);

    if (fgRef.current) {
      fgRef.current.resumeAnimation();
      
      const zoomLevel = node.group === "category" ? 2.2 : node.group === "project" ? 2.5 : 1.8;
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(zoomLevel, 800);

      // Turn off animation loop after transition concludes
      setTimeout(() => {
        if (!isDraggingRef.current && !hoveredNode) {
          // If node is selected, keep animated for edge directional particles
          // otherwise pause animation
          if (!selectedNode) {
            fgRef.current.pauseAnimation();
          }
        }
      }, 850);
    }

    setAccessibilityAnnouncement(`Focused node: ${node.label}. Description: ${node.description}`);
  };

  // Click handler supporting double-clicks to focus
  const handleNodeClick = (node: any) => {
    const now = Date.now();
    const lastClick = lastClickRef.current;

    if (lastClick && lastClick.id === node.id && (now - lastClick.time) < 320) {
      // Double click focuses camera on node
      focusNode(node);
      lastClickRef.current = null;
    } else {
      // Single click selects node in inspector
      setSelectedNode(node);
      setFocusedNodeId(node.id);
      lastClickRef.current = { id: node.id, time: now };

      // Make sure animation loop is running to show edge particles
      if (fgRef.current) {
        fgRef.current.resumeAnimation();
      }
    }
  };

  // Recenter graph view
  const handleRecenter = () => {
    setSelectedNode(null);
    setFocusedNodeId(null);
    if (fgRef.current) {
      fgRef.current.resumeAnimation();
      fgRef.current.zoomToFit(800, 80);
      setTimeout(() => {
        if (!isDraggingRef.current && !hoveredNode) {
          fgRef.current.pauseAnimation();
        }
      }, 850);
    }
    setAccessibilityAnnouncement("Recentered knowledge graph camera view.");
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (fgRef.current) {
      fgRef.current.resumeAnimation();
      fgRef.current.zoom(fgRef.current.zoom() * 1.35, 300);
      setTimeout(() => {
        if (!isDraggingRef.current && !hoveredNode && !selectedNode) {
          fgRef.current.pauseAnimation();
        }
      }, 350);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      fgRef.current.resumeAnimation();
      fgRef.current.zoom(fgRef.current.zoom() / 1.35, 300);
      setTimeout(() => {
        if (!isDraggingRef.current && !hoveredNode && !selectedNode) {
          fgRef.current.pauseAnimation();
        }
      }, 350);
    }
  };

  // Custom canvas node drawing
  const drawNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;
    const isActive = isHovered || isSelected;

    let fontSize = 10;
    const isDomain = node.group === "category";
    const isProject = node.group === "project";
    const isLeadership = node.group === "leadership";
    const isDecorative = node.group === "decorative";

    if (isDomain) fontSize = 11.5;
    else if (isProject) fontSize = 10;
    else if (isLeadership) fontSize = 9;
    else if (isDecorative) fontSize = 7.5;

    ctx.font = `${isDomain ? "bold" : "normal"} ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

    // Construct label string
    let terminalLabel = node.label;
    if (isDomain) {
      terminalLabel = `dir/${node.label.toLowerCase().replace(" & ", "-").replace(" ", "-")}`;
    } else if (isProject) {
      terminalLabel = `○ ${node.label}`;
    } else if (isLeadership) {
      terminalLabel = `lead/${node.label.toLowerCase()}`;
    }

    if (isActive && blink) {
      terminalLabel += " █";
    }

    // Draw decorative anchor nodes simply
    if (isDecorative) {
      ctx.save();
      ctx.fillStyle = isActive ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(6, 182, 212, 0.5)";
      ctx.shadowBlur = isActive ? 5 : 0;
      ctx.fillText(terminalLabel, node.x, node.y);
      ctx.restore();
      return;
    }

    const textWidth = ctx.measureText(terminalLabel).width;
    const paddingX = isDomain ? 8 : 6;
    const paddingY = isDomain ? 5 : 4;
    const r = 3.5; // Rounded terminal borders

    const w = textWidth + paddingX * 2;
    const h = fontSize + paddingY * 2;
    const x = node.x - w / 2;
    const y = node.y - h / 2;

    // Default styles
    let fillColor = "rgba(8, 12, 20, 0.9)";
    let borderColor = "rgba(255, 255, 255, 0.08)";
    let textColor = "rgba(148, 163, 184, 0.75)";

    if (isDomain) {
      borderColor = "rgba(6, 182, 212, 0.25)";
      textColor = "rgba(6, 182, 212, 0.85)";
    } else if (isLeadership) {
      borderColor = "rgba(168, 85, 247, 0.25)";
      textColor = "rgba(168, 85, 247, 0.85)";
    }

    // Handle Dimming of Unrelated Nodes
    const activeNode = hoveredNode || selectedNode;
    let isDimmed = false;
    if (activeNode) {
      const isCurrent = activeNode.id === node.id;
      const isConnected = isNodeConnected(node.id, activeNode.id);
      if (!isCurrent && !isConnected) {
        isDimmed = true;
      }
    }

    if (isDimmed) {
      ctx.save();
      ctx.globalAlpha = 0.15;
    }

    // Active Node Glowing & Highlighting
    ctx.save();
    if (isActive) {
      const glowColor = isDomain ? "rgba(6, 182, 212, 0.85)" : isLeadership ? "rgba(168, 85, 247, 0.85)" : "rgba(255, 255, 255, 0.8)";
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1;
      borderColor = glowColor;
      textColor = "#ffffff";
    } else {
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
    }

    // Neighbor Highlights
    if (activeNode && isNodeConnected(node.id, activeNode.id) && !isActive) {
      borderColor = isDomain ? "rgba(6, 182, 212, 0.55)" : isLeadership ? "rgba(168, 85, 247, 0.55)" : "rgba(255, 255, 255, 0.4)";
      textColor = "rgba(248, 250, 252, 0.95)";
    }

    // Draw box
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    
    // Draw rounded rect
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw label
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(terminalLabel, node.x, node.y);
    ctx.restore();

    if (isDimmed) {
      ctx.restore();
    }
  };

  // Draw drifting particles before nodes rendering
  const handleRenderFramePre = (ctx: CanvasRenderingContext2D, globalScale: number) => {
    ctx.save();
    particlesRef.current.forEach((p) => {
      // Drift movement
      p.x += p.vx;
      p.y += p.vy;

      // Warp bounds
      if (p.x < -380) p.x = 380;
      if (p.x > 380) p.x = -380;
      if (p.y < -280) p.y = 280;
      if (p.y > 280) p.y = -280;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / globalScale, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
      ctx.shadowColor = "rgba(6, 182, 212, 0.5)";
      ctx.shadowBlur = 3;
      ctx.fill();
    });
    ctx.restore();
  };

  // Keyboard navigation event hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      if (filteredNodes.length === 0) return;

      if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        
        const currentIndex = filteredNodes.findIndex((n) => n.id === focusedNodeId);
        let nextIndex = 0;

        if (e.key === "Tab") {
          if (e.shiftKey) {
            nextIndex = currentIndex <= 0 ? filteredNodes.length - 1 : currentIndex - 1;
          } else {
            nextIndex = currentIndex === -1 || currentIndex === filteredNodes.length - 1 ? 0 : currentIndex + 1;
          }
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIndex = currentIndex === -1 || currentIndex === filteredNodes.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? filteredNodes.length - 1 : currentIndex - 1;
        }

        const nextNode = filteredNodes[nextIndex];
        setSelectedNode(nextNode);
        setFocusedNodeId(nextNode.id);
        if (fgRef.current) {
          fgRef.current.resumeAnimation();
        }
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentNode = filteredNodes.find((n) => n.id === focusedNodeId);
        if (currentNode) {
          focusNode(currentNode);
        }
      }

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleRecenter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedNodeId, filteredNodes]);

  // Edges Color and Width calculations
  const getLinkColor = (link: any) => {
    const active = hoveredNode || selectedNode;
    if (!active) {
      return "rgba(6, 182, 212, 0.12)";
    }
    return isLinkActive(link) ? "rgba(6, 182, 212, 0.65)" : "rgba(6, 182, 212, 0.02)";
  };

  const getLinkWidth = (link: any) => {
    const active = hoveredNode || selectedNode;
    if (!active) {
      return 0.75;
    }
    return isLinkActive(link) ? 1.5 : 0.25;
  };

  // Find all node names connected to the target node
  const getConnectedNodes = (node: GraphNode) => {
    const connected = new Set<string>();
    filteredLinks.forEach((link) => {
      const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      if (sId === node.id) {
        const targetNode = filteredNodes.find(n => n.id === tId);
        if (targetNode && targetNode.group !== 'decorative') {
          connected.add(targetNode.label);
        }
      } else if (tId === node.id) {
        const sourceNode = filteredNodes.find(n => n.id === sId);
        if (sourceNode && sourceNode.group !== 'decorative') {
          connected.add(sourceNode.label);
        }
      }
    });
    return Array.from(connected);
  };

  const activeNode = hoveredNode || selectedNode;

  return (
    <section id="system-map" className="w-full bg-[#080c14] py-20 px-4 border-t border-slate-900/60 relative overflow-hidden select-none">
      
      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {accessibilityAnnouncement}
      </div>

      {/* Grid overlay background */}
      <div className="absolute inset-0 grid-bg pointer-events-none select-none opacity-20" />
      <div 
        className="absolute inset-0 pointer-events-none select-none z-10"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.015) 0%, rgba(8, 12, 20, 0) 80%)"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Section Header Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#06b6d4]">krishi@stack:~$</span>
          <span className="text-slate-100">open system-map</span>
        </div>

        {/* Section Info Block */}
        <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg mb-8 font-mono">
          <div className="flex items-center space-x-2 text-[10px] text-[#06b6d4] uppercase tracking-wider mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
            <span>system-map // simulation_engine</span>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            Knowledge Network
          </h2>
          <p className="mt-2 text-slate-400 text-xs leading-relaxed select-text font-sans">
            An interactive system architecture topology mapping how my academic foundation, software projects, leadership experiences, and domains connect. Drag nodes to inspect relationships, double-click to focus, or recenter below.
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
                  setSelectedNode(null);
                  setFocusedNodeId(null);
                  if (fgRef.current) {
                    fgRef.current.resumeAnimation();
                    setTimeout(() => fgRef.current.zoomToFit(600, 80), 50);
                    setTimeout(() => fgRef.current.pauseAnimation(), 700);
                  }
                  setAccessibilityAnnouncement(`Filtered graph view by ${filter.label}`);
                }}
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

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
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
              title="Recenter visualizer camera view"
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
                  ? "bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4]"
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
              className="mb-4 p-4 rounded-xl border border-[#06b6d4]/20 bg-[#0d1321]/80 backdrop-blur-md font-mono text-[11px] text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <span className="text-[#06b6d4] font-bold block mb-1">⌨️ Tab / Arrow keys</span>
                Navigate and cycle through currently visible nodes sequentially.
              </div>
              <div>
                <span className="text-[#06b6d4] font-bold block mb-1">⌨️ Enter / Space</span>
                Select focused node and center/zoom graph camera on it.
              </div>
              <div>
                <span className="text-[#06b6d4] font-bold block mb-1">⌨️ Double-Click</span>
                Focus and transition the camera to center coordinates on the node.
              </div>
              <div>
                <span className="text-[#06b6d4] font-bold block mb-1">⌨️ Esc / +/- Keys</span>
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
            className="lg:col-span-3 border border-slate-900/80 rounded-xl relative overflow-hidden h-[380px] md:h-[500px] cursor-grab active:cursor-grabbing shadow-inner flex bg-[#060a12] terminal-highlight"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
              backgroundPosition: 'center',
            }}
          >
            {/* Visual scanline element to simulate old terminal interface */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,24,38,0)_96%,rgba(6,182,212,0.06)_96%)] bg-[size:100%_3px] opacity-10 z-10" />

            <ForceGraph2D
              ref={fgRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={{ nodes: filteredNodes, links: filteredLinks }}
              nodeCanvasObject={drawNode}
              nodeRelSize={4.5}
              linkWidth={getLinkWidth}
              linkColor={getLinkColor}
              linkDirectionalParticles={(link: any) => isLinkActive(link) ? 3 : 0}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={0.008}
              linkDirectionalParticleColor={() => "rgba(6, 182, 212, 0.85)"}
              cooldownTicks={120}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              onNodeClick={handleNodeClick}
              onNodeHover={handleNodeHover}
              onNodeDrag={handleNodeDrag}
              onNodeDragEnd={handleNodeDragEnd}
              onRenderFramePre={handleRenderFramePre}
              onBackgroundClick={handleRecenter}
              enableZoomInteraction={true}
              enablePanInteraction={true}
            />

            {/* Quick Helper Floating UI Guide */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500 pointer-events-none select-none uppercase tracking-wider space-y-1 z-10">
              <div className="flex items-center gap-1 text-slate-400">
                <Info size={8} />
                <span>Double-Click nodes to center focus camera</span>
              </div>
              <div>⚡ Scroll: Zoom | Click & Drag: Orbit Graph</div>
            </div>
          </div>

          {/* Node Metadata Terminal Inspector Panel */}
          <div className="lg:col-span-1 flex flex-col h-full min-h-[220px]">
            {/* Panel Frame Header */}
            <div className="bg-slate-950/80 px-4 py-2 border border-slate-900 flex justify-between items-center rounded-t-xl select-none font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                Node Inspector
              </span>
            </div>

            {/* Panel Body */}
            <div className="flex-1 border border-t-0 border-slate-900 bg-[#0d1321]/20 backdrop-blur-md rounded-b-xl overflow-hidden relative min-h-[200px] flex flex-col justify-stretch">
              <AnimatePresence mode="wait">
                {activeNode && activeNode.group !== 'decorative' ? (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="p-5 flex flex-col justify-between h-full relative font-mono text-xs text-slate-300"
                  >
                    {/* Glowing Accent Top Bar matching category colors */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300" 
                      style={{
                        backgroundColor: 
                          activeNode.group === "category" ? "#06b6d4" :
                          activeNode.group === "project" ? "#10b981" :
                          activeNode.group === "leadership" ? "#a855f7" : "#64748b"
                      }}
                    />

                    <div className="space-y-4">
                      {/* Node Header Metadata */}
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                          NODE
                        </span>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight uppercase">
                          {activeNode.label}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                            STATUS
                          </span>
                          <span className={`text-[10px] font-bold ${activeNode.status === 'SYSTEM' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                            {activeNode.status || 'ACTIVE'}
                          </span>
                        </div>

                        {activeNode.parentId && (
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                              DOMAIN
                            </span>
                            <span className="text-[10px] text-slate-200">
                              {nodes.find(n => n.id === activeNode.parentId)?.label || 'Core'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Connected nodes calculation */}
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
                          CONNECTED
                        </span>
                        <ul className="space-y-1">
                          {getConnectedNodes(activeNode).map((name, idx) => (
                            <li key={idx} className="text-[10px] flex items-center gap-1.5 text-slate-300">
                              <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Node description */}
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
                          METADATA
                        </span>
                        <p className="text-slate-400 text-xs leading-relaxed font-sans">
                          {activeNode.description}
                        </p>
                      </div>

                      {/* Related Bullet Info */}
                      {activeNode.techStack && activeNode.techStack.length > 0 && (
                        <div className="pt-2 border-t border-slate-900/60">
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1.5">
                            TECH STACK
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {activeNode.techStack.map((tech, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-900 text-[9px] text-slate-400 uppercase tracking-wide">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand Category Interaction Prompt */}
                    <div className="mt-8 pt-4 border-t border-slate-900/50 font-mono text-[9px] text-slate-500 uppercase tracking-wider space-y-2">
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">LINKS</div>
                      <div className="space-y-1.5 text-[10px]">
                        {activeNode.openUrl && (
                          <a 
                            href={activeNode.openUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
                          >
                            → Open Project
                          </a>
                        )}
                        {activeNode.githubUrl && (
                          <a 
                            href={activeNode.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
                          >
                            → GitHub
                          </a>
                        )}
                        <button 
                          onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors bg-transparent border-none p-0 cursor-pointer font-mono font-bold text-[10px] text-left"
                        >
                          → Ask Krishi
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-6 flex-1 flex flex-col justify-center items-center text-center select-none font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 animate-ping mb-3" />
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
