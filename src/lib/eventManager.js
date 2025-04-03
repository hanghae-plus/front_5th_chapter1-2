const eventStore = new Map();
const rootStore = new Map();

export function setupEventListeners(root) {
  if (eventStore.size < 1) return;

  Array.from(eventStore.entries()).forEach(([eventType]) => {
    const depthMap = eventStore.get(eventType);
    Array.from(depthMap.entries()).forEach(([element, handler]) => {
      // root.addEventListener(eventType, handler)
      if (rootStore.get(element)?.has(handler)) {
        return;
      }
      const eventHandler = (e) => {
        if (element === e.target) {
          handler(e);
        }
      };
      root.addEventListener(eventType, eventHandler);
      let rootDepthMap = rootStore.get(element);

      if (!rootDepthMap) {
        rootDepthMap = new Map();
        rootStore.set(element, rootDepthMap);
      }
      // rootDepthMap.set(handler, root);
      rootDepthMap.set(handler, { root, eventHandler });
    });
  });
}

// event 를 저장하는데 어떤 event 인지 특정해줘야 함
// element 가 파라미터로 넘어오니까 해당 element도 어딘가에 저장해야됨.
export function addEvent(element, eventType, handler) {
  // eventType 을 key로 새로운 newMap을 만들고
  // 거기에 element와 handler로 넣자.
  let depthMap = eventStore.get(eventType);
  if (!depthMap) {
    depthMap = new Map();
    eventStore.set(eventType, depthMap);
  }

  depthMap.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const depthMap = eventStore.get(eventType);
  depthMap.delete(element);

  const rootData = rootStore.get(element);
  if (rootData) {
    const { root, eventHandler } = rootData.get(handler);
    root.removeEventListener(eventType, eventHandler); // eventHandler를 사용하여 제거
  }
}

// // key: 이벤트 타입 (ex.click)
// // value: WeakMap (key: event target , value: handler)
// const eventHandlers = new Map();

// export function setupEventListeners(root) {
//   if (!root) return;

//   if (!root.__rootEvents) {
//     root.__rootEvents = new Set();
//   }

//   for (const [eventType, eventMap] of eventHandlers.entries()) {
//     if (root.__rootEvents.has(eventType)) continue;

//     root.addEventListener(eventType, (e) => {
//       let targetElement = e.target;

//       // 핸들러 하위 요소에 액션을 했을 경우
//       while (targetElement && targetElement !== root.parentNode) {
//         const handler = eventMap.get(targetElement);

//         if (handler) {
//           handler(e);

//           break;
//         }

//         targetElement = targetElement.parentNode;
//       }
//     });

//     root.__rootEvents.add(eventType);
//   }
// }

// export function addEvent(element, eventType, handler) {
//   if (!element || !eventType || !handler) return;

//   let eventMap = eventHandlers.get(eventType);

//   if (!eventMap) {
//     eventMap = new WeakMap();
//     eventHandlers.set(eventType, eventMap);
//   }

//   eventMap.set(element, handler);
// }

// export function removeEvent(element, eventType, handler) {
//   if (!element || !eventType || !handler) return;

//   const eventMap = eventHandlers.get(eventType);

//   if (eventMap && eventMap.get(element) === handler) {
//     eventMap.delete(element);
//   }
// }
