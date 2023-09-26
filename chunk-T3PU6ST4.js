import {
  EMPTY_FUNC,
  subscribe_to_store
} from "./chunk-ZADVA3HR.js";

// src/internal/client/block.ts
var ROOT_BLOCK = 0;
var IF_BLOCK = 1;
var EACH_BLOCK = 2;
var EACH_ITEM_BLOCK = 3;
var TRY_BLOCK = 4;
var AWAIT_BLOCK = 5;
var KEY_BLOCK = 6;
var HEAD_BLOCK = 7;
var DYNAMIC_COMPONENT_BLOCK = 8;
var DYNAMIC_ELEMENT_BLOCK = 9;
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_KEYED = 1 << 2;
var EACH_IS_CONTROLLED = 1 << 3;
function create_root_block(container) {
  return {
    dom: null,
    effect: null,
    container,
    parent: null,
    transition: null,
    type: ROOT_BLOCK
  };
}
function create_if_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: IF_BLOCK
  };
}
function create_key_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: KEY_BLOCK
  };
}
function create_head_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: HEAD_BLOCK
  };
}
function create_dynamic_element_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: DYNAMIC_ELEMENT_BLOCK
  };
}
function create_dynamic_component_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: DYNAMIC_COMPONENT_BLOCK
  };
}
function create_await_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    type: AWAIT_BLOCK
  };
}
function create_try_block() {
  return {
    dom: null,
    effect: null,
    parent: current_block,
    transition: null,
    state: null,
    type: TRY_BLOCK
  };
}
function create_each_block() {
  return {
    dom: null,
    items: [],
    effect: null,
    parent: current_block,
    transition: null,
    transitions: [],
    type: EACH_BLOCK
  };
}
function create_each_item_block(render_fn, item, index, key) {
  return {
    dom: null,
    effect: null,
    index,
    key,
    item,
    parent: current_block,
    render_fn,
    transition: null,
    transitions: null,
    type: EACH_ITEM_BLOCK
  };
}

// src/internal/client/utils.ts
var object_ref = Object;
var array_ref = Array;
var is_array = array_ref.isArray;
var array_from = array_ref.from;
var define_property = object_ref.defineProperty;

