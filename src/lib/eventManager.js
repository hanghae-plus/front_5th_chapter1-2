export const eventHandlers = new Map();

export function setupEventListeners(root) {
  eventHandlers.forEach((handlersMap, eventType) => {
    root.addEventListener(eventType, (eventObj) => {
      let target = eventObj.target;

      while (target && target !== root) {
        const handlers = handlersMap.get(target);

        if (handlers) {
          for (const fn of handlers) {
            fn(eventObj);
          }
          break;
        }

        target = target.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.get(eventType)) {
    eventHandlers.set(eventType, new Map());
  }

  const handlersMap = eventHandlers.get(eventType);
  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Set());
  }

  handlersMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventHandlers.get(eventType);
  if (!handlersMap) return;

  const handlers = handlersMap.get(element);
  if (!handlers) return;

  handlers.delete(handler);

  // 핸들러가 모두 제거되었으면 Map에서도 제거
  if (handlers.size === 0) {
    handlersMap.delete(element);
  }
}

// export function setupEventListeners(root) {
//   Object.keys(eventHandlers).forEach((eventType) => {
//     root.addEventListener(eventType, (eventObj) => {
//       let target = eventObj.target;

//       while (target && target !== root) {
//         const handlers = eventHandlers[eventType].get(target);
//         console.log(handlers);
//         if (handlers) {
//           handlers.forEach((fn) => fn(eventObj));
//           break;
//         }

//         target = target.parentNode;
//       }
//     });
//   });
// }
