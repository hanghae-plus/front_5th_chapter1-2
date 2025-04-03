const eventMap = new Map();
let rootElement;

export function setupEventListeners(root) {
  eventMap.forEach((_, eventType) => {
    rootElement?.removeEventListener(eventType, handleEventCallback);
    root.addEventListener(eventType, handleEventCallback);
  });

  rootElement = root;
}

function handleEventCallback(event) {
  const handlers = eventMap.get(event.type);

  handlers?.forEach(({ element, handler }) => {
    if (event.target !== element) {
      return;
    }

    handler(event);
  });
}

export function addEvent(element, eventType, handler) {
  if (eventMap.has(eventType)) {
    eventMap.get(eventType).push({ element, handler });
    return;
  }

  eventMap.set(eventType, [{ element, handler }]);
  rootElement?.addEventListener(eventType, handleEventCallback);
}

export function removeEvent(targetElement, eventType, targetHandler) {
  const handlers = eventMap.get(eventType);

  if (!handlers) return;

  const index = handlers.findIndex(({ element, handler }) => {
    return element === targetElement && handler === targetHandler;
  });

  if (index === -1) return;

  handlers.splice(index, 1);

  if (handlers.length) {
    return;
  }

  eventMap.delete(eventType);
  rootElement?.removeEventListener(eventType, handleEventCallback);
}
