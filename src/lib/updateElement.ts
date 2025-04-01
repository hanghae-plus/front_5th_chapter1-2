import { ElementWithHandlers, HTMLEventType, VNode } from "@/types";
import { isValidVNode } from "@/utils/validator";
import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

const shouldReplaceNode = (
  newNode: VNode | string | null,
  oldNode: VNode | string | null,
): boolean => {
  if (typeof oldNode !== typeof newNode) true;

  if (typeof oldNode === "string" && oldNode !== newNode) true;

  if (
    isValidVNode(oldNode) &&
    isValidVNode(newNode) &&
    oldNode.type !== newNode.type
  ) {
    return true;
  }

  return false;
};

function updateAttributes(
  target: ElementWithHandlers,
  newProps: VNode["props"],
  oldProps: VNode["props"],
) {
  if (!oldProps && !newProps) return;

  if (oldProps) {
    Object.keys(oldProps).forEach((key) => {
      if (key.startsWith("on") && typeof oldProps[key] === "function") {
        const eventType = key.toLowerCase().substring(2) as HTMLEventType;

        if (!newProps || !newProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        } else if (newProps[key] !== oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        return;
      }

      if (!newProps || !(key in newProps)) {
        if (key === "className") {
          target.removeAttribute("class");
        } else {
          target.removeAttribute(key);
        }
      }
    });
  }

  if (newProps) {
    Object.keys(newProps).forEach((key) => {
      if (key === "children") return;
      if (key === "textContent") return;

      if (key.startsWith("on") && typeof newProps[key] === "function") {
        const eventType = key.toLowerCase().substring(2);

        if (!oldProps || !oldProps[key] || oldProps[key] !== newProps[key]) {
          addEvent(target, eventType as HTMLEventType, newProps[key]);
        }
        return;
      }

      if (!oldProps || oldProps[key] !== newProps[key]) {
        if (key === "className") {
          target.setAttribute("class", newProps[key]);
        } else {
          target.setAttribute(key, newProps[key]);
        }
      }
    });
  }
}

export function updateElement(
  parentElement: ElementWithHandlers,
  newNode: VNode | string | null,
  oldNode: VNode | string | null,
  index = 0,
) {
  if (oldNode && !newNode) {
    const element = parentElement.childNodes[index];
    parentElement.removeChild(element);
    return;
  }

  if (!oldNode && newNode) {
    const element = createElement(newNode);
    parentElement.appendChild(element);
    return;
  }

  if (shouldReplaceNode(newNode, oldNode)) {
    const oldElement = parentElement.childNodes[index];
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, oldElement);
    return;
  }

  if (typeof newNode === "string") {
    if (newNode !== oldNode) {
      const element = parentElement.childNodes[index];
      element.nodeValue = newNode;
    }
    return;
  }
  if (isValidVNode(newNode) && isValidVNode(oldNode)) {
    const element = parentElement.childNodes[index] as ElementWithHandlers;
    const typedNewNode = newNode as VNode;
    const typedOldNode = oldNode as VNode;

    updateAttributes(element, typedNewNode.props, typedOldNode.props);

    const newLength = typedNewNode.children ? typedNewNode.children.length : 0;
    const oldLength = typedOldNode.children ? typedOldNode.children.length : 0;
    const maxLength = Math.max(newLength, oldLength);

    for (let i = 0; i < maxLength; i++) {
      const newChild =
        typedNewNode.children && i < newLength
          ? typedNewNode.children[i]
          : null;
      const oldChild =
        typedOldNode.children && i < oldLength
          ? typedOldNode.children[i]
          : null;
      updateElement(element, newChild, oldChild, i);
    }
  }
}

// * preact/diff/prpos.js - setProperty
// export function setProperty(dom, name, value, oldValue, namespace) {
// 	let useCapture;

// 	o: if (name == 'style') {
// 		if (typeof value == 'string') {
// 			dom.style.cssText = value;
// 		} else {
// 			if (typeof oldValue == 'string') {
// 				dom.style.cssText = oldValue = '';
// 			}

// 			if (oldValue) {
// 				for (name in oldValue) {
// 					if (!(value && name in value)) {
// 						setStyle(dom.style, name, '');
// 					}
// 				}
// 			}

// 			if (value) {
// 				for (name in value) {
// 					if (!oldValue || value[name] != oldValue[name]) {
// 						setStyle(dom.style, name, value[name]);
// 					}
// 				}
// 			}
// 		}
// 	}
// 	// Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
// 	else if (name[0] == 'o' && name[1] == 'n') {
// 		useCapture = name != (name = name.replace(CAPTURE_REGEX, '$1'));

