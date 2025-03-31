/**
 * dom 요소별 이벤트 핸들러 저장소
 * @type {WeakMap<Element, Record<string, Function[]>>}
 * @example { element: { click: [handler1, handler2], mouseover: [handler3] } }
 */
const elementHandlerMap = new WeakMap();

/**
 * 위임된 루트 이벤트 리스너
 * @type {Map<string, Function>}
 * @example { click: handler, mouseover: handler }
 */
const rootListenerMap = new Map();

export function addEvent(element, eventType, handler) {
  let events = elementHandlerMap.get(element);
  if (!events) {
    events = {};
    elementHandlerMap.set(element, events);
  }

  if (!events[eventType]) events[eventType] = [];
  events[eventType].push(handler);

  if (!rootListenerMap.has(eventType)) {
    rootListenerMap.set(eventType, null);
  }
}

export function removeEvent(element, eventType, handler) {
  const events = elementHandlerMap.get(element);
  if (!events || !events[eventType]) return;

  events[eventType] = events[eventType].filter(
    (registeredHandler) => registeredHandler !== handler,
  );

  if (events[eventType].length === 0) {
    delete events[eventType];
  }

  if (Object.keys(events).length === 0) {
    elementHandlerMap.delete(element);
  }
}

export function setupEventListeners(root) {
  for (const [eventType, existingHandler] of rootListenerMap) {
    if (existingHandler) {
      root.removeEventListener(eventType, existingHandler);
    }

    const delegatedHandler = (event) => {
      if (event.cancelBubble) return;

      let current = event.target;
      while (current && current !== root) {
        if (elementHandlerMap.has(current)) {
          const events = elementHandlerMap.get(current);

          if (events[eventType]) {
            for (const handler of events[eventType]) {
              handler.call(current, event);
              if (event.cancelBubble) return;
            }
          }
        }
        current = current.parentElement;
      }
    };

    root.addEventListener(eventType, delegatedHandler);
    rootListenerMap.set(eventType, delegatedHandler);
  }
}
