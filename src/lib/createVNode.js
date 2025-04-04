/**
 * 가상 DOM 노드(Virtual DOM Node)를 생성하는 함수
 * @param {string|function} type - DOM 요소 타입 또는 컴포넌트 함수
 * ex: 'div', 'p', 'span', Button, Card
 * @param {object|null} props - 요소 또는 컴포넌트에 전달할 속성
 * ex: {id: 'main', className: 'container', onClick: handleClick}
 * @param {...any} children - 자식 요소들 (예: 문자열, 숫자, 다른 vNodes, 또는 이들의 배열)
 * @returns {object} 생성된 가상 DOM 노드 객체
 * ex: createVNode('div', { id: 'container' }, 'Hello World');
 */
export function createVNode(type, props, ...children) {
  /**
   * @description
   * flat(Infinity)으로 children 깊이 평탄화
   * filter로 child가 false 값이면 바로 렌더링안함. 조건부 렌더링
   */
  const flattenedChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    );
  return {
    type,
    props,
    children: flattenedChildren,
  };
}
