const eventMap = new Map();

/**
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  const exRoot = eventMap.get("root");
  if (exRoot !== root) {
    eventMap.set("root", root);
  }

  eventMap.forEach((event) => {
    Object.entries(event)
      .filter(([, handler]) => typeof handler === "function")
      .forEach(([eventType, handler]) => {
        root.addEventListener(eventType, handler);
      });
  });
}

/**
 * @param {HTMLElement} element
 * @param {keyof WindowEventMap} eventType
 * @param {Function} handler
 */
export function addEvent(element, eventType, handler) {
  eventMap.set(element, {
    ...eventMap.get(element),
    [eventType]: handler,
  });
}

/**
 * @param {HTMLElement} element
 * @param {keyof WindowEventMap} eventType
 * @param {Function} handler
 */
export function removeEvent(element, eventType, handler) {
  const exEvent = eventMap.get(element);
  const hasEvent = !!exEvent;
  if (hasEvent) {
    eventMap.delete(element);
  }

  const root = eventMap.get("root");
  root.removeEventListener(eventType, handler);
}
