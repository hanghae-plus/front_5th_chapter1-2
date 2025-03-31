export function createVNode(type, props, ...children) {
  // children 평탄화 (재귀적으로 중첩된 배열도 처리)
  const flattenChildren = (items) => {
    return items.reduce((acc, item) => {
      // null, undefined, true, false 같은 값 제외 조건부처리
      if (
        item === null ||
        item === undefined ||
        item === true ||
        item === false
      ) {
        return acc;
      }
      if (Array.isArray(item)) {
        return [...acc, ...flattenChildren(item)];
      }
      return [...acc, item];
    }, []);
  };

  return {
    type,
    props: props || null,
    children: flattenChildren(children),
  };
}
