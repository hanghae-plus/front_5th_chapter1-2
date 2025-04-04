/**
 * 가상돔 정규화 함수
 * - 함수형 컴포넌트의 경우 실행 후 결과를 재귀적으로 다시 정규화
 * - 재귀적 정규화를 통해 컴포넌트 중첩, 조건부 렌더링 등을 처리
 * - 모든 자식 요소들도 재귀적으로 정규화
 * @param {*} vNode - 정규화할 가상 노드 객체 or 요소
 *                     type: HTML 태그명 또는 컴포넌트 함수
 *                     props: 속성 객체 (id, className, 이벤트 핸들러 등)
 *                     children: 자식 요소들. [] 형식
 * @returns {Object|String} 정규화된 가상 노드 또는 문자열
 */
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값을 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 숫자를 문자열로 변환
  if (typeof vNode === "number") {
    return String(vNode);
  }
  // 문자열이면 바로 vNode 리턴
  if (typeof vNode === "string") {
    return vNode;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    // function 함수 저장
    const Component = vNode.type;
    // props 복사 이벤트 핸들러.
    const props = { ...(vNode.props || {}) };
    // children 전달 (props.children이 없는 경우에만)
    // 함수에 복사한 props를 넣고 실행.
    // 가상 DOM 객체 형식으로 반환 후 재귀.
    // 앞에 string 코드가 실행되면서 vNode 반환.
    // props.children가 있는 경우
    // 함수형 컴포넌트 파라미터에 미리 준비한 children로 children을 오버라이딩하는경우
    // 오버라이딩하는경우 children을 사용.
    if (!props.children) props.children = vNode.children;
    const renderedVNode = Component(props);
    return normalizeVNode(renderedVNode);
  }

  // 자식요소 정규화
  if (vNode.children) {
    //children이 배열이 아니면 []로 만들기
    const childrenArray = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children];

    // 자식들도 재귀로 정규화하고 빈값 필터링
    const normalizedChildren = childrenArray
      .map((child) => normalizeVNode(child))
      .filter(
        (child) =>
          child !== "" &&
          child !== null &&
          child !== undefined &&
          child !== false,
      );

    return { ...vNode, children: normalizedChildren };
  }

  return vNode;
}
