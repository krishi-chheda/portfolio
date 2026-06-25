export const nodeSpring = {
  type: "spring" as const,
  stiffness: 250,
  damping: 22,
  mass: 0.8
};

export const edgeSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 24
};

export const transitionSlow = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18
};
