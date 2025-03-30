const eventRegistry = new Map();

export function setupEventListeners(root) {
  eventRegistry.forEach((elementMap, eventType) => {
    root.addEventListener(eventType, (event) => {
      for (const [element, handler] of elementMap) {
        if (element.contains(event.target)) {
          handler.call(element, event);
        }
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(eventType)) {
    eventRegistry.set(eventType, new Map());
  }

  const elementMap = eventRegistry.get(eventType);
  elementMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  const elementMap = eventRegistry.get(eventType);
  if (elementMap) {
    elementMap.delete(element);
  }
}
