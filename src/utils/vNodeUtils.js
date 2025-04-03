import { isTextNodeValue, shouldSkipRendering } from "./renderUtils";

/**
 * 객체가 유효한 vNode 구조를 가지고 있는지 검사합니다.
 * @param {object} obj - 검사할 객체
 * @returns {boolean} 유효한 vNode 구조이면 true
 */
export const hasValidVNodeShape = (obj) => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (typeof obj.type !== "string" && typeof obj.type !== "function") {
    return false;
  }

  if (
    obj.props !== null &&
    obj.props !== undefined &&
    typeof obj.props !== "object"
  ) {
    return false;
  }

  if (!Array.isArray(obj.children)) {
    return false;
  }

  return true;
};

/**
 * vNode가 렌더링 가능한 자식인지 검사합니다.
 * @param {*} vNode - 검사할 vNode
 * @returns {boolean} 자식으로 유효하면 true
 */
export const isValidChild = (vNode) => {
  if (shouldSkipRendering(vNode)) {
    return false;
  }

  if (isTextNodeValue(vNode)) {
    return true;
  }

  if (Array.isArray(vNode)) {
    return true;
  }

  return hasValidVNodeShape(vNode);
};

/**
 * vNOde가 DOM 형태로 직접 변환 가능한지 검사합니다.
 * @param {*} vNode - 검사할 vNode
 * @returns {boolean} vNode가 DOM 형태로 직접 변환 가능하면 true
 */
export const isDOMRenderable = (vNode) => {
  if (isTextNodeValue(vNode)) {
    return true;
  }

  if (shouldSkipRendering(vNode)) {
    return false;
  }

  if (Array.isArray(vNode)) {
    return vNode.every(isValidChild);
  }

  return hasValidVNodeShape(vNode) && typeof vNode.type === "string";
};
