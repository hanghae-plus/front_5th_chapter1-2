export function createVNode(type, props, ...children) {
  // type, props, children 속성을 가진 vNode(Virtual Node) 객체 생성
  return {
    type,
    props,
    children: children
      // 모든 중첩 배열을 1차원 배열로 평탄화
      // 평탄화를 하는 이유: JSX 구문에서 자식 요소가 중첩된 형태로 들어올 수 있기 때문
      .flat(Infinity)

      // 유효하지 않은 값 제거
      .filter(
        (child) => child !== false && child !== null && child !== undefined,
      ),
  };
}
