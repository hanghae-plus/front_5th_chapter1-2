const event = {
  root: null,
  map: new Map(),
};

/**
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  const currentRoot = event.root;
  if (currentRoot !== root) {
    event.root = root;
  }

  event.map.forEach((event) => {
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
  event.map.set(element, {
    ...event.map.get(element),
    [eventType]: handler,
  });
}

/**
 * @param {HTMLElement} element
 * @param {keyof WindowEventMap} eventType
 * @param {Function} handler
 */
export function removeEvent(element, eventType, handler) {
  const exEvent = event.map.get(element);
  const hasEvent = !!exEvent;
  if (hasEvent) {
    event.map.delete(element);
  }

  const root = event.root;
  if (!root) return;

  root.removeEventListener(eventType, handler);
}
