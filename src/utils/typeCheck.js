// 1. falsy 체크
export const isFalsy = (value) =>
  value === null || value === undefined || typeof value === "boolean";

// 2. 문자열과 숫자 체크
export const isPrimitive = (value) =>
  typeof value === "string" || typeof value === "number";

// 3. 배열 체크
export const isArray = (value) => Array.isArray(value);

// 4. 컴포넌트 체크
export const isComponent = (value) => value && typeof value.type === "function";
