/**
 * `typeof` 실행
 * 1. null -> "null"
 * 2. array -> "array"
 * 3. object -> "object"
 * 4. 나머지 -> typeof
 */
export const getTypes = (vNode) => {
  if (vNode === null) {
    return "null";
  }
  if (Array.isArray(vNode)) {
    return "array";
  }

  return typeof vNode;
};
