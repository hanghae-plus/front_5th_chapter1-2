/**
 * vNode 생성
 * @description 중첩된 배열을 완전히 평탄화하고 falsy 값(null, undefined, false) 제거
 * @param {*} type 노드 타입
 * @param {*} props 노드 속성
 * @param  {...any} children 노드 자식
 * @returns {object} 생성된 vNode
 */
export function createVNode(type, props, ...children) {
  const flattenedChildren = children
    .flat(Infinity) // NOTE: depth 제한 없이 flatten
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    );

  return {
    type,
    props,
    children: flattenedChildren,
  };
}