// src/internal/client/runtime.ts
var SOURCE = 1;
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var PRE_EFFECT = 1 << 3;
var RENDER_EFFECT = 1 << 4;
var MANAGED = 1 << 5;
var UNOWNED = 1 << 6;
var IS_EFFECT = EFFECT | PRE_EFFECT | RENDER_EFFECT;
var CLEAN = 0;
var DIRTY = 1;
var MAYBE_DIRTY = 2;
var DESTROYED = 3;
var FLUSH_MICROTASK = 0;
var FLUSH_SYNC = 1;
var UNINITIALIZED = Symbol();
var current_scheduler_mode = FLUSH_MICROTASK;
var is_micro_task_queued = false;
var is_signal_exposed = false;
var current_queued_pre_effects = [];
var current_queued_render_effects = [];
var current_queued_effects = [];
var flush_count = 0;
var current_consumer = null;
var current_effect_signal = null;
var current_dependencies = null;
var current_dependencies_index = 0;
var current_global_access_id = 1;
var current_access_id = 1;
var current_should_capture_signal = false;
var current_untracking = false;
var current_captured_signal = null;
var current_has_reactive_get = false;
var current_skip_consumer = false;
var is_signals_recorded = false;
var captured_signals = /* @__PURE__ */ new Set();
var current_block = null;
var current_component_context = null;
var is_ssr = false;
function set_is_ssr(ssr) {
  is_ssr = ssr;
}
function create_component_context(events) {
  const parent = current_component_context;
  return {
    events,
    parent,
    context: null,
    immutable: false,
    runes: false,
    update_callbacks: null
  };
}
function is_runes() {
  return current_component_context !== null && current_component_context.runes;
}
function default_equals(a, b) {
  return a === b;
}
function create_signal_object(flags, value, status, block) {
  return {
    access: 0,
    block,
    consumers: null,
    context: null,
    dependencies: null,
    destroy: null,
    equals: null,
    flags,
    init: null,
    references: null,
    status,
    value
  };
}
function push_reference(target_signal, ref_signal) {
  const references = target_signal.references;
  if (references === null) {
    target_signal.references = [ref_signal];
  } else {
    references.push(ref_signal);
  }
}
function is_signal_dirty(signal) {
  const status = signal.status;
  if (status === DIRTY || signal.value === UNINITIALIZED) {
    return true;
  }
  if (status === MAYBE_DIRTY) {
    const dependencies = signal.dependencies;
    if (dependencies !== null) {
      const length = dependencies.length;
      let i;
      for (i = 0; i < length; i++) {
        const dependency = dependencies[i];
        if (dependency.status === MAYBE_DIRTY && !is_signal_dirty(dependency)) {
          continue;
        }
        if (dependency.status === DIRTY || dependency.value === UNINITIALIZED) {
          if ((dependency.flags & DERIVED) !== 0) {
            update_derived(dependency);
            if (signal.status === DIRTY) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function execute_signal_fn(signal) {
  const init = signal.init;
  const previous_dependencies = current_dependencies;
  const previous_dependencies_index = current_dependencies_index;
  const previous_access_id = current_access_id;
  const previous_consumer = current_consumer;
  const previous_block = current_block;
  const previous_component_context = current_component_context;
  const previous_skip_consumer = current_skip_consumer;
  const is_render_effect = (signal.flags & RENDER_EFFECT) !== 0;
  current_dependencies = null;
  current_dependencies_index = 0;
  current_global_access_id++;
  if (current_global_access_id === 255) {
    current_global_access_id = 1;
  }
  current_access_id = current_global_access_id;
  current_consumer = signal;
  current_block = signal.block;
  current_component_context = signal.context;
  current_skip_consumer = current_effect_signal === null && (signal.flags & UNOWNED) !== 0;
  if (is_render_effect && current_component_context?.update_callbacks != null) {
    current_component_context.update_callbacks.execute();
  }
  try {
    let res;
    if (is_render_effect) {
      res = init(signal.block);
    } else {
      res = init();
    }
    let dependencies = signal.dependencies;
    if (current_dependencies !== null) {
      let i;
      remove_consumer(signal, current_dependencies_index);
      if (dependencies !== null && current_dependencies_index > 0) {
        dependencies.length = current_dependencies_index + current_dependencies.length;
        for (i = 0; i < current_dependencies.length; i++) {
          dependencies[current_dependencies_index + i] = current_dependencies[i];
        }
      } else {
        signal.dependencies = dependencies = current_dependencies;
      }
      if (!current_skip_consumer) {
        for (i = current_dependencies_index; i < dependencies.length; i++) {
          const dependency = dependencies[i];
          if (dependency.consumers === null) {
            dependency.consumers = [signal];
          } else {
            dependency.consumers.push(signal);
          }
        }
      }
    } else if (dependencies !== null && current_dependencies_index < dependencies.length) {
      remove_consumer(signal, current_dependencies_index);
      dependencies.length = current_dependencies_index;
    }
    return res;
  } finally {
    current_dependencies = previous_dependencies;
    current_dependencies_index = previous_dependencies_index;
    current_access_id = previous_access_id;
    current_consumer = previous_consumer;
    current_block = previous_block;
    current_component_context = previous_component_context;
    current_skip_consumer = previous_skip_consumer;
  }
}
function remove_consumer(signal, start_index) {
  const dependencies = signal.dependencies;
  if (dependencies !== null) {
    let i;
    for (i = start_index; i < dependencies.length; i++) {
      const dependency = dependencies[i];
      const consumers = dependency.consumers;
      let consumers_length = 0;
      if (consumers !== null) {
        const index = consumers.indexOf(signal);
        consumers_length = consumers.length - 1;
        consumers[index] = consumers[consumers_length];
        consumers.pop();
      }
      if (consumers_length === 0 && (dependency.flags & UNOWNED) !== 0) {
        remove_consumer(dependency, 0);
      }
    }
  }
}
function destroy_references(signal) {
  const references = signal.references;
  if (references !== null) {
    let i;
    for (i = 0; i < references.length; i++) {
      destroy_signal(references[i]);
    }
  }
}
function report_error(block, error) {
  let current_block2 = block;
  let current_error = error;
  while (current_block2 !== null) {
    if (current_block2.type === TRY_BLOCK) {
      const error_fn = current_block2.state;
      try {
        error_fn(current_error);
        return;
      } catch (error2) {
        current_error = error2;
      }
    } else if (current_block2.type === ROOT_BLOCK) {
      throw error;
    }
    current_block2 = current_block2.parent;
  }
}
function execute_effect(signal) {
  if (signal.status === DESTROYED) {
    return;
  }
  const teardown = signal.value;
  const previous_effect_signal = current_effect_signal;
  current_effect_signal = signal;
  try {
    destroy_references(signal);
    if (teardown !== null) {
      teardown();
    }
    const possible_teardown = execute_signal_fn(signal);
    if (typeof possible_teardown === "function") {
      signal.value = possible_teardown;
    }
  } catch (error) {
    report_error(signal.block, error);
  } finally {
    current_effect_signal = previous_effect_signal;
  }
  if (is_runes() && // Don't rerun pre effects more than once to accomodate for "$: only runs once" behavior
  (signal.flags & PRE_EFFECT) !== 0 && current_queued_pre_effects.length > 0) {
    const previous_queued_pre_effects = current_queued_pre_effects;
    try {
      current_queued_pre_effects = [];
      flush_queued_effects(current_queued_pre_effects);
    } finally {
      current_queued_pre_effects = previous_queued_pre_effects;
    }
  }
}
function flush_queued_effects(effects) {
  const length = effects.length;
  if (length > 0) {
    if (flush_count > 100) {
      throw new Error(
        "Maximum update depth exceeded. This can happen when a reactive block or effect repeatedly sets a new value. Svelte limits the number of nested updates to prevent infinite loops."
      );
    }
    flush_count++;
    let i;
    for (i = 0; i < length; i++) {
      const signal = effects[i];
      const status = signal.status;
      if (status !== DESTROYED && is_signal_dirty(signal)) {
        signal.status = CLEAN;
        execute_effect(signal);
      } else if (status === MAYBE_DIRTY) {
        signal.status = CLEAN;
      }
    }
    effects.length = 0;
  }
}
function process_microtask() {
  is_micro_task_queued = false;
  if (flush_count > 101) {
    return;
  }
  const previous_queued_pre_effects = current_queued_pre_effects;
  const previous_queued_render_effects = current_queued_render_effects;
  const previous_queued_effects = current_queued_effects;
  current_queued_pre_effects = [];
  current_queued_render_effects = [];
  current_queued_effects = [];
  flush_queued_effects(previous_queued_pre_effects);
  flush_queued_effects(previous_queued_render_effects);
  flush_queued_effects(previous_queued_effects);
  if (!is_micro_task_queued) {
    flush_count = 0;
  }
}
function schedule_effect(signal, sync) {
  const flags = signal.flags;
  if (sync) {
    execute_effect(signal);
    signal.status = CLEAN;
  } else {
    if (current_scheduler_mode === FLUSH_MICROTASK) {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_microtask);
      }
    }
    if ((flags & RENDER_EFFECT) !== 0) {
      current_queued_render_effects.push(signal);
    } else if ((flags & PRE_EFFECT) !== 0) {
      current_queued_pre_effects.push(signal);
    } else {
      current_queued_effects.push(signal);
    }
  }
}
function flushSync(fn) {
  const previous_scheduler_mode = current_scheduler_mode;
  const previous_queued_pre_effects = current_queued_pre_effects;
  const previous_queued_render_effects = current_queued_render_effects;
  const previous_queued_effects = current_queued_effects;
  try {
    const pre_effects = [];
    const render_effects = [];
    const effects = [];
    current_scheduler_mode = FLUSH_SYNC;
    current_queued_pre_effects = pre_effects;
    current_queued_render_effects = render_effects;
    current_queued_effects = effects;
    flush_count = 0;
    flush_queued_effects(previous_queued_pre_effects);
    flush_queued_effects(previous_queued_render_effects);
    flush_queued_effects(previous_queued_effects);
    if (fn !== void 0) {
      fn();
    }
    if (pre_effects.length > 0 || render_effects.length > 0 || effects.length > 0) {
      flushSync();
    }
  } finally {
    current_scheduler_mode = previous_scheduler_mode;
    current_queued_pre_effects = previous_queued_pre_effects;
    current_queued_render_effects = previous_queued_render_effects;
    current_queued_effects = previous_queued_effects;
  }
}
function update_derived(signal) {
  const value = execute_signal_fn(signal);
  signal.status = CLEAN;
  const equals = signal.equals;
  if (!equals(value, signal.value)) {
    signal.value = value;
    mark_signal_consumers(signal, DIRTY);
  }
}
function store_get(store, store_name, stores) {
  let entry = stores[store_name];
  const is_new = entry === void 0;
  if (is_new) {
    entry = {
      store: null,
      value: /* @__PURE__ */ source(UNINITIALIZED),
      unsubscribe: EMPTY_FUNC
    };
    stores[store_name] = entry;
  }
  if (is_new || entry.store !== store) {
    entry.unsubscribe();
    entry.store = store ?? null;
    entry.unsubscribe = connect_store_to_signal(store, entry.value);
  }
  return get(entry.value);
}
function connect_store_to_signal(store, source2) {
  if (store == null) {
    set(source2, void 0);
    return EMPTY_FUNC;
  }
  const is_writable_store = typeof store.set === "function";
  let is_updating = false;
  const run = (v) => {
    if (!is_updating) {
      is_updating = true;
      source2.context = null;
      set(source2, v);
      if (is_writable_store) {
        source2.context = store;
      }
      is_updating = false;
    }
  };
  return subscribe_to_store(store, run);
}
function store_set(store, value) {
  store.set(value);
  return value;
}
function unsubscribe_on_destroy(stores) {
  onDestroy(() => {
    let store_name;
    for (store_name in stores) {
      const ref = stores[store_name];
      ref.unsubscribe();
      destroy_signal(ref.value);
    }
  });
}
function exposable(fn) {
  const previous_is_signal_exposed = is_signal_exposed;
  try {
    is_signal_exposed = true;
    return fn();
  } finally {
    is_signal_exposed = previous_is_signal_exposed;
  }
}
function get(signal) {
  if (signal.status === DESTROYED) {
    return UNINITIALIZED;
  }
  const flags = signal.flags;
  if (is_signal_exposed && current_should_capture_signal) {
    current_captured_signal = signal;
  }
  if (is_signals_recorded) {
    captured_signals.add(signal);
  }
  if (current_consumer !== null && (current_consumer.flags & MANAGED) === 0 && !current_untracking) {
    current_has_reactive_get = true;
    const dependencies = current_consumer.dependencies;
    if (current_dependencies === null && dependencies !== null && dependencies[current_dependencies_index] === signal) {
      current_dependencies_index++;
    } else if (current_dependencies === null) {
      current_dependencies = [signal];
    } else if (signal.access !== current_access_id) {
      current_dependencies.push(signal);
    }
    signal.access = current_access_id;
  }
  if ((flags & DERIVED) !== 0 && is_signal_dirty(signal)) {
    update_derived(signal);
  }
  return signal.value;
}
function set(signal, value) {
  set_signal_value(signal, value);
  return value;
}
function set_sync(signal, value) {
  flushSync(() => set_signal_value(signal, value));
}
function is_reactive(fn) {
  const previously_has_reactive_get = current_has_reactive_get;
  try {
    current_has_reactive_get = false;
    const value = fn();
    return [value, current_has_reactive_get];
  } finally {
    current_has_reactive_get = previously_has_reactive_get;
  }
}
function expose(possible_signal_fn) {
  const previous_captured_signal = current_captured_signal;
  const previous_should_capture_signal = current_should_capture_signal;
  current_captured_signal = null;
  current_should_capture_signal = true;
  try {
    const value = possible_signal_fn();
    if (current_captured_signal === null) {
      return value;
    }
    return current_captured_signal;
  } finally {
    current_captured_signal = previous_captured_signal;
    current_should_capture_signal = previous_should_capture_signal;
  }
}
function invalidate_inner_signals(fn) {
  const previous_is_signals_recorded = is_signals_recorded;
  const previous_captured_signals = captured_signals;
  is_signals_recorded = true;
  captured_signals = /* @__PURE__ */ new Set();
  try {
    untrack(fn);
  } finally {
    is_signals_recorded = previous_is_signals_recorded;
    let signal2;
    for (signal2 of captured_signals) {
      previous_captured_signals.add(signal2);
    }
    captured_signals = previous_captured_signals;
  }
  let signal;
  for (signal of captured_signals) {
    mutate(
      signal,
      null
      /* doesnt matter */
    );
  }
  return captured_signals;
}
function mutate(source2, value) {
  set_signal_value(
    source2,
    untrack(() => get(source2))
  );
  return value;
}
function mutate_store(store, expression, new_value) {
  store.set(new_value);
  return expression;
}
function mark_signal_consumers(signal, to_status) {
  const runes = is_runes();
  const consumers = signal.consumers;
  if (consumers !== null) {
    const length = consumers.length;
    let i;
    for (i = 0; i < length; i++) {
      const consumer = consumers[i];
      const status = consumer.status;
      if (status === DIRTY || !runes && consumer === current_effect_signal) {
        continue;
      }
      consumer.status = to_status;
      if (status === CLEAN) {
        if ((consumer.flags & IS_EFFECT) !== 0) {
          schedule_effect(consumer, false);
        } else {
          mark_signal_consumers(consumer, MAYBE_DIRTY);
        }
      }
    }
  }
}
function set_signal_value(signal, value) {
  if (!current_untracking && current_consumer !== null && is_runes() && (current_consumer.flags & DERIVED) !== 0) {
    throw new Error(
      `Unsafe mutations during Svelte's render or derived phase are not permitted in runes mode. This can lead to unexpected errors and possibly cause infinite loops.

If this mutation is not meant to be reactive do not use the "$state" rune for that declaration.`
    );
  }
  if ((signal.flags & SOURCE) !== 0 && !signal.equals(value, signal.value)) {
    signal.value = value;
    if (is_runes() && current_effect_signal !== null && current_effect_signal.consumers === null && current_effect_signal.status === CLEAN && current_dependencies !== null && current_dependencies.includes(signal)) {
      current_effect_signal.status = DIRTY;
      schedule_effect(current_effect_signal, false);
    }
    mark_signal_consumers(signal, DIRTY);
    const context = signal.context;
    if (context !== null) {
      context.set(value);
    }
  }
}
function destroy_signal(signal) {
  const teardown = signal.value;
  const destroy = signal.destroy;
  destroy_references(signal);
  remove_consumer(signal, 0);
  signal.init = null;
  signal.references = null;
  signal.destroy = null;
  signal.context = null;
  signal.block = null;
  signal.value = null;
  signal.dependencies = null;
  signal.consumers = null;
  signal.status = DESTROYED;
  if (destroy !== null) {
    if (is_array(destroy)) {
      let i;
      for (i = 0; i < destroy.length; i++) {
        destroy[i]();
      }
    } else {
      destroy();
    }
  }
  if (teardown !== null && (signal.flags & IS_EFFECT) !== 0) {
    teardown();
  }
}
// @__NO_SIDE_EFFECTS__
function derived(init, equals) {
  const is_unowned = current_effect_signal === null;
  const flags = is_unowned ? DERIVED | UNOWNED : DERIVED;
  const signal = create_signal_object(flags, UNINITIALIZED, CLEAN, current_block);
  signal.init = init;
  signal.context = current_component_context;
  signal.equals = get_equals_method(equals);
  if (!is_unowned) {
    push_reference(current_effect_signal, signal);
  }
  return signal;
}
// @__NO_SIDE_EFFECTS__
function source(initial_value, equals) {
  const source2 = create_signal_object(SOURCE, initial_value, CLEAN, null);
  source2.equals = get_equals_method(equals);
  return source2;
}
function get_equals_method(equals) {
  if (equals !== void 0) {
    return equals;
  }
  const context = current_component_context;
  if (context && !context.immutable) {
    return safe_equal;
  }
  return default_equals;
}
function untrack(fn) {
  const previous_untracking = current_untracking;
  try {
    current_untracking = true;
    return fn();
  } finally {
    current_untracking = previous_untracking;
  }
}
function internal_create_effect(type, init, sync, block) {
  const signal = create_signal_object(type, null, DIRTY, block);
  signal.init = init;
  signal.context = current_component_context;
  schedule_effect(signal, sync);
  if (current_effect_signal !== null && (type & MANAGED) === 0) {
    push_reference(current_effect_signal, signal);
  }
  return signal;
}
function effect(init) {
  if (current_effect_signal === null) {
    throw new Error("The Svelte $effect rune can only be used during component initialisation.");
  }
  return internal_create_effect(EFFECT, init, false, current_block);
}
function managed_effect(init) {
  return internal_create_effect(EFFECT | MANAGED, init, false, current_block);
}
function managed_pre_effect(init) {
  return internal_create_effect(PRE_EFFECT | MANAGED, init, false, current_block);
}
function pre_effect(init) {
  return internal_create_effect(PRE_EFFECT, init, true, current_block);
}
function render_effect(init, block = current_block, managed = false, sync = true) {
  let flags = RENDER_EFFECT;
  if (managed) {
    flags |= MANAGED;
  }
  return internal_create_effect(flags, init, sync, block);
}
function push_destroy_fn(signal, destroy_fn) {
  let destroy = signal.destroy;
  if (destroy === null) {
    signal.destroy = destroy_fn;
  } else if (is_array(destroy)) {
    destroy.push(destroy_fn);
  } else {
    signal.destroy = [destroy, destroy_fn];
  }
}
var Selector = class {
  #consumers_map = /* @__PURE__ */ new Map();
  #active_key;
  constructor(key) {
    this.#active_key = /* @__PURE__ */ source(key || null);
  }
  get current() {
    return get(this.#active_key);
  }
  set(key) {
    const active_key = this.#active_key;
    const previous_key = active_key.value;
    if (previous_key === key) {
      return;
    }
    set_signal_value(active_key, key);
    const consumers_map = this.#consumers_map;
    let consumers = consumers_map.get(previous_key);
    if (consumers !== void 0) {
      this.#update_consumers(consumers);
    }
    consumers = consumers_map.get(key);
    if (consumers !== void 0) {
      this.#update_consumers(consumers);
    }
  }
  #update_consumers(consumers) {
    let consumer;
    for (consumer of consumers) {
      consumer.status = DIRTY;
      if ((consumer.flags & IS_EFFECT) !== 0) {
        schedule_effect(consumer, false);
      } else {
        mark_signal_consumers(consumer, DIRTY);
      }
    }
  }
  is(key) {
    const consumers_map = this.#consumers_map;
    let consumers = consumers_map.get(key);
    if (consumers === void 0) {
      consumers = /* @__PURE__ */ new Set();
      consumers_map.set(key, consumers);
    }
    const consumer = current_consumer;
    const effect2 = current_effect_signal;
    if (effect2 !== null && consumer !== null && !consumers.has(consumer)) {
      consumers.add(consumer);
      push_destroy_fn(effect2, () => {
        const consumers_set = consumers;
        consumers_set.delete(effect2);
        if (consumers_set.size === 0) {
          consumers_map.delete(key);
        }
      });
    }
    return this.#active_key.value === key;
  }
};
function selector(key) {
  return new Selector(key);
}
function is_signal(val) {
  return typeof val === "object" && val !== null && typeof val.flags === "number";
}
function is_store(val) {
  return typeof val === "object" && val !== null && typeof val.subscribe === "function";
}
function prop_source(props_obj, key, default_value) {
  const props = is_signal(props_obj) ? get(props_obj) : props_obj;
  const possible_signal = expose(() => props[key]);
  const update_bound_prop = Object.getOwnPropertyDescriptor(props, key)?.set;
  let value = props[key];
  const should_set_default_value = value === void 0 && default_value !== void 0;
  if (is_signal(possible_signal) && possible_signal.value === value && update_bound_prop === void 0 && get_equals_method() === possible_signal.equals) {
    if (should_set_default_value) {
      set(possible_signal, default_value);
    }
    return possible_signal;
  }
  if (should_set_default_value) {
    value = default_value;
  }
  const source_signal = /* @__PURE__ */ source(value);
  const immutable = current_component_context.immutable;
  let ignore_next1 = false;
  let ignore_next2 = false;
  let mount = true;
  pre_effect(() => {
    const props2 = is_signal(props_obj) ? get(props_obj) : props_obj;
    const propagating_value = props2[key];
    if (mount) {
      mount = false;
      return;
    }
    if (ignore_next1) {
      ignore_next1 = false;
      return;
    }
    if (not_equal(immutable, propagating_value, source_signal.value)) {
      ignore_next2 = true;
      untrack(() => set_signal_value(source_signal, propagating_value));
    }
  });
  if (is_signal(possible_signal) && update_bound_prop !== void 0) {
    let ignore_first = !should_set_default_value;
    pre_effect(() => {
      const propagating_value = get(source_signal);
      if (ignore_first) {
        ignore_first = false;
        return;
      }
      if (ignore_next2) {
        ignore_next2 = false;
        return;
      }
      if (not_equal(immutable, propagating_value, possible_signal.value)) {
        ignore_next1 = true;
        untrack(() => update_bound_prop(propagating_value));
      }
    });
  }
  return source_signal;
}
function prop(props_obj, key, default_value) {
  if (default_value !== void 0) {
    const props = is_signal(props_obj) ? get(props_obj) : props_obj;
    const possible_signal = expose(() => props[key]);
    let value = props[key];
    if (is_signal(possible_signal) && possible_signal.value === value && value === void 0) {
      const update = Object.getOwnPropertyDescriptor(props, key)?.set;
      if (update === void 0) {
        set(possible_signal, default_value);
      } else {
        update(default_value);
      }
    }
  }
  return () => {
    const props = is_signal(props_obj) ? get(props_obj) : props_obj;
    let value = props[key];
    if (value === void 0 && default_value !== void 0) {
      value = default_value;
    }
    return value;
  };
}
function not_equal(immutable, a, b) {
  return immutable ? immutable_not_equal(a, b) : safe_not_equal(a, b);
}
function immutable_not_equal(a, b) {
  return a != a ? b == b : a !== b;
}
function safe_not_equal(a, b) {
  return a != a ? (
    // eslint-disable-next-line eqeqeq
    b == b
  ) : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equal(a, b) {
  return !safe_not_equal(a, b);
}
function get_or_init_context_map() {
  const component_context = current_component_context;
  if (component_context === null) {
    throw new Error("Context can only be used during component initialisation.");
  }
  let context_map = component_context.context;
  if (context_map === null) {
    const parent_context = get_parent_context(component_context);
    context_map = component_context.context = new Map(parent_context || void 0);
  }
  return context_map;
}
function get_parent_context(component_context) {
  let parent = component_context.parent;
  while (parent !== null) {
    const context_map = parent.context;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.parent;
  }
  return null;
}
function bubble_event($$events, event) {
  const events = $$events[event.type];
  const callbacks = is_array(events) ? events.slice() : [events];
  let fn;
  for (fn of callbacks) {
    if (is_signal(fn)) {
      get(fn)(event);
    } else {
      fn(event);
    }
  }
}
function tick() {
  return Promise.resolve();
}
function increment(signal) {
  const value = get(signal);
  set_signal_value(signal, value + 1);
  return value;
}
function increment_store(store, store_value) {
  store.set(store_value + 1);
  return store_value;
}
function decrement(signal) {
  const value = get(signal);
  set_signal_value(signal, value - 1);
  return value;
}
function decrement_store(store, store_value) {
  store.set(store_value - 1);
  return store_value;
}
function increment_pre(signal) {
  const value = get(signal) + 1;
  set_signal_value(signal, value);
  return value;
}
function increment_pre_store(store, store_value) {
  const value = store_value + 1;
  store.set(value);
  return value;
}
function decrement_pre(signal) {
  const value = get(signal) - 1;
  set_signal_value(signal, value);
  return value;
}
function decrement_pre_store(store, store_value) {
  const value = store_value - 1;
  store.set(value);
  return value;
}
function exclude_from_object(obj, keys) {
  obj = { ...obj };
  let key;
  for (key of keys) {
    delete obj[key];
  }
  return obj;
}
function value_or_fallback(value, fallback) {
  return value === void 0 ? fallback : value;
}
function onDestroy(fn) {
  if (!is_ssr) {
    effect(() => () => untrack(fn));
  }
}
function push(events, runes = false, immutable = false) {
  const context_stack_item = create_component_context(events);
  context_stack_item.runes = runes;
  context_stack_item.immutable = immutable;
  current_component_context = context_stack_item;
}
function pop() {
  const context_stack_item = current_component_context;
  if (context_stack_item !== null) {
    current_component_context = context_stack_item.parent;
  }
}

export {
  ROOT_BLOCK,
  IF_BLOCK,
  EACH_ITEM_BLOCK,
  AWAIT_BLOCK,
  KEY_BLOCK,
  EACH_ITEM_REACTIVE,
  EACH_INDEX_REACTIVE,
  EACH_KEYED,
  EACH_IS_CONTROLLED,
  create_root_block,
  create_if_block,
  create_key_block,
  create_head_block,
  create_dynamic_element_block,
  create_dynamic_component_block,
  create_await_block,
  create_try_block,
  create_each_block,
  create_each_item_block,
  object_ref,
  is_array,
  array_from,
  define_property,
  UNINITIALIZED,
  current_block,
  current_component_context,
  is_ssr,
  set_is_ssr,
  execute_effect,
  schedule_effect,
  flushSync,
  store_get,
  store_set,
  unsubscribe_on_destroy,
  exposable,
  get,
  set,
  set_sync,
  is_reactive,
  expose,
  invalidate_inner_signals,
  mutate,
  mutate_store,
  set_signal_value,
  destroy_signal,
  derived,
  source,
  untrack,
  effect,
  managed_effect,
  managed_pre_effect,
  pre_effect,
  render_effect,
  push_destroy_fn,
  selector,
  is_signal,
  is_store,
  prop_source,
  prop,
  safe_not_equal,
  safe_equal,
  get_or_init_context_map,
  bubble_event,
  tick,
  increment,
  increment_store,
  decrement,
  decrement_store,
  increment_pre,
  increment_pre_store,
  decrement_pre,
  decrement_pre_store,
  exclude_from_object,
  value_or_fallback,
  onDestroy,
  push,
  pop
};
//# sourceMappingURL=chunk-T3PU6ST4.js.map
