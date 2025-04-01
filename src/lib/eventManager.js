import { EVENT_TYPES } from "../constants";

const event = {
  root: null,
  map: new Map(),
  types: new Set(EVENT_TYPES),
};

/**
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  const currentRoot = event.root;
  if (currentRoot !== root) {
    event.root = root;
  }

  event.types.forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      event.map.get(e.target)?.get(eventType)?.(e);
    });
  });
}

/**
 * @param {HTMLElement} element
 * @param {keyof WindowEventMap} eventType
 * @param {Function} handler
 */
export function addEvent(element, eventType, handler) {
  // 이벤트가 없다면 추가
  if (!event.map.has(element)) {
    event.map.set(element, new Map());
  }

  // 이벤트 등록
  event.map.get(element).set(eventType, handler);
}

/**
 * @param {HTMLElement} element
 * @param {keyof WindowEventMap} eventType
 * @param {Function} handler
 */
export function removeEvent(element, eventType, handler) {
  if (!event.map.has(element)) return;
  if (event.map.get(element).get(eventType) !== handler) return;

  event.map.get(element).delete(eventType);
}
