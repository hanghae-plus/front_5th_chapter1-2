const eventHandlers = new Map();
const registeredEventHandlers = new Map();

export function setupEventListeners(root) {
  registeredEventHandlers.forEach((handler, eventType) => {
    root.removeEventListener(eventType, handler);
  });

  registeredEventHandlers.clear();

  eventHandlers.forEach((elementsMap, eventType) => {
    const eventHandler = (event) => {
      if (!elementsMap.has(event.target)) {
        return;
      }
      const eventHandlerSet = elementsMap.get(event.target);
      eventHandlerSet.forEach((eventHandler) => eventHandler(event));
    };

    root.addEventListener(eventType, eventHandler);
    registeredEventHandlers.set(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Map());
  }

  const elementsMap = eventHandlers.get(eventType);
  if (!elementsMap.has(element)) {
    elementsMap.set(element, new Set());
  }

  elementsMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventHandlers.has(eventType)) {
    return;
  }

  const elementsMap = eventHandlers.get(eventType);
  if (!elementsMap.has(element)) {
    return;
  }

  elementsMap.get(element).delete(handler);
}
