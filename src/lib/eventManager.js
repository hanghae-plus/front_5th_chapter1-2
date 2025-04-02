const eventMap = new Map();

function handleEvent(e) {
  const handlers = eventMap.get(e.type);
  if (handlers) {
    const handler = handlers.get(e.target);
    if (handler) handler(e);
  }
}

export function setupEventListeners(root) {
  eventMap.forEach((handlers, eventType) =>
    root.addEventListener(eventType, handleEvent),
  );
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.get(eventType)) {
    eventMap.set(eventType, new WeakMap());
  }
  eventMap.get(eventType).set(element, handler);
}

export function removeEvent(element, eventType) {
  const eventHandlers = eventMap.get(eventType);
  if (!eventHandlers) return;
  eventHandlers.delete(element);
}
