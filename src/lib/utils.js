export function isPrimitive(value) {
  return typeof value === "string" || typeof value === "number";
}

export function isEmpty(value) {
  return value === null || value === undefined || typeof value === "boolean";
}

export function isFunctionComponent(vNode) {
  return (
    !isEmpty(vNode) &&
    typeof vNode === "object" &&
    typeof vNode.type === "function"
  );
}