// 		// Infer correct casing for DOM built-in events:
// 		if (
// 			name.toLowerCase() in dom ||
// 			name == 'onFocusOut' ||
// 			name == 'onFocusIn'
// 		)
// 			name = name.toLowerCase().slice(2);
// 		else name = name.slice(2);

// 		if (!dom._listeners) dom._listeners = {};
// 		dom._listeners[name + useCapture] = value;

// 		if (value) {
// 			if (!oldValue) {
// 				value._attached = eventClock;
// 				dom.addEventListener(
// 					name,
// 					useCapture ? eventProxyCapture : eventProxy,
// 					useCapture
// 				);
// 			} else {
// 				value._attached = oldValue._attached;
// 			}
// 		} else {
// 			dom.removeEventListener(
// 				name,
// 				useCapture ? eventProxyCapture : eventProxy,
// 				useCapture
// 			);
// 		}
// 	} else {
// 		if (namespace == SVG_NAMESPACE) {
// 			// Normalize incorrect prop usage for SVG:
// 			// - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
// 			// - className --> class
// 			name = name.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
// 		} else if (
// 			name != 'width' &&
// 			name != 'height' &&
// 			name != 'href' &&
// 			name != 'list' &&
// 			name != 'form' &&
// 			// Default value in browsers is `-1` and an empty string is
// 			// cast to `0` instead
// 			name != 'tabIndex' &&
// 			name != 'download' &&
// 			name != 'rowSpan' &&
// 			name != 'colSpan' &&
// 			name != 'role' &&
// 			name != 'popover' &&
// 			name in dom
// 		) {
// 			try {
// 				dom[name] = value == NULL ? '' : value;
// 				// labelled break is 1b smaller here than a return statement (sorry)
// 				break o;
// 			} catch (e) {}
// 		}

// 		// aria- and data- attributes have no boolean representation.
// 		// A `false` value is different from the attribute not being
// 		// present, so we can't remove it. For non-boolean aria
// 		// attributes we could treat false as a removal, but the
// 		// amount of exceptions would cost too many bytes. On top of
// 		// that other frameworks generally stringify `false`.

// 		if (typeof value == 'function') {
// 			// never serialize functions as attribute values
// 		} else if (value != NULL && (value !== false || name[4] == '-')) {
// 			dom.setAttribute(name, name == 'popover' && value == true ? '' : value);
// 		} else {
// 			dom.removeAttribute(name);
// 		}
// 	}
// }

// * presct/diff/index.js - diffElementNodes
// function diffElementNodes(
// 	dom,
// 	newVNode,
// 	oldVNode,
// 	globalContext,
// 	namespace,
// 	excessDomChildren,
// 	commitQueue,
// 	isHydrating,
// 	refQueue
// ) {
// 	let oldProps = oldVNode.props;
// 	let newProps = newVNode.props;
// 	let nodeType = /** @type {string} */ (newVNode.type);
// 	/** @type {any} */
// 	let i;
// 	/** @type {{ __html?: string }} */
// 	let newHtml;
// 	/** @type {{ __html?: string }} */
// 	let oldHtml;
// 	/** @type {ComponentChildren} */
// 	let newChildren;
// 	let value;
// 	let inputValue;
// 	let checked;

// 	// Tracks entering and exiting namespaces when descending through the tree.
// 	if (nodeType == 'svg') namespace = SVG_NAMESPACE;
// 	else if (nodeType == 'math') namespace = MATH_NAMESPACE;
// 	else if (!namespace) namespace = XHTML_NAMESPACE;

// 	if (excessDomChildren != NULL) {
// 		for (i = 0; i < excessDomChildren.length; i++) {
// 			value = excessDomChildren[i];

// 			// if newVNode matches an element in excessDomChildren or the `dom`
// 			// argument matches an element in excessDomChildren, remove it from
// 			// excessDomChildren so it isn't later removed in diffChildren
// 			if (
// 				value &&
// 				'setAttribute' in value == !!nodeType &&
// 				(nodeType ? value.localName == nodeType : value.nodeType == 3)
// 			) {
// 				dom = value;
// 				excessDomChildren[i] = NULL;
// 				break;
// 			}
// 		}
// 	}

// 	if (dom == NULL) {
// 		if (nodeType == NULL) {
// 			return document.createTextNode(newProps);
// 		}

// 		dom = document.createElementNS(
// 			namespace,
// 			nodeType,
// 			newProps.is && newProps
// 		);

// 		// we are creating a new node, so we can assume this is a new subtree (in
// 		// case we are hydrating), this deopts the hydrate
// 		if (isHydrating) {
// 			if (options._hydrationMismatch)
// 				options._hydrationMismatch(newVNode, excessDomChildren);
// 			isHydrating = false;
// 		}
// 		// we created a new parent, so none of the previously attached children can be reused:
// 		excessDomChildren = NULL;
// 	}

