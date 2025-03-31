const isEmptyStrType = (val) => {
  return val === null || typeof val === "undefined" || typeof val === "boolean";
};

const isNumericOrStr = (val) => {
  return !isNaN(Number(val)) || typeof val === "string";
};

export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환
  if (isEmptyStrType(vNode)) return "";

  // 문자열과 숫자는 문자열로 변환
  if (isNumericOrStr(vNode)) return String(vNode);

  // 컴포넌트 정규화
  const { type, props, children } = vNode;

  if (!type && !props && !children) {
    return;
  }

  if (typeof type === "function") {
    return normalizeVNode(type({ children, ...(props || {}) }));
  }

  const normalizedChildren = Array.isArray(children)
    ? children.map(normalizeVNode)
    : children
      ? [normalizeVNode(children)]
      : [];

  return {
    type,
    props: props ?? null,
    children: normalizedChildren,
  };
}
