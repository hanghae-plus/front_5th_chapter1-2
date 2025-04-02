// 1. 모든 자식 요소들을 평평하게 만듭니다.
// 2. 모든 자식 요소들을 필터링하여 falsy 값을 제거합니다.
// 3. 모든 자식 요소들을 배열로 반환합니다.

const isNotFalsy = (el) => el !== false && el !== null && el !== undefined;

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isNotFalsy),
  };
}
