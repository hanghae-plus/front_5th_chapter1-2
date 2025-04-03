/**
 * 가상 DOM 노드를 생성하는 함수
 * @param {string} type - 요소의 타입 (예: 'div', 'span' 등)
 * @param {Object|null} props - 요소의 속성들
 * @param {Array|string|number|null} children - 자식 노드들
 * @returns {Object} 생성된 가상 DOM 노드
 */
export function createVNode(type, props, ...children) {
  // 자식 요소 평탄화 및 falsy, Boolean 값 필터링
  const flattenedChildren = children
    .flat(Infinity) // 모든 depth가 평탄화 될 수 있도록 함
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== false &&
        child !== true,
    );
  return { type, props, children: flattenedChildren };
}
