/*
  1. type, props, ...children을 매개변수로 받는 함수를 작성하세요.
  2. 반환값은 { type, props, children } 형태의 객체여야 합니다.
*/

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter(
        (child) => child !== null && child !== undefined && child !== false,
      ),
  };
}
