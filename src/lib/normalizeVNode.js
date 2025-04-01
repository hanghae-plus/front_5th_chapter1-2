export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return "";
  if (typeof vNode === "string" || typeof vNode === "number")
    return vNode.toString();
  if (Object.prototype.toString.call(vNode) === "[object Function]")
    return normalizeVNode(vNode());
  if (Array.isArray(vNode))
    return vNode
      .map(normalizeVNode)
      .filter((child) => typeof child === "string")
      .join("");
  if (Object.prototype.toString.call(vNode) === "[object Object]") {
    const normalized = { ...vNode };
    if (normalized.children) {
      normalized.children = normalizeVNode(normalized.children);
    }
    return normalized;
  }
  return "";
}
