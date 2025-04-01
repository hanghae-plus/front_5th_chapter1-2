/**
 * crateVNode
 * @description JSX를 vNode로 변환하는 함수
 * 어떤일을할까? JSX파일을 vNode로 변환하여 createElement를 통해 DOM으로 변환할수 있는 Node객체로 변환시켜야한다.
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns
 */
export function createVNode(type, props, ...children) {
  // 0401 조건부렌더링, null, undefined 처리 테스트 실패
  // 해당부분에 대한 처리 필요.
  // 0401 조건부렌더링, null, undefined 처리 테스트 성공, createVNode 전체 테스트 통과
  children = children.filter(
    (child) => child !== null && child !== undefined && child !== false,
  );
  return {
    type,
    props,
    children: children.flat(Infinity),
  };
}
