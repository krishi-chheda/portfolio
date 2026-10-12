interface SectionHeaderProps {
  num: string;
  title: string;
  command: string;
  meta?: string;
}

// "§ 01  PROJECTS · ls -la projects/" — the command types out via useTerminalReveal (data-reveal="command").
export default function SectionHeader({ num, title, command, meta }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3 mb-10 text-[11px] uppercase tracking-[0.18em]">
      <h2 className="flex items-baseline gap-3 font-normal text-ink-faint">
        <span className="text-accent">§ {num}</span>
        <span>
          <span className="text-ink">{title}</span>
          <span className="mx-2">·</span>
          <span data-reveal="command" className="normal-case tracking-normal text-ink-soft">{command}</span>
        </span>
      </h2>
      {meta && <span className="text-ink-faint">{meta}</span>}
    </div>
  );
}
