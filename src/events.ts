import { Event, Scenario } from "./api";

export type EffectFn = (scenario: Scenario, time: number) => void;
export const createEvent = (
  name: string,
  occursAt: number,
  effect: EffectFn,
): Event => {
  return {
    name,
    time: occursAt,
    effect,
    handled: false,
  };
};
