let globalEvents = {};

export function setupEventListeners(root) {
  for (const eventType in globalEvents) {
    root.addEventListener(eventType, handleGlobalEvents);
  }
}

export function handleGlobalEvents(e) {
  let target = e.target;

  if (globalEvents[e.type].has(target)) {
    globalEvents[e.type].get(target)(e);
  }
}

export function addEvent(element, eventType, handler) {
  globalEvents[eventType] = globalEvents[eventType] || new WeakMap();
  globalEvents[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (globalEvents[eventType].get(element) === handler) {
    globalEvents[eventType].delete(element);
  }
}
