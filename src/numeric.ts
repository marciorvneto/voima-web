export type ODEFn = (t: number, y: number) => number;

export const rk4Step = (t: number, y: number, h: number, dydt: ODEFn) => {
  const k1 = h * dydt(t, y);
  const k2 = h * dydt(t + h / 2, y + k1 / 2);
  const k3 = h * dydt(t + h / 2, y + k2 / 2);
  const k4 = h * dydt(t + h, y + k3);
  const yNext = y + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  return yNext;
};
