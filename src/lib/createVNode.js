export function createVNode(type, props, ...children) {
  const filteredChildren = children
    .flat(Infinity) // 자식 노드가 배열일 경우 평탄화 (제일 깊은 객체가 Infinity이므로)
    .filter((child) => child != null && child !== false);
  return { type, props, children: filteredChildren };
}
