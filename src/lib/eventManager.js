// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.
const savedListeners = {};

export function setupEventListeners(root) {
  Object.entries(savedListeners).forEach(([key, listenerArray]) => {
    // 해당 키(이벤트 타입)에 등록된 리스너가 없다면 건뛰
    if (listenerArray == null || listenerArray.length < 1) {
      return;
    }

    // 루트에 이벤트 타입 별로 모든 이벤트 핸들러를 등록한다.
    root.addEventListener(key.toLowerCase(), (e) => {
      // target이 이벤트 핸들러가 등록되었어야 할 엘리먼트의 자식노드라면 이벤트 핸들러를 실행시킨다.
      /** {element: Element, handler: ()=>{}} */
      listenerArray.forEach((listenerObj) => {
        if (e.target.closest(listenerObj.element.tagName)) {
          listenerObj.handler.call(listenerObj.element, e);
        }
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (savedListeners[eventType] == null) {
    savedListeners[eventType] = [
      {
        element,
        handler,
      },
    ];
  } else {
    savedListeners[eventType].push({
      element,
      handler,
    });
  }
}

export function removeEvent(element, eventType, handler) {
  if (savedListeners[eventType] == null) {
    return null;
  } else {
    savedListeners[eventType].filter((listenrObj) => {
      return listenrObj.element !== element && listenrObj.handler !== handler;
    });
  }
}
