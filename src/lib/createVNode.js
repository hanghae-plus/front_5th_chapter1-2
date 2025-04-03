/**
 * 가상 DOM 노드를 생성합니다.
 *
 * @param {string | Function} type - 태그 이름(ex: "div") 또는 함수형 컴포넌트
 * @param {Object|null} props - 요소의 속성(props), 없으면 null
 * @param {...any} children - 자식 요소들. 문자열, 숫자, 배열, VNode 등 다양하게 올 수 있음
 * @returns {{
 *   type: string | Function,
 *   props: Object|null,
 *   children: any[]
 * }} 생성된 VNode 객체
 */

export function createVNode(type, props, ...children) {
  const flattenChildren = children
    .flat(Infinity)
    .filter((v) => v !== null && v !== undefined && v !== false); // 이 줄 꼭 필요

  return {
    type,
    props,
    children: flattenChildren,
  };
}
