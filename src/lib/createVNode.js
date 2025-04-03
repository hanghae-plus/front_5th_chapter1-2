/**
 * 가상 돔 노드 생성
 * @param {*} type 요소 타입
 * @param {*} props 속성
 * @param  {...any} children 자식 요소
 * @returns 가상 돔 노드
 */

export function createVNode(type, props, ...children) {
  return {
    type: type,
    props: props,
    children: flattenChildren(children),
  };
}

/**
 * 자식 요소 평탄화
 * @param {*} children 자식 요소
 * @returns 평탄화된 자식 요소
 */
function flattenChildren(children) {
  return children
    .flat(Infinity)
    .map((child) =>
      child === null || child === undefined || typeof child === "boolean"
        ? ""
        : child,
    )
    .filter((child) => child !== "");
}
