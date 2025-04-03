const eventStore = {};
let rootElement = null;

export function setupEventListeners(root) {
  if (!root) {
    return;
  }

  rootElement = root;

  Object.keys(eventStore).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventType || !element || typeof handler !== "function") {
    return;
  }
  if (!eventStore[eventType]) {
    eventStore[eventType] = new Map();
  }

  eventStore[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventType || !element) {
    return;
  }
  const handlerMap = eventStore[eventType];
  if (!handlerMap) return;

  handlerMap.delete(element);

  if (handlerMap.size === 0) {
    delete eventStore[eventType];
  }
}

function handleEvent(event) {
  const { type, target } = event;
  const handlerMap = eventStore[type];
  if (!handlerMap) return;

  let current = target;
  while (current && current !== rootElement) {
    if (event.cancelBubble) break; // stopPropagation된 경우 위임 중단

    const handler = handlerMap.get(current);

    if (handler) {
      // 수정된 부분
      try {
        handler(event);
      } catch (error) {
        console.error("Error in event handler:", error);
      }
      break;
    }
    current = current.parentElement;
  }
}
