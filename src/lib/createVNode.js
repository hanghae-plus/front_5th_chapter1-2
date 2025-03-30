/**
 * @param {string} type - element의 타입
 * @param {Object} props - element의 속성
 * @param {...any} children - element의 자식 요소
 */
export function createVNode(type, props, ...children) {
  console.log("createVNode", type, props, children);
  // TODO: 중첩구조에서도 flat이 필요
  // filter 추가 v가 null, undefined 인 경우 제외해야함.
  return {
    type,
    props,
    children: children.flat(Infinity).filter((v) => v === 0 || Boolean(v)),
  };
}
