export const exceptedNormalizedType = ["null", "undefined", "boolean"];
export const toStringType = ["string", "number"];
export function getType(vNode) {
  // null 일때 강제로 type null로 반환
  if (vNode === null) {
    return "null";
  } else if (Array.isArray(vNode)) {
    return "array";
  } else {
    return typeof vNode;
  }
}

/**
 *  vNode를 정규화 시키는 과정
 * @param vNode
 */
export function normalizeVNode(vNode) {
  const vNodeType = getType(vNode);
  // console.log("1 vNode", vNode);
  if (exceptedNormalizedType.includes(vNodeType)) {
    return "";
  }
  if (toStringType.includes(vNodeType)) {
    return String(vNode);
  }
  // console.log("vNodeType", vNodeType);
  // console.log("vNode", vNode);
  // vNode가 함수형 컴포넌트 일 때
  if (vNode && typeof vNode.type === "function") {
    // createVNode의 형태 반환
    return normalizeVNode(
      vNode.type({ ...(vNode.props || {}), children: vNode.children }),
    );
  }
  // 자식 요소의 정규화 및 빈 문자열 제거
  if (vNode.children) {
    vNode.children = vNode.children
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "");
  }
  return vNode;
}
