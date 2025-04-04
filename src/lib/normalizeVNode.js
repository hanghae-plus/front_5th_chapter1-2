/**
 * 노드를 정규화하여 렌더링 가능한 형태로 변환 (컴포넌트 함수 실행 & DOM 구조로 변환)
 * @param {*} vNode 정규화할 노드
 * @returns {string | object} 정규화 완료된 노드
 */
export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  // 컴포넌트 함수 실행
  if (typeof vNode.type === "function") {
    const props = { ...vNode.props, children: vNode.children };
    const result = vNode.type(props);
    return normalizeVNode(result);
  }

  // 타입이 일반 DOM 요소인 경우, 자식 노드들을 정규화
  if (vNode.children && vNode.children.length > 0) {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== ""),
    };
  }

  return vNode;
}
