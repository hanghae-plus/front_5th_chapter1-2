/**
 * 1. addEvent와 removeEnent를 통해 element에 대한 이벤트함수를 어딘가에 저장하거나 삭제한다.
 * 2. setupEventListeners를 이용해 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록한다.
 */

export function setupEventListeners(root) {
  console.log(root);
}

export function addEvent(element, eventType, handler) {
  console.log(element, eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  console.log(element, eventType, handler);
}
