/**
 * vNode 객체를 정규화하는 함수
 * 다양한 타입의 입력값을 일관된 형태로 변환
 *
 * 예시:
 * 1. null -> ""
 * 2. "hello" -> "hello"
 * 3. 42 -> "42"
 * 4. [1, "hello", null] -> ["1", "hello"]
 * 5. {type: "div", props: {id: "test"}, children: ["Hello"]} -> 정규화된 vNode 객체
 */
export function normalizeVNode(vNode) {
  if (
    vNode === true ||
    vNode === false ||
    vNode === null ||
    vNode === undefined
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열인 경우 각 요소를 정규화하고 빈 값 제거
  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode).filter(Boolean);
  }

  // 함수형 컴포넌트인 경우 실행하여 결과를 정규화
  if (typeof vNode.type === "function") {
    const result = vNode.type({ ...vNode.props, children: vNode.children });

    return normalizeVNode(result);
  }

  // 일반 vNode 객체인 경우 children 정규화
  return {
    ...vNode,
    children: vNode.children
      .flat() // 중첩 배열 평탄화
      .map(normalizeVNode) // 각 자식 노드 정규화
      .filter((child) => child !== ""), // 빈 문자열 제거
  };
}
