export default function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Primary Grid Layout */}
      <div className="absolute inset-0 grid-bg opacity-35" />

      {/* Spotlights and Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-950/15 rounded-full blur-[150px] pointer-events-none opacity-45" />
      
      {/* Radial Gradient overlay to fade grid at the edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, transparent 10%, #080c14 85%)"
        }}
      />
    </div>
  );
}
