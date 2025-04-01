const isValidateNode = (node) => {
  if (node === null || node === undefined || node === true || node === false) {
    return false;
  }
  return true;
};

export function normalizeVNode(vNode) {
  // 빈 문자열
  if (!isValidateNode(vNode)) {
    return "";
  }

  // 단순 문자열과 숫자
  if (typeof vNode == "string" || typeof vNode == "number") {
    return `${vNode}`;
  }

  // 오브젝트
  if (typeof vNode == "object") {
    const { type, props = {}, children = [] } = vNode;
    // 1. type: function
    if (typeof vNode.type == "function") {
      // 함수형 컴포넌트를 사용하듯이, props와 children 추가
      return normalizeVNode(vNode.type({ ...props, children }));
    }

    // 2. type: string
    if (typeof vNode.type == "string") {
      const normalizedChildren = [];
      if (Array.isArray(children)) {
        children.forEach(
          (child) =>
            isValidateNode(child) &&
            normalizedChildren.push(normalizeVNode(child)),
        );
      }
      // Object 타입의 VNode 반환
      return { type, props, children: normalizedChildren };
    }
  }
}
