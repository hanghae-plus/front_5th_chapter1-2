import {
  isEmptyVNode,
  isFunctionalComponent,
  isTextVNode,
} from "../utils/\bvNode";

export function normalizeVNode(vNode) {
  if (isEmptyVNode(vNode)) {
    return "";
  }

  if (isTextVNode(vNode)) {
    return String(vNode);
  }

  if (isFunctionalComponent(vNode)) {
    const vNodeResult = vNode.type({
      ...vNode.props,
      children: normalizeChildren(vNode.children),
    });

    return normalizeVNode(vNodeResult);
  }

  function normalizeChildren(children) {
    if (Array.isArray(children)) {
      return children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== null && child !== "");
    }
    return children !== null ? [normalizeVNode(children)] : [];
  }

  return {
    ...vNode,
    children: normalizeChildren(vNode.children),
  };
}
