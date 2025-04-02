export const eventHandlers = new Map();

export function setupEventListeners(root) {
  if (root._isinitialized) return;
  root._isinitialized = true;

  for (const eventType of eventHandlers.keys()) {
    root.addEventListener(eventType, (eventObj) => {
      let target = eventObj.target;
      while (target && target !== root) {
        if (eventHandlers.has(eventType)) {
          const handlerMap = eventHandlers.get(eventType);
          if (handlerMap.has(target)) {
            const handlers = handlerMap.get(target);
            if (handlers) {
              handlers.forEach((fn) => {
                fn(target);
              });
              break;
            }
          }
        }
        target = target.parentNode;
      }
    });
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Map()); // 1) key eventType
  }

  const handlersMap = eventHandlers.get(eventType);

  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Set()); // 2) key element
  }

  handlersMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventHandlers.has(eventType)) return;

  const handlersMap = eventHandlers.get(eventType);

  if (!handlersMap.has(element)) return;

  handlersMap.get(element).delete(handler);
}
