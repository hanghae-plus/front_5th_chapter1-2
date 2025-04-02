const globalEventHandlers = {};

const handleGlobalEvents = (e) => {
  const thisEventObject = globalEventHandlers[e.type];
  for (const tagName in thisEventObject) {
    if (e.target.tagName === tagName) {
      thisEventObject[tagName](e);
    }
  }
};

export function setupEventListeners(root) {
  Object.keys(globalEventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, handleGlobalEvents);
  });
}

export function addEvent(element, eventType, handler) {
  if (!globalEventHandlers[eventType]) {
    globalEventHandlers[eventType] = {};
  }
  globalEventHandlers[eventType][element.tagName] = handler;
}

export function removeEvent(element, eventType, handler) {
  if (!globalEventHandlers[eventType]) return;

  const eventHandlers = globalEventHandlers[eventType];

  if (
    eventHandlers[element.tagName] &&
    eventHandlers[element.tagName] === handler
  ) {
    delete eventHandlers[element.tagName];
  }
}
