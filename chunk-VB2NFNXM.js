import {
  AWAIT_BLOCK,
  EACH_INDEX_REACTIVE,
  EACH_IS_CONTROLLED,
  EACH_ITEM_BLOCK,
  EACH_ITEM_REACTIVE,
  EACH_KEYED,
  IF_BLOCK,
  KEY_BLOCK,
  ROOT_BLOCK,
  UNINITIALIZED,
  array_from,
  create_await_block,
  create_dynamic_component_block,
  create_dynamic_element_block,
  create_each_block,
  create_each_item_block,
  create_head_block,
  create_if_block,
  create_key_block,
  create_root_block,
  create_try_block,
  current_block,
  define_property,
  derived,
  destroy_signal,
  effect,
  execute_effect,
  expose,
  flushSync,
  get,
  is_array,
  is_signal,
  managed_pre_effect,
  object_ref,
  push_destroy_fn,
  render_effect,
  safe_not_equal,
  schedule_effect,
  set,
  set_signal_value,
  source,
  untrack
} from "./chunk-T3PU6ST4.js";
import {
  is_promise
} from "./chunk-ZADVA3HR.js";

// src/internal/client/validate.ts
var void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(tag) {
  return void_element_names.test(tag) || tag.toLowerCase() === "!doctype";
}
function validate_store(store, name) {
  if (store != null && typeof store.subscribe !== "function") {
    throw new Error(`'${name}' is not a store with a 'subscribe' method`);
  }
}
function validate_dynamic_component(component_fn) {
  const error_message = "this={...} of <svelte:component> should specify a Svelte component.";
  try {
    const instance = component_fn();
    if (instance !== void 0 && typeof instance !== "object") {
      throw new Error(error_message);
    }
    return instance;
  } catch (err) {
    const { message } = err;
    if (typeof message === "string" && message.indexOf("is not a function") !== -1) {
      throw new Error(error_message);
    } else {
      throw err;
    }
  }
}
function validate_void_dynamic_element(tag_fn) {
  const tag = is_signal(tag_fn) ? get(tag_fn) : typeof tag_fn === "function" ? tag_fn() : tag_fn;
  if (tag && is_void(tag)) {
    console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
  }
}

// src/internal/client/hydration.ts
var current_hydration_fragment = null;
function set_current_hydration_fragment(fragment) {
  current_hydration_fragment = fragment;
}
function get_hydration_fragment(node) {
  const fragment = [];
  let current_node = node;
  let target_depth = null;
  while (current_node !== null) {
    const node_type = current_node.nodeType;
    const next_sibling = current_node.nextSibling;
    if (node_type === 8) {
      const data = current_node.data;
      if (data.startsWith("ssr:")) {
        const depth = data.slice(4);
        if (target_depth === null) {
          target_depth = depth;
        } else if (depth === target_depth) {
          return fragment;
        } else {
          fragment.push(current_node);
        }
        current_node = next_sibling;
        continue;
      }
    }
    if (target_depth !== null) {
      fragment.push(current_node);
    }
    current_node = next_sibling;
  }
  return null;
}
function hydrate_block_anchor(anchor_node, is_controlled) {
  let target_node = anchor_node;
  if (current_hydration_fragment !== null) {
    if (is_controlled) {
      target_node = target_node.firstChild;
    }
    if (target_node.nodeType === 8) {
      let fragment = target_node.$$fragment;
      if (fragment === void 0) {
        fragment = get_hydration_fragment(target_node);
      }
      set_current_hydration_fragment(fragment);
    } else {
      set_current_hydration_fragment([target_node.firstChild]);
    }
  }
}

// src/internal/client/operations.ts
var node_prototype = Node.prototype;
var element_prototype = Element.prototype;
var event_target_prototype = EventTarget.prototype;
var append_child_method = node_prototype.appendChild;
var clone_node_method = node_prototype.cloneNode;
event_target_prototype.__click = void 0;
var get_descriptor = /* @__NO_SIDE_EFFECTS__ */ (o, p) => object_ref.getOwnPropertyDescriptor(o, p);
var first_child_get = (/* @__PURE__ */ get_descriptor(node_prototype, "firstChild")).get;
var next_sibling_get = (/* @__PURE__ */ get_descriptor(node_prototype, "nextSibling")).get;
var text_content_set = (/* @__PURE__ */ get_descriptor(node_prototype, "textContent")).set;
var class_name_set = (/* @__PURE__ */ get_descriptor(element_prototype, "className")).set;
function append_child(element2, child2) {
  append_child_method.call(element2, child2);
}
function clone_node(node, deep) {
  return clone_node_method.call(node, deep);
}
function child(node) {
  const child2 = first_child_get.call(node);
  if (current_hydration_fragment !== null && child2 !== null) {
    return capture_fragment_from_node(child2);
  }
  return child2;
}
function child_frag(node) {
  if (current_hydration_fragment !== null) {
    const first_node = node[0];
    if (current_hydration_fragment !== null && first_node !== null) {
      return capture_fragment_from_node(first_node);
    }
    return first_node;
  }
  return first_child_get.call(node);
}
function sibling(node) {
  const next_sibling = next_sibling_get.call(node);
  if (current_hydration_fragment !== null && next_sibling !== null) {
    return capture_fragment_from_node(next_sibling);
  }
  return next_sibling;
}
function set_class_name(node, class_name2) {
  class_name_set.call(node, class_name2);
}
function text_content(node, text2) {
  text_content_set.call(node, text2);
}
function capture_fragment_from_node(node) {
  if (node.nodeType === 8 && node.data.startsWith("ssr:") && current_hydration_fragment.at(-1) !== node) {
    const fragment = get_hydration_fragment(node);
    const last_child = fragment.at(-1) || node;
    const target = last_child.nextSibling;
    target.$$fragment = fragment;
    return target;
  }
  return node;
}
var $window = window;
var $document = document;

