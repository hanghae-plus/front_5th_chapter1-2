export const eventHandlers = new Map();
const registeredListeners = new Map();
export function addEvent(element, eventType, handler) {
  if (!eventHandlers.get(eventType)) {
    eventHandlers.set(eventType, new Map());
  }

  const handlersMap = eventHandlers.get(eventType);
  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Set());
  }

  handlersMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventHandlers.get(eventType);
  if (!handlersMap) return;

  const handlers = handlersMap.get(element);
  if (!handlers) return;

  handlers.delete(handler);

  if (handlers.size === 0) {
    handlersMap.delete(element);
  }
}

// }

export function setupEventListeners(root) {
  eventHandlers.forEach((handlersMap, eventType) => {
    // 기존 리스너 제거
    const prevListener = registeredListeners.get(eventType);
    if (prevListener) {
      root.removeEventListener(eventType, prevListener);
    }

    // 새 리스너 정의
    const listener = (eventObj) => {
      let target = eventObj.target;

      while (target && target !== root) {
        const handlers = handlersMap.get(target);

        handlers?.forEach((fn) => fn(eventObj));

        if (handlers) break;
        target = target.parentNode;
      }
    };

    root.addEventListener(eventType, listener);
    registeredListeners.set(eventType, listener);
  });
}
