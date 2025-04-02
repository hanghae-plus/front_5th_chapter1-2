// key: 이벤트 타입 (ex.click)
// value: WeakMap (key: event target , value: handler)
const eventHandlers = new Map();

export function setupEventListeners(root) {
  if (!root) return;

  if (!root.__rootEvents) {
    root.__rootEvents = new Set();
  }

  for (const [eventType, eventMap] of eventHandlers.entries()) {
    if (root.__rootEvents.has(eventType)) continue;

    root.addEventListener(eventType, (e) => {
      let targetElement = e.target;

      // 핸들러 하위 요소에 액션을 했을 경우
      while (targetElement && targetElement !== root.parentNode) {
        const handler = eventMap.get(targetElement);

        if (handler) {
          handler(e);

          break;
        }

        targetElement = targetElement.parentNode;
      }
    });

    root.__rootEvents.add(eventType);
  }
}

export function addEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  let eventMap = eventHandlers.get(eventType);

  if (!eventMap) {
    eventMap = new WeakMap();
    eventHandlers.set(eventType, eventMap);
  }

  eventMap.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  const eventMap = eventHandlers.get(eventType);

  if (eventMap && eventMap.get(element) === handler) {
    eventMap.delete(element);
  }
}
