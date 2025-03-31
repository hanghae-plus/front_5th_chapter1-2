let eventMap = new Map();
let eventList = []; //  최상단에 event는 하나만 등록될 것이기 때문에..
let handlerMap = new Map();

// 실제로 이 이벤트가 실행될 수 있는지 체크
const eventHandler = (e) => {
  // e.target 은 실제 이벤트가 발생한 요소
  // console.log('e.target', e.target); // element
  // console.log('e.type', e.type); // event
  const currentElement = e.target;
  const currentHandlerMap = eventMap.get(currentElement);
  const currentHandler = currentHandlerMap.get(e.type);
  // console.log('currentHandler', currentHandler);
  if (currentHandler) currentHandler(e);
};

export function setupEventListeners(root) {
  eventList.forEach((event) => {
    // root.addEventListener(event, handlerMap.get(event));
    root.addEventListener(event, eventHandler);
  });
}

// event를 저장해놓는다..
export function addEvent(element, eventType, handler) {
  if (!eventList.includes(eventType)) eventList.push(eventType);
  // event handler map 세팅
  handlerMap.set(eventType, handler);
  // 요소 별 event handler 세팅
  eventMap.set(element, handlerMap);
}

export function removeEvent(element, eventType, handler) {
  // 아.. 버튼에 내가 이벤트 리스너 등록한게 아니지....
  // element.removeEventListener(eventType, handler);
  const currentHandlerMap = eventMap.get(element);
  const currentHandler = currentHandlerMap.get(eventType);
  // 삭제하려는 핸들러가 같은지 확인 후 삭제
  if (currentHandler === handler) {
    currentHandlerMap.delete(eventType);
  }
}
