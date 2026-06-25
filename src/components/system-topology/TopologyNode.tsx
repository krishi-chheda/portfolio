import { motion } from "framer-motion";
import { TopologyNodeData } from "./topologyData";
import { nodeSpring } from "./animations";

interface TopologyNodeProps {
  node: TopologyNodeData;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  isNeighbor: boolean;
  isDimmed: boolean;
  blink: boolean;
  onClick: () => void;
  onDrag: (id: string, offset: { x: number; y: number }) => void;
  onDragEnd: (id: string) => void;
}

export default function TopologyNode({
  node,
  x,
  y,
  isSelected,
  isHovered,
  isNeighbor,
  isDimmed,
  blink,
  onClick,
  onDrag,
  onDragEnd
}: TopologyNodeProps) {
  const isDomain = node.group === "category";
  const isProject = node.group === "project";
  const isLeadership = node.group === "leadership";
  const isDecorative = node.group === "decorative";
  const isActive = isSelected || isHovered;

  // Build the terminal-style node label
  let terminalLabel = node.label;
  if (isDomain) {
    terminalLabel = `dir/${node.label.toLowerCase().replace(" & ", "-").replace(" ", "-")}`;
  } else if (isProject) {
    terminalLabel = `○ ${node.label}`;
  } else if (isLeadership) {
    terminalLabel = `lead/${node.label.toLowerCase()}`;
  }

  // Blinking cursor on hover/select states
  if (isActive && blink) {
    terminalLabel += " █";
  }

  // Calculate box dimensions dynamically
  let charWidth = 5.6;
  let fontSize = 9.5;
  let paddingX = 8;
  let paddingY = 5.5;

  if (isDomain) {
    charWidth = 6.4;
    fontSize = 11;
    paddingX = 10;
    paddingY = 7;
  } else if (isLeadership) {
    charWidth = 5.0;
    fontSize = 8.5;
    paddingX = 7;
    paddingY = 4.5;
  }

  const boxW = terminalLabel.length * charWidth + paddingX * 2;
  const boxH = fontSize + paddingY * 2;

  // Setup styles, strokes, and glows based on selection state
  let strokeColor = "rgba(255, 255, 255, 0.08)";
  let fillColor = "rgba(8, 12, 20, 0.92)";
  let textColor = "rgba(148, 163, 184, 0.75)";
  let filterId = "";
  let strokeWidth = 1.0;

  if (isDomain) {
    strokeColor = isSelected 
      ? "rgba(6, 182, 212, 1.0)" 
      : isHovered 
        ? "rgba(6, 182, 212, 0.85)" 
        : isNeighbor 
          ? "rgba(6, 182, 212, 0.55)" 
          : "rgba(6, 182, 212, 0.25)";
    textColor = isActive ? "#ffffff" : isNeighbor ? "rgba(6, 182, 212, 0.95)" : "rgba(6, 182, 212, 0.75)";
    fillColor = "rgba(6, 182, 212, 0.03)";
    filterId = isSelected ? "url(#glow-cyan-strong)" : isHovered ? "url(#glow-cyan)" : "";
    strokeWidth = isSelected ? 1.5 : 1.0;
  } else if (isLeadership) {
    strokeColor = isSelected 
      ? "rgba(168, 85, 247, 1.0)" 
      : isHovered 
        ? "rgba(168, 85, 247, 0.85)" 
        : isNeighbor 
          ? "rgba(168, 85, 247, 0.55)" 
          : "rgba(168, 85, 247, 0.25)";
    textColor = isActive ? "#ffffff" : isNeighbor ? "rgba(168, 85, 247, 0.95)" : "rgba(168, 85, 247, 0.75)";
    fillColor = "rgba(168, 85, 247, 0.03)";
    filterId = isSelected ? "url(#glow-purple-strong)" : isHovered ? "url(#glow-purple)" : "";
    strokeWidth = isSelected ? 1.5 : 1.0;
  } else if (isProject) {
    strokeColor = isSelected 
      ? "rgba(16, 185, 129, 1.0)" 
      : isHovered 
        ? "rgba(16, 185, 129, 0.85)" 
        : isNeighbor 
          ? "rgba(16, 185, 129, 0.55)" 
          : "rgba(255, 255, 255, 0.1)";
    textColor = isActive ? "#ffffff" : isNeighbor ? "rgba(16, 185, 129, 0.95)" : "rgba(148, 163, 184, 0.75)";
    filterId = isSelected ? "url(#glow-green-strong)" : isHovered ? "url(#glow-green)" : "";
    strokeWidth = isSelected ? 1.5 : 1.0;
  }

  // Render decorative nodes as simple SVG text (no bounding cards)
  if (isDecorative) {
    return (
      <motion.g
        animate={{ 
          x, 
          y,
          scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
          opacity: isDimmed ? 0.35 : 1.0
        }}
        transition={nodeSpring}
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={isActive ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.35)"}
          fontSize="7.5"
          fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace"
          filter={isActive ? "url(#glow-cyan)" : undefined}
        >
          {terminalLabel}
        </text>
      </motion.g>
    );
  }

  return (
    <motion.g
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      dragSnapToOrigin={true}
      onDrag={(event, info) => onDrag(node.id, { x: info.offset.x, y: info.offset.y })}
      onDragEnd={() => onDragEnd(node.id)}
      animate={{ 
        x, 
        y,
        scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
        opacity: isDimmed ? 0.35 : 1.0 // Fades unrelated nodes to 30-40% opacity
      }}
      transition={nodeSpring}
      style={{ cursor: "grab" }}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick();
      }}
    >
      {/* Node Bounding Box */}
      <rect
        x={-boxW / 2}
        y={-boxH / 2}
        width={boxW}
        height={boxH}
        rx={4}
        ry={4}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter={filterId || undefined}
        style={{ transition: "stroke 0.15s, fill 0.15s" }}
      />

      {/* Terminal Node Label */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={fontSize}
        fontFamily="ui-monospace, SFMono-Regular, Consolas, monospace"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {terminalLabel}
      </text>
    </motion.g>
  );
}