// src/internal/client/reconciler.ts
var NEW_BLOCK = -1;
var MOVED_BLOCK = 99999999;
var LIS_BLOCK = -2;
function create_fragment_from_html(html2) {
  const elem = document.createElement("template");
  elem.innerHTML = html2;
  return elem.content;
}
function insert(current, parent_element, sibling2) {
  if (is_array(current)) {
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (sibling2 === null) {
        append_child(parent_element, node);
      } else {
        sibling2.before(node);
      }
    }
    return current[0];
  } else if (current !== null) {
    if (sibling2 === null) {
      append_child(parent_element, current);
    } else {
      sibling2.before(current);
    }
  }
  return current;
}
function remove(current) {
  let first_node = current;
  if (is_array(current)) {
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (i === 0) {
        first_node = node;
      }
      if (node.isConnected) {
        node.remove();
      }
    }
  } else if (current.isConnected) {
    current.remove();
  }
  return first_node;
}
function reconcile_html(dom, value, svg) {
  hydrate_block_anchor(dom);
  if (current_hydration_fragment !== null) {
    return current_hydration_fragment;
  }
  let html2 = value + "";
  const target = dom;
  let frag_nodes;
  if (svg) {
    html2 = `<svg>${html2}</svg>`;
  }
  let content = create_fragment_from_html(html2);
  if (svg) {
    content = content.firstChild;
  }
  const clone = content.cloneNode(true);
  frag_nodes = Array.from(clone.childNodes);
  target.before(svg ? clone.firstChild : clone);
  return frag_nodes;
}
function insert_each_item_block(block, dom, is_controlled, sibling2) {
  const current = block.dom;
  if (sibling2 === null) {
    if (is_controlled) {
      return insert(current, dom, null);
    } else {
      return insert(current, dom.parentNode, dom);
    }
  }
  return insert(current, null, sibling2);
}
function get_first_child(block) {
  const current = block.dom;
  if (is_array(current)) {
    return current[0];
  }
  return current;
}
function destroy_active_transition_blocks(active_transitions) {
  const length = active_transitions.length;
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      const block = active_transitions[i];
      const transition2 = block.transition;
      if (transition2 !== null) {
        block.transition = null;
        destroy_each_item_block(block, null, false);
      }
    }
    active_transitions.length = 0;
  }
}
function reconcile_indexed_array(array, each_block, dom, is_controlled, render_fn, type, apply_transitions) {
  const a_blocks = each_block.items;
  const active_transitions = each_block.transitions;
  const a = a_blocks.length;
  const b = array.length;
  const length = Math.max(a, b);
  let index = 0;
  let b_blocks;
  if (active_transitions.length !== 0) {
    destroy_active_transition_blocks(active_transitions);
  }
  if (b === 0) {
    b_blocks = [];
    if (is_controlled && a !== 0) {
      text_content(dom, "");
    }
    while (index < length) {
      const block = a_blocks[index++];
      destroy_each_item_block(block, active_transitions, is_controlled);
    }
  } else {
    let item;
    let block;
    b_blocks = Array(b);
    if (current_hydration_fragment !== null) {
      let hydrating_node = current_hydration_fragment[0];
      for (; index < length; index++) {
        item = array[index];
        const fragment = get_hydration_fragment(hydrating_node);
        set_current_hydration_fragment(fragment);
        hydrating_node = fragment.at(-1).nextSibling.nextSibling;
        block = each_item_block(item, null, index, render_fn, type);
        b_blocks[index] = block;
      }
    } else {
      for (; index < length; index++) {
        if (index >= a) {
          item = array[index];
          block = each_item_block(item, null, index, render_fn, type);
          b_blocks[index] = block;
          insert_each_item_block(block, dom, is_controlled, null);
        } else if (index >= b) {
          block = a_blocks[index];
          destroy_each_item_block(block, active_transitions, apply_transitions);
        } else {
          item = array[index];
          block = a_blocks[index];
          b_blocks[index] = block;
          update_each_item_block(block, item, index, type);
        }
      }
    }
  }
  each_block.items = b_blocks;
}
function reconcile_tracked_array(array, each_block, dom, is_controlled, render_fn, keys, type, apply_transitions) {
  const a_blocks = each_block.items;
  const is_computed_key = keys !== null;
  const active_transitions = each_block.transitions;
  let a = a_blocks.length;
  let b = array.length;
  let b_blocks;
  if (active_transitions.length !== 0) {
    destroy_active_transition_blocks(active_transitions);
  }
  if (b === 0) {
    b_blocks = [];
    if (is_controlled && a !== 0) {
      text_content(dom, "");
    }
    while (a > 0) {
      const block = a_blocks[--a];
      destroy_each_item_block(block, active_transitions, apply_transitions, is_controlled);
    }
  } else {
    let a_end = a - 1;
    let b_end = b - 1;
    let block;
    b_blocks = Array(b);
    if (current_hydration_fragment !== null) {
      let hydrating_node = current_hydration_fragment[0];
      while (b > 0) {
        const idx = b_end - --b;
        const item = array[idx];
        const key2 = is_computed_key ? keys[idx] : item;
        const fragment = get_hydration_fragment(hydrating_node);
        set_current_hydration_fragment(fragment);
        hydrating_node = fragment.at(-1).nextSibling.nextSibling;
        block = each_item_block(item, key2, idx, render_fn, type);
        b_blocks[idx] = block;
      }
    } else if (a === 0) {
      while (b > 0) {
        const idx = b_end - --b;
        const item = array[idx];
        const key2 = is_computed_key ? keys[idx] : item;
        block = each_item_block(item, key2, idx, render_fn, type);
        b_blocks[idx] = block;
        insert_each_item_block(block, dom, is_controlled, null);
      }
    } else {
      let start = 0;
      let item = array[b_end];
      let key2 = is_computed_key ? keys[b_end] : item;
      let sibling2 = null;
      outer:
        while (true) {
          while (a_blocks[a_end].key === key2) {
            block = a_blocks[a_end--];
            item = array[b_end];
            update_each_item_block(block, item, b_end, type);
            sibling2 = get_first_child(block);
            b_blocks[b_end] = block;
            if (start > --b_end || start > a_end) {
              break outer;
            }
            key2 = is_computed_key ? keys[b_end] : item;
          }
          item = array[start];
          key2 = is_computed_key ? keys[start] : item;
          while (start <= a_end && start <= b_end && a_blocks[start].key === key2) {
            item = array[start];
            block = a_blocks[start];
            update_each_item_block(block, item, start, type);
            b_blocks[start] = block;
            ++start;
            key2 = is_computed_key ? keys[start] : array[start];
          }
          break;
        }
      if (start > a_end) {
        while (b_end >= start) {
          item = array[b_end];
          key2 = is_computed_key ? keys[b_end] : item;
          block = each_item_block(item, key2, b_end, render_fn, type);
          b_blocks[b_end--] = block;
          sibling2 = insert_each_item_block(block, dom, is_controlled, sibling2);
        }
      } else if (start > b_end) {
        b = start;
        do {
          if ((block = a_blocks[b++]) !== null) {
            destroy_each_item_block(block, active_transitions, apply_transitions);
          }
        } while (b <= a_end);
      } else {
        let pos = 0;
        let b_length = b_end - start + 1;
        const sources = new Int32Array(b_length);
        const item_index = /* @__PURE__ */ new Map();
        for (b = 0; b < b_length; ++b) {
          a = b + start;
          sources[b] = NEW_BLOCK;
          item = array[a];
          key2 = is_computed_key ? keys[a] : item;
          item_index.set(key2, a);
        }
        for (b = start; b <= a_end; ++b) {
          a = item_index.get(a_blocks[b].key);
          block = a_blocks[b];
          if (a !== void 0) {
            pos = pos < a ? a : MOVED_BLOCK;
            sources[a - start] = b;
            b_blocks[a] = block;
          } else if (block !== null) {
            destroy_each_item_block(block, active_transitions, apply_transitions);
          }
        }
        if (pos === MOVED_BLOCK) {
          mark_lis(sources);
        }
        while (b_length-- > 0) {
          b_end = b_length + start;
          a = sources[b_length];
          const should_create = a === -1;
          item = array[b_end];
          if (should_create) {
            const key3 = is_computed_key ? keys[b_end] : item;
            block = each_item_block(item, key3, b_end, render_fn, type);
          } else {
            block = b_blocks[b_end];
            update_each_item_block(block, item, b_end, type);
          }
          if (should_create || pos === MOVED_BLOCK && a !== LIS_BLOCK) {
            sibling2 = insert_each_item_block(block, dom, is_controlled, sibling2);
          } else {
            sibling2 = get_first_child(block);
          }
          b_blocks[b_end] = block;
        }
      }
    }
  }
  each_block.items = b_blocks;
}
function mark_lis(a) {
  const length = a.length;
  const parent = new Int32Array(length);
  const index = new Int32Array(length);
  let index_length = 0;
  let i = 0;
  let j;
  let k;
  let lo;
  let hi;
  for (; a[i] === NEW_BLOCK; ++i) {
  }
  index[0] = i++;
  for (; i < length; ++i) {
    k = a[i];
    if (k !== NEW_BLOCK) {
      j = index[index_length];
      if (a[j] < k) {
        parent[i] = j;
        index[++index_length] = i;
      } else {
        lo = 0;
        hi = index_length;
        while (lo < hi) {
          j = lo + hi >> 1;
          if (a[index[j]] < k) {
            lo = j + 1;
          } else {
            hi = j;
          }
        }
        if (k < a[index[lo]]) {
          if (lo > 0) {
            parent[i] = index[lo - 1];
          }
          index[lo] = i;
        }
      }
    }
  }
  j = index[index_length];
  while (index_length-- >= 0) {
    a[j] = LIS_BLOCK;
    j = parent[j];
  }
}

