export function createVNode(type, props, ...children) {
  // 자식 요소 평탄화
  function flattenChildren(children, result = []) {
    for (const child of children) {
      // 1. 배열이면 재귀
      if (Array.isArray(child)) {
        flattenChildren(child, result);
      } else if (child !== null && child !== undefined && child !== false) {
        result.push(child);
      }
    }
    return result;
  }

  return {
    type,
    props,
    children: flattenChildren(children),
  };
}
