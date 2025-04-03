/*
 * 가상 DOM 노드를 정규화하는 함수
 * 함수형 컴포넌트를 실행하고 기본 타입을 변환하여 일관된 형태로 만든다.
 * */
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 숫자는 문자열로 변환
  if (typeof vNode === "number") {
    return String(vNode);
  }

  // 문자열은 그대로 반환
  if (typeof vNode === "string") {
    return vNode;
  }

  // 배열인 경우 정규화
  if (Array.isArray(vNode)) {
    return vNode
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "");
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    // 컴포넌트 함수 실행
    const component = vNode.type;
    const props = vNode.props || {};
    const componentResult = component(props);
    // 결과를 다시 정규화(중첩 제거)
    return normalizeVNode(componentResult);
  }

  // 일반 요소 처리 - 자식 요소 정규화
  const normalizedChildren = vNode.children
    ? vNode.children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== "")
    : [];

  // 새로운 정규화 된 vNode 반환
  return {
    type: vNode.type,
    props: vNode.props,
    children: normalizedChildren,
  };
}
