import { addEvent, removeEvent } from "../lib";
import { isPrototypeEvent, normalizeEventPropKey } from "./eventUtils";

/**
 * className 속성을 업데이트합니다.
 * @param {HTMLElement} $el - 대상 DOM 요소
 * @param {string} value - className 값
 */
export const updateClassName = ($el, value) => {
  $el.classList = value ?? "";
};

/**
 * 일반 속성을 설정합니다.
 * @param {HTMLElement} $el - 대상 DOM 요소
 * @param {string} key - 속성 키
 * @param {*} value - 속성 값
 */
export function setAttribute($el, key, value) {
  if (value != null) {
    $el.setAttribute(key, value);
  } else {
    $el.removeAttribute(key);
  }
}

/**
 * 이벤트 핸들러를 설정합니다.
 * @param {HTMLElement} $el - 대상 DOM 요소
 * @param {string} key - 이벤트 속성 키 (예: onClick)
 * @param {Function} handler - 이벤트 핸들러
 */
export const updateEventHandler = (
  $el,
  key,
  newHandler = null,
  oldHandler = null,
) => {
  const eventType = normalizeEventPropKey(key);

  if (isPrototypeEvent($el, eventType)) {
    if (oldHandler) {
      removeEvent($el, eventType, oldHandler);
    }

    if (newHandler) {
      addEvent($el, eventType, newHandler);
    }

    return;
  }

  setAttribute($el, key, newHandler);
};

export const updateAttributes = ($el, newProps = {}, oldProps = {}) => {
  Object.keys(oldProps).forEach((key) => {
    if (key in newProps && newProps[key] != null) {
      return;
    }

    if (key === "className") {
      updateClassName($el);
      return;
    }

    if (key.startsWith("on")) {
      updateEventHandler($el, key, null, oldProps[key]);
      return;
    }

    setAttribute($el, key, null);
  });

  Object.keys(newProps).forEach((key) => {
    if (oldProps[key] === newProps[key]) {
      return;
    }

    if (key === "className") {
      updateClassName($el, newProps[key]);
      return;
    }

    if (key.startsWith("on")) {
      updateEventHandler($el, key, newProps[key], oldProps[key]);
      return;
    }

    setAttribute($el, key, newProps[key]);
  });
};
