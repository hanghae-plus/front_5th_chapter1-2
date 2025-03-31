const eventMap = new Map();

export function setupEventListeners(root) {
  for (const [eventType, handlers] of eventMap.entries()) {
    handlers.forEach(({ element, handler }) => {
      if (element && root.contains(element)) {
        root.addEventListener(eventType, handler);
      }
    });
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, []);
  }
  eventMap.get(eventType).push({ element, handler });
}

export function removeEvent(element, eventType, handler) {
  if (eventMap.has(eventType)) {
    const handlers = eventMap.get(eventType);
    const index = handlers.findIndex(
      (h) => h.element === element && h.handler === handler,
    );
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
}
