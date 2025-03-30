let _root = null;

const elementSet = new Set();
const eventListenerMap = new WeakMap();

export function setupEventListeners(root) {
  if (!root) {
    throw new Error("setupEventListeners: root가 정의되지 않았습니다.");
  }

  _root = root;

  for (const element of elementSet) {
    const typeMap = eventListenerMap.get(element);
    if (!typeMap) continue;

    for (const [eventType, handlerMap] of typeMap.entries()) {
      for (const boundFunc of handlerMap.values()) {
        _root.addEventListener(eventType, boundFunc);
      }
    }
  }
}

export function addEvent(element, eventType, handler) {
  elementSet.add(element);

  const typeMap = eventListenerMap.get(element) ?? new Map();
  eventListenerMap.set(element, typeMap);

  const handlerMap = typeMap.get(eventType) ?? new Map();
  typeMap.set(eventType, handlerMap);

  if (!handlerMap.has(handler)) {
    const boundFunc = getBoundFunction(element, handler);
    handlerMap.set(handler, boundFunc);

    if (_root) _root.addEventListener(eventType, boundFunc);
  }
}

function getBoundFunction(element, handler) {
  return (event) => {
    if (event.target === element) handler(event);
  };
}

export function removeEvent(element, eventType, handler) {
  const typeMap = eventListenerMap.get(element);
  if (!typeMap) return;

  const handlerMap = typeMap.get(eventType);
  if (!handlerMap) return;

  const boundFunc = handlerMap.get(handler);
  if (boundFunc && _root) {
    _root.removeEventListener(eventType, boundFunc);
  }
  handlerMap.delete(handler);

  if (handlerMap.size === 0) typeMap.delete(eventType);
  if (typeMap.size === 0) elementSet.delete(element);
}
