"use client";

import { useState, useEffect, useRef } from "react";
import { animate, motion, AnimatePresence } from "framer-motion";
import { 
  initialNodes, 
  initialLinks, 
  TopologyNodeData, 
  TopologyLinkData 
} from "./topologyData";
import TopologyNode from "./TopologyNode";
import TopologyEdge from "./TopologyEdge";
import Inspector from "./Inspector";
import Toolbar from "./Toolbar";
import { Info } from "lucide-react";

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

export default function SystemTopology() {
  // Graph configuration state
  const [nodes] = useState<TopologyNodeData[]>(initialNodes);
  const [links] = useState<TopologyLinkData[]>(initialLinks);

  // Pan & Zoom coordinates state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Filters and inspection state
  const [activeGroupFilter, setActiveGroupFilter] = useState("all");
  const [selectedNode, setSelectedNode] = useState<TopologyNodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TopologyNodeData | null>(null);
  const [blink, setBlink] = useState(true);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState("");

  // Framer Motion spring coordinates for snapping back
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Pre-compiled ambient background particles
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    const tempParticles: ParticleData[] = [];
    for (let i = 0; i < 25; i++) {
      tempParticles.push({
        id: i,
        x: (Math.random() - 0.5) * 760,
        y: (Math.random() - 0.5) * 560,
        size: Math.random() * 1.5 + 0.8,
        duration: Math.random() * 20 + 20, // 20-40 seconds slow loop
        delay: Math.random() * -30, // Random phase offsets
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 60
      });
    }
    setParticles(tempParticles);
  }, []);

  // Blink interval for terminal cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  // Navigation Filter Lists
  const filteredNodes = nodes.filter((node) => {
    if (activeGroupFilter === "all") return true;
    if (activeGroupFilter === "domains") return node.group === "category";
    if (activeGroupFilter === "projects") return node.group === "project" || node.group === "leadership";
    return true;
  });

  const filteredLinks = links.filter((link) => {
    return filteredNodes.some((n) => n.id === link.source) && filteredNodes.some((n) => n.id === link.target);
  });

  // Check if link is connected to current hover/selected node
  const isLinkActive = (link: TopologyLinkData) => {
    const active = hoveredNode || selectedNode;
    if (!active) return false;
    return link.source === active.id || link.target === active.id;
  };

  // Check connection status
  const isNodeConnected = (nodeId1: string, nodeId2: string) => {
    return filteredLinks.some((l) => {
      return (l.source === nodeId1 && l.target === nodeId2) || (l.source === nodeId2 && l.target === nodeId1);
    });
  };

  // Find all node labels connected to target
  const getConnectedNodeNames = (node: TopologyNodeData) => {
    const connected = new Set<string>();
    filteredLinks.forEach((l) => {
      if (l.source === node.id) {
        const found = filteredNodes.find((n) => n.id === l.target);
        if (found && found.group !== "decorative") connected.add(found.label);
      } else if (l.target === node.id) {
        const found = filteredNodes.find((n) => n.id === l.source);
        if (found && found.group !== "decorative") connected.add(found.label);
      }
    });
    return Array.from(connected);
  };

  // Zooming tools
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.25, 3.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.25, 0.5));
  const handleRecenter = () => {
    setSelectedNode(null);
    setFocusedNodeId(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setAccessibilityAnnouncement("Recenter camera coordinates view.");
  };

  // Zoom by mouse wheel scroll
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z * zoomFactor, 3.5));
    } else {
      setZoom((z) => Math.max(z / zoomFactor, 0.5));
    }
  };

  // Panning controls on visualizer background click
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const isBg = 
      (e.target as HTMLElement).tagName === "svg" || 
      (e.target as HTMLElement).classList.contains("topology-bg") ||
      (e.target as HTMLElement).classList.contains("ambient-grid");
      
    if (!isBg) return;

    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Drag offsets snap-back math
  const handleNodeDrag = (nodeId: string, offset: { x: number; y: number }) => {
    // Ignore minor coordinate drifts under 5px (prevent clicks from triggering drags)
    if (Math.abs(offset.x) < 5 && Math.abs(offset.y) < 5) return;
    setDraggedNodeId(nodeId);
    setDragOffset(offset);
  };

  const handleNodeDragEnd = (nodeId: string) => {
    // Snap back dragged offset to 0,0 elastically using springs
    animate(dragOffset.x, 0, {
      type: "spring",
      stiffness: 220,
      damping: 20,
      onUpdate: (val) => setDragOffset((prev) => ({ ...prev, x: val }))
    });
    animate(dragOffset.y, 0, {
      type: "spring",
      stiffness: 220,
      damping: 20,
      onUpdate: (val) => setDragOffset((prev) => ({ ...prev, y: val })),
      onComplete: () => {
        setDraggedNodeId(null);
      }
    });
  };

  // Calculate coordinates matching render constraints
  const getNodeRenderCoords = (node: TopologyNodeData) => {
    if (draggedNodeId === node.id) {
      return { x: node.baseX, y: node.baseY }; // Framer Motion handles dragged offset transform directly
    }
    if (draggedNodeId && isNodeConnected(node.id, draggedNodeId)) {
      // Adjacent nodes follow elastically by a fraction
      return {
        x: node.baseX + dragOffset.x * 0.18,
        y: node.baseY + dragOffset.y * 0.18
      };
    }
    return { x: node.baseX, y: node.baseY };
  };

  const getNodeTrueCoords = (node: TopologyNodeData) => {
    if (draggedNodeId === node.id) {
      return { x: node.baseX + dragOffset.x, y: node.baseY + dragOffset.y };
    }
    if (draggedNodeId && isNodeConnected(node.id, draggedNodeId)) {
      return {
        x: node.baseX + dragOffset.x * 0.18,
        y: node.baseY + dragOffset.y * 0.18
      };
    }
    return { x: node.baseX, y: node.baseY };
  };

  // Set selected node and focus ID
  const handleNodeSelect = (node: TopologyNodeData) => {
    setSelectedNode(node);
    setFocusedNodeId(node.id);
    setAccessibilityAnnouncement(`Selected node: ${node.label}`);
  };

  // Accessibility keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

      if (filteredNodes.length === 0) return;

      if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = filteredNodes.findIndex((n) => n.id === focusedNodeId);
        let nextIndex = 0;

        if (e.key === "Tab") {
          nextIndex = e.shiftKey
            ? (currentIndex <= 0 ? filteredNodes.length - 1 : currentIndex - 1)
            : (currentIndex === -1 || currentIndex === filteredNodes.length - 1 ? 0 : currentIndex + 1);
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIndex = currentIndex === -1 || currentIndex === filteredNodes.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? filteredNodes.length - 1 : currentIndex - 1;
        }

        const nextNode = filteredNodes[nextIndex];
        setSelectedNode(nextNode);
        setFocusedNodeId(nextNode.id);
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentNode = filteredNodes.find((n) => n.id === focusedNodeId);
        if (currentNode) handleNodeSelect(currentNode);
      }

      if (e.key === "+" || e.key === "=") { e.preventDefault(); handleZoomIn(); }
      if (e.key === "-") { e.preventDefault(); handleZoomOut(); }
      if (e.key === "Escape") { e.preventDefault(); handleRecenter(); }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedNodeId, filteredNodes, zoom, pan]);

  const activeNode = hoveredNode || selectedNode;

  return (
    <section id="system-map" className="w-full bg-[#080c14] py-20 px-4 border-t border-slate-900/60 relative overflow-hidden select-none">
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {accessibilityAnnouncement}
      </div>

      {/* Cyber Grid Styling & Keyframes Inject */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-particle {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(var(--dx), var(--dy), 0); }
        }
        .ambient-particle {
          transform-box: fill-box;
          transform-origin: center;
        }
      `}} />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#06b6d4]">krishi@stack:~$</span>
          <span className="text-slate-100">open system-topology</span>
        </div>

        {/* Section Header details */}
        <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg mb-8 font-mono">
          <div className="flex items-center space-x-2 text-[10px] text-[#06b6d4] uppercase tracking-wider mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
            <span>system-topology // display_manager</span>
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            Knowledge Network
          </h2>
          <p className="mt-2 text-slate-400 text-xs leading-relaxed select-text font-sans">
            An interactive system architecture topology mapping academic foundation, software projects, leadership experiences, and domains. Drag nodes to elastically pull links, hover paths, and inspect debugger parameters.
          </p>
        </div>

        {/* Modular Toolbar */}
        <Toolbar
          activeGroupFilter={activeGroupFilter}
          onFilterChange={(filter) => {
            setActiveGroupFilter(filter);
            setSelectedNode(null);
            setFocusedNodeId(null);
          }}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
          showKeyboardGuide={showKeyboardGuide}
          onToggleKeyboardGuide={() => setShowKeyboardGuide(!showKeyboardGuide)}
        />

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

        {/* Main Visualizer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* SVG Canvas Board */}
          <div
            className="lg:col-span-3 border border-slate-900/80 rounded-xl relative overflow-hidden h-[380px] md:h-[500px] shadow-inner flex bg-[#060a12] terminal-highlight"
            style={{
              cursor: isPanning ? "grabbing" : "grab"
            }}
          >
            {/* Ambient CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,24,38,0)_96%,rgba(6,182,212,0.06)_96%)] bg-[size:100%_3px] opacity-10 z-10" />

            {/* Interactive SVG Wrapper */}
            <svg
              className="w-full h-full topology-bg"
              viewBox="-400 -300 800 600"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ pointerEvents: "auto" }}
            >
              {/* Defs block containing glows and filters */}
              <defs>
                <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-cyan-strong" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="6.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-purple-strong" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="6.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-green-strong" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="6.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Cyber grid and scanlines drawn inside SVG */}
              <g className="ambient-grid" style={{ pointerEvents: "none" }}>
                <rect x="-400" y="-300" width="800" height="600" fill="none" />
                
                {/* CSS animated drifting ambient background particles */}
                {particles.map((p) => (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r={p.size}
                    fill="rgba(6, 182, 212, 0.25)"
                    className="ambient-particle"
                    style={{
                      animation: `float-particle ${p.duration}s infinite alternate ease-in-out`,
                      animationDelay: `${p.delay}s`,
                      // Inject offset vectors as inline style variables
                      "--dx": `${p.dx}px`,
                      "--dy": `${p.dy}px`
                    } as React.CSSProperties}
                  />
                ))}
              </g>

              {/* Camera translation container */}
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                
                {/* Edges layer */}
                <g>
                  {filteredLinks.map((link, idx) => {
                    const sourceNode = filteredNodes.find((n) => n.id === link.source);
                    const targetNode = filteredNodes.find((n) => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    const active = hoveredNode || selectedNode;
                    let isEdgeActive = false;
                    let isEdgeDimmed = false;

                    if (active) {
                      isEdgeActive = isLinkActive(link);
                      isEdgeDimmed = !isEdgeActive;
                    }

                    // Get true snap locations
                    const sCoords = getNodeTrueCoords(sourceNode);
                    const tCoords = getNodeTrueCoords(targetNode);

                    return (
                      <TopologyEdge
                        key={`${link.source}-${link.target}-${idx}`}
                        x1={sCoords.x}
                        y1={sCoords.y}
                        x2={tCoords.x}
                        y2={tCoords.y}
                        isActive={isEdgeActive}
                        isDimmed={isEdgeDimmed}
                      />
                    );
                  })}
                </g>

                {/* Nodes layer */}
                <g>
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isHovered = hoveredNode?.id === node.id;
                    let isNeighbor = false;
                    let isDimmed = false;

                    if (activeNode) {
                      isNeighbor = isNodeConnected(node.id, activeNode.id);
                      if (activeNode.id !== node.id && !isNeighbor) {
                        isDimmed = true;
                      }
                    }

                    const rCoords = getNodeRenderCoords(node);

                    return (
                      <TopologyNode
                        key={node.id}
                        node={node}
                        x={rCoords.x}
                        y={rCoords.y}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        isNeighbor={isNeighbor}
                        isDimmed={isDimmed}
                        blink={blink}
                        onClick={() => handleNodeSelect(node)}
                        onDrag={handleNodeDrag}
                        onDragEnd={handleNodeDragEnd}
                      />
                    );
                  })}
                </g>
              </g>
            </svg>

            {/* Quick helper tip */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500 pointer-events-none select-none uppercase tracking-wider space-y-1 z-10">
              <div className="flex items-center gap-1 text-slate-400">
                <Info size={8} />
                <span>Single-Click selects | Double-Click zooms camera</span>
              </div>
              <div>⚡ Wheel: Zoom | Drag empty canvas space: Pan viewport</div>
            </div>
          </div>

          {/* Node Metadata Terminal Inspector Panel */}
          <Inspector
            activeNode={selectedNode}
            nodes={nodes}
            connectedNodeNames={selectedNode ? getConnectedNodeNames(selectedNode) : []}
          />
          
        </div>

      </div>
    </section>
  );
}
