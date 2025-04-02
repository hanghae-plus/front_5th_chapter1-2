export const nonRenderableTypes = ["null", "undefined", "boolean"];

export function getType(value) {
  if (value === null) return "null";
  return typeof value;
}
