const eventTypes = [];
const elementMap = new Map();

export function setupEventListeners($root) {
  eventTypes.forEach((eventType) => {
    $root.addEventListener(eventType, handleEvent);
  });
}

// 함수 등록 시 addEventListener에 함수를 직접 넣는 경우
// 익명함수를 별도의 함수로 취급하여, toHaveBeenCalledTimes 테스트에서 실패가 일어남
const handleEvent = (e) => {
  const handlerMap = elementMap.get(e.target);
  const handler = handlerMap?.get(e.type);
  if (handler) handler.call(e.target, e);
};
// TODO 이벤트 버블링 커스텀 구현하기 >> onClick, onClickCapture

export function addEvent(element, eventType, handler) {
  if (!eventTypes.includes(eventType)) eventTypes.push(eventType);
  const handlerMap = elementMap.get(element) || new Map();
  if (handlerMap.get(eventType) === handler) return;
  handlerMap.set(eventType, handler);
  elementMap.set(element, handlerMap);
}

export function removeEvent(element, eventType, handler) {
  const handlerMap = elementMap.get(element);
  if (!handlerMap) return;

  if (handlerMap.get(eventType) === handler) handlerMap.delete(eventType);

  if (handlerMap.size === 0) elementMap.delete(element);
  else elementMap.set(element, handlerMap);
}
