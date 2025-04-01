const parsedChildren = (children) => {
  let result = [];

  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...parsedChildren(child));
    } else {
      result.push(child);
    }
  }

  return result.filter(
    (resultChild) => typeof resultChild === "number" || Boolean(resultChild),
  );
};

export const createVNode = (type, props, ...children) => ({
  type,
  props,
  children: parsedChildren(children),
});
