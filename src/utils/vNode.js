export function isEmptyVNode(vNode) {
  return vNode === null || vNode === undefined || typeof vNode === "boolean";
}

export function isTextVNode(vNode) {
  return typeof vNode === "string" || typeof vNode === "number";
}

export function isFunctionalComponent(vNode) {
  return typeof vNode.type === "function";
}
