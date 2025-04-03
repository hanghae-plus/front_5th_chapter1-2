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

    if (typeof vNode.type == "function") {
      return normalizeVNode(vNode.type({ ...props, children }));
    }

    if (typeof vNode.type == "string") {
      const normalizedChildren = [];
      if (Array.isArray(children)) {
        children.forEach(
          (child) =>
            isValidateNode(child) &&
            normalizedChildren.push(normalizeVNode(child)),
        );
      }
      return { type, props, children: normalizedChildren };
    }
  }
}
