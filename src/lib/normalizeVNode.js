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
 *  자식Node 정규화 과정
 * @param children
 * @returns {*|*[]|*[]}
 */
function normalizeChildren(children) {
  let result = [];
  console.log("children", children);
  if (!children) {
    return [];
  } else {
    result = children
      .filter((child) => {
        if (!exceptedNormalizedType.includes(getType(child))) {
          return true;
        }
      })
      .map((child) =>
        getType(child) === "object" ? normalizeVNode(child) : child,
      );
  }
  return result;
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
  if (vNodeType === "object" && typeof vNode.type === "function") {
    // createVNode의 형태 반환
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }
  // 일반 vNode 형태 일때, vNode의 type이 func이 아닌것
  if (vNodeType === "object" && !("function" in vNode)) {
    return {
      ...vNode,
      children: normalizeChildren(vNode.children),
    };
  }
}
