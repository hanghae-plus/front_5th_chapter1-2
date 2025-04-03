import { getTypes } from "../utils/getTypes";

/**
 * 주어진 VNode를 정규화
 *
 * - null, undefined, false 같은 falsy 값은 제거하거나 빈 문자열로 처리합니다.
 * - 문자열과 숫자는 문자열로 변환합니다.
 * - 함수형 컴포넌트는 실행 후 다시 정규화합니다.
 * - 자식 노드(children)는 재귀적으로 정규화되며, 렌더링 불가능한 값은 제거됩니다.
 *
 * @param {*} vNode - 정규화할 VNode (문자열, 숫자, null, 컴포넌트 등)
 * @returns {object|string} 정규화된 VNode 객체 또는 문자열 노드
 */
export function normalizeVNode(vNode) {
  // 타입 불러오기

  // 인자값의 타입 변수
  const vNodeType = getTypes(vNode);

  // 통과되면 안되는 값들
  const invalidTypes = ["null", "undefined", "boolean"];

  // 디버깅용 로그
  // console.log("vNode =>", vNode);

  // null, undefined, boolean 값은 빈 문자열로 변환되어야 한다.
  if (invalidTypes.includes(vNodeType)) {
    return "";
  }

  // 문자열과 숫자는 문자열로 변환되어야 한다.
  if (vNodeType === "number" || vNodeType === "string") {
    return String(vNode);
  }

  // 컴포넌트를 정규화한다..
  if (typeof vNode?.type === "function") {
    const renderedVNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    return normalizeVNode(renderedVNode);
  }

  // Falsy 값 (null, undefined, false)은 자식 노드에서 제거되어야 한다. -> vNode.children이 없으면 빈 배열
  const normalizedChildren = vNode.children
    ? vNode.children
        .filter((v) => !invalidTypes.includes(getTypes(v)))
        .map((v) => (typeof v === "object" ? normalizeVNode(v) : v))
    : [];

  return { ...vNode, children: normalizedChildren };
}
