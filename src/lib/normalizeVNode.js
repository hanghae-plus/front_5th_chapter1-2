export function normalizeVNode(vNode) {
  const inValidValues = [null, undefined, true, false];
  if (inValidValues.includes(vNode)) {
    return "";
  }

  const isPrimitive = typeof vNode === "string" || typeof vNode === "number";
  if (isPrimitive) {
    return String(vNode);
  }

  console.dir(vNode.type());
  return { ...vNode };
}