// 	if (nodeType == NULL) {
// 		// During hydration, we still have to split merged text from SSR'd HTML.
// 		if (oldProps !== newProps && (!isHydrating || dom.data != newProps)) {
// 			dom.data = newProps;
// 		}
// 	} else {
// 		// If excessDomChildren was not null, repopulate it with the current element's children:
// 		excessDomChildren = excessDomChildren && slice.call(dom.childNodes);

// 		oldProps = oldVNode.props || EMPTY_OBJ;

// 		// If we are in a situation where we are not hydrating but are using
// 		// existing DOM (e.g. replaceNode) we should read the existing DOM
// 		// attributes to diff them
// 		if (!isHydrating && excessDomChildren != NULL) {
// 			oldProps = {};
// 			for (i = 0; i < dom.attributes.length; i++) {
// 				value = dom.attributes[i];
// 				oldProps[value.name] = value.value;
// 			}
// 		}

// 		for (i in oldProps) {
// 			value = oldProps[i];
// 			if (i == 'children') {
// 			} else if (i == 'dangerouslySetInnerHTML') {
// 				oldHtml = value;
// 			} else if (!(i in newProps)) {
// 				if (
// 					(i == 'value' && 'defaultValue' in newProps) ||
// 					(i == 'checked' && 'defaultChecked' in newProps)
// 				) {
// 					continue;
// 				}
// 				setProperty(dom, i, NULL, value, namespace);
// 			}
// 		}

// 		// During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
// 		// @TODO we should warn in debug mode when props don't match here.
// 		for (i in newProps) {
// 			value = newProps[i];
// 			if (i == 'children') {
// 				newChildren = value;
// 			} else if (i == 'dangerouslySetInnerHTML') {
// 				newHtml = value;
// 			} else if (i == 'value') {
// 				inputValue = value;
// 			} else if (i == 'checked') {
// 				checked = value;
// 			} else if (
// 				(!isHydrating || typeof value == 'function') &&
// 				oldProps[i] !== value
// 			) {
// 				setProperty(dom, i, value, oldProps[i], namespace);
// 			}
// 		}

// 		// If the new vnode didn't have dangerouslySetInnerHTML, diff its children
// 		if (newHtml) {
// 			// Avoid re-applying the same '__html' if it did not changed between re-render
// 			if (
// 				!isHydrating &&
// 				(!oldHtml ||
// 					(newHtml.__html != oldHtml.__html && newHtml.__html != dom.innerHTML))
// 			) {
// 				dom.innerHTML = newHtml.__html;
// 			}

// 			newVNode._children = [];
// 		} else {
// 			if (oldHtml) dom.innerHTML = '';

// 			diffChildren(
// 				// @ts-expect-error
// 				newVNode.type == 'template' ? dom.content : dom,
// 				isArray(newChildren) ? newChildren : [newChildren],
// 				newVNode,
// 				oldVNode,
// 				globalContext,
// 				nodeType == 'foreignObject' ? XHTML_NAMESPACE : namespace,
// 				excessDomChildren,
// 				commitQueue,
// 				excessDomChildren
// 					? excessDomChildren[0]
// 					: oldVNode._children && getDomSibling(oldVNode, 0),
// 				isHydrating,
// 				refQueue
// 			);

// 			// Remove children that are not part of any vnode.
// 			if (excessDomChildren != NULL) {
// 				for (i = excessDomChildren.length; i--; ) {
// 					removeNode(excessDomChildren[i]);
// 				}
// 			}
// 		}

// 		// As above, don't diff props during hydration
// 		if (!isHydrating) {
// 			i = 'value';
// 			if (nodeType == 'progress' && inputValue == NULL) {
// 				dom.removeAttribute('value');
// 			} else if (
// 				inputValue != UNDEFINED &&
// 				// #2756 For the <progress>-element the initial value is 0,
// 				// despite the attribute not being present. When the attribute
// 				// is missing the progress bar is treated as indeterminate.
// 				// To fix that we'll always update it when it is 0 for progress elements
// 				(inputValue !== dom[i] ||
// 					(nodeType == 'progress' && !inputValue) ||
// 					// This is only for IE 11 to fix <select> value not being updated.
// 					// To avoid a stale select value we need to set the option.value
// 					// again, which triggers IE11 to re-evaluate the select value
// 					(nodeType == 'option' && inputValue != oldProps[i]))
// 			) {
// 				setProperty(dom, i, inputValue, oldProps[i], namespace);
// 			}

// 			i = 'checked';
// 			if (checked != UNDEFINED && checked != dom[i]) {
// 				setProperty(dom, i, checked, oldProps[i], namespace);
// 			}
// 		}
// 	}

// 	return dom;
// }
