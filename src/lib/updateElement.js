import { createElement } from "./createElement";

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    // _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

// function _iterableToArrayLimit(arr, i) {
//   var _i =
//     arr == null
//       ? null
//       : (typeof Symbol !== "undefined" && arr[Symbol.iterator]) ||
//         arr["@@iterator"];
//   if (_i == null) return;
//   var _arr = [];
//   var _n = true;
//   var _d = false;
//   var _s, _e;
//   try {
//     for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
//       _arr.push(_s.value);
//       if (i && _arr.length === i) break;
//     }
//   } catch (err) {
//     _d = true;
//     _e = err;
//   } finally {
//     try {
//       if (!_n && _i["return"] != null) _i["return"]();
//     } finally {
//       if (_d) throw _e;
//     }
//   }
//   return _arr;
// }

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function updateAttributes(target, newProps, oldProps) {
  for (
    var _i2 = 0, _Object$entries = Object.entries(newProps);
    _i2 < _Object$entries.length;
    _i2++
  ) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
      attr = _Object$entries$_i[0],
      value = _Object$entries$_i[1];

    if (oldProps[attr] === newProps[attr]) continue;
    target.setAttribute(attr, value);
  }

  for (
    var _i3 = 0, _Object$keys = Object.keys(oldProps);
    _i3 < _Object$keys.length;
    _i3++
  ) {
    var _attr = _Object$keys[_i3];
    if (newProps[_attr] !== undefined) continue;
    target.removeAttribute(_attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //updateElement를 구현해서 하고 싶은것은 diff 알고리즘의 구현이다.
  // oldNode와 newNode를 비교해서 변경사항만 바꿔주는게 이번 updateElement의 핵심 목표이다.

  //다를때를 확인해봐야해
  console.log("old===new", oldNode === newNode);
  console.log("old!==new", oldNode !== newNode);

  if (!newNode && oldNode) {
    console.log(oldNode);
    console.log(newNode);
    console.log("oldNode만 있는 경우", parentElement.childNodes[index]);
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (newNode && !oldNode) {
    console.log(oldNode);
    console.log(newNode);
    return parentElement.appendChild(createElement(newNode));
  }

  console.log(typeof newNode);
  console.log(typeof oldNode);
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  var maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (var i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

// function updateElement(parent, newNode, oldNode) {
//     var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

//     if (!newNode && oldNode) {
//       return parent.removeChild(parent.childNodes[index]);
//     }

//     if (newNode && !oldNode) {
//       return parent.appendChild(createElement(newNode));
//     }

//     if (typeof newNode === "string" && typeof oldNode === "string") {
//       if (newNode === oldNode) return;
//       return parent.replaceChild(createElement(newNode), parent.childNodes[index]);
//     }

//     if (newNode.type !== oldNode.type) {
//       return parent.replaceChild(createElement(newNode), parent.childNodes[index]);
//     }

//     updateAttributes(parent.childNodes[index], newNode.props || {}, oldNode.props || {});
//     var maxLength = Math.max(newNode.children.length, oldNode.children.length);

//     for (var i = 0; i < maxLength; i++) {
//       updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
//     }
//   }

// function updateAttributes(target, newProps, oldProps) {
//     for (var _i2 = 0, _Object$entries = Object.entries(newProps); _i2 < _Object$entries.length; _i2++) {
//       var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
//           attr = _Object$entries$_i[0],
//           value = _Object$entries$_i[1];

//       if (oldProps[attr] === newProps[attr]) continue;
//       target.setAttribute(attr, value);
//     }

//     for (var _i3 = 0, _Object$keys = Object.keys(oldProps); _i3 < _Object$keys.length; _i3++) {
//       var _attr = _Object$keys[_i3];
//       if (newProps[_attr] !== undefined) continue;
//       target.removeAttribute(_attr);
//     }
//   }
