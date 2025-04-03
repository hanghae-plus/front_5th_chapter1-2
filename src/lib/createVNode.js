export function createVNode(type, props, ...children) {
  /**
   * flat 함수가 무엇인지?
   * filter 함수의 정확한 기능은 무엇인지?
   * Boolean은 무엇인지. => true, false를 반환하는 함수
   * what is the filter?
   */
  return {
    type,
    props,
    children: children.flat(Infinity).filter((v) => v === 0 || Boolean(v)),
  };
}
