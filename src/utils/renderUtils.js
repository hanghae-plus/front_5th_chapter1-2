/**
 * 값이 빈 텍스트로 변환해야 하는지 체크합니다.
 * @param {*} value - 체크할 값 (문자열, 숫자, 또는 기타 값)
 * @returns {boolean} 빈 텍스트로 변환해야 하면 true
 */
export const shouldSkipRendering = (value) =>
  value === null || typeof value === "undefined" || typeof value === "boolean";

/**
 * 값이 텍스트 노드로 변환 가능한지 체크합니다.
 * @param {*} value - 체크할 값 (문자열, 숫자, 또는 기타 값)
 * @returns {boolean} 문자열이나 숫자면 true
 */
export const isTextNodeValue = (value) =>
  typeof value === "string" || typeof value === "number";
