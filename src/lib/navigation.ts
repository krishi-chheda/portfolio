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
    section_id: "readme",
    scroll_target: "",
    command_aliases: [
      "cat readme.md",
      "cat readme",
      "man krishi",
      "readme"
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
