import { motion } from "framer-motion";
import { edgeSpring } from "./animations";

interface TopologyEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
  isDimmed: boolean;
}

export default function TopologyEdge({
  x1,
  y1,
  x2,
  y2,
  isActive,
  isDimmed
}: TopologyEdgeProps) {
  // Edge layout configurations matching user specification
  let strokeColor = "rgba(6, 182, 212, 0.25)"; // Soft transparent cyan
  let strokeWidth = 0.75;
  let opacity = 1.0;

  if (isActive) {
    strokeColor = "rgba(6, 182, 212, 0.85)"; // Brightened active path
    strokeWidth = 1.25;
  } else if (isDimmed) {
    opacity = 0.35; // Faded to 30-40% opacity
  }

  return (
    <g>
      {/* Underlying structural static line connection */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
        transition={edgeSpring}
      />

      {/* Overlaid data particles flow flow lines */}
      {isActive && (
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(6, 182, 212, 0.85)"
          strokeWidth={1.5}
          strokeDasharray="4 16"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -20 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 1.0
          }}
        />
      )}
    </g>
  );
}
