/*
  1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
  2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.
*/

export const eventMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  if (root === rootElement) return;

  rootElement = root;

  eventMap.forEach((_, eventType) => {
    addListtenerToRoot(root, eventType);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, []);
  }

  if (rootElement) {
    addListtenerToRoot(rootElement, eventType);
  }

  eventMap.get(eventType).push({ element, handler });
}

export function removeEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) return;

  const handlers = eventMap.get(eventType);

  if (handler) {
    const index = handlers.findIndex((item) => {
      return item.element === element && item.handler === handler;
    });

    if (index !== -1) {
      handlers.splice(index, 1);
    }
    return;
  }

  const newHandlers = handlers.filter((item) => item.element !== element);
  eventMap.set(eventType, newHandlers);
}

function addListtenerToRoot(root, eventType) {
  if (!root._delegatedHandlers) {
    root._delegatedHandlers = {};
  }

  if (!root._delegatedHandlers[eventType]) {
    const delegatedHandler = (e) => {
      let target = e.target;

      const handlers = eventMap.get(eventType) || [];

      while (target && target !== root) {
        handlers.forEach(({ element, handler }) => {
          if (element === target) {
            handler.call(element, e);
          }
        });
        target = target.parentElement;
      }
    };

    root._delegatedHandlers[eventType] = delegatedHandler;
    root.addEventListener(eventType, delegatedHandler);
  }
}

export function cleanupElementEvents(element) {
  if (!element || element.nodeType !== 1) return;

  eventMap.forEach((_, eventType) => {
    removeEvent(element, eventType);
  });

  // 자식 요소들 처리
  if (element.childNodes) {
    Array.from(element.childNodes).forEach((child) => {
      if (child.nodeType === 1) {
        cleanupElementEvents(child);
      }
    });
  }
}
