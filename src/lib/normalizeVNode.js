export function normalizeVNode(vNode) {
  // 기본 값 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 원시 타입 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    console.log(vNode);
    return vNode.map((child) => normalizeVNode(child)).flat();
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    return normalizeVNode(Component(vNode.props || {}));
  }

  // VNode 객체 처리
  const normalizedChildren = [];
  if (vNode.children) {
    const children = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children];
    children.forEach((child) => {
      const normalized = normalizeVNode(child);
      if (Array.isArray(normalized)) {
        normalizedChildren.push(...normalized);
      } else if (normalized !== "") {
        normalizedChildren.push(normalized);
      }
    });
  }

  return {
    type: vNode.type,
    props: vNode.props || {},
    children: normalizedChildren,
  };
}
