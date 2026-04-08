import { DEFAULT_UNIT_STEP, UNIT_STEPS } from "../constants";

export function getQuantityStep(unit: string): number {
  return UNIT_STEPS[unit] ?? DEFAULT_UNIT_STEP;
}

function getQuantityPrecision(step: number): number {
  const [, decimals = ""] = step.toString().split(".");
  return decimals.length;
}

export function normalizeQuantity(quantity: number, unit: string): number {
  const step = getQuantityStep(unit);
  const precision = getQuantityPrecision(step);
  const normalizedSteps = Math.round(Number((quantity / step).toFixed(precision + 2)));

  return Number((normalizedSteps * step).toFixed(precision));
}

export function formatQuantity(quantity: number, unit: string): string {
  const normalizedQuantity = normalizeQuantity(quantity, unit);
  const step = getQuantityStep(unit);

  if (unit === "100 g") {
    return (normalizedQuantity * 100).toFixed(0);
  }

  return normalizedQuantity.toFixed(getQuantityPrecision(step));
}

export function formatQuantityUnit(unit: string): string {
  return unit === "100 g" ? "g" : unit;
}

export function formatQuantityLabel(quantity: number, unit: string): string {
  return `${formatQuantity(quantity, unit)}${formatQuantityUnit(unit)}`;
}
