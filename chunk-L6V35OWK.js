import {
  AWAIT_BLOCK,
  DYNAMIC_COMPONENT_BLOCK,
  EACH_BLOCK,
  EACH_INDEX_REACTIVE,
  EACH_IS_ANIMATED,
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
  current_effect,
  current_untracking,
  define_property,
  derived,
  destroy_signal,
  effect,
  execute_effect,
  exposable,
  expose,
  flushSync,
  get,
  is_array,
  is_signal,
  managed_effect,
  managed_pre_effect,
  mark_subtree_inert,
  object_ref,
  push_destroy_fn,
  render_effect,
  safe_equal,
  safe_not_equal,
  schedule_effect,
  set,
  set_signal_value,
  set_untracking,
  source,
  untrack
} from "./chunk-MJHIVLLY.js";
import {
  is_promise
} from "./chunk-CAF54RTH.js";

// src/internal/client/hydration.js
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
      const data = (
        /** @type {Comment} */
        current_node.data
      );
      if (data.startsWith("ssr:")) {
        const depth = data.slice(4);
        if (target_depth === null) {
          target_depth = depth;
        } else if (depth === target_depth) {
          return fragment;
        } else {
          fragment.push(
            /** @type {Text | Comment | Element} */
            current_node
          );
        }
        current_node = next_sibling;
        continue;
      }
    }
    if (target_depth !== null) {
      fragment.push(
        /** @type {Text | Comment | Element} */
        current_node
      );
    }
    current_node = next_sibling;
  }
  return null;
}
function hydrate_block_anchor(anchor_node, is_controlled) {
  let target_node = anchor_node;
  if (current_hydration_fragment !== null) {
    if (is_controlled) {
      target_node = /** @type {Node} */
      target_node.firstChild;
    }
    if (target_node.nodeType === 8) {
      let fragment = target_node.$$fragment;
      if (fragment === void 0) {
        fragment = get_hydration_fragment(target_node);
        target_node.$$fragment = void 0;
      }
      set_current_hydration_fragment(fragment);
    } else {
      set_current_hydration_fragment([
        /** @type {Element} */
        target_node.firstChild
      ]);
    }
  }
}

// src/internal/client/operations.js
var node_prototype = Node.prototype;
var element_prototype = Element.prototype;
var event_target_prototype = EventTarget.prototype;
var append_child_method = node_prototype.appendChild;
var clone_node_method = node_prototype.cloneNode;
event_target_prototype.__click = void 0;
event_target_prototype.__nodeValue = " ";
event_target_prototype.__className = "";
var get_descriptor = /* @__NO_SIDE_EFFECTS__ */ (o, p) => object_ref.getOwnPropertyDescriptor(o, p);
var first_child_get = (
  /** @type {(this: Node) => ChildNode | null} */
  // @ts-ignore
  (/* @__PURE__ */ get_descriptor(node_prototype, "firstChild")).get
);
var next_sibling_get = (
  /** @type {(this: Node) => ChildNode | null} */
  // @ts-ignore
  (/* @__PURE__ */ get_descriptor(node_prototype, "nextSibling")).get
);
var text_content_set = (
  /** @type {(this: Node, text: string ) => void} */
  // @ts-ignore
  (/* @__PURE__ */ get_descriptor(node_prototype, "textContent")).set
);
var class_name_set = (
  /** @type {(this: Element, class_name: string) => void} */
  // @ts-ignore
  (/* @__PURE__ */ get_descriptor(element_prototype, "className")).set
);
function append_child(element2, child2) {
  append_child_method.call(element2, child2);
}
// @__NO_SIDE_EFFECTS__
function clone_node(node, deep) {
  return (
    /** @type {N} */
    clone_node_method.call(node, deep)
  );
}
// @__NO_SIDE_EFFECTS__
function child(node) {
  const child2 = first_child_get.call(node);
  if (current_hydration_fragment !== null && child2 !== null) {
    return capture_fragment_from_node(child2);
  }
  return child2;
}
// @__NO_SIDE_EFFECTS__
function child_frag(node) {
  if (current_hydration_fragment !== null) {
    const first_node = (
      /** @type {Node[]} */
      node[0]
    );
    if (current_hydration_fragment !== null && first_node !== null) {
      return capture_fragment_from_node(first_node);
    }
    return first_node;
  }
  return first_child_get.call(
    /** @type {Node} */
    node
  );
}
// @__NO_SIDE_EFFECTS__
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
  if (node.nodeType === 8 && /** @type {Comment} */
  node.data.startsWith("ssr:") && /** @type {Array<Element | Text | Comment>} */
  current_hydration_fragment.at(-1) !== node) {
    const fragment = (
      /** @type {Array<Element | Text | Comment>} */
      get_hydration_fragment(node)
    );
    const last_child = fragment.at(-1) || node;
    const target = (
      /** @type {Node} */
      last_child.nextSibling
    );
    target.$$fragment = fragment;
    return target;
  }
  return node;
}
var $window = window;
var $document = document;

