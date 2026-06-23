export interface NavigationSection {
  section_id: string;
  scroll_target: string;
  command_aliases: string[];
}

export const navigationRegistry: NavigationSection[] = [
  {
    section_id: "accessible-vision",
    scroll_target: "projects",
    command_aliases: [
      "cat projects/accessible-vision/details.md",
      "cat projects/accessible-vision",
      "accessible-vision"
    ]
  },
  {
    section_id: "clinicalbrief",
    scroll_target: "projects",
    command_aliases: [
      "cat projects/clinicalbrief/details.md",
      "cat projects/clinicalbrief",
      "clinicalbrief"
    ]
  },
  {
    section_id: "studenthub",
    scroll_target: "projects",
    command_aliases: [
      "cat projects/studenthub/details.md",
      "cat projects/studenthub",
      "studenthub"
    ]
  },
  {
    section_id: "traffic-ai",
    scroll_target: "projects",
    command_aliases: [
      "cat projects/traffic-ai/details.md",
      "cat projects/traffic-ai",
      "traffic-ai"
    ]
  },
  {
    section_id: "leadership",
    scroll_target: "leadership",
    command_aliases: [
      "cd leadership",
      "leadership"
    ]
  },
  {
    section_id: "career",
    scroll_target: "career",
    command_aliases: [
      "git log --career",
      "career"
    ]
  },
  {
    section_id: "currently-building",
    scroll_target: "currently-building",
    command_aliases: [
      "tail -f currently-building.log",
      "currently-building"
    ]
  },
  {
    section_id: "system-map",
    scroll_target: "system-map",
    command_aliases: [
      "open system-map",
      "system-map"
    ]
  },
  {
    section_id: "contact",
    scroll_target: "contact",
    command_aliases: [
      "ssh recruiter@krishi.os",
      "ssh contact@krishi.os",
      "contact"
    ]
  }
];

export const executeNavigationCommand = (cmdText: string) => {
  const normalized = cmdText.trim().toLowerCase();
  const match = navigationRegistry.find((s) =>
    s.command_aliases.some((alias) => normalized.includes(alias.toLowerCase()))
  );

  if (match) {
    // 1. Dispatch custom event for project selection if applicable
    if (
      match.section_id === "accessible-vision" ||
      match.section_id === "clinicalbrief" ||
      match.section_id === "studenthub" ||
      match.section_id === "traffic-ai"
    ) {
      window.dispatchEvent(new CustomEvent("select-project", { detail: { id: match.section_id } }));
    }

    // 2. Scroll to the scroll target
    const element = document.getElementById(match.scroll_target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // 3. Highlight the core terminal block inside this section
      const terminal =
        element.querySelector(".terminal-highlight") ||
        element.querySelector(".border-slate-900") ||
        element;

      if (terminal) {
        terminal.classList.add("terminal-highlight-active");
        setTimeout(() => {
          terminal.classList.remove("terminal-highlight-active");
        }, 2500);
      }
    }
  }
};
