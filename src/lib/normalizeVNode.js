import { getType, nonRenderableTypes } from "../utils";

export function normalizeVNode(vNode) {
  const type = getType(vNode);

  if (nonRenderableTypes.includes(type)) {
    return "";
  }

  if (type === "string" || type === "number") {
    return String(vNode);
  }

  // 함수형 컴포넌트 처리
  if (type === "object" && typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: normalizeChildren(vNode.children),
      }),
    );
  }

  // 일반 DOM VNode 처리
  if (type === "object" && typeof vNode.type === "string") {
    return {
      ...vNode,
      children: normalizeChildren(vNode.children),
    };
  }

  return vNode;
}

export function normalizeChildren(children) {
  const result = [];

  const flatten = (child) => {
    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else {
      const normalized = normalizeVNode(child);
      if (normalized !== "") {
        result.push(normalized);
      }
    }
  };

  flatten(children);
  return result;
}
