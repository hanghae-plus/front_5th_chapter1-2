/**
 * 1. type, props, ...children을 매개변수로 받는 함수를 작성하세요.
 * 2. 반환값은 { type, props, children } 형태의 객체여야 합니다.
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns
 */
export function createVNode(type, props, ...children) {
  const flatChildren = [...children].flat(Infinity);
  // children 중 조건부 렌더링이 있는 경우 false, undefined, null 값 제외
  const filteredChildren = flatChildren.filter(
    (item) => item !== false && item !== undefined && item !== null,
  );

  return {
    type: type,
    props: props,
    children: filteredChildren,
  };
}
