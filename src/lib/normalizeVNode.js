import { FALSY_VALUES, PRIMITIVE_TYPES } from "./utils";

export function normalizeVNode(vNode) {
  if (FALSY_VALUES.includes(vNode)) {
    return "";
  }
  if (PRIMITIVE_TYPES.includes(typeof vNode)) {
    return `${vNode}`;
  }

  if (vNode.type && typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    const result = type({ ...props, children });

    return normalizeVNode(result);
  }

  return {
    ...vNode,
    children: vNode.children?.map(normalizeVNode).filter(Boolean),
  };
}
