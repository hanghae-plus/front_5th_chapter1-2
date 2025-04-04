export function createVNode(type, props, ...children) {
  // Null과 undefined는 어떻게 처리할지 생각
  // children에 filter를 걸어서 null이거나 undefined가 되는 경우 리턴을 제어
  // 느슨한 비교
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((ch) => ch != null && ch !== false),
  };
}
