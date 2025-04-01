const eventListeners = new Map();

export function setupEventListeners(root) {
  eventListeners.forEach((_, eventType) => {
    root.removeEventListener(eventType, handleEvent);
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(e) {
  const { target, type } = e;
  const listeners = eventListeners.get(type);

  if (!listeners) {
    return;
  }

  const handler = listeners.get(target);
  if (typeof handler === "function") {
    handler(e);
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new WeakMap());
  }

  const listeners = eventListeners.get(eventType);
  listeners.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventListeners.has(eventType)) {
    return;
  }

  const elementEventListeners = eventListeners.get(eventType);
  elementEventListeners.delete(element);
}
