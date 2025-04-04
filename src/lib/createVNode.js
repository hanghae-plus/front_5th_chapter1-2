export function createVNode(type, props, ...children) {
  // 재귀적 평탄화
  const flatten = (arr) => {
    return arr.reduce((acc, item) => {
      if (item || item === 0) {
        return acc.concat(Array.isArray(item) ? flatten(item) : item);
      }
      return acc;
    }, []);
  };

  // 자식 배열 평탐화
  const flatChildren = flatten(children);

  return { type, props, children: flatChildren };
}
