import {
  EMPTY_FUNC,
  subscribe_to_store
} from "./chunk-CAF54RTH.js";

// src/internal/client/block.js
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
var EACH_IS_ANIMATED = 1 << 4;
function create_root_block(container, intro) {
  return {
    dom: null,
    effect: null,
    container,
    intro,
    parent: null,
    transition: null,
    type: ROOT_BLOCK
  };
}
function create_if_block() {
  return {
    current: false,
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    type: IF_BLOCK
  };
}
function create_key_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    type: KEY_BLOCK
  };
}
function create_head_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    type: HEAD_BLOCK
  };
}
function create_dynamic_element_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    type: DYNAMIC_ELEMENT_BLOCK
  };
}
function create_dynamic_component_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    type: DYNAMIC_COMPONENT_BLOCK
  };
}
function create_await_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    pending: true,
    transition: null,
    type: AWAIT_BLOCK
  };
}
function create_try_block() {
  return {
    dom: null,
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    state: null,
    type: TRY_BLOCK
  };
}
function create_each_block(flags, anchor) {
  return {
    anchor,
    dom: null,
    flags,
    items: [],
    effect: null,
    parent: (
      /** @type {import('./types.js').Block} */
      current_block
    ),
    transition: null,
    transitions: [],
    type: EACH_BLOCK
  };
}
function create_each_item_block(item, index, key) {
  return {
    dom: null,
    effect: null,
    index,
    key,
    item,
    parent: (
      /** @type {import('./types.js').EachBlock} */
      current_block
    ),
    transition: null,
    transitions: null,
    type: EACH_ITEM_BLOCK
  };
}

// src/internal/client/utils.js
var object_ref = Object;
var array_ref = Array;
var is_array = array_ref.isArray;
var array_from = array_ref.from;
var define_property = object_ref.defineProperty;