// src/internal/client/render.ts
var all_registerd_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
var passive_delegated_events = /* @__PURE__ */ new Set(["touchstart", "touchmove", "touchend"]);
function empty() {
  return document.createTextNode("");
}
// @__NO_SIDE_EFFECTS__
function template(html2, is_fragment) {
  let cached_content;
  return () => {
    if (cached_content === void 0) {
      const content = create_fragment_from_html(html2);
      cached_content = is_fragment ? content : child(content);
    }
    return cached_content;
  };
}
// @__NO_SIDE_EFFECTS__
function svg_template(svg, is_fragment) {
  let cached_content;
  return () => {
    if (cached_content === void 0) {
      const content = child(create_fragment_from_html(`<svg>${svg}</svg>`));
      cached_content = is_fragment ? content : child(content);
    }
    return cached_content;
  };
}
function svg_replace(node) {
  const first_child = node.firstChild;
  node.replaceWith(first_child);
  return first_child;
}
function open_template(is_fragment, anchor, template_element_fn) {
  if (current_hydration_fragment !== null) {
    if (anchor !== null) {
      hydrate_block_anchor(anchor, false);
    }
    const fragment = current_hydration_fragment;
    if (fragment !== null) {
      return is_fragment ? fragment : fragment[0];
    }
  }
  return clone_node(template_element_fn(), true);
}
// @__NO_SIDE_EFFECTS__
function open(anchor, template_element_fn) {
  return open_template(false, anchor, template_element_fn);
}
// @__NO_SIDE_EFFECTS__
function open_frag(anchor, template_element_fn) {
  return open_template(true, anchor, template_element_fn);
}
function close_template(dom, is_fragment, anchor) {
  const block = current_block;
  const current = is_fragment ? is_array(dom) ? dom : Array.from(dom.childNodes) : dom;
  if (anchor !== null && current_hydration_fragment === null) {
    insert(current, null, anchor);
  }
  block.dom = current;
}
function close(anchor, dom) {
  close_template(dom, false, anchor);
}
function close_frag(anchor, dom) {
  close_template(dom, true, anchor);
}
function trusted(fn) {
  return function(...args) {
    const event2 = args[0];
    if (event2.isTrusted) {
      unwrap(fn).apply(this, args);
    }
  };
}
function self(fn) {
  return function(...args) {
    const event2 = args[0];
    if (event2.target === this) {
      unwrap(fn).apply(this, args);
    }
  };
}
function stopPropagation(fn) {
  return function(...args) {
    const event2 = args[0];
    event2.stopPropagation();
    return unwrap(fn).apply(this, args);
  };
}
function once(fn) {
  let ran = false;
  return function(...args) {
    if (ran) {
      return;
    }
    ran = true;
    return unwrap(fn).apply(this, args);
  };
}
function stopImmediatePropagation(fn) {
  return function(...args) {
    const event2 = args[0];
    event2.stopImmediatePropagation();
    return unwrap(fn).apply(this, args);
  };
}
function preventDefault(fn) {
  return function(...args) {
    const event2 = args[0];
    event2.preventDefault();
    return unwrap(fn).apply(this, args);
  };
}
function event(event_name, dom, handler, capture, passive) {
  const options = {
    capture,
    passive
  };
  const target_handler = handler;
  dom.addEventListener(event_name, target_handler, options);
  if (dom === document.body || dom === window || dom === document) {
    render_effect(() => {
      return () => {
        dom.removeEventListener(event_name, target_handler, options);
      };
    });
  }
}
function class_name(dom, value) {
  if (typeof value === "function") {
    render_effect(() => {
      const string = to_class(value());
      class_name(dom, string);
    });
  } else {
    if (value === "") {
      dom.removeAttribute("class");
    } else {
      set_class_name(dom, value);
    }
  }
}
function text(dom, value) {
  render_effect(() => {
    const string = stringify(value());
    dom.nodeValue = string;
  });
}
function auto_focus(dom, value) {
  if (value) {
    const body = document.body;
    dom.autofocus = true;
    render_effect(
      () => {
        if (document.activeElement === body) {
          dom.focus();
        }
      },
      current_block,
      true,
      false
    );
  }
}
function to_class(value) {
  return value == null ? "" : value;
}
function class_toggle(dom, class_name2, value) {
  if (value) {
    dom.classList.add(class_name2);
  } else {
    dom.classList.remove(class_name2);
  }
}
function select_option(select, value) {
  if (select.multiple) {
    return select_options(select, value);
  }
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    const option_value = get_option_value(option);
    if (option_value === value) {
      option.selected = true;
      return;
    }
  }
  select.value = "";
}
function select_options(select, value) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    option.selected = ~value.indexOf(get_option_value(option));
  }
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}
function bind_online(update) {
  const status_changed = () => {
    update(navigator.onLine);
  };
  window.addEventListener("online", status_changed);
  window.addEventListener("offline", status_changed);
  status_changed();
  render_effect(() => {
    return () => {
      window.removeEventListener("online", status_changed);
      window.removeEventListener("offline", status_changed);
    };
  });
}
function selected(dom) {
  effect(() => {
    let select = dom.parentNode;
    while (select != null) {
      if (select.nodeName === "SELECT") {
        break;
      }
      select = select.parentNode;
    }
    if (select != null) {
      const select_value = select.__value;
      const option_value = dom.__value;
      dom.selected = select_value === option_value;
      dom.value = option_value;
    }
  });
}
function bind_value(dom, get_value, update) {
  const is_select = dom.nodeName === "SELECT";
  let mounted = false;
  dom.addEventListener(is_select ? "change" : "input", () => {
    let value = dom.value;
    const type = dom.type;
    if (type === "number" || type === "range") {
      value = value === "" ? null : +value;
    } else if (is_select) {
      if (dom.multiple) {
        value = [].map.call(
          dom.querySelectorAll(":checked"),
          // @ts-ignore
          (option) => option.__value
        );
      } else {
        const selected_option = dom.querySelector(":checked");
        value = selected_option && selected_option.__value;
      }
    }
    update(value);
  });
  render_effect(() => {
    const value = get_value();
    if (value == null && !mounted) {
      let selected_option = value === void 0 ? dom.querySelector(":checked") : null;
      if (is_select) {
        if (selected_option === null) {
          dom.value = "";
        }
        const options = dom.querySelectorAll("option");
        for (const option of options) {
          if (option.__value === value || option.hasAttribute("selected")) {
            if (option.disabled) {
              option.value = "";
            }
            option.selected = true;
            selected_option = option;
            break;
          }
        }
      }
      if (selected_option != null) {
        const non_null_value = selected_option.__value;
        update(non_null_value);
        if (selected_option.hasAttribute("selected")) {
          selected_option.removeAttribute("selected");
          selected_option.selected = true;
        }
      }
    } else {
      if (is_select) {
        select_option(dom, value);
      } else {
        const coerced_value = value == null ? null : value + "";
        dom.value = coerced_value;
      }
      dom.__value = value;
    }
    mounted = true;
  });
}
function bind_select_value(dom, get_value, update) {
  let mounted = false;
  dom.addEventListener("change", () => {
    let value = dom.value;
    if (dom.multiple) {
      value = [].map.call(dom.querySelectorAll(":checked"), get_option_value);
    } else {
      const selected_option = dom.querySelector(":checked");
      value = selected_option && get_option_value(selected_option);
    }
    update(value);
  });
  render_effect(() => {
    const value = get_value();
    if (value == null && !mounted) {
      let selected_option = value === void 0 ? dom.querySelector(":checked") : null;
      if (selected_option === null) {
        dom.value = "";
      }
      const options = dom.querySelectorAll("option");
      for (const option of options) {
        if (get_option_value(option) === value || option.hasAttribute("selected")) {
          if (option.disabled) {
            option.value = "";
          }
          option.selected = true;
          selected_option = option;
          break;
        }
      }
      if (selected_option != null) {
        const non_null_value = get_option_value(selected_option);
        update(non_null_value);
        if (selected_option.hasAttribute("selected")) {
          selected_option.removeAttribute("selected");
          selected_option.selected = true;
        }
      }
    } else {
      select_option(dom, value);
      dom.__value = value;
    }
    mounted = true;
  });
}
function bind_content_editable(property, dom, get_value, update) {
  dom.addEventListener("input", () => {
    const value = dom[property];
    update(value);
  });
  render_effect(() => {
    const value = get_value();
    if (value === null) {
      const non_null_value = dom[property];
      update(non_null_value);
    } else {
      dom[property] = value + "";
    }
  });
}
function get_binding_group_value(group, __value, checked) {
  const value = /* @__PURE__ */ new Set();
  for (let i = 0; i < group.length; i += 1) {
    if (group[i].checked) {
      value.add(group[i].__value);
    }
  }
  if (!checked) {
    value.delete(__value);
  }
  return Array.from(value);
}
function bind_group(group, group_index, dom, get_value, update) {
  const is_checkbox = dom.getAttribute("type") === "checkbox";
  let binding_group = group;
  if (group_index !== null) {
    for (const index of group_index) {
      const group2 = binding_group;
      binding_group = group2[index];
      if (binding_group === void 0) {
        binding_group = group2[index] = [];
      }
    }
  }
  binding_group.push(dom);
  dom.addEventListener("change", () => {
    let value = dom.__value;
    if (is_checkbox) {
      value = get_binding_group_value(binding_group, value, dom.checked);
    }
    update(value);
  });
  render_effect(() => {
    let value = get_value();
    if (is_checkbox) {
      value = value || [];
      dom.checked = value.includes(dom.__value);
    } else {
      dom.checked = dom.__value === value;
    }
  });
  render_effect(() => {
    return () => {
      const index = binding_group.indexOf(dom);
      if (index !== -1) {
        binding_group.splice(index, 1);
      }
    };
  });
}
function bind_checked(dom, get_value, update) {
  dom.addEventListener("change", () => {
    const value = dom.checked;
    update(value);
  });
  if (get_value() == void 0) {
    update(false);
  }
  render_effect(() => {
    const value = get_value();
    dom.checked = Boolean(value);
  });
}
function bind_scroll(type, dom, get_value, update) {
  const is_scrolling_x = type === "x";
  const target_handler = () => {
    scrolling = true;
    clearTimeout(timeout);
    timeout = setTimeout(clear, 100);
    const value = dom[is_scrolling_x ? "pageXOffset" : "pageYOffset"];
    update(value);
  };
  dom.addEventListener("scroll", target_handler, {
    passive: true
  });
  let latest_value = 0;
  let scrolling = false;
  let timeout;
  const clear = () => {
    scrolling = false;
  };
  render_effect(() => {
    latest_value = get_value() || 0;
    if (!scrolling) {
      scrolling = true;
      clearTimeout(timeout);
      if (is_scrolling_x) {
        scrollTo(latest_value, window.pageYOffset);
      } else {
        scrollTo(window.pageXOffset, latest_value);
      }
      timeout = setTimeout(clear, 100);
    }
  });
  render_effect(() => {
    if (dom === document.body || dom === window || dom === document) {
      return () => {
        dom.removeEventListener("scroll", target_handler, {
          passive: true
        });
      };
    }
  });
}
function bind_property(property, event_name, type, dom, get_value, update) {
  const target_handler = () => {
    const value = dom[property];
    update(value);
  };
  dom.addEventListener(event_name, target_handler);
  if (type === "set") {
    render_effect(() => {
      const value = get_value();
      dom[property] = value;
    });
  }
  if (type === "get") {
    const value = dom[property];
    update(value);
  }
  render_effect(() => {
    if (dom === document.body || dom === window || dom === document) {
      return () => {
        dom.removeEventListener(event_name, target_handler);
      };
    }
  });
}
function bind_prop(props, prop2, value) {
  const update = (value2) => {
    const current_props = unwrap(props);
    const signal = expose(() => current_props[prop2]);
    if (is_signal(signal)) {
      set(signal, value2);
    } else if (Object.getOwnPropertyDescriptor(current_props, prop2)?.set !== void 0) {
      current_props[prop2] = value2;
    }
  };
  update(value);
  render_effect(() => () => {
    update(null);
  });
}
function bind_this(element_or_component, update) {
  untrack(() => {
    update(element_or_component);
    render_effect(() => () => {
      untrack(() => {
        update(null);
      });
    });
  });
}
function delegate(events) {
  for (let i = 0; i < events.length; i++) {
    all_registerd_events.add(events[i]);
  }
  for (const fn of root_event_handles) {
    fn(events);
  }
}
function handle_event_propagation(root_element, event2) {
  const event_name = event2.type;
  let current_target = event2.composedPath && event2.composedPath()[0] || event2.target;
  if (event2.target !== current_target) {
    define_property(event2, "target", {
      configurable: true,
      value: current_target
    });
  }
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || document;
    }
  });
  while (current_target !== null) {
    const parent_element = current_target.parentNode || current_target.host || null;
    const internal_prop_name = "__" + event_name;
    const delegated = current_target[internal_prop_name];
    if (delegated !== void 0 && !current_target.disabled) {
      const [fn, ...data] = delegated;
      if (data === null) {
        fn.call(current_target, event2);
      } else {
        fn.apply(current_target, [event2, ...data]);
      }
    }
    if (event2.cancelBubble || parent_element === root_element) {
      return;
    }
    current_target = parent_element;
  }
}
function slot(anchor_node, slot_fn, slot_props, fallback_fn) {
  hydrate_block_anchor(anchor_node);
  if (slot_fn === void 0) {
    if (fallback_fn !== null) {
      fallback_fn(anchor_node);
    }
  } else {
    slot_fn(slot_props, anchor_node);
  }
}
function if_block(anchor_node, condition_fn, consequent_fn, alternate_fn) {
  const block = create_if_block();
  hydrate_block_anchor(anchor_node);
  const consequent_transitions = /* @__PURE__ */ new Set();
  const alternate_transitions = /* @__PURE__ */ new Set();
  let consequent_current = null;
  let alternate_current = null;
  let last_result = false;
  let result = false;
  let has_mounted = false;
  block.transition = (transition2) => {
    if (result) {
      consequent_transitions.add(transition2);
      transition2.finished(() => {
        consequent_transitions.delete(transition2);
        if (consequent_transitions.size === 0) {
          execute_effect(consequent_effect);
        }
      });
    } else {
      alternate_transitions.add(transition2);
      transition2.finished(() => {
        alternate_transitions.delete(transition2);
        if (alternate_transitions.size === 0) {
          execute_effect(alternate_effect);
        }
      });
    }
  };
  const if_effect = render_effect(
    () => {
      result = condition_fn();
      if (last_result !== result || !has_mounted) {
        last_result = result;
        if (has_mounted) {
          if (result) {
            if (alternate_transitions.size === 0) {
              execute_effect(alternate_effect);
            } else {
              trigger_transitions(alternate_transitions, "out");
            }
            if (consequent_transitions.size === 0) {
              execute_effect(consequent_effect);
            } else {
              trigger_transitions(consequent_transitions, "in");
            }
          } else {
            if (consequent_transitions.size === 0) {
              execute_effect(consequent_effect);
            } else {
              trigger_transitions(consequent_transitions, "out");
            }
            if (alternate_transitions.size === 0) {
              execute_effect(alternate_effect);
            } else {
              trigger_transitions(alternate_transitions, "in");
            }
          }
        }
        has_mounted = true;
      }
    },
    block,
    false
  );
  const consequent_effect = render_effect(
    () => {
      if (consequent_current !== null) {
        remove(consequent_current);
        consequent_current = null;
      }
      if (result) {
        consequent_fn(anchor_node);
      }
      consequent_current = block.dom;
      block.dom = null;
    },
    block,
    true
  );
  const alternate_effect = render_effect(
    () => {
      if (alternate_current !== null) {
        remove(alternate_current);
        alternate_current = null;
      }
      if (!result && alternate_fn !== null) {
        alternate_fn(anchor_node);
      }
      alternate_current = block.dom;
      block.dom = null;
    },
    block,
    true
  );
  push_destroy_fn(if_effect, () => {
    if (consequent_current !== null) {
      remove(consequent_current);
    }
    if (alternate_current !== null) {
      remove(alternate_current);
    }
    destroy_signal(consequent_effect);
    destroy_signal(alternate_effect);
  });
  block.effect = if_effect;
}
function head(render_fn) {
  const block = create_head_block();
  const head_effect = render_effect(
    () => {
      const anchor = empty();
      const current = block.dom;
      if (current !== null) {
        remove(current);
        block.dom = null;
      }
      document.head.appendChild(anchor);
      render_fn(anchor);
    },
    block,
    false
  );
  push_destroy_fn(head_effect, () => {
    const current = block.dom;
    if (current !== null) {
      remove(current);
    }
  });
  block.effect = head_effect;
}
function element(anchor_node, tag_fn, render_fn, is_svg = false) {
  const block = create_dynamic_element_block();
  hydrate_block_anchor(anchor_node);
  let has_mounted = false;
  let tag;
  let element2 = null;
  const element_effect = render_effect(
    () => {
      tag = is_signal(tag_fn) ? get(tag_fn) : typeof tag_fn === "function" ? tag_fn() : tag_fn;
      if (has_mounted) {
        execute_effect(render_effect_signal);
      }
      has_mounted = true;
    },
    block,
    false
  );
  const render_effect_signal = render_effect(
    () => {
      const next_element = tag ? is_svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag) : null;
      const prev_element = element2;
      if (prev_element !== null) {
        block.dom = null;
      }
      element2 = next_element;
      if (element2 !== null && render_fn !== null) {
        const anchor = empty();
        element2.appendChild(anchor);
        render_fn(element2, anchor);
      }
      if (prev_element !== null) {
        remove(prev_element);
      }
      insert(
        element2,
        null,
        anchor_node
      );
    },
    block,
    true
  );
  push_destroy_fn(element_effect, () => {
    if (element2 !== null) {
      remove(element2);
      block.dom = null;
      element2 = null;
    }
    destroy_signal(render_effect_signal);
  });
  block.effect = element_effect;
}
function component(anchor_node, component_fn, render_fn) {
  const block = create_dynamic_component_block();
  hydrate_block_anchor(anchor_node);
  let component2 = null;
  let has_mounted = false;
  const component_effect = render_effect(
    () => {
      component2 = component_fn();
      if (has_mounted) {
        execute_effect(render_effect_signal);
      }
      has_mounted = true;
    },
    block,
    false
  );
  const render_effect_signal = render_effect(
    () => {
      const current = block.dom;
      if (current !== null) {
        remove(current);
        block.dom = null;
      }
      if (component2) {
        render_fn(component2);
      }
    },
    block,
    true
  );
  push_destroy_fn(component_effect, () => {
    const current = block.dom;
    if (current !== null) {
      remove(current);
    }
    destroy_signal(render_effect_signal);
  });
  block.effect = component_effect;
}
function await_block(anchor_node, input, pending_fn, then_fn, catch_fn) {
  const block = create_await_block();
  hydrate_block_anchor(anchor_node);
  let latest_token;
  let resolved_value = UNINITIALIZED;
  let error = UNINITIALIZED;
  let current_render_effect = null;
  let prev_render_effect = null;
  let prev_current = null;
  let current = null;
  let transitions = /* @__PURE__ */ new Set();
  let prev_transitions = null;
  block.transition = (transition2) => {
    transitions.add(transition2);
    transition2.finished(() => {
      if (prev_transitions !== null) {
        prev_transitions.delete(transition2);
        if (prev_transitions.size === 0) {
          if (prev_render_effect !== null) {
            if (prev_current !== null) {
              remove(prev_current);
              prev_current = null;
            }
            destroy_signal(prev_render_effect);
          }
          prev_transitions = null;
        }
      }
    });
  };
  const create_render_effect = () => {
    current_render_effect = render_effect(
      () => {
        if (error === UNINITIALIZED) {
          if (resolved_value === UNINITIALIZED) {
            if (pending_fn !== null) {
              pending_fn(anchor_node);
            }
          } else if (then_fn !== null) {
            then_fn(anchor_node, resolved_value);
          }
        } else if (catch_fn !== null) {
          catch_fn(anchor_node, error);
        }
        current = block.dom;
        block.dom = null;
      },
      block,
      true,
      true
    );
  };
  const render = () => {
    if (transitions.size === 0) {
      if (current !== null) {
        remove(current);
        current = null;
      }
      if (current_render_effect) {
        execute_effect(current_render_effect);
      } else {
        create_render_effect();
      }
    } else {
      if (prev_transitions !== null && prev_render_effect !== null) {
        if (prev_current !== null) {
          remove(prev_current);
          prev_current = null;
        }
        destroy_signal(prev_render_effect);
      }
      prev_transitions = transitions;
      transitions = /* @__PURE__ */ new Set();
      prev_current = current;
      prev_render_effect = current_render_effect;
      create_render_effect();
      trigger_transitions(prev_transitions, "out");
    }
  };
  const await_effect = render_effect(
    () => {
      const token = {};
      latest_token = token;
      const promise = is_signal(input) ? get(input) : typeof input === "function" ? input() : input;
      if (is_promise(promise)) {
        promise.then(
          (v) => {
            if (latest_token === token) {
              flushSync();
              resolved_value = v;
              render();
            }
          },
          (_error) => {
            error = _error;
            render();
          }
        );
        if (resolved_value !== UNINITIALIZED || error !== UNINITIALIZED) {
          error = UNINITIALIZED;
          resolved_value = UNINITIALIZED;
        }
        render();
      } else {
        error = UNINITIALIZED;
        resolved_value = promise;
        render();
      }
    },
    block,
    false
  );
  push_destroy_fn(await_effect, () => {
    latest_token = {};
    if (prev_current !== null) {
      remove(prev_current);
    }
    if (current !== null) {
      remove(current);
    }
    if (current_render_effect !== null) {
      destroy_signal(current_render_effect);
    }
    if (prev_render_effect !== null) {
      destroy_signal(prev_render_effect);
    }
  });
  block.effect = await_effect;
}
function try_block(try_fn, catch_fn, error_event_fn) {
  const block = create_try_block();
  let error = null;
  block.state = (_error) => {
    try {
      if (error_event_fn !== null) {
        error_event_fn(_error);
      }
      error = _error;
      execute_effect(try_effect);
    } catch {
    }
  };
  const try_effect = render_effect(
    () => {
      const current = block.dom;
      if (current !== null) {
        remove(current);
        block.dom = null;
      }
      if (error === null) {
        try_fn();
      } else if (catch_fn !== null) {
        catch_fn(error);
      }
    },
    block,
    true,
    false
  );
  schedule_effect(try_effect, true);
  push_destroy_fn(try_effect, () => {
    const current = block.dom;
    if (current !== null) {
      remove(current);
    }
  });
  block.effect = try_effect;
}
function key(anchor_node, key2, render_fn) {
  const block = create_key_block();
  hydrate_block_anchor(anchor_node);
  let has_mounted = false;
  let key_value = UNINITIALIZED;
  let render_effect_signal;
  let prev_render_effect = null;
  let prev_current = null;
  let current = null;
  let transitions = /* @__PURE__ */ new Set();
  let prev_transitions = null;
  block.transition = (transition2) => {
    transitions.add(transition2);
    transition2.finished(() => {
      if (prev_transitions !== null) {
        prev_transitions.delete(transition2);
        if (prev_transitions.size === 0) {
          if (prev_render_effect !== null) {
            if (prev_current !== null) {
              remove(prev_current);
              prev_current = null;
            }
            destroy_signal(prev_render_effect);
          }
          prev_transitions = null;
        }
      }
    });
  };
  const key_effect = render_effect(
    () => {
      const prev_key_value = key_value;
      if (is_signal(key2)) {
        key_value = get(key2);
      } else if (typeof key2 === "function") {
        key_value = key2();
      }
      if (has_mounted && safe_not_equal(prev_key_value, key_value)) {
        if (transitions.size === 0) {
          if (current !== null) {
            remove(current);
            current = null;
          }
          execute_effect(render_effect_signal);
        } else {
          if (prev_transitions !== null && prev_render_effect !== null) {
            if (prev_current !== null) {
              remove(prev_current);
              prev_current = null;
            }
            destroy_signal(prev_render_effect);
          }
          prev_transitions = transitions;
          transitions = /* @__PURE__ */ new Set();
          prev_current = current;
          prev_render_effect = render_effect_signal;
          create_render_effect();
          trigger_transitions(prev_transitions, "out");
        }
      }
      has_mounted = true;
    },
    block,
    false
  );
  const create_render_effect = () => {
    render_effect_signal = render_effect(
      () => {
        render_fn(anchor_node);
        current = block.dom;
        block.dom = null;
      },
      block,
      true,
      true
    );
  };
  create_render_effect();
  push_destroy_fn(key_effect, () => {
    if (prev_current !== null) {
      remove(prev_current);
    }
    if (current !== null) {
      remove(current);
    }
    destroy_signal(render_effect_signal);
    if (prev_render_effect !== null) {
      destroy_signal(prev_render_effect);
    }
  });
  block.effect = key_effect;
}
function update_each_item_block(block, item, index, type) {
  const reactive_index = (type & EACH_INDEX_REACTIVE) !== 0;
  if ((type & EACH_ITEM_REACTIVE) !== 0) {
    if (reactive_index) {
      set_signal_value(block.index, index);
    }
    set_signal_value(block.item, item);
  } else if (reactive_index) {
    set_signal_value(block.index, index);
  }
}
function destroy_each_item_block(block, transition_block, apply_transitions, controlled = false) {
  const transitions = block.transitions;
  if (apply_transitions && transitions !== null) {
    trigger_transitions(transitions, "out");
    if (transition_block !== null) {
      transition_block.push(block);
    }
  } else {
    const current = block.dom;
    if (!controlled && current !== null) {
      remove(current);
    }
    destroy_signal(block.effect);
  }
}
function each_item_transition(transition2) {
  const block = this;
  let transitions = block.transitions;
  if (transitions === null) {
    block.transitions = transitions = /* @__PURE__ */ new Set();
  }
  transition2.finished(() => {
    if (transitions !== null) {
      transitions.delete(transition2);
      if (transitions.size === 0) {
        block.transitions = null;
        destroy_each_item_block(block, null, true);
      }
    }
  });
  transitions.add(transition2);
}
function trigger_transitions(transitions, target_direction) {
  for (const transition2 of transitions) {
    const direction = transition2.direction;
    if ((direction === "in" || direction === "both") && target_direction === "in") {
      transition2.in();
    } else if ((direction === "out" || direction === "both") && target_direction === "out") {
      transition2.out();
    }
  }
}
function render_each_item_block(block) {
  block.render_fn(null, block.item, block.index);
}
function each_item_block(item, key2, index, render_fn, type) {
  const item_value = (type & EACH_ITEM_REACTIVE) === 0 || is_signal(item) ? item : source(item);
  const index_value = (type & EACH_INDEX_REACTIVE) === 0 || is_signal(index) ? index : source(index);
  const block = create_each_item_block(render_fn, item_value, index_value, key2);
  block.transition = each_item_transition;
  const effect2 = render_effect(render_each_item_block, block, true);
  block.effect = effect2;
  return block;
}
function each(anchor_node, collection, type, key_fn, render_fn, fallback_fn) {
  const block = create_each_block();
  const is_controlled = (type & EACH_IS_CONTROLLED) !== 0;
  hydrate_block_anchor(anchor_node, is_controlled);
  let fallback = false;
  let has_mounted = false;
  let array;
  let keys = null;
  const each2 = render_effect(
    () => {
      const maybe_array = collection();
      array = is_array(maybe_array) ? maybe_array : maybe_array == null ? [] : Array.from(maybe_array);
      if (key_fn !== null) {
        const length = array.length;
        keys = Array(length);
        for (let i = 0; i < length; i++) {
          keys[i] = key_fn(array[i]);
        }
      }
      if (has_mounted) {
        execute_effect(render);
      }
    },
    block,
    false
  );
  const render = render_effect(
    () => {
      const current = block.dom;
      if (fallback && current !== null) {
        remove(current);
        block.items = [];
        fallback = false;
      }
      if ((type & EACH_KEYED) !== 0) {
        reconcile_tracked_array(
          array,
          block,
          anchor_node,
          is_controlled,
          render_fn,
          keys,
          type,
          true
        );
      } else {
        reconcile_indexed_array(array, block, anchor_node, is_controlled, render_fn, type, true);
      }
      if (fallback_fn !== null && array.length === 0) {
        let anchor = anchor_node;
        if (is_controlled) {
          anchor = empty();
          anchor_node.appendChild(anchor);
        }
        block.dom = null;
        fallback = true;
        fallback_fn(anchor);
      }
      has_mounted = true;
    },
    block,
    true
  );
  push_destroy_fn(each2, () => {
    const current = block.dom;
    if (fallback) {
      if (current !== null) {
        remove(current);
      }
    } else {
      reconcile_indexed_array([], block, anchor_node, is_controlled, render_fn, type, false);
    }
    destroy_signal(render);
  });
  block.effect = each2;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function html(dom, value, svg) {
  const html_dom = reconcile_html(dom, value, svg);
  render_effect(() => () => {
    remove(html_dom);
  });
  return dom;
}
function css_style_from_camel_case(style2) {
  const parts = style2.split("-");
  if (parts.length === 1)
    return parts[0];
  return parts[0] + parts.slice(1).map((word) => word[0].toUpperCase() + word.slice(1)).join("");
}
function css_to_keyframe(css) {
  const keyframe = {};
  const parts = css.split(";");
  for (const part of parts) {
    const [property, value] = part.split(":");
    if (!property)
      break;
    const formatted_property = css_style_from_camel_case(property.trim());
    keyframe[formatted_property] = value.trim();
  }
  return keyframe;
}
function create_transition(dom, payload, direction) {
  let curr_direction = "in";
  let subs = [];
  const duration = payload.duration ?? 0;
  const delay = payload.delay ?? 0;
  const css_fn = payload.css;
  const linear = (t) => t;
  const easing_fn = payload.easing || linear;
  const keyframes = [];
  let animation = null;
  for (let i = 0; i < duration; i += 10) {
    const time = i / duration;
    keyframes.push(css_to_keyframe(css_fn(easing_fn(time))));
  }
  if (direction === "out") {
    keyframes.reverse();
  }
  const create_animation = () => {
    animation = dom.animate(keyframes, {
      duration,
      endDelay: delay,
      delay,
      fill: "both"
    });
    animation.pause();
    animation.onfinish = () => {
      animation.pause();
      if (curr_direction === "out") {
        for (const sub of subs) {
          sub();
        }
        subs = [];
      }
    };
  };
  return {
    finished(fn) {
      subs.push(fn);
    },
    in(skip) {
      if (animation === null) {
        create_animation();
      }
      if (curr_direction !== "in") {
        animation.reverse();
      }
      if (skip) {
        animation.finish();
      } else {
        animation.play();
      }
      curr_direction = "in";
    },
    out() {
      if (animation === null) {
        create_animation();
      }
      if (direction === "both" && curr_direction !== "out") {
        animation.reverse();
      } else {
        animation.play();
      }
      curr_direction = "out";
    },
    direction
  };
}
function is_transition_block(block) {
  return block.type === IF_BLOCK || block.type === EACH_ITEM_BLOCK || block.type === KEY_BLOCK || block.type === AWAIT_BLOCK;
}
function bind_transition(dom, transition_fn, _props, direction, global) {
  const block = current_block;
  let props;
  render_effect(() => {
    props = is_signal(_props) ? get(_props) : typeof _props === "function" ? _props() : _props;
  });
  let skip_intro = true;
  let transition_block = block;
  while (transition_block !== null) {
    if (is_transition_block(transition_block)) {
      if (transition_block.type === EACH_ITEM_BLOCK) {
        transition_block = transition_block.parent;
      }
      skip_intro = transition_block.effect === null;
      if (!global) {
        break;
      }
    } else if (transition_block.type === ROOT_BLOCK && transition_block.effect !== null) {
      skip_intro = false;
    }
    transition_block = transition_block.parent;
  }
  effect(() => {
    const payload = untrack(() => transition_fn(dom, props, { direction }));
    const transition2 = create_transition(dom, payload, direction);
    const effect2 = managed_pre_effect(() => {
      destroy_signal(effect2);
      if (direction === "in" || direction === "both") {
        transition2.in(skip_intro);
      }
      if (direction === "out" || direction === "both") {
        let transition_block2 = block;
        while (transition_block2 !== null) {
          if (is_transition_block(transition_block2)) {
            if (transition_block2.transition !== null) {
              transition_block2.transition(transition2);
            }
            if (!global) {
              break;
            }
          }
          transition_block2 = transition_block2.parent;
        }
      }
    });
  });
}
function transition(dom, transition_fn, props, global = false) {
  bind_transition(dom, transition_fn, props, "both", global);
}
function in_fn(dom, transition_fn, props, global = false) {
  bind_transition(dom, transition_fn, props, "in", global);
}
function out(dom, transition_fn, props, global = false) {
  bind_transition(dom, transition_fn, props, "out", global);
}
function action(dom, action2, value_fn) {
  let payload = void 0;
  effect(() => {
    if (value_fn) {
      const value = value_fn();
      untrack(() => {
        if (payload === void 0) {
          payload = action2(dom, value);
        } else {
          const update = payload.update;
          if (typeof update === "function") {
            update(value);
          }
        }
      });
    } else {
      untrack(() => payload = action2(dom));
    }
  });
  effect(() => {
    if (payload !== void 0) {
      const destroy = payload.destroy;
      if (typeof destroy === "function") {
        return () => {
          destroy();
        };
      }
    }
  });
}
function attr(dom, attribute, value) {
  if (typeof value === "function") {
    render_effect(() => {
      const string = value();
      attr(dom, attribute, string);
    });
  } else {
    if (value == null) {
      dom.removeAttribute(attribute);
    } else {
      dom.setAttribute(attribute, value);
    }
  }
}
function xlink_attr(dom, attribute, value) {
  if (typeof value === "function") {
    render_effect(() => {
      const string = value();
      xlink_attr(dom, attribute, string);
    });
  } else {
    dom.setAttributeNS("http://www.w3.org/1999/xlink", attribute, value);
  }
}
function style(dom, key2, value, important) {
  if (value == null) {
    dom.style.removeProperty(key2);
  } else {
    dom.style.setProperty(key2, value, important ? "important" : "");
  }
}
var always_set_through_set_attribute = ["width", "height"];
function spread_attributes(dom, prev, attrs, css_hash) {
  const next = Object.assign({}, ...attrs);
  const has_hash = css_hash.length !== 0;
  if (prev !== null) {
    for (const key2 in prev) {
      if (!(key2 in next)) {
        next[key2] = null;
      }
    }
  }
  if (has_hash && !next.class) {
    next.class = "";
  }
  const descriptors = Object.getOwnPropertyDescriptors(dom.__proto__);
  for (const key2 in next) {
    let value = next[key2];
    if (has_hash && key2 === "class") {
      if (value)
        value += " ";
      value += css_hash;
    }
    if (value == null) {
      dom.removeAttribute(key2);
    } else if (key2 === "style") {
      dom.style.cssText = value + "";
    } else if (key2 === "autofocus") {
      auto_focus(dom, Boolean(value));
    } else if (key2 === "__value" || key2 === "value") {
      dom.value = dom[key2] = dom.__value = value;
    } else if (descriptors[key2] && descriptors[key2].set && always_set_through_set_attribute.indexOf(key2) === -1) {
      dom[key2] = value;
    } else {
      attr(dom, key2, value);
    }
  }
  return next;
}
function rest_props(props_signal, rest) {
  return derived(() => {
    const props = unwrap(props_signal);
    const rest_props2 = {};
    let key2;
    for (key2 in props) {
      if (rest.includes(key2)) {
        continue;
      }
      const desc = get_descriptor(props, key2);
      const getter = desc.get;
      if (getter !== void 0) {
        Object.defineProperty(rest_props2, key2, {
          enumerable: true,
          configurable: true,
          get: getter
        });
      } else if (desc.get !== void 0) {
        rest_props2[key2] = props[key2];
      } else {
        Object.defineProperty(rest_props2, key2, {
          enumerable: true,
          configurable: true,
          value: props[key2]
        });
      }
    }
    return rest_props2;
  });
}
function spread_props(props) {
  if (typeof props === "function") {
    return derived(() => {
      return spread_props(props());
    });
  }
  const merged_props = {};
  let key2;
  for (let i = 0; i < props.length; i++) {
    const obj = props[i];
    for (key2 in obj) {
      const desc = get_descriptor(obj, key2);
      const getter = desc.get;
      if (getter !== void 0) {
        Object.defineProperty(merged_props, key2, {
          enumerable: true,
          configurable: true,
          get: getter
        });
      } else if (desc.get !== void 0) {
        merged_props[key2] = obj[key2];
      } else {
        Object.defineProperty(merged_props, key2, {
          enumerable: true,
          configurable: true,
          value: obj[key2]
        });
      }
    }
  }
  return merged_props;
}
function unwrap(value) {
  if (is_signal(value)) {
    return get(value);
  }
  return value;
}
function mount(component2, container) {
  const registered_events = /* @__PURE__ */ new Set();
  const block = create_root_block(container);
  const first_child = container.firstChild;
  const hydration_fragment = get_hydration_fragment(first_child);
  const previous_hydration_fragment = current_hydration_fragment;
  try {
    let anchor = null;
    if (hydration_fragment === null) {
      anchor = empty();
      container.appendChild(anchor);
    }
    set_current_hydration_fragment(hydration_fragment);
    const effect2 = render_effect(() => component2(anchor), block, true);
    block.effect = effect2;
  } catch (error) {
    if (hydration_fragment !== null) {
      console.error(
        "Hydration failed because the initial UI does not match what was rendered on the server."
      );
      remove(hydration_fragment);
      first_child.remove();
      hydration_fragment.at(-1)?.nextSibling?.remove();
      mount(component2, container);
    } else {
      throw error;
    }
  } finally {
    set_current_hydration_fragment(previous_hydration_fragment);
  }
  const bound_event_listener = handle_event_propagation.bind(null, container);
  const event_handle = (events) => {
    for (let i = 0; i < events.length; i++) {
      const event_name = events[i];
      if (!registered_events.has(event_name)) {
        registered_events.add(event_name);
        container.addEventListener(
          event_name,
          bound_event_listener,
          passive_delegated_events.has(event_name) ? {
            passive: true
          } : void 0
        );
      }
    }
  };
  event_handle(array_from(all_registerd_events));
  root_event_handles.add(event_handle);
  return () => {
    for (const event_name of registered_events) {
      container.removeEventListener(
        event_name,
        bound_event_listener,
        passive_delegated_events.has(event_name) ? {
          passive: true
        } : void 0
      );
    }
    root_event_handles.delete(event_handle);
    const current = block.dom;
    if (current !== null) {
      remove(current);
    }
    if (hydration_fragment !== null) {
      remove(hydration_fragment);
    }
    destroy_signal(block.effect);
  };
}
function access_props(props) {
  for (const prop2 in props) {
    props[prop2];
  }
}
function compile_error(message, filename, code_highlights) {
  const page = document.createElement("div");
  const container = document.createElement("div");
  const pre = document.createElement("pre");
  const h1 = document.createElement("h1");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  h1.textContent = "Compilation Error";
  h2.textContent = message;
  p.textContent = filename;
  pre.appendChild(h1);
  pre.appendChild(h2);
  if (code_highlights) {
    const code_container = document.createElement("div");
    for (const line of code_highlights) {
      const code_line = document.createElement("div");
      const code_line_number = document.createElement("span");
      code_line_number.textContent = String(line.line);
      const code_source = document.createElement("span");
      code_source.textContent = line.source;
      if (line.highlight) {
        code_line.style.cssText = "padding:8px;background:#333;color:#fff";
      } else {
        code_line.style.cssText = "padding:8px;background:#000;color:#999";
      }
      code_line_number.style.cssText = "color:#888;padding:0 15px 0 5px;text-align:right;";
      code_line.appendChild(code_line_number);
      code_line.appendChild(code_source);
      code_container.appendChild(code_line);
    }
    pre.appendChild(code_container);
  }
  h1.style.cssText = "color:#ff5555;font-weight:normal;margin-top:0;padding:0;font-size:20px;";
  h2.style.cssText = "color:#ccc;font-weight:normal;margin-top:0;padding:0;font-size:16px;white-space:normal;";
  p.style.cssText = "color: #999;";
  page.style.cssText = "z-index:9999;margin:0;position:fixed;top: 0;left: 0;height:100%;width:100%;background:rgba(0,0,0,0.66)";
  container.style.cssText = `background:#181818;margin:30px auto;padding:25px 40px;position:relative;color:#d8d8d8;border-radius:6px 6px 8px 8px;width:800px;font-family:'SF Mono', SFMono-Regular, ui-monospace,'DejaVu Sans Mono', Menlo, Consolas, monospace;;border-top:8px solid #ff5555;`;
  pre.appendChild(p);
  container.appendChild(pre);
  page.appendChild(container);
  document.body.appendChild(page);
  console.error("[Compilation Error] " + message);
}

export {
  validate_store,
  validate_dynamic_component,
  validate_void_dynamic_element,
  child,
  child_frag,
  sibling,
  $window,
  $document,
  template,
  svg_template,
  svg_replace,
  open,
  open_frag,
  close,
  close_frag,
  trusted,
  self,
  stopPropagation,
  once,
  stopImmediatePropagation,
  preventDefault,
  event,
  class_name,
  text,
  auto_focus,
  to_class,
  class_toggle,
  select_option,
  bind_online,
  selected,
  bind_value,
  bind_select_value,
  bind_content_editable,
  bind_group,
  bind_checked,
  bind_scroll,
  bind_property,
  bind_prop,
  bind_this,
  delegate,
  slot,
  if_block,
  head,
  element,
  component,
  await_block,
  try_block,
  key,
  update_each_item_block,
  destroy_each_item_block,
  trigger_transitions,
  each_item_block,
  each,
  stringify,
  html,
  bind_transition,
  transition,
  in_fn,
  out,
  action,
  attr,
  xlink_attr,
  style,
  spread_attributes,
  rest_props,
  spread_props,
  unwrap,
  mount,
  access_props,
  compile_error
};
//# sourceMappingURL=chunk-VB2NFNXM.js.map
