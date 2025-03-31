const eventMap = new Map();

let rootElement = null;

export function setupEventListeners(root) {
  if (!root) return;
  rootElement = root;
  eventMap.forEach((handlers, eventType) => {
    handlers.forEach((handler) => {
      rootElement.addEventListener(eventType, handler);
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const handlers = eventMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventMap.get(eventType);
  if (handlers.get(element)) {
    handlers.delete(element);
    rootElement.removeEventListener(eventType, handler);
  }
}
