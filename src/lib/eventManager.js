const eventListeners = new Map();
const roots = new Set();

export function setupEventListeners(root) {
  if (roots.has(root)) return;

  eventListeners.forEach((handler, eventType) => {
    root.addEventListener(eventType, (e) => {
      const targetHandler = handler.get(e.target);
      if (targetHandler) {
        targetHandler(e);
      }
    });
  });

  roots.add(root);
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new Map());
  }

  const eventTypeListeners = eventListeners.get(eventType);
  eventTypeListeners.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const eventTypeListeners = eventListeners.get(eventType);

  if (!eventTypeListeners) return;

  const targetHandler = eventTypeListeners.get(element);

  if (targetHandler === handler) {
    eventTypeListeners.delete(element);
  }
}
