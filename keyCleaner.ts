const TRANSFORMATIONS = new Map([
  ["n° chasis", "chasis"],
  ["n° motor", "motor"],
  ["año", "ano"],
]);

export function cleanKey(key: string) {
  key = key.trim().toLowerCase();
  return TRANSFORMATIONS.get(key) || key;
}
