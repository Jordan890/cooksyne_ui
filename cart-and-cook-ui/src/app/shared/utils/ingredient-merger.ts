import { IngredientQuantity, Unit } from '../../features/recipes/models/recipe.model';

const WEIGHT_UNITS: Unit[] = ['GRAMS', 'OUNCES', 'POUNDS'];
const VOLUME_UNITS: Unit[] = ['CUPS', 'TBSP', 'TSP', 'ML', 'LITERS'];

/** Conversion factors to base unit (grams for weight, ml for volume). */
const TO_BASE: Record<string, number> = {
  GRAMS: 1,
  OUNCES: 28.3495,
  POUNDS: 453.592,
  ML: 1,
  LITERS: 1000,
  CUPS: 236.588,
  TBSP: 14.7868,
  TSP: 4.92892,
};

function isWeight(u: Unit): boolean {
  return WEIGHT_UNITS.includes(u);
}

function isVolume(u: Unit): boolean {
  return VOLUME_UNITS.includes(u);
}

function areCompatible(a: Unit, b: Unit): boolean {
  if (a === b) return true;
  if (isWeight(a) && isWeight(b)) return true;
  if (isVolume(a) && isVolume(b)) return true;
  return false;
}

/** Convert `amount` from `from` unit to `to` unit. Both must be compatible. */
function convert(amount: number, from: Unit, to: Unit): number {
  if (from === to) return amount;
  const base = amount * (TO_BASE[from] ?? 1);
  return base / (TO_BASE[to] ?? 1);
}

/**
 * Merge `incoming` ingredients into `existing`.
 *
 * - Same name + same unit → amounts are added.
 * - Same name + compatible units (both weight or both volume) → converted to
 *   the existing ingredient's unit, then added.
 * - Same name + incompatible units → kept as a separate entry.
 * - New ingredient name → appended.
 *
 * Returns a new array; inputs are not mutated.
 */
export function mergeIngredients(
  existing: IngredientQuantity[],
  incoming: IngredientQuantity[],
): IngredientQuantity[] {
  // Deep-copy existing so we never mutate caller data.
  const merged: IngredientQuantity[] = existing.map(i => ({
    name: i.name,
    quantity: { amount: i.quantity.amount, unit: i.quantity.unit },
  }));

  for (const inc of incoming) {
    const key = inc.name.toLowerCase().trim();
    const idx = merged.findIndex(m => m.name.toLowerCase().trim() === key);

    if (idx >= 0) {
      const cur = merged[idx];
      if (areCompatible(cur.quantity.unit, inc.quantity.unit)) {
        const added = convert(inc.quantity.amount, inc.quantity.unit, cur.quantity.unit);
        merged[idx] = {
          ...cur,
          quantity: {
            amount: Math.round((cur.quantity.amount + added) * 100) / 100,
            unit: cur.quantity.unit,
          },
        };
      } else {
        // Incompatible units — add as separate entry.
        merged.push({
          name: inc.name,
          quantity: { amount: inc.quantity.amount, unit: inc.quantity.unit },
        });
      }
    } else {
      merged.push({
        name: inc.name,
        quantity: { amount: inc.quantity.amount, unit: inc.quantity.unit },
      });
    }
  }

  return merged;
}
