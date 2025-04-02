const eventHandlers = {};

export function setupEventListeners(root) {
  Object.keys(eventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, getListener);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = new WeakMap();
  }
  eventHandlers[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventHandlers[eventType]?.has(element)) {
    eventHandlers[eventType].delete(element);
  }
}

function getListener(e) {
  return eventHandlers[e.type]?.get(e.target)?.(e);
}
