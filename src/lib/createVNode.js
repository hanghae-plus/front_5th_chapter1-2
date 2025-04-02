/**
 * Refactor
 * 1. Array.flat()을 Custom Flat으로 변경
 * - 메모리와 CPU 자원을 많이 사용해 성능 저하의 우려가 있음
 * - 구버전 브라우저 지원 X, 크로스 브라우징 이슈 발생 가능성 있음
 */

export function createVNode(type, props, ...children) {
  const vNode = {
    type,
    props,
    children: children.flat(Infinity).filter((v) => typeof v === "number" || v),
  };
  return vNode;
}
