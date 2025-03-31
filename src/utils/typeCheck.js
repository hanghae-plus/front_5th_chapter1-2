export const isValidVNode = (vNode) => {
  return typeof vNode === "string" || typeof vNode === "number";
};

export const isInvalidVNode = (vNode) => {
  return vNode === null || vNode === undefined || typeof vNode === "boolean";
};

export const isFuncVNode = (vNode) => {
  return typeof vNode === "object" && typeof vNode.type === "function";
};
export const isArray = (vNode) => {
  return Array.isArray(vNode);
};