// src/internal/client/runtime.js
var SOURCE = 1;
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var PRE_EFFECT = 1 << 3;
var RENDER_EFFECT = 1 << 4;
var MANAGED = 1 << 5;
var UNOWNED = 1 << 6;
var CLEAN = 1 << 7;
var DIRTY = 1 << 8;
var MAYBE_DIRTY = 1 << 9;
var INERT = 1 << 10;
var DESTROYED = 1 << 11;
var IS_EFFECT = EFFECT | PRE_EFFECT | RENDER_EFFECT;
var FLUSH_MICROTASK = 0;
var FLUSH_SYNC = 1;
var MAX_SAFE_INT = Number.MAX_SAFE_INTEGER;
var UNINITIALIZED = Symbol();
var current_scheduler_mode = FLUSH_MICROTASK;
var is_micro_task_queued = false;
var is_signal_exposed = false;
var current_queued_pre_effects = [];
var current_queued_render_effects = [];
var current_queued_effects = [];
var flush_count = 0;
var current_consumer = null;
var current_effect = null;
var current_dependencies = null;
var current_dependencies_index = 0;
var current_consumer_clock = 1;
var current_clock = 1;
var current_should_capture_signal = false;
var current_untracking = false;
var ignore_mutation_validation = false;
var current_captured_signal = null;
var current_skip_consumer = false;
var is_signals_recorded = false;
var captured_signals = /* @__PURE__ */ new Set();
var current_block = null;
var current_component_context = null;
var is_ssr = false;
function set_is_ssr(ssr) {
  is_ssr = ssr;
}
function set_untracking(value) {
  current_untracking = value;
}
function create_component_context(events) {
  const parent = current_component_context;
  return {
    events,
    parent,
    accessors: null,
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
function create_signal_object(flags, value, block) {
  return {
    block,
    clock: 0,
    consumers: null,
    context: null,
    dependencies: null,
    destroy: null,
    equals: null,
    flags,
    init: null,
    references: null,
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
  const flags = signal.flags;
  if ((flags & DIRTY) !== 0 || signal.value === UNINITIALIZED) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    const dependencies = signal.dependencies;
    if (dependencies !== null) {
      const length = dependencies.length;
      let i;
      for (i = 0; i < length; i++) {
        const dependency = dependencies[i];
        if ((dependency.flags & MAYBE_DIRTY) !== 0 && !is_signal_dirty(dependency)) {
          set_signal_status(dependency, CLEAN);
          continue;
        }
        if ((dependency.flags & DIRTY) !== 0 || dependency.value === UNINITIALIZED) {
          if ((dependency.flags & DERIVED) !== 0) {
            update_derived(dependency, true);
            if ((signal.flags & DIRTY) !== 0) {
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
  const previous_consumer_clock = current_consumer_clock;
  const previous_consumer = current_consumer;
  const previous_block = current_block;
  const previous_component_context = current_component_context;
  const previous_skip_consumer = current_skip_consumer;
  const is_render_effect = (signal.flags & RENDER_EFFECT) !== 0;
  current_dependencies = /** @type {null | import('./types.js').Signal[]} */
  null;
  current_dependencies_index = 0;
  if (current_clock === MAX_SAFE_INT) {
    current_clock = 1;
  } else {
    current_clock++;
  }
  current_consumer_clock = current_clock;
  current_consumer = signal;
  current_block = signal.block;
  current_component_context = signal.context;
  current_skip_consumer = current_effect === null && (signal.flags & UNOWNED) !== 0;
  if (is_render_effect && current_component_context?.update_callbacks != null) {
    current_component_context.update_callbacks.execute();
  }
  try {
    let res;
    if (is_render_effect) {
      res = /** @type {(block: import('./types.js').Block) => V} */
      init(
        /** @type {import('./types.js').Block} */
        signal.block
      );
    } else {
      res = /** @type {() => V} */
      init();
    }
    let dependencies = signal.dependencies;
    if (current_dependencies !== null) {
      let i;
      remove_consumer(signal, current_dependencies_index, false);
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
      remove_consumer(signal, current_dependencies_index, false);
      dependencies.length = current_dependencies_index;
    }
    return res;
  } finally {
    current_dependencies = previous_dependencies;
    current_dependencies_index = previous_dependencies_index;
    current_consumer_clock = previous_consumer_clock;
    current_consumer = previous_consumer;
    current_block = previous_block;
    current_component_context = previous_component_context;
    current_skip_consumer = previous_skip_consumer;
  }
}
function remove_consumer(signal, start_index, remove_unowned) {
  const dependencies = signal.dependencies;
  if (dependencies !== null) {
    let i;
    for (i = start_index; i < dependencies.length; i++) {
      const dependency = dependencies[i];
      const consumers = dependency.consumers;
      let consumers_length = 0;
      if (consumers !== null) {
        consumers_length = consumers.length - 1;
        if (consumers_length === 0) {
          dependency.consumers = null;
        } else {
          const index = consumers.indexOf(signal);
          consumers[index] = consumers[consumers_length];
          consumers.pop();
        }
      }
      if (remove_unowned && consumers_length === 0 && (dependency.flags & UNOWNED) !== 0) {
        remove_consumer(dependency, 0, true);
      }
    }
  }
}
function destroy_references(signal) {
  const references = signal.references;
  signal.references = null;
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
      const error_fn = (
        /** @type {(error: unknown) => void} */
        current_block2.state
      );
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
  if ((signal.flags & DESTROYED) !== 0) {
    return;
  }
  const teardown = signal.value;
  const previous_effect = current_effect;
  current_effect = signal;
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
    const block = signal.block;
    if (block !== null) {
      report_error(block, error);
    } else {
      throw error;
    }
  } finally {
    current_effect = previous_effect;
  }
  if (is_runes() && // Don't rerun pre effects more than once to accomodate for "$: only runs once" behavior
  (signal.flags & PRE_EFFECT) !== 0 && current_queued_pre_effects.length > 0) {
    const previous_queued_pre_effects = current_queued_pre_effects;
    try {
      current_queued_pre_effects = [];
      flush_queued_effects(previous_queued_pre_effects);
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
      const flags = signal.flags;
      if ((flags & DESTROYED) === 0 && (flags & INERT) === 0) {
        if (is_signal_dirty(signal)) {
          set_signal_status(signal, CLEAN);
          execute_effect(signal);
        } else if ((flags & MAYBE_DIRTY) !== 0) {
          set_signal_status(signal, CLEAN);
        }
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
    set_signal_status(signal, CLEAN);
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
function update_derived(signal, force_schedule) {
  const value = execute_signal_fn(signal);
  const status = current_skip_consumer || current_effect === null && (signal.flags & UNOWNED) !== 0 ? DIRTY : CLEAN;
  set_signal_status(signal, status);
  const equals = (
    /** @type {import('./types.js').EqualsFunctions} */
    signal.equals
  );
  if (!equals(value, signal.value)) {
    signal.value = value;
    mark_signal_consumers(signal, DIRTY, force_schedule);
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
  const run = (v) => {
    ignore_mutation_validation = true;
    set(source2, v);
    ignore_mutation_validation = false;
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
  const flags = signal.flags;
  if ((flags & DESTROYED) !== 0) {
    return (
      /** @type {V} */
      UNINITIALIZED
    );
  }
  if (is_signal_exposed && current_should_capture_signal) {
    current_captured_signal = signal;
  }
  if (is_signals_recorded) {
    captured_signals.add(signal);
  }
  if (current_consumer !== null && (current_consumer.flags & MANAGED) === 0 && !current_untracking) {
    const dependencies = current_consumer.dependencies;
    if (current_dependencies === null && dependencies !== null && dependencies[current_dependencies_index] === signal) {
      current_dependencies_index++;
    } else if (current_dependencies === null) {
      current_dependencies = [signal];
    } else if (signal.clock !== current_clock) {
      current_dependencies.push(signal);
    }
    signal.clock = current_consumer_clock;
  }
  if ((flags & DERIVED) !== 0 && is_signal_dirty(signal)) {
    update_derived(signal, false);
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
function mark_subtree_inert(signal, inert) {
  const flags = signal.flags;
  if ((flags & INERT) === 0 && inert || (flags & INERT) !== 0 && !inert) {
    signal.flags ^= INERT;
    if (!inert && (flags & IS_EFFECT) !== 0 && (flags & CLEAN) === 0) {
      schedule_effect(
        /** @type {import('./types.js').EffectSignal} */
        signal,
        false
      );
    }
  }
  const references = signal.references;
  if (references !== null) {
    let i;
    for (i = 0; i < references.length; i++) {
      mark_subtree_inert(references[i], inert);
    }
  }
}
function mark_signal_consumers(signal, to_status, force_schedule) {
  const runes = is_runes();
  const consumers = signal.consumers;
  if (consumers !== null) {
    const length = consumers.length;
    let i;
    for (i = 0; i < length; i++) {
      const consumer = consumers[i];
      const flags = consumer.flags;
      if ((flags & DIRTY) !== 0 || !runes && consumer === current_effect || !force_schedule && consumer === current_effect) {
        continue;
      }
      set_signal_status(consumer, to_status);
      if ((flags & CLEAN) !== 0) {
        if ((consumer.flags & IS_EFFECT) !== 0) {
          schedule_effect(
            /** @type {import('./types.js').EffectSignal} */
            consumer,
            false
          );
        } else {
          mark_signal_consumers(consumer, MAYBE_DIRTY, force_schedule);
        }
      }
    }
  }
}
function set_signal_value(signal, value) {
  if (!current_untracking && !ignore_mutation_validation && current_consumer !== null && is_runes() && (current_consumer.flags & DERIVED) !== 0) {
    throw new Error(
      `Unsafe mutations during Svelte's render or derived phase are not permitted in runes mode. This can lead to unexpected errors and possibly cause infinite loops.

If this mutation is not meant to be reactive do not use the "$state" rune for that declaration.`
    );
  }
  if ((signal.flags & SOURCE) !== 0 && !/** @type {import('./types.js').EqualsFunctions} */
  signal.equals(value, signal.value)) {
    signal.value = value;
    if (is_runes() && !current_untracking && current_effect !== null && current_effect.consumers === null && (current_effect.flags & CLEAN) !== 0 && current_dependencies !== null && current_dependencies.includes(signal)) {
      set_signal_status(current_effect, DIRTY);
      schedule_effect(current_effect, false);
    }
    mark_signal_consumers(signal, DIRTY, true);
  }
}
function destroy_signal(signal) {
  const teardown = (
    /** @type {null | (() => void)} */
    signal.value
  );
  const destroy = signal.destroy;
  destroy_references(signal);
  remove_consumer(signal, 0, true);
  signal.init = null;
  signal.references = null;
  signal.destroy = null;
  signal.context = null;
  signal.block = null;
  signal.value = /** @type {V} */
  null;
  signal.dependencies = null;
  signal.consumers = null;
  set_signal_status(signal, DESTROYED);
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
  const is_unowned = current_effect === null;
  const flags = is_unowned ? DERIVED | UNOWNED : DERIVED;
  const signal = (
    /** @type {import('./types.js').Signal<V>} */
    create_signal_object(flags | CLEAN, UNINITIALIZED, current_block)
  );
  signal.init = init;
  signal.context = current_component_context;
  signal.equals = get_equals_method(equals);
  if (!is_unowned) {
    push_reference(
      /** @type {import('./types.js').EffectSignal} */
      current_effect,
      signal
    );
  }
  return signal;
}
// @__NO_SIDE_EFFECTS__
function source(initial_value, equals) {
  const source2 = create_signal_object(SOURCE | CLEAN, initial_value, null);
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
  const signal = create_signal_object(type | DIRTY, null, block);
  signal.init = init;
  signal.context = current_component_context;
  schedule_effect(signal, sync);
  if (current_effect !== null && (type & MANAGED) === 0) {
    push_reference(current_effect, signal);
  }
  return signal;
}
function effect(init) {
  if (current_effect === null) {
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
  const sync = current_effect !== null && (current_effect.flags & RENDER_EFFECT) !== 0;
  return internal_create_effect(PRE_EFFECT, init, sync, current_block);
}
function render_effect(init, block = current_block, managed = false, sync = true) {
  let flags = RENDER_EFFECT;
  if (managed) {
    flags |= MANAGED;
  }
  return internal_create_effect(
    flags,
    /** @type {any} */
    init,
    sync,
    block
  );
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
function set_signal_status(signal, status) {
  const flags = signal.flags;
  if ((flags & status) === 0) {
    if ((flags & MAYBE_DIRTY) !== 0) {
      signal.flags ^= MAYBE_DIRTY;
    } else if ((flags & CLEAN) !== 0) {
      signal.flags ^= CLEAN;
    } else if ((flags & DIRTY) !== 0) {
      signal.flags ^= DIRTY;
    }
    signal.flags ^= status;
  }
}
var Selector = class {
  /** @type {Map<V, Set<import('./types.js').Signal>>} */
  #consumers_map = /* @__PURE__ */ new Map();
  /** @type {import('./types.js').Signal<V | null>} */
  #active_key;
  /** @param {V | null} [key] */
  constructor(key) {
    this.#active_key = /* @__PURE__ */ source(key || null);
  }
  get current() {
    return get(this.#active_key);
  }
  /**
   * @param {V | null} key
   * @returns {void}
   */
  set(key) {
    const active_key = this.#active_key;
    const previous_key = active_key.value;
    if (previous_key === key) {
      return;
    }
    set_signal_value(active_key, key);
    const consumers_map = this.#consumers_map;
    let consumers = consumers_map.get(
      /** @type {V} */
      previous_key
    );
    if (consumers !== void 0) {
      this.#update_consumers(consumers);
    }
    consumers = consumers_map.get(
      /** @type {V} */
      key
    );
    if (consumers !== void 0) {
      this.#update_consumers(consumers);
    }
  }
  /**
   * @param {Set<import('./types.js').Signal>} consumers
   * @returns {void}
   */
  #update_consumers(consumers) {
    let consumer;
    for (consumer of consumers) {
      set_signal_status(consumer, DIRTY);
      if ((consumer.flags & IS_EFFECT) !== 0) {
        schedule_effect(
          /** @type {import('./types.js').EffectSignal} */
          consumer,
          false
        );
      } else {
        mark_signal_consumers(consumer, DIRTY, true);
      }
    }
  }
  /**
   * @param {V} key
   * @returns {boolean}
   */
  is(key) {
    const consumers_map = this.#consumers_map;
    let consumers = consumers_map.get(key);
    if (consumers === void 0) {
      consumers = /* @__PURE__ */ new Set();
      consumers_map.set(key, consumers);
    }
    const consumer = current_consumer;
    const effect2 = current_effect;
    if (effect2 !== null && consumer !== null && !consumers.has(consumer)) {
      consumers.add(consumer);
      push_destroy_fn(effect2, () => {
        const consumers_set = (
          /** @type {Set<import('./types.js').Signal>} */
          consumers
        );
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
  return typeof val === "object" && val !== null && typeof /** @type {import('./types.js').Signal<V>} */
  val.flags === "number";
}
function prop_source(props_obj, key, default_value, call_default_value) {
  const props = is_signal(props_obj) ? get(props_obj) : props_obj;
  const possible_signal = (
    /** @type {import('./types.js').MaybeSignal<V>} */
    expose(() => props[key])
  );
  const update_bound_prop = Object.getOwnPropertyDescriptor(props, key)?.set;
  let value = props[key];
  const should_set_default_value = value === void 0 && default_value !== void 0;
  if (is_signal(possible_signal) && possible_signal.value === value && update_bound_prop === void 0 && get_equals_method() === possible_signal.equals) {
    if (should_set_default_value) {
      set(
        possible_signal,
        // @ts-expect-error would need a cumbersome method overload to type this
        call_default_value ? default_value() : default_value
      );
    }
    return possible_signal;
  }
  if (should_set_default_value) {
    value = // @ts-expect-error would need a cumbersome method overload to type this
    call_default_value ? default_value() : default_value;
  }
  const source_signal = /* @__PURE__ */ source(value);
  const immutable = (
    /** @type {import('./types.js').ComponentContext} */
    current_component_context.immutable
  );
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
      flushSync();
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
  return (
    /** @type {import('./types.js').Signal<V>} */
    source_signal
  );
}
function prop(props_obj, key) {
  return () => {
    const props = is_signal(props_obj) ? get(props_obj) : props_obj;
    return (
      /** @type {V} */
      props[key]
    );
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
      get(fn).call(this, event);
    } else {
      fn.call(this, event);
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
function reactive_import(fn) {
  const s = /* @__PURE__ */ source(0);
  return function() {
    if (arguments.length === 1) {
      set(s, get(s) + 1);
      return arguments[0];
    } else {
      get(s);
      return fn();
    }
  };
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
function pop(accessors) {
  const context_stack_item = current_component_context;
  if (context_stack_item !== null) {
    if (accessors !== void 0) {
      context_stack_item.accessors = accessors;
    }
    current_component_context = context_stack_item.parent;
  }
}

// src/internal/client/validate.js
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
    const { message } = (
      /** @type {Error} */
      err
    );
    if (typeof message === "string" && message.indexOf("is not a function") !== -1) {
      throw new Error(error_message);
    } else {
      throw err;
    }
  }
}
function validate_void_dynamic_element(tag_fn) {
  const tag = tag_fn();
  if (tag && is_void(tag)) {
    console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
  }
}
function validate_dynamic_element_tag(tag_fn) {
  const tag = tag_fn();
  const is_string = typeof tag === "string";
  if (tag && !is_string) {
    throw new Error('<svelte:element> expects "this" attribute to be a string.');
  }
}
function validate_each_keys(collection, key_fn) {
  const keys = /* @__PURE__ */ new Map();
  const maybe_array = collection();
  const array = is_array(maybe_array) ? maybe_array : maybe_array == null ? [] : Array.from(maybe_array);
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const key = key_fn(array[i]);
    if (keys.has(key)) {
      throw new Error(
        `Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
          key
        )} and ${i} with value '${array[i]}' are duplicates`
      );
    }
    keys.set(key, i);
  }
}
function loop_guard(timeout) {
  const start = Date.now();
  return () => {
    if (Date.now() - start > timeout) {
      throw new Error("Infinite loop detected");
    }
  };
}

export {
  ROOT_BLOCK,
  IF_BLOCK,
  EACH_BLOCK,
  EACH_ITEM_BLOCK,
  AWAIT_BLOCK,
  KEY_BLOCK,
  DYNAMIC_COMPONENT_BLOCK,
  EACH_ITEM_REACTIVE,
  EACH_INDEX_REACTIVE,
  EACH_KEYED,
  EACH_IS_CONTROLLED,
  EACH_IS_ANIMATED,
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
  current_effect,
  current_untracking,
  current_block,
  current_component_context,
  is_ssr,
  set_is_ssr,
  set_untracking,
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
  expose,
  invalidate_inner_signals,
  mutate,
  mutate_store,
  mark_subtree_inert,
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
  reactive_import,
  exclude_from_object,
  value_or_fallback,
  onDestroy,
  push,
  pop,
  validate_store,
  validate_dynamic_component,
  validate_void_dynamic_element,
  validate_dynamic_element_tag,
  validate_each_keys,
  loop_guard
};
//# sourceMappingURL=chunk-MJHIVLLY.js.map
