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

export const createVNode = (type, props, ...children) => {
  const isValidType = typeof type === "string" || typeof type === "function";

  if (!isValidType) {
    throw new Error(`허용 type = string, function / 받은 값: ${typeof type}`);
  }

  return {
    type,
    props,
    children: parsedChildren(children),
  };
};
