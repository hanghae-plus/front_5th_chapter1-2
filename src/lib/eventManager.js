// 이벤트 핸들러를 등록할 객체
// const eventHandlers = {};

const eventMap = new Map();
let rootElement = null;
const activeHandlers = new Map();

export function setupEventListeners(root) {
  // console.log(root);

  // root.addEventListener("click", (event) => {
  //   if (event.target.dataset.event) {
  //     const handlerName = event.target.dataset.event;
  //     const handler = eventHandlers[handlerName];
  //     if (handler) {
  //       handler(event);
  //     }
  //   }
  // });

  // Object.keys(eventHandlers).forEach((eventType) => {
  //   root.addEventListener(eventType, handleEvents);
  // });

  // 이벤트 맵에 등록된 이벤트를 root에 등록
  rootElement = root;

  // 이전에 등록된 이벤트 핸들러 제거
  activeHandlers.forEach((handler, eventType) => {
    rootElement.removeEventListener(eventType, handler);
  });
  activeHandlers.clear();

  // 이벤트 맵에 등록된 이벤트를 root에 다시 등록
  eventMap.forEach((handlers, eventType) => {
    const eventHandler = (e) => {
      // 이벤트 타겟이 등록된 엘리먼트인지 확인
      for (const [element, handler] of handlers.entries()) {
        if (element === e.target || element.contains(e.target)) {
          handler(e);
          break;
        }
      }
    };
    rootElement.addEventListener(eventType, eventHandler);
    activeHandlers.set(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  // console.log('element >>>');
  // console.log(element);
  // console.log('eventType >>>');
  // console.log(eventType);
  // console.log('handler >>>');
  // console.log(handler);

  // const handlerName = `${eventType}-${Math.random().toString(36).substr(2, 9)}`;
  // eventHandlers[handlerName] = handler;

  // 요소에 이벤트 핸들러 이름을 data-event 속성으로 추가
  // element.dataset.event = handlerName;

  // if (!eventHandlers[eventType]) {
  //   eventHandlers[eventType] = new Map();
  // }

  // const elementHandlerMap = eventHandlers[eventType];
  // elementHandlerMap.set(element, handler);

  // 이벤트 타입이 없으면 생성. ex) click:{}
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  // 이벤트 타입에 이벤트 핸들러를 등록. ex) click:{div:handler, button:handler}
  const handlers = eventMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType) {
  // console.log('element >>>');
  // console.log(element);
  // console.log('eventType >>>');
  // console.log(eventType);
  // console.log('handler >>>');
  // console.log(handler);
  // const handlerName = element.dataset.event;

  // 해당 핸들러가 존재하면 제거
  // if (handlerName && eventHandlers[handlerName] === handler) {
  //   delete eventHandlers[handlerName];
  //   delete element.dataset.event; // 요소에서 data-event 제거
  // }

  // if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
  //   eventHandlers[eventType].delete(element);
  // }

  if (!eventMap.has(eventType)) {
    return;
  }

  const handlers = eventMap.get(eventType);
  if (handlers.has(element)) {
    handlers.delete(element);
  }
}

// function handleEvents(e) {
//   const handlers = eventHandlers[e.type];
//   if (!handlers) return;

//   const handler = handlers.get(e.target);
//   if (!handler) return;

//   handler(e);
// }

// -------------------------------

// const oneTimeHandler = (e) => {
//     handler(e);
//     element.removeEventListener(eventType, oneTimeHandler);
// }

// element.addEventListener(eventType, oneTimeHandler);

// -------------------------------

// const eventHandlers = {};

// export function setupEventListeners(root) {
//   Object.keys(eventHandlers).forEach((eventType) => {
//     root.addEventListener(eventType, handleEvents);
//   });
// }

// export function addEvent(element, eventType, handler) {
//   if (!eventHandlers[eventType]) {
//     eventHandlers[eventType] = new Map();
//   }

//   const elementHandlerMap = eventHandlers[eventType];
//   elementHandlerMap.set(element, handler);
// }

// export function removeEvent(element, eventType) {
//   if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
//     eventHandlers[eventType].delete(element);
//   }
// }

// function handleEvents(e) {
//   const handlers = eventHandlers[e.type];
//   if (!handlers) return;

//   const handler = handlers.get(e.target);
//   if (!handler) return;

//   handler(e);
// }
