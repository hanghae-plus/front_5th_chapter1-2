const eventTypes = [];
const elementMap = new Map();

const handleEvent = (e) => {
  const targetMap = elementMap.get(e.target);
  const handler = targetMap?.get(e.type);
  if (handler) {
    handler.call(e.target, e);
  }
};

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventTypes.includes(eventType)) {
    eventTypes.push(eventType);
  }
  const targetMap = elementMap.get(element) || new Map();
  if (targetMap.get(eventType) === handler) return;
  targetMap.set(eventType, handler);
  elementMap.set(element, targetMap);
}

export function removeEvent(element, eventType, handler) {
  const targetMap = elementMap.get(element);
  if (!targetMap) return;
  if (targetMap.get(eventType) === handler) {
    targetMap.delete(eventType);
  }
  if (targetMap.size === 0) {
    elementMap.delete(element);
  }
}
