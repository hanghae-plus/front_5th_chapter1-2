export const flatDeep = (array) => {
  return array.reduce((result, value) => {
    if (Array.isArray(value)) {
      result.push(...flatDeep(value));
    } else {
      result.push(value);
    }
    return result;
  }, []);
};
