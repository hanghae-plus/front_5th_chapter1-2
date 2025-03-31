export function createVNode(type, props, ...children) {
  // type: 요소의 타입 (예: 'div', 'span') 또는 함수형 컴포넌트
  // props: 요소의 속성 (예: id, className, onClick 등)
  // ...children: 자식 요소들

  // 평탄화
  const flatChildren = children.flat(Infinity);

  // 필터링
  const filteredChildren = flatChildren.filter(
    (child) =>
      child !== null &&
      child !== undefined &&
      child !== false &&
      child !== true,
  );

  return {
    type,
    props,
    children: filteredChildren,
  };
}
