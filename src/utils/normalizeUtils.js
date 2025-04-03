export function normalizeAttribute(attr) {
  return attr.toLowerCase() === "classname" ? "class" : attr;
}