// src/internal/client/reconciler.js
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
        append_child(
          /** @type {Element} */
          parent_element,
          /** @type {Node} */
          node
        );
      } else {
        sibling2.before(
          /** @type {Node} */
          node
        );
      }
    }
    return current[0];
  } else if (current !== null) {
    if (sibling2 === null) {
      append_child(
        /** @type {Element} */
        parent_element,
        /** @type {Node} */
        current
      );
    } else {
      sibling2.before(
        /** @type {Node} */
        current
      );
    }
  }
  return (
    /** @type {Text | Element | Comment} */
    current
  );
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
  return (
    /** @type {Element | Comment | Text} */
    first_node
  );
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
    content = /** @type {DocumentFragment} */
    /** @type {unknown} */
    content.firstChild;
  }
  const clone = content.cloneNode(true);
  frag_nodes = Array.from(clone.childNodes);
  target.before(svg ? (
    /** @type {Node} */
    clone.firstChild
  ) : clone);
  return (
    /** @type {Array<Text | Comment | Element>} */
    frag_nodes
  );
}
function insert_each_item_block(block, dom, is_controlled, sibling2) {
  const current = (
    /** @type {import('./types.js').TemplateNode} */
    block.dom
  );
  if (sibling2 === null) {
    if (is_controlled) {
      return insert(
        current,
        /** @type {Element} */
        dom,
        null
      );
    } else {
      return insert(
        current,
        /** @type {Element} */
        dom.parentNode,
        dom
      );
    }
  }
  return insert(current, null, sibling2);
}
function get_first_child(block) {
  const current = block.dom;
  if (is_array(current)) {
    return (
      /** @type {Text | Element | Comment} */
      current[0]
    );
  }
  return (
    /** @type {Text | Element | Comment} */
    current
  );
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
function reconcile_indexed_array(array, each_block, dom, is_controlled, render_fn, flags, apply_transitions) {
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
      destroy_each_item_block(block, active_transitions, apply_transitions, is_controlled);
    }
  } else {
    let item;
    let block;
    b_blocks = Array(b);
    if (current_hydration_fragment !== null) {
      let hydrating_node = current_hydration_fragment[0];
      for (; index < length; index++) {
        item = array[index];
        const fragment = (
          /** @type {Array<Text | Comment | Element>} */
          get_hydration_fragment(hydrating_node)
        );
        set_current_hydration_fragment(fragment);
        hydrating_node = /** @type {Node} */
        /** @type {Node} */
        /** @type {Node} */
        fragment.at(-1).nextSibling.nextSibling;
        block = each_item_block(item, null, index, render_fn, flags);
        b_blocks[index] = block;
      }
    } else {
      for (; index < length; index++) {
        if (index >= a) {
          item = array[index];
          block = each_item_block(item, null, index, render_fn, flags);
          b_blocks[index] = block;
          insert_each_item_block(block, dom, is_controlled, null);
        } else if (index >= b) {
          block = a_blocks[index];
          destroy_each_item_block(block, active_transitions, apply_transitions);
        } else {
          item = array[index];
          block = a_blocks[index];
          b_blocks[index] = block;
          update_each_item_block(block, item, index, flags);
        }
      }
    }
  }
  each_block.items = b_blocks;
}
function reconcile_tracked_array(array, each_block, dom, is_controlled, render_fn, keys, flags, apply_transitions) {
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
    let key2;
    let item;
    let idx;
    b_blocks = Array(b);
    if (current_hydration_fragment !== null) {
      let fragment;
      let hydrating_node = current_hydration_fragment[0];
      while (b > 0) {
        idx = b_end - --b;
        item = array[idx];
        key2 = is_computed_key ? keys[idx] : item;
        fragment = /** @type {Array<Text | Comment | Element>} */
        get_hydration_fragment(hydrating_node);
        set_current_hydration_fragment(fragment);
        hydrating_node = /** @type {Node} */
        /** @type {Node} */
        (fragment.at(-1) || hydrating_node).nextSibling.nextSibling;
        block = each_item_block(item, key2, idx, render_fn, flags);
        b_blocks[idx] = block;
      }
    } else if (a === 0) {
      while (b > 0) {
        idx = b_end - --b;
        item = array[idx];
        key2 = is_computed_key ? keys[idx] : item;
        block = each_item_block(item, key2, idx, render_fn, flags);
        b_blocks[idx] = block;
        insert_each_item_block(block, dom, is_controlled, null);
      }
    } else {
      const should_update_block = (flags & EACH_ITEM_REACTIVE) !== 0 || (flags & EACH_INDEX_REACTIVE) !== 0;
      let start = 0;
      let sibling2 = null;
      item = array[b_end];
      key2 = is_computed_key ? keys[b_end] : item;
      outer:
        while (true) {
          while (a_blocks[a_end].key === key2) {
            block = a_blocks[a_end--];
            item = array[b_end];
            if (should_update_block) {
              update_each_item_block(block, item, b_end, flags);
            }
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
            if (should_update_block) {
              update_each_item_block(block, item, start, flags);
            }
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
          block = each_item_block(item, key2, b_end, render_fn, flags);
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
          a = item_index.get(
            /** @type {V} */
            a_blocks[b].key
          );
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
        const is_animated = (flags & EACH_IS_ANIMATED) !== 0;
        let should_create;
        if (is_animated) {
          let i = b_length;
          while (i-- > 0) {
            b_end = i + start;
            a = sources[i];
            if (pos === MOVED_BLOCK && a !== LIS_BLOCK) {
              block = b_blocks[b_end];
              update_each_item_block(block, item, b_end, flags);
            }
          }
        }
        while (b_length-- > 0) {
          b_end = b_length + start;
          a = sources[b_length];
          should_create = a === -1;
          item = array[b_end];
          if (should_create) {
            key2 = is_computed_key ? keys[b_end] : item;
            block = each_item_block(item, key2, b_end, render_fn, flags);
          } else {
            block = b_blocks[b_end];
            if (!is_animated && should_update_block) {
              update_each_item_block(block, item, b_end, flags);
            }
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

// src/internal/client/timing.js
var raf = {
  tick: (
    /** @param {any} _ */
    (_) => requestAnimationFrame(_)
  ),
  now: () => performance.now()
};

// src/internal/client/transitions.js
var active_tick_animations = /* @__PURE__ */ new Set();
var DELAY_NEXT_TICK = Number.MIN_SAFE_INTEGER;
var active_tick_ref = void 0;
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
function dispatch_event(dom, type) {
  dom.dispatchEvent(custom_event(type));
}
function css_style_from_camel_case(style2) {
  const parts = style2.split("-");
  if (parts.length === 1)
    return parts[0];
  return parts[0] + parts.slice(1).map(
    /** @param {any} word */
    (word) => word[0].toUpperCase() + word.slice(1)
  ).join("");
}
function css_to_keyframe(css) {
  const keyframe = {};
  const parts = css.split(";");
  for (const part of parts) {
    const [property, value] = part.split(":");
    if (!property || value === void 0)
      break;
    const formatted_property = css_style_from_camel_case(property.trim());
    keyframe[formatted_property] = value.trim();
  }
  return keyframe;
}
var TickAnimation = class {
  /** @type {null | (() => void)} */
  onfinish;
  /** @type {(t: number, u: number) => string} */
  #tick_fn;
  /** @type {number} */
  #duration;
  /** @type {number} */
  #current;
  /** @type {number} */
  #delay;
  /** @type {number} */
  #previous;
  /** @type {boolean} */
  paused;
  /** @type {boolean} */
  #reversed;
  /** @type {number} */
  #delay_current;
  /** @type {boolean} */
  #delayed_reverse;
  /**
   * @param {(t: number, u: number) => string} tick_fn
   * @param {number} duration
   * @param {number} delay
   * @param {boolean} out
   */
  constructor(tick_fn, duration, delay, out2) {
    this.#duration = duration;
    this.#delay = delay;
    this.paused = false;
    this.#tick_fn = tick_fn;
    this.#reversed = out2;
    this.#delay_current = delay;
    this.#current = out2 ? duration : 0;
    this.#previous = 0;
    this.#delayed_reverse = false;
    this.onfinish = null;
    if (this.#delay) {
      if (!out2) {
        this.#tick_fn(0, 1);
      }
    }
  }
  pause() {
    this.paused = true;
  }
  play() {
    this.paused = false;
    if (!active_tick_animations.has(this)) {
      this.#previous = raf.now();
      if (active_tick_ref === void 0) {
        active_tick_ref = raf.tick(handle_raf);
      }
      active_tick_animations.add(this);
    }
  }
  #reverse() {
    this.#reversed = !this.#reversed;
    if (this.paused) {
      if (this.#current === 0) {
        this.#current = this.#duration;
      }
      this.play();
    }
  }
  reverse() {
    if (this.#delay === 0) {
      this.#reverse();
    } else {
      this.#delay_current = this.#delay;
      this.#delayed_reverse = true;
    }
  }
  cancel() {
    const t = this.#reversed ? 1 : 0;
    active_tick_animations.delete(this);
    this.#tick_fn(t, 1 - t);
  }
  finish() {
    active_tick_animations.delete(this);
    if (this.onfinish) {
      this.onfinish();
    }
  }
  /** @param {number} time */
  _update(time) {
    let diff = time - this.#previous;
    this.#previous = time;
    if (this.#delay_current !== 0) {
      const is_delayed = this.#delay_current === DELAY_NEXT_TICK;
      let cancel = !this.#delayed_reverse;
      this.#delay_current -= diff;
      if (this.#delay_current < 0 || is_delayed || this.#delay_current === 0 && this.#reversed) {
        const delay_diff = is_delayed ? 0 : -this.#delay_current;
        this.#delay_current = 0;
        if (this.#delayed_reverse) {
          this.#delayed_reverse = false;
          this.#reverse();
        } else if (delay_diff !== 0 || this.#reversed) {
          diff = delay_diff;
        }
        cancel = false;
      } else if (this.#delay_current === 0) {
        this.#delay_current = DELAY_NEXT_TICK;
      }
      if (cancel) {
        return;
      }
    }
    this.#current += this.#reversed ? -diff : diff;
    let t = this.#current / this.#duration;
    if (t < 0) {
      t = 0;
    } else if (t > 1) {
      t = 1;
    }
    if (this.#reversed && t <= 0 || !this.#reversed && t >= 1) {
      t = this.#reversed ? 0 : 1;
      if (this.#delay_current === 0) {
        active_tick_animations.delete(this);
        if (this.onfinish) {
          this.paused = true;
          this.onfinish();
        }
      }
    }
    this.#tick_fn(t, 1 - t);
  }
};
function handle_raf(time) {
  for (const animation of active_tick_animations) {
    if (!animation.paused) {
      animation._update(time);
    }
  }
  if (active_tick_animations.size !== 0) {
    active_tick_ref = raf.tick(handle_raf);
  } else {
    active_tick_ref = void 0;
  }
}
function create_transition(dom, init, direction, effect2) {
  let curr_direction = "in";
  let subs = [];
  let animation = null;
  let cancelled = false;
  const create_animation = () => {
    let payload = (
      /** @type {import('./types.js').TransitionPayload} */
      transition2.payload
    );
    if (typeof payload === "function") {
      payload = payload({ direction: curr_direction });
    }
    const duration = payload.duration ?? 300;
    const delay = payload.delay ?? 0;
    const css_fn = payload.css;
    const tick_fn = payload.tick;
    const linear = (t) => t;
    const easing_fn = payload.easing || linear;
    const keyframes = [];
    if (typeof tick_fn === "function") {
      animation = new TickAnimation(tick_fn, duration, delay, direction === "out");
    } else {
      if (typeof css_fn === "function") {
        const frame_time = 16.666;
        const max_duration = Math.max(duration, frame_time);
        for (let i = 0; i <= max_duration; i += frame_time) {
          let time;
          if (i + frame_time > max_duration) {
            time = 1;
          } else if (i === 0) {
            time = 0;
          } else {
            time = i / max_duration;
          }
          keyframes.push(css_to_keyframe(css_fn(easing_fn(time), 1 - time)));
        }
        if (direction === "out") {
          keyframes.reverse();
        }
      }
      animation = dom.animate(keyframes, {
        duration,
        endDelay: delay,
        delay,
        fill: "both"
      });
    }
    animation.pause();
    animation.onfinish = () => {
      const is_outro = curr_direction === "out";
      animation.pause();
      if (is_outro) {
        for (const sub of subs) {
          sub();
        }
        subs = [];
      }
      dispatch_event(dom, is_outro ? "outroend" : "introend");
    };
  };
  const transition2 = {
    effect: effect2,
    init,
    payload: null,
    /** @param {() => void} fn */
    finished(fn) {
      subs.push(fn);
    },
    in() {
      const needs_reverse = curr_direction !== "in";
      curr_direction = "in";
      if (animation === null || cancelled) {
        cancelled = false;
        create_animation();
      }
      dispatch_event(dom, "introstart");
      if (needs_reverse) {
        animation.reverse();
      }
      animation.play();
    },
    out() {
      const needs_reverse = direction === "both" && curr_direction !== "out";
      curr_direction = "out";
      if (animation === null || cancelled) {
        cancelled = false;
        create_animation();
      }
      dispatch_event(dom, "outrostart");
      if (needs_reverse) {
        animation.reverse();
      } else {
        animation.play();
      }
    },
    cancel() {
      animation.cancel();
      cancelled = true;
    },
    cleanup() {
      for (const sub of subs) {
        sub();
      }
      subs = [];
    },
    direction,
    dom
  };
  return transition2;
}
function is_transition_block(block) {
  return block.type === IF_BLOCK || block.type === EACH_ITEM_BLOCK || block.type === KEY_BLOCK || block.type === AWAIT_BLOCK || block.type === DYNAMIC_COMPONENT_BLOCK || block.type === EACH_BLOCK && block.items.length === 0;
}
function bind_transition(dom, transition_fn, props_fn, direction, global) {
  const transition_effect = (
    /** @type {import('./types.js').EffectSignal} */
    current_effect
  );
  const block = current_block;
  const props = props_fn === null ? {} : props_fn();
  let skip_intro = true;
  let transition_block = block;
  while (transition_block !== null) {
    if (is_transition_block(transition_block)) {
      if (transition_block.type === EACH_ITEM_BLOCK) {
        transition_block = transition_block.parent;
      } else if (transition_block.type === AWAIT_BLOCK && transition_block.pending) {
        skip_intro = false;
      }
      if (skip_intro) {
        skip_intro = transition_block.effect === null;
      }
      if (!skip_intro || !global) {
        break;
      }
    } else if (transition_block.type === ROOT_BLOCK && (transition_block.effect !== null || transition_block.intro)) {
      skip_intro = false;
    }
    transition_block = transition_block.parent;
  }
  let transition2;
  effect(() => {
    const init = (from) => untrack(
      () => direction === "key" ? (
        /** @type {import('./types.js').AnimateFn<any>} */
        transition_fn(
          dom,
          { from: (
            /** @type {DOMRect} */
            from
          ), to: dom.getBoundingClientRect() },
          props,
          {}
        )
      ) : (
        /** @type {import('./types.js').TransitionFn<any>} */
        transition_fn(dom, props, {
          direction
        })
      )
    );
    transition2 = create_transition(dom, init, direction, transition_effect);
    const show_intro = !skip_intro && (direction === "in" || direction === "both");
    if (show_intro) {
      transition2.payload = transition2.init();
    }
    const effect2 = managed_pre_effect(() => {
      destroy_signal(effect2);
      dom.inert = false;
      if (show_intro) {
        transition2.in();
      }
      let transition_block2 = block;
      while (transition_block2 !== null) {
        const parent = transition_block2.parent;
        if (is_transition_block(transition_block2)) {
          if (transition_block2.transition !== null) {
            transition_block2.transition(transition2);
          }
          if (parent === null || !global && (transition_block2.type !== IF_BLOCK || parent.type !== IF_BLOCK || parent.current)) {
            break;
          }
        }
        transition_block2 = parent;
      }
    });
  });
  if (direction === "key") {
    effect(() => {
      return () => {
        transition2.cleanup();
      };
    });
  }
}

// src/internal/client/render.js
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
      cached_content = is_fragment ? content : (
        /** @type {Node} */
        child(content)
      );
    }
    return cached_content;
  };
}
// @__NO_SIDE_EFFECTS__
function svg_template(svg, is_fragment) {
  let cached_content;
  return () => {
    if (cached_content === void 0) {
      const content = (
        /** @type {Node} */
        child(create_fragment_from_html(`<svg>${svg}</svg>`))
      );
      cached_content = is_fragment ? content : (
        /** @type {Node} */
        child(content)
      );
    }
    return cached_content;
  };
}
function svg_replace(node) {
  const first_child = (
    /** @type {Element} */
    node.firstChild
  );
  node.replaceWith(first_child);
  return first_child;
}
function open_template(is_fragment, use_clone_node, anchor, template_element_fn) {
  if (current_hydration_fragment !== null) {
    if (anchor !== null) {
      hydrate_block_anchor(anchor, false);
    }
    const fragment = current_hydration_fragment;
    if (fragment !== null) {
      return is_fragment ? fragment : (
        /** @type {Element} */
        fragment[0]
      );
    }
  }
  return use_clone_node ? clone_node(
    /** @type {() => Element} */
    template_element_fn(),
    true
  ) : document.importNode(
    /** @type {() => Element} */
    template_element_fn(),
    true
  );
}
// @__NO_SIDE_EFFECTS__
function open(anchor, use_clone_node, template_element_fn) {
  return open_template(false, use_clone_node, anchor, template_element_fn);
}
// @__NO_SIDE_EFFECTS__
function open_frag(anchor, use_clone_node, template_element_fn) {
  return open_template(true, use_clone_node, anchor, template_element_fn);
}
function close_template(dom, is_fragment, anchor) {
  const block = (
    /** @type {import('./types.js').Block} */
    current_block
  );
  const current = is_fragment ? is_array(dom) ? dom : (
    /** @type {import('./types.js').TemplateNode[]} */
    Array.from(dom.childNodes)
  ) : dom;
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
    const event2 = (
      /** @type {Event} */
      args[0]
    );
    if (event2.isTrusted) {
      unwrap(fn).apply(this, args);
    }
  };
}
function self(fn) {
  return function(...args) {
    const event2 = (
      /** @type {Event} */
      args[0]
    );
    if (event2.target === this) {
      unwrap(fn).apply(this, args);
    }
  };
}
function stopPropagation(fn) {
  return function(...args) {
    const event2 = (
      /** @type {Event} */
      args[0]
    );
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
    const event2 = (
      /** @type {Event} */
      args[0]
    );
    event2.stopImmediatePropagation();
    return unwrap(fn).apply(this, args);
  };
}
function preventDefault(fn) {
  return function(...args) {
    const event2 = (
      /** @type {Event} */
      args[0]
    );
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
function class_name_effect(dom, value) {
  render_effect(() => {
    const string = value();
    class_name(dom, string);
  });
}
function class_name(dom, value) {
  const prev_class_name = dom.__className;
  const next_class_name = to_class(value);
  if (prev_class_name !== next_class_name) {
    if (next_class_name === "") {
      dom.removeAttribute("class");
    } else {
      set_class_name(dom, next_class_name);
    }
    dom.__className = next_class_name;
  }
}
function text_effect(dom, value) {
  render_effect(() => {
    const string = value();
    text(dom, string);
  });
}
function text(dom, value) {
  const prev_node_value = dom.__nodeValue;
  const next_node_value = stringify(value);
  if (prev_node_value !== next_node_value) {
    dom.nodeValue = next_node_value;
    dom.__nodeValue = next_node_value;
  }
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
  listen_to_events(window, ["online", "offline"], status_changed);
}
function time_ranges_to_array(ranges) {
  const array = [];
  for (let i = 0; i < ranges.length; i += 1) {
    array.push({ start: ranges.start(i), end: ranges.end(i) });
  }
  return array;
}
function bind_current_time(media, get_value, update) {
  let raf_id;
  let updating = false;
  const callback = () => {
    cancelAnimationFrame(raf_id);
    if (!media.paused) {
      raf_id = requestAnimationFrame(callback);
    }
    updating = true;
    update(media.currentTime);
  };
  raf_id = requestAnimationFrame(callback);
  media.addEventListener("timeupdate", callback);
  render_effect(() => {
    const value = get_value();
    if (!updating && !isNaN(
      /** @type {any} */
      value
    )) {
      media.currentTime = /** @type {number} */
      value;
    }
    updating = false;
  });
  render_effect(() => () => cancelAnimationFrame(raf_id));
}
function bind_buffered(media, update) {
  const callback = () => {
    update(time_ranges_to_array(media.buffered));
  };
  listen_to_events(media, ["loadedmetadata", "progress"], callback);
}
function bind_seekable(media, update) {
  const callback = () => {
    update(time_ranges_to_array(media.seekable));
  };
  listen_to_events(media, ["loadedmetadata"], callback);
}
function bind_played(media, update) {
  const callback = () => {
    update(time_ranges_to_array(media.played));
  };
  listen_to_events(media, ["timeupdate"], callback);
}
function bind_seeking(media, update) {
  const callback = () => {
    update(media.seeking);
  };
  listen_to_events(media, ["seeking", "seeked"], callback);
}
function bind_ended(media, update) {
  const callback = () => {
    update(media.ended);
  };
  listen_to_events(media, ["timeupdate", "ended"], callback);
}
function bind_ready_state(media, update) {
  const callback = () => {
    update(media.readyState);
  };
  listen_to_events(
    media,
    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing", "waiting", "emptied"],
    callback
  );
}
function bind_playback_rate(media, get_value, update) {
  let updating = false;
  const callback = () => {
    if (!updating) {
      update(media.playbackRate);
    }
    updating = false;
  };
  let render;
  let destroyed = false;
  const effect2 = managed_effect(() => {
    destroy_signal(effect2);
    if (destroyed)
      return;
    if (get_value() == null) {
      callback();
    }
    listen_to_events(media, ["ratechange"], callback, false);
    render = render_effect(() => {
      const value = get_value();
      if (!isNaN(
        /** @type {any} */
        value
      ) && value !== media.playbackRate) {
        updating = true;
        media.playbackRate = /** @type {number} */
        value;
      }
    });
  });
  render_effect(() => () => {
    destroyed = true;
    if (render) {
      destroy_signal(render);
    }
  });
}
function bind_paused(media, get_value, update) {
  let mounted = current_hydration_fragment !== null;
  let paused = get_value();
  const callback = () => {
    if (paused !== media.paused) {
      paused = media.paused;
      update(paused = media.paused);
    }
  };
  if (paused == null) {
    callback();
  }
  if (mounted) {
    listen_to_events(media, ["play", "pause", "canplay"], callback, false);
  }
  render_effect(() => {
    paused = !!get_value();
    if (paused !== media.paused) {
      const toggle = () => {
        mounted = true;
        if (paused) {
          media.pause();
        } else {
          media.play().catch(() => {
            update(paused = true);
          });
        }
      };
      if (mounted) {
        toggle();
      } else {
        media.addEventListener(
          "canplay",
          () => {
            listen_to_events(media, ["play", "pause", "canplay"], callback, false);
            toggle();
          },
          { once: true }
        );
      }
    }
  });
}
function bind_volume(media, get_value, update) {
  let updating = false;
  const callback = () => {
    updating = true;
    update(media.volume);
  };
  if (get_value() == null) {
    callback();
  }
  listen_to_events(media, ["volumechange"], callback, false);
  render_effect(() => {
    const value = get_value();
    if (!updating && !isNaN(
      /** @type {any} */
      value
    )) {
      media.volume = /** @type {number} */
      value;
    }
    updating = false;
  });
}
function bind_muted(media, get_value, update) {
  let updating = false;
  const callback = () => {
    updating = true;
    update(media.muted);
  };
  if (get_value() == null) {
    callback();
  }
  listen_to_events(media, ["volumechange"], callback, false);
  render_effect(() => {
    const value = get_value();
    if (!updating) {
      media.muted = !!value;
    }
    updating = false;
  });
}
function listen_to_events(dom, events, handler, call_handler_immediately = true) {
  if (call_handler_immediately) {
    handler();
  }
  for (const name of events) {
    dom.addEventListener(name, handler);
  }
  render_effect(() => {
    return () => {
      for (const name of events) {
        dom.removeEventListener(name, handler);
      }
    };
  });
}
var ResizeObserverSingleton = class _ResizeObserverSingleton {
  /** */
  #listeners = /* @__PURE__ */ new WeakMap();
  /** @type {ResizeObserver | undefined} */
  #observer;
  /** @type {ResizeObserverOptions} */
  #options;
  /** @static */
  static entries = /* @__PURE__ */ new WeakMap();
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.#options = options;
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(element2, listener) {
    const listeners = this.#listeners.get(element2) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    this.#listeners.set(element2, listeners);
    this.#getObserver().observe(element2, this.#options);
    return () => {
      const listeners2 = this.#listeners.get(element2);
      listeners2.delete(listener);
      if (listeners2.size === 0) {
        this.#listeners.delete(element2);
        this.#observer.unobserve(element2);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver(
      /** @param {any} entries */
      (entries) => {
        for (const entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          for (const listener of this.#listeners.get(entry.target) || []) {
            listener(entry);
          }
        }
      }
    ));
  }
};
var resize_observer_content_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "content-box"
});
var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "border-box"
});
var resize_observer_device_pixel_content_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "device-pixel-content-box"
});
function bind_resize_observer(dom, type, update) {
  const observer = type === "contentRect" || type === "contentBoxSize" ? resize_observer_content_box : type === "borderBoxSize" ? resize_observer_border_box : resize_observer_device_pixel_content_box;
  const unsub = observer.observe(
    dom,
    /** @param {any} entry */
    (entry) => update(entry[type])
  );
  render_effect(() => unsub);
}
function bind_element_size(dom, type, update) {
  requestAnimationFrame(() => requestAnimationFrame(() => update(dom[type])));
  const unsub = resize_observer_border_box.observe(dom, () => update(dom[type]));
  render_effect(() => unsub);
}
function bind_window_size(type, update) {
  const callback = () => update(window[type]);
  listen_to_events(window, ["resize"], callback);
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
  dom.addEventListener("input", () => {
    let value = dom.value;
    const type = dom.type;
    if (type === "number" || type === "range") {
      value = value === "" ? null : +value;
    }
    update(value);
  });
  render_effect(() => {
    const value = get_value();
    const coerced_value = value == null ? null : value + "";
    dom.value = coerced_value;
    dom.__value = value;
  });
}
function bind_select_value(dom, get_value, update) {
  let mounted = false;
  dom.addEventListener("change", () => {
    let value;
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
    if (dom[property] !== value) {
      if (value === null) {
        const non_null_value = dom[property];
        update(non_null_value);
      } else {
        dom[property] = value + "";
      }
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
function bind_window_scroll(type, get_value, update) {
  const is_scrolling_x = type === "x";
  const target_handler = () => {
    scrolling = true;
    clearTimeout(timeout);
    timeout = setTimeout(clear, 100);
    const value = window[is_scrolling_x ? "scrollX" : "scrollY"];
    update(value);
  };
  addEventListener("scroll", target_handler, {
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
        scrollTo(latest_value, window.scrollY);
      } else {
        scrollTo(window.scrollX, latest_value);
      }
      timeout = setTimeout(clear, 100);
    }
  });
  render_effect(() => {
    return () => {
      removeEventListener("scroll", target_handler);
    };
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
  const path = event2.composedPath?.() || [];
  let current_target = (
    /** @type {null | Element} */
    path[0] || event2.target
  );
  if (event2.target !== current_target) {
    define_property(event2, "target", {
      configurable: true,
      value: current_target
    });
  }
  let path_idx = 0;
  const handled_at = event2.__handled_event_at;
  if (handled_at) {
    const at_idx = path.indexOf(handled_at);
    if (at_idx < path.indexOf(root_element)) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event2.target;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || document;
    }
  });
  while (current_target !== null) {
    const parent_element = current_target.parentNode || /** @type {any} */
    current_target.host || null;
    const internal_prop_name = "__" + event_name;
    const delegated = current_target[internal_prop_name];
    if (delegated !== void 0 && !/** @type {any} */
    current_target.disabled) {
      if (is_array(delegated)) {
        const [fn, ...data] = delegated;
        fn.apply(current_target, [event2, ...data]);
      } else {
        delegated.call(current_target, event2);
      }
    }
    if (event2.cancelBubble || parent_element === root_element) {
      break;
    }
    current_target = parent_element;
  }
  event2.__handled_event_at = root_element;
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
  let consequent_dom = null;
  let alternate_dom = null;
  let has_mounted = false;
  block.transition = /**
   * @param {import('./types.js').Transition} transition
   * @returns {void}
   */
  (transition2) => {
    if (block.current) {
      consequent_transitions.add(transition2);
      transition2.finished(() => {
        consequent_transitions.delete(transition2);
        for (let other of consequent_transitions) {
          if (other.direction === "in") {
            consequent_transitions.delete(other);
          }
        }
        if (consequent_transitions.size === 0) {
          execute_effect(consequent_effect);
        }
      });
    } else {
      alternate_transitions.add(transition2);
      transition2.finished(() => {
        alternate_transitions.delete(transition2);
        for (let other of alternate_transitions) {
          if (other.direction === "in") {
            alternate_transitions.delete(other);
          }
        }
        if (alternate_transitions.size === 0) {
          execute_effect(alternate_effect);
        }
      });
    }
  };
  const if_effect = render_effect(
    () => {
      const result = !!condition_fn();
      if (block.current !== result || !has_mounted) {
        block.current = result;
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
      if (consequent_dom !== null) {
        remove(consequent_dom);
        consequent_dom = null;
      }
      if (block.current) {
        consequent_fn(anchor_node);
      }
      consequent_dom = block.dom;
      block.dom = null;
    },
    block,
    true
  );
  const alternate_effect = render_effect(
    () => {
      if (alternate_dom !== null) {
        remove(alternate_dom);
        alternate_dom = null;
      }
      if (!block.current) {
        if (alternate_fn !== null) {
          alternate_fn(anchor_node);
        }
      }
      alternate_dom = block.dom;
      block.dom = null;
    },
    block,
    true
  );
  push_destroy_fn(if_effect, () => {
    if (consequent_dom !== null) {
      remove(consequent_dom);
    }
    if (alternate_dom !== null) {
      remove(alternate_dom);
    }
    destroy_signal(consequent_effect);
    destroy_signal(alternate_effect);
  });
  block.effect = if_effect;
}
function head(render_fn) {
  const block = create_head_block();
  const hydration_fragment = current_hydration_fragment !== null ? get_hydration_fragment(document.head.firstChild) : null;
  const previous_hydration_fragment = current_hydration_fragment;
  set_current_hydration_fragment(hydration_fragment);
  try {
    const head_effect = render_effect(
      () => {
        const current = block.dom;
        if (current !== null) {
          remove(current);
          block.dom = null;
        }
        let anchor = null;
        if (current_hydration_fragment === null) {
          anchor = empty();
          document.head.appendChild(anchor);
        }
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
  } finally {
    set_current_hydration_fragment(previous_hydration_fragment);
  }
}
function swap_block_dom(block, from, to) {
  const dom = block.dom;
  if (is_array(dom)) {
    for (let i = 0; i < dom.length; i++) {
      if (dom[i] === from) {
        dom[i] = to;
        break;
      }
    }
  } else if (dom === from) {
    block.dom = to;
  }
}
function element(anchor_node, tag_fn, render_fn, is_svg = false) {
  const block = create_dynamic_element_block();
  hydrate_block_anchor(anchor_node);
  let has_mounted = false;
  let tag;
  let element2 = null;
  const element_effect = render_effect(
    () => {
      tag = tag_fn();
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
      const next_element = tag ? current_hydration_fragment !== null ? (
        /** @type {HTMLElement | SVGElement} */
        current_hydration_fragment[0]
      ) : is_svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag) : null;
      const prev_element = element2;
      if (prev_element !== null) {
        block.dom = null;
      }
      element2 = next_element;
      if (element2 !== null && render_fn !== null) {
        let anchor;
        if (current_hydration_fragment !== null) {
          anchor = /** @type {Comment} */
          element2.firstChild;
        } else {
          anchor = empty();
          element2.appendChild(anchor);
        }
        render_fn(element2, anchor);
      }
      const has_prev_element = prev_element !== null;
      if (has_prev_element) {
        remove(prev_element);
      }
      if (element2 !== null) {
        insert(element2, null, anchor_node);
        if (has_prev_element) {
          const parent_block = block.parent;
          if (element2 == null) {
            throw new Error("shit");
          }
          swap_block_dom(parent_block, prev_element, element2);
        }
      }
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
  let current_render = null;
  hydrate_block_anchor(anchor_node);
  let component2 = null;
  block.transition = /**
   * @param {import('./types.js').Transition} transition
   * @returns {void}
   */
  (transition2) => {
    const render2 = (
      /** @type {import('./types.js').Render} */
      current_render
    );
    const transitions = render2.transitions;
    transitions.add(transition2);
    transition2.finished(() => {
      transitions.delete(transition2);
      for (let other of transitions) {
        if (other.direction === "in") {
          transitions.delete(other);
        }
      }
      if (transitions.size === 0) {
        if (render2.effect !== null) {
          if (render2.dom !== null) {
            remove(render2.dom);
            render2.dom = null;
          }
          destroy_signal(render2.effect);
          render2.effect = null;
        }
      }
    });
  };
  const create_render_effect = () => {
    const render2 = {
      dom: null,
      effect: null,
      transitions: /* @__PURE__ */ new Set(),
      prev: current_render
    };
    const effect2 = render_effect(
      () => {
        const current = block.dom;
        if (current !== null) {
          remove(current);
          block.dom = null;
        }
        if (component2) {
          render_fn(component2);
        }
        render2.dom = block.dom;
        block.dom = null;
      },
      block,
      true
    );
    render2.effect = effect2;
    current_render = render2;
  };
  const render = () => {
    const render2 = current_render;
    if (render2 === null) {
      create_render_effect();
      return;
    }
    const transitions = render2.transitions;
    if (transitions.size === 0) {
      if (render2.dom !== null) {
        remove(render2.dom);
        render2.dom = null;
      }
      if (render2.effect) {
        execute_effect(render2.effect);
      } else {
        create_render_effect();
      }
    } else {
      create_render_effect();
      trigger_transitions(transitions, "out");
    }
  };
  const component_effect = render_effect(
    () => {
      const next_component = component_fn();
      if (component2 !== next_component) {
        component2 = next_component;
        render();
      }
    },
    block,
    false
  );
  push_destroy_fn(component_effect, () => {
    let render2 = current_render;
    while (render2 !== null) {
      const dom = render2.dom;
      if (dom !== null) {
        remove(dom);
      }
      const effect2 = render2.effect;
      if (effect2 !== null) {
        destroy_signal(effect2);
      }
      render2 = render2.prev;
    }
  });
  block.effect = component_effect;
}
function await_block(anchor_node, input, pending_fn, then_fn, catch_fn) {
  const block = create_await_block();
  let current_render = null;
  hydrate_block_anchor(anchor_node);
  let latest_token;
  let resolved_value = UNINITIALIZED;
  let error = UNINITIALIZED;
  let pending = false;
  block.transition = /**
   * @param {import('./types.js').Transition} transition
   * @returns {void}
   */
  (transition2) => {
    const render2 = (
      /** @type {import('./types.js').Render} */
      current_render
    );
    const transitions = render2.transitions;
    transitions.add(transition2);
    transition2.finished(() => {
      transitions.delete(transition2);
      for (let other of transitions) {
        if (other.direction === "in") {
          transitions.delete(other);
        }
      }
      if (transitions.size === 0) {
        if (render2.effect !== null) {
          if (render2.dom !== null) {
            remove(render2.dom);
            render2.dom = null;
          }
          destroy_signal(render2.effect);
          render2.effect = null;
        }
      }
    });
  };
  const create_render_effect = () => {
    const render2 = {
      dom: null,
      effect: null,
      transitions: /* @__PURE__ */ new Set(),
      prev: current_render
    };
    const effect2 = render_effect(
      () => {
        if (error === UNINITIALIZED) {
          if (resolved_value === UNINITIALIZED) {
            block.pending = true;
            if (pending_fn !== null) {
              pending_fn(anchor_node);
            }
          } else if (then_fn !== null) {
            block.pending = false;
            then_fn(anchor_node, resolved_value);
          }
        } else if (catch_fn !== null) {
          block.pending = false;
          catch_fn(anchor_node, error);
        }
        render2.dom = block.dom;
        block.dom = null;
      },
      block,
      true,
      true
    );
    render2.effect = effect2;
    current_render = render2;
  };
  const render = () => {
    const render2 = current_render;
    if (render2 === null) {
      create_render_effect();
      return;
    }
    const transitions = render2.transitions;
    if (transitions.size === 0) {
      if (render2.dom !== null) {
        remove(render2.dom);
        render2.dom = null;
      }
      if (render2.effect) {
        execute_effect(render2.effect);
      } else {
        create_render_effect();
      }
    } else {
      create_render_effect();
      trigger_transitions(transitions, "out");
    }
  };
  const await_effect = render_effect(
    () => {
      const token = {};
      latest_token = token;
      const promise = is_signal(input) ? get(input) : typeof input === "function" ? input() : input;
      if (is_promise(promise)) {
        promise.then(
          /** @param {V} v */
          (v) => {
            if (latest_token === token) {
              flushSync();
              resolved_value = v;
              pending = false;
              render();
            }
          },
          /** @param {unknown} _error */
          (_error) => {
            error = _error;
            pending = false;
            render();
          }
        );
        if (resolved_value !== UNINITIALIZED || error !== UNINITIALIZED) {
          error = UNINITIALIZED;
          resolved_value = UNINITIALIZED;
        }
        if (!pending) {
          pending = true;
          render();
        }
      } else {
        error = UNINITIALIZED;
        resolved_value = promise;
        pending = false;
        render();
      }
    },
    block,
    false
  );
  push_destroy_fn(await_effect, () => {
    let render2 = current_render;
    latest_token = {};
    while (render2 !== null) {
      const dom = render2.dom;
      if (dom !== null) {
        remove(dom);
      }
      const effect2 = render2.effect;
      if (effect2 !== null) {
        destroy_signal(effect2);
      }
      render2 = render2.prev;
    }
  });
  block.effect = await_effect;
}
function try_block(try_fn, catch_fn, error_event_fn) {
  const block = create_try_block();
  let error = null;
  block.state = /**
   * @param {unknown} _error
   * @returns {void}
   */
  (_error) => {
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
      const dom = block.dom;
      if (dom !== null) {
        remove(dom);
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
    const dom = block.dom;
    if (dom !== null) {
      remove(dom);
    }
  });
  block.effect = try_effect;
}
function key(anchor_node, key2, render_fn) {
  const block = create_key_block();
  let current_render = null;
  hydrate_block_anchor(anchor_node);
  let key_value = UNINITIALIZED;
  let mounted = false;
  block.transition = /**
   * @param {import('./types.js').Transition} transition
   * @returns {void}
   */
  (transition2) => {
    const render2 = (
      /** @type {import('./types.js').Render} */
      current_render
    );
    const transitions = render2.transitions;
    transitions.add(transition2);
    transition2.finished(() => {
      transitions.delete(transition2);
      for (let other of transitions) {
        if (other.direction === "in") {
          transitions.delete(other);
        }
      }
      if (transitions.size === 0) {
        if (render2.effect !== null) {
          if (render2.dom !== null) {
            remove(render2.dom);
            render2.dom = null;
          }
          destroy_signal(render2.effect);
          render2.effect = null;
        }
      }
    });
  };
  const create_render_effect = () => {
    const render2 = {
      dom: null,
      effect: null,
      transitions: /* @__PURE__ */ new Set(),
      prev: current_render
    };
    const effect2 = render_effect(
      () => {
        render_fn(anchor_node);
        render2.dom = block.dom;
        block.dom = null;
      },
      block,
      true,
      true
    );
    render2.effect = effect2;
    current_render = render2;
  };
  const render = () => {
    const render2 = current_render;
    if (render2 === null) {
      create_render_effect();
      return;
    }
    const transitions = render2.transitions;
    if (transitions.size === 0) {
      if (render2.dom !== null) {
        remove(render2.dom);
        render2.dom = null;
      }
      if (render2.effect) {
        execute_effect(render2.effect);
      } else {
        create_render_effect();
      }
    } else {
      trigger_transitions(transitions, "out");
      create_render_effect();
    }
  };
  const key_effect = render_effect(
    () => {
      const prev_key_value = key_value;
      key_value = key2();
      if (mounted && safe_not_equal(prev_key_value, key_value)) {
        render();
      }
    },
    block,
    false
  );
  render();
  mounted = true;
  push_destroy_fn(key_effect, () => {
    let render2 = current_render;
    while (render2 !== null) {
      const dom = render2.dom;
      if (dom !== null) {
        remove(dom);
      }
      const effect2 = render2.effect;
      if (effect2 !== null) {
        destroy_signal(effect2);
      }
      render2 = render2.prev;
    }
  });
  block.effect = key_effect;
}
function get_first_element(block) {
  const current = block.dom;
  if (is_array(current)) {
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (node.nodeType !== 8) {
        return node;
      }
    }
  }
  return (
    /** @type {Text | Element | Comment} */
    current
  );
}
function update_each_item_block(block, item, index, type) {
  if ((type & EACH_ITEM_REACTIVE) !== 0) {
    set_signal_value(block.item, item);
  }
  const transitions = block.transitions;
  const index_is_reactive = (type & EACH_INDEX_REACTIVE) !== 0;
  if (transitions !== null && (type & EACH_KEYED) !== 0) {
    let prev_index = block.index;
    if (index_is_reactive) {
      prev_index = /** @type {import('./types.js').Signal<number>} */
      prev_index.value;
      index = /** @type {import('./types.js').Signal<number>} */
      index.value;
    }
    const items = block.parent.items;
    if (prev_index !== index && /** @type {number} */
    index < items.length) {
      const from_dom = (
        /** @type {Element} */
        get_first_element(block)
      );
      const from = from_dom.getBoundingClientRect();
      const e = managed_pre_effect(() => {
        destroy_signal(e);
        const e2 = managed_effect(() => {
          destroy_signal(e2);
          trigger_transitions(transitions, "key", from);
        });
      });
    }
  }
  if (index_is_reactive) {
    set_signal_value(
      /** @type {import('./types.js').Signal<number>} */
      block.index,
      index
    );
  } else {
    block.index = index;
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
    const dom = block.dom;
    if (!controlled && dom !== null) {
      remove(dom);
    }
    destroy_signal(
      /** @type {import('./types.js').Signal} */
      block.effect
    );
  }
}
function each_item_transition(transition2) {
  const block = this;
  const each_block = block.parent;
  const is_controlled = (each_block.flags & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    const anchor = empty();
    each_block.flags ^= EACH_IS_CONTROLLED;
    append_child(
      /** @type {Element} */
      each_block.anchor,
      anchor
    );
    each_block.anchor = anchor;
  }
  if (transition2.direction === "key" && (each_block.flags & EACH_IS_ANIMATED) === 0) {
    each_block.flags |= EACH_IS_ANIMATED;
  }
  let transitions = block.transitions;
  if (transitions === null) {
    block.transitions = transitions = /* @__PURE__ */ new Set();
  }
  transition2.finished(() => {
    if (transitions !== null) {
      transitions.delete(transition2);
      if (transition2.direction !== "key") {
        for (let other of transitions) {
          if (other.direction === "key" || other.direction === "in") {
            transitions.delete(other);
          }
        }
        if (transitions.size === 0) {
          block.transitions = null;
          destroy_each_item_block(block, null, true);
        }
      }
    }
  });
  transitions.add(transition2);
}
function trigger_transitions(transitions, target_direction, from) {
  const outros = [];
  for (const transition2 of transitions) {
    const direction = transition2.direction;
    if (target_direction === "in") {
      if (direction === "in" || direction === "both") {
        if (direction === "in") {
          transition2.cancel();
        }
        transition2.in();
      } else {
        transition2.cancel();
      }
      transition2.dom.inert = false;
      mark_subtree_inert(transition2.effect, false);
    } else if (target_direction === "key") {
      if (direction === "key") {
        transition2.payload = transition2.init(
          /** @type {DOMRect} */
          from
        );
        transition2.in();
      }
    } else {
      if (direction === "out" || direction === "both") {
        transition2.payload = transition2.init();
        outros.push(transition2.out);
      }
      transition2.dom.inert = true;
      mark_subtree_inert(transition2.effect, true);
    }
  }
  if (outros.length > 0) {
    const e = managed_pre_effect(() => {
      destroy_signal(e);
      const e2 = managed_effect(() => {
        destroy_signal(e2);
        outros.forEach(
          /** @param {any} o */
          (o) => o()
        );
      });
    });
  }
}
function each_item_block(item, key2, index, render_fn, flags) {
  const item_value = (flags & EACH_ITEM_REACTIVE) === 0 ? item : source(item);
  const index_value = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);
  const block = create_each_item_block(item_value, index_value, key2);
  block.transition = each_item_transition;
  const effect2 = render_effect(
    /** @param {import('./types.js').EachItemBlock} block */
    (block2) => {
      render_fn(null, block2.item, block2.index);
    },
    block,
    true
  );
  block.effect = effect2;
  return block;
}
function each(anchor_node, collection, flags, key_fn, render_fn, fallback_fn) {
  const is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
  const block = create_each_block(flags, anchor_node);
  let current_fallback = null;
  hydrate_block_anchor(anchor_node, is_controlled);
  let array;
  let keys = null;
  let render = null;
  block.transition = /** @param {import('./types.js').Transition} transition */
  (transition2) => {
    const fallback = (
      /** @type {import('./types.js').Render} */
      current_fallback
    );
    const transitions = fallback.transitions;
    transitions.add(transition2);
    transition2.finished(() => {
      transitions.delete(transition2);
      for (let other of transitions) {
        if (other.direction === "in") {
          transitions.delete(other);
        }
      }
      if (transitions.size === 0) {
        if (fallback.effect !== null) {
          if (fallback.dom !== null) {
            remove(fallback.dom);
            fallback.dom = null;
          }
          destroy_signal(fallback.effect);
          fallback.effect = null;
        }
      }
    });
  };
  const create_fallback_effect = () => {
    const fallback = {
      dom: null,
      effect: null,
      transitions: /* @__PURE__ */ new Set(),
      prev: current_fallback
    };
    const effect2 = render_effect(
      () => {
        const dom = block.dom;
        if (dom !== null) {
          remove(dom);
          block.dom = null;
        }
        let anchor = block.anchor;
        const is_controlled2 = (block.flags & EACH_IS_CONTROLLED) !== 0;
        if (is_controlled2) {
          anchor = empty();
          block.anchor.appendChild(anchor);
        }
        fallback_fn(anchor);
        fallback.dom = block.dom;
        block.dom = null;
      },
      block,
      true
    );
    fallback.effect = effect2;
    current_fallback = fallback;
  };
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
      if (fallback_fn !== null) {
        if (array.length === 0) {
          if (block.items.length !== 0 || render === null) {
            create_fallback_effect();
          }
        } else if (block.items.length === 0 && current_fallback !== null) {
          const fallback = current_fallback;
          const transitions = fallback.transitions;
          if (transitions.size === 0) {
            if (fallback.dom !== null) {
              remove(fallback.dom);
              fallback.dom = null;
            }
          } else {
            trigger_transitions(transitions, "out");
          }
        }
      }
      if (render !== null) {
        execute_effect(render);
      }
    },
    block,
    false
  );
  render = render_effect(
    /** @param {import('./types.js').EachBlock} block */
    (block2) => {
      const flags2 = block2.flags;
      const is_controlled2 = (flags2 & EACH_IS_CONTROLLED) !== 0;
      const anchor_node2 = block2.anchor;
      if ((flags2 & EACH_KEYED) !== 0) {
        reconcile_tracked_array(
          array,
          block2,
          anchor_node2,
          is_controlled2,
          render_fn,
          keys,
          flags2,
          true
        );
      } else {
        reconcile_indexed_array(array, block2, anchor_node2, is_controlled2, render_fn, flags2, true);
      }
    },
    block,
    true
  );
  push_destroy_fn(each2, () => {
    const flags2 = block.flags;
    const is_controlled2 = (flags2 & EACH_IS_CONTROLLED) !== 0;
    const anchor_node2 = block.anchor;
    let fallback = current_fallback;
    while (fallback !== null) {
      const dom = fallback.dom;
      if (dom !== null) {
        remove(dom);
      }
      const effect2 = fallback.effect;
      if (effect2 !== null) {
        destroy_signal(effect2);
      }
      fallback = fallback.prev;
    }
    reconcile_indexed_array([], block, anchor_node2, is_controlled2, render_fn, flags2, false);
    destroy_signal(
      /** @type {import('./types.js').EffectSignal} */
      render
    );
  });
  block.effect = each2;
}
function cssProps(anchor, is_html, props, component2) {
  hydrate_block_anchor(anchor);
  let tag;
  let component_anchor;
  if (current_hydration_fragment !== null) {
    tag = /** @type {HTMLElement | SVGElement} */
    current_hydration_fragment[0];
    component_anchor = /** @type {Comment} */
    tag.firstChild;
  } else {
    if (is_html) {
      tag = document.createElement("div");
      tag.style.display = "contents";
    } else {
      tag = document.createElementNS("http://www.w3.org/2000/svg", "g");
    }
    insert(tag, null, anchor);
    component_anchor = empty();
    tag.appendChild(component_anchor);
  }
  component2(component_anchor);
  let current_props = {};
  const effect2 = render_effect(() => {
    const next_props = props();
    for (const key2 in current_props) {
      if (!(key2 in next_props)) {
        tag.style.removeProperty(key2);
      }
    }
    for (const key2 in next_props) {
      tag.style.setProperty(key2, next_props[key2]);
    }
    current_props = next_props;
  });
  push_destroy_fn(effect2, () => {
    remove(tag);
  });
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
function transition(dom, transition_fn, props, global = false) {
  bind_transition(dom, transition_fn, props, "both", global);
}
function animate(dom, transition_fn, props) {
  bind_transition(dom, transition_fn, props, "key", false);
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
function remove_input_attr_defaults(dom) {
  if (current_hydration_fragment !== null) {
    attr(dom, "value", null);
    attr(dom, "checked", null);
  }
}
function remove_textarea_child(dom) {
  if (current_hydration_fragment !== null && dom.firstChild !== null) {
    dom.textContent = "";
  }
}
function attr_effect(dom, attribute, value) {
  render_effect(() => {
    const string = value();
    attr(dom, attribute, string);
  });
}
function attr(dom, attribute, value) {
  if (value == null) {
    dom.removeAttribute(attribute);
  } else {
    dom.setAttribute(attribute, value);
  }
}
function xlink_attr_effect(dom, attribute, value) {
  render_effect(() => {
    const string = value();
    xlink_attr(dom, attribute, string);
  });
}
function xlink_attr(dom, attribute, value) {
  dom.setAttributeNS("http://www.w3.org/1999/xlink", attribute, value);
}
function set_custom_element_data_effect(node, prop2, value) {
  render_effect(() => {
    set_custom_element_data(node, prop2, value());
  });
}
function set_custom_element_data(node, prop2, value) {
  if (prop2 in node) {
    node[prop2] = typeof node[prop2] === "boolean" && value === "" ? true : value;
  } else {
    attr(node, prop2, value);
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
      auto_focus(
        /** @type {HTMLElement} */
        dom,
        Boolean(value)
      );
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
function spread_dynamic_element_attributes(node, prev, attrs, css_hash) {
  if (node.tagName.includes("-")) {
    const next = Object.assign({}, ...attrs);
    if (prev !== null) {
      for (const key2 in prev) {
        if (!(key2 in next)) {
          next[key2] = null;
        }
      }
    }
    for (const key2 in next) {
      set_custom_element_data(node, key2, next[key2]);
    }
    return next;
  } else {
    return spread_attributes(
      /** @type {Element & ElementCSSInlineStyle} */
      node,
      prev,
      attrs,
      css_hash
    );
  }
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
      const desc = (
        /** @type {PropertyDescriptor} */
        get_descriptor(props, key2)
      );
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
      const desc = (
        /** @type {PropertyDescriptor} */
        get_descriptor(obj, key2)
      );
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
function mount(component2, options) {
  const registered_events = /* @__PURE__ */ new Set();
  const container = options.target;
  const props = options.props || /** @type {P} */
  {};
  const events = options.events || /** @type {E} */
  {};
  const slots = options.slots || /** @type {S} */
  {};
  const block = create_root_block(container, options.intro || false);
  const first_child = (
    /** @type {ChildNode} */
    container.firstChild
  );
  const hydration_fragment = get_hydration_fragment(first_child);
  let v;
  const previous_hydration_fragment = current_hydration_fragment;
  const previous_untracking = current_untracking;
  try {
    let anchor = null;
    if (hydration_fragment === null) {
      anchor = empty();
      container.appendChild(anchor);
    }
    set_current_hydration_fragment(hydration_fragment);
    set_untracking(false);
    const effect2 = render_effect(
      () => {
        v = component2(anchor, props, events, slots);
      },
      block,
      true
    );
    block.effect = effect2;
  } catch (error) {
    if (options.recover !== false && hydration_fragment !== null) {
      console.error(
        "Hydration failed because the initial UI does not match what was rendered on the server."
      );
      remove(hydration_fragment);
      first_child.remove();
      hydration_fragment.at(-1)?.nextSibling?.remove();
      mount(component2, options);
    } else {
      throw error;
    }
  } finally {
    set_current_hydration_fragment(previous_hydration_fragment);
    set_untracking(previous_untracking);
  }
  const bound_event_listener = handle_event_propagation.bind(null, container);
  const event_handle = (events2) => {
    for (let i = 0; i < events2.length; i++) {
      const event_name = events2[i];
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
  return [
    () => {
      for (const event_name of registered_events) {
        container.removeEventListener(event_name, bound_event_listener);
      }
      root_event_handles.delete(event_handle);
      const dom = block.dom;
      if (dom !== null) {
        remove(dom);
      }
      if (hydration_fragment !== null) {
        remove(hydration_fragment);
      }
      destroy_signal(
        /** @type {import('./types.js').Signal} */
        block.effect
      );
    },
    /** @type {V} */
    v
  ];
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

// src/internal/client/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** @type {any} The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** @type {Record<string, any>} Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    $$l = {};
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    /** @type {any} The managed render effect for reflecting attributes */
    $$me;
    /**
     * @param {*} $$componentCtor
     * @param {*} $$slots
     * @param {*} use_shadow_dom
     */
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot2 = function(name) {
          return (_, anchor) => {
            const node = open(anchor, true, () => {
              const slot2 = document.createElement("slot");
              if (name !== "default") {
                slot2.name = name;
              }
              return slot2;
            });
            close(
              anchor,
              /** @type {Element} */
              node
            );
          };
        };
        var create_slot = create_slot2;
        await Promise.resolve();
        if (!this.$$cn) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = create_slot2(name);
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots
          }
        });
        this.$$me = render_effect(() => {
          this.$$r = true;
          for (const key2 of Object.keys(this.$$c)) {
            if (!this.$$p_d[key2].reflect)
              continue;
            this.$$d[key2] = this.$$c[key2];
            const attribute_value = get_custom_element_value(
              key2,
              this.$$d[key2],
              this.$$p_d,
              "toAttribute"
            );
            if (attribute_value == null) {
              this.removeAttribute(this.$$p_d[key2].attribute || key2);
            } else {
              this.setAttribute(this.$$p_d[key2].attribute || key2, attribute_value);
            }
          }
          this.$$r = false;
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    /**
     * @param {string} attr
     * @param {string} _oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r)
        return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn) {
          this.$$c.$destroy();
          destroy_signal(this.$$me);
          this.$$c = void 0;
        }
      });
    }
    /**
     * @param {string} attribute_name
     */
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key2) => this.$$p_d[key2].attribute === attribute_name || !this.$$p_d[key2].attribute && key2.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[
      /** @type {Element} node */
      node.slot || "default"
    ] = true;
  });
  return result;
}
function create_custom_element(Component, props_definition, slots, accessors, use_shadow_dom, extend) {
  let Class = class extends SvelteElement {
    constructor() {
      super(Component, slots, use_shadow_dom);
      this.$$p_d = props_definition;
    }
    static get observedAttributes() {
      return Object.keys(props_definition).map(
        (key2) => (props_definition[key2].attribute || key2).toLowerCase()
      );
    }
  };
  Object.keys(props_definition).forEach((prop2) => {
    Object.defineProperty(Class.prototype, prop2, {
      get() {
        return this.$$c && prop2 in this.$$c ? this.$$c[prop2] : this.$$d[prop2];
      },
      set(value) {
        value = get_custom_element_value(prop2, value, props_definition);
        this.$$d[prop2] = value;
        this.$$c?.$set({ [prop2]: value });
      }
    });
  });
  accessors.forEach((accessor) => {
    Object.defineProperty(Class.prototype, accessor, {
      get() {
        return this.$$c?.[accessor];
      }
    });
  });
  if (extend) {
    Class = extend(Class);
  }
  Component.element = /** @type {any} */
  Class;
  return Class;
}

// src/legacy/index.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
function asClassComponent(component2) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options) {
      super({
        component: component2,
        ...options
      });
    }
  };
}
var Svelte4Component = class {
  /** @type {any} */
  #_props = {};
  /** @type {any} */
  #_sources = {};
  /** @type {any} */
  #_propsSignal;
  /** @type {any} */
  #_events = {};
  /** @type {any} */
  #_destroy;
  /** @type {any} */
  #_options;
  /** @param {any} options */
  constructor(options) {
    this.#_options = options;
    for (const prop2 in options.props || {}) {
      if (prop2 === "$$slots")
        continue;
      this.#_addProp(prop2, options.props[prop2]);
    }
    this.#_propsSignal = source(
      new Proxy(this.#_props, {
        get: (
          /**
          * @param {any} target
          * @param {any} property
          */
          (target, property) => {
            if (typeof property !== "string")
              return target[property];
            if (!(property in this.#_sources)) {
              this.#_addProp(property, void 0);
            }
            return this.#_props[property];
          }
        )
      }),
      options.immutable ? (
        /**
         * @param {any} a
         * @param {any} b
         */
        (a, b) => a === b
      ) : safe_equal
    );
    let destroy;
    let component2;
    [destroy, component2] = mount(options.component, {
      props: this.#_propsSignal,
      events: this.#_events,
      slots: options.props?.$$slots || {},
      target: options.target,
      intro: options.intro,
      recover: options.recover
    });
    this.#_destroy = destroy;
    if (component2) {
      Object.keys(component2).forEach(
        /** @param {any} key */
        (key2) => {
          Object.defineProperty(this, key2, {
            get() {
              return component2[key2];
            },
            /** @param {any} value */
            set(value) {
              component2[key2] = value;
            },
            enumerable: true
          });
        }
      );
    }
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    Object.entries(props).forEach(
      /** @param {any}params_0 */
      ([prop2, value]) => {
        if (prop2 in this.#_sources) {
          set(this.#_sources[prop2], value);
        } else {
          this.#_addProp(prop2, value);
          set(this.#_propsSignal, this.#_props);
        }
      }
    );
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event2, callback) {
    this.#_events[event2] = this.#_events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#_events[event2].push(cb);
    return () => {
      this.#_events[event2] = this.#_events[event2].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#_destroy();
  }
  /**
   * @param {string} prop
   * @param {any} value
   */
  #_addProp(prop2, value) {
    const source2 = source(
      value,
      this.#_options.immutable ? (
        /**
         * @param {any} a
         * @param {any} b
         */
        (a, b) => a === b
      ) : safe_equal
    );
    this.#_sources[prop2] = source2;
    Object.defineProperty(this.#_props, prop2, {
      get() {
        return exposable(() => get(source2));
      },
      enumerable: true
    });
  }
};

export {
  child,
  child_frag,
  sibling,
  $window,
  $document,
  raf,
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
  class_name_effect,
  class_name,
  text_effect,
  text,
  auto_focus,
  to_class,
  class_toggle,
  select_option,
  bind_online,
  bind_current_time,
  bind_buffered,
  bind_seekable,
  bind_played,
  bind_seeking,
  bind_ended,
  bind_ready_state,
  bind_playback_rate,
  bind_paused,
  bind_volume,
  bind_muted,
  bind_resize_observer,
  bind_element_size,
  bind_window_size,
  selected,
  bind_value,
  bind_select_value,
  bind_content_editable,
  bind_group,
  bind_checked,
  bind_window_scroll,
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
  cssProps,
  stringify,
  html,
  transition,
  animate,
  in_fn,
  out,
  action,
  remove_input_attr_defaults,
  remove_textarea_child,
  attr_effect,
  attr,
  xlink_attr_effect,
  xlink_attr,
  set_custom_element_data_effect,
  set_custom_element_data,
  style,
  spread_attributes,
  spread_dynamic_element_attributes,
  rest_props,
  spread_props,
  unwrap,
  mount,
  access_props,
  compile_error,
  createClassComponent,
  asClassComponent,
  create_custom_element
};
//# sourceMappingURL=chunk-L6V35OWK.js.map
