export const eventHandlers = new Map();

export function setupEventListeners(root) {
  Object.keys(eventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, (eventObj) => {
      let target = eventObj.target;
      while (target && target !== root) {
        const handlers = eventHandlers[eventType].get(target);
        console.log(target);

        if (handlers?.has(target)) {
          console.log(target);

          const handler = handlers.get(target);
          console.log(handler);
          handler(target);
          break;
        }

        target = target.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = new Map();
  }

  const handlersMap = eventHandlers[eventType];

  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Set());
  }

  handlersMap.get(element).add(handler);
  console.log("element: ", element);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventHandlers[eventType];
  if (!handlersMap) return;

  const handlers = handlersMap.get(element);
  if (!handlers) return;

  handlersMap.set(element, handlers.delete(handler));
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
