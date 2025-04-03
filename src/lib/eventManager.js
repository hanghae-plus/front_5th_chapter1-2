let _root = null;

const listeners = new Map();

export function setupEventListeners(root) {
  if (!root) {
    throw new Error("setupEventListeners: root가 정의되지 않았습니다.");
  }

  _root = root;

  listeners.forEach((eventTypeMap) => {
    eventTypeMap.forEach((handlerMap, eventType) => {
      handlerMap.forEach((boundFunc) => {
        _root.addEventListener(eventType, boundFunc);
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  let eventTypeMap = listeners.get(element);
  if (!eventTypeMap) {
    eventTypeMap = new Map();
    listeners.set(element, eventTypeMap);
  }

  let handlerMap = eventTypeMap.get(eventType);
  if (!handlerMap) {
    handlerMap = new Map();
    eventTypeMap.set(eventType, handlerMap);
  }

  if (!handlerMap.has(handler)) {
    const boundFunction = getBoundFunction(element, handler);

    handlerMap.set(handler, boundFunction);
    if (_root) _root.addEventListener(eventType, boundFunction);
  }
}

function getBoundFunction(element, handler) {
  return (e) => {
    if (e.target === element) handler(e);
  };
}

export function removeEvent(element, eventType, handler) {
  const eventTypeMap = listeners.get(element);
  if (!eventTypeMap) return;

  const handlerMap = eventTypeMap.get(eventType);
  if (!handlerMap) return;

  const boundFunc = handlerMap.get(handler);

  if (boundFunc && _root) _root.removeEventListener(eventType, boundFunc);
  handlerMap.delete(handler);

  if (handlerMap.size === 0) eventTypeMap.delete(eventType);
  if (eventTypeMap.size === 0) listeners.delete(element);
}
