const eventRegistry = new Map();
const registeredEvents = new Set();

export function setupEventListeners(root) {
  eventRegistry.forEach((elementMap, eventType) => {
    if (registeredEvents.has(eventType)) return;
    root.addEventListener(eventType, (event) => {
      for (const [element, handler] of elementMap) {
        if (element.contains(event.target)) {
          handler.call(element, event);
        }
      }
    });
    registeredEvents.add(eventType);
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
