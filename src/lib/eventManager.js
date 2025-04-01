import {
  attachedEventMap,
  delegationMap,
  elementEventMap,
  elementToRootMap,
  trackedElements,
} from "../utils/eventStore";

export function setupEventListeners(root) {
  if (!root) {
    return;
  }

  const attachedEvents = attachedEventMap.get(root) || new Set();

  const allElWithEvents = [...trackedElements.keys()].filter((el) =>
    root.contains(el),
  );

  const eventTypeHandlers = {};

  allElWithEvents.forEach((el) => {
    const events = elementEventMap.get(el);
    elementToRootMap.set(el, root);

    Object.entries(events).forEach(([eventType, handler]) => {
      if (!eventTypeHandlers[eventType]) {
        eventTypeHandlers[eventType] = new Map();
      }
      eventTypeHandlers[eventType].set(el, handler);
    });
  });

  Object.entries(eventTypeHandlers).forEach(([eventType, handlerMap]) => {
    if (attachedEvents.has(eventType)) {
      return;
    }

    //위임 핸들러
    const delegatedHandler = (event) => {
      const handler = handlerMap.get(event.target);

      if (handler) {
        handler(event);
      }
    };

    root.addEventListener(eventType, delegatedHandler);
    attachedEvents.add(eventType);

    // 위임정보를 나중에 제거할 때 쓰기위해 저장
    const rootDelegationMap = delegationMap.get(root) || new Map();
    rootDelegationMap.set(eventType, handlerMap);
    delegationMap.set(root, rootDelegationMap);
  });

  attachedEventMap.set(root, attachedEvents);
}

export function addEvent(element, eventType, handler) {
  if (!eventType || !element || typeof handler !== "function") {
    return;
  }

  const events = elementEventMap.get(element) || {};
  events[eventType] = handler;
  elementEventMap.set(element, events);
  trackedElements.add(element);
}

export function removeEvent(element, eventType) {
  if (!eventType || !element) {
    return;
  }
  const events = elementEventMap.get(element);
  if (!events || !events[eventType]) return;

  delete events[eventType];

  if (Object.keys(events).length === 0) {
    elementEventMap.delete(element);
    trackedElements.delete(element);
  } else {
    elementEventMap.set(element, events);
  }

  const root = elementToRootMap.get(element);
  if (!root) return;

  const typeMap = delegationMap.get(root);
  const handlerMap = typeMap?.get(eventType);

  handlerMap?.delete(element);

  if (handlerMap?.size === 0) {
    typeMap.delete(eventType);
  }

  if (typeMap?.size === 0) {
    delegationMap.delete(root);
  }
}
