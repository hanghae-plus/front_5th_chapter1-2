const globalEventHandlers = {};

const handleGlobalEvents = (e) => {
  const thisEventObject = globalEventHandlers[e.type];
  if (!thisEventObject) return;
  let target = e.target;
  // 타겟에서 위로 올라가며 핸들러를 찾음 (delegation 대응)
  while (target && target !== document.body) {
    const handler = thisEventObject.get(target);
    if (handler) {
      handler(e);
      break;
    }
    target = target.parentElement;
  }
};

export function setupEventListeners(root) {
  Object.keys(globalEventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, handleGlobalEvents);
  });
}

export function addEvent(element, eventType, handler) {
  if (!globalEventHandlers[eventType]) {
    globalEventHandlers[eventType] = new WeakMap();
  }
  globalEventHandlers[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (!globalEventHandlers[eventType]) return;
  const eventMap = globalEventHandlers[eventType];
  console.log(handler);
  if (eventMap) {
    eventMap.delete(element);
  }
}
