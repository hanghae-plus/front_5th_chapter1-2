const eventMap = new Map();
const rootMap = new Map();

export function setupEventListeners(root) {
  if (!rootMap.has(root)) {
    rootMap.set(root, new Set());
  }

  const rootEventTypeList = rootMap.get(root);

  for (const [eventType, elementMap] of eventMap) {
    if (rootEventTypeList.has(eventType)) return;

    root.addEventListener(eventType, (event) => {
      for (const [element, handler] of elementMap) {
        if (element === event.target || element.contains(event.target)) {
          handler.call(element, event);
        }
      }
    });

    rootEventTypeList.add(eventType);
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const elementMap = eventMap.get(eventType);
  elementMap.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventMap.get(eventType);
  if (!elementMap) return;

  if (elementMap.get(element) === handler) {
    elementMap.delete(element);
  }
}
