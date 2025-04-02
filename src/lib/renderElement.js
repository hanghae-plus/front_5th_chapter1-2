import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode); //v노드 정규화
  const $el = createElement(normalizedVNode); //셀제 DOM 생성

  container.appendChild($el); // DOM 연결
  // setupEventListeners(container);
  // console.log(normalizedVNode);

  setupEventListeners(container); // 이벤트 위임 === 이때 이벤트가 attach
}

// addEvent는 createElement에 호출됨
//만약 createElement의 props에 이벤트가 있으면
//그래서 돔을 생성할때 addEvent를 통해 setupEventListeners에 채워짐
//=> createElement 단계에서 setupEventListener에 등록됨
//이라고 생각을 했는데 안됨

//질문1. setupEventListners(container) 를 그냥 호출하게 되면
//무한 루프에 들어가게 되는데 그 이유를 모르겠음

// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.
