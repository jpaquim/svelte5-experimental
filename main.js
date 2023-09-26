import {
  mount
} from "./chunk-VB2NFNXM.js";
import {
  current_component_context,
  destroy_signal,
  effect,
  flushSync,
  get,
  get_or_init_context_map,
  is_array,
  is_signal,
  is_ssr,
  managed_effect,
  onDestroy,
  selector,
  tick,
  untrack
} from "./chunk-T3PU6ST4.js";
import "./chunk-ZADVA3HR.js";
import "./chunk-ZS7NZCD4.js";

// src/main/index.ts
function onMount(fn) {
  if (!is_ssr) {
    effect(() => {
      const result = untrack(fn);
      if (typeof result === "function") {
        return result;
      }
    });
  }
}
function getContext(key) {
  const context_map = get_or_init_context_map();
  return context_map.get(key);
}
function setContext(key, value) {
  const context_map = get_or_init_context_map();
  context_map.set(key, value);
  return value;
}
function hasContext(key) {
  const context_map = get_or_init_context_map();
  return context_map.has(key);
}
function getAllContexts() {
  const context_map = get_or_init_context_map();
  return context_map;
}
function create_custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
function createEventDispatcher() {
  const component_context = current_component_context;
  if (component_context === null) {
    throw new Error("createEventDispatcher can only be used during component initialisation.");
  }
  return (type, detail, options) => {
    const events = component_context.events[type];
    if (events) {
      const callbacks = is_array(events) ? events.slice() : [events];
      const event = create_custom_event(type, detail, options);
      for (const fn of callbacks) {
        if (is_signal(fn)) {
          get(fn)(event);
        } else {
          fn(event);
        }
      }
      return !event.defaultPrevented;
    }
    return true;
  };
}
function init_update_callbacks() {
  let called_before = false;
  let called_after = false;
  const update_callbacks = {
    before: [],
    after: [],
    execute() {
      if (!called_before) {
        called_before = true;
        untrack(() => update_callbacks.before.forEach((c) => c()));
        if (!called_after) {
          effect(() => {
            called_before = false;
            called_after = true;
            untrack(() => update_callbacks.after.forEach((c) => c()));
            const managed = managed_effect(() => {
              destroy_signal(managed);
              called_after = false;
            });
          });
        } else {
          effect(() => {
            called_before = false;
          });
        }
      }
    }
  };
  return update_callbacks;
}
function beforeUpdate(fn) {
  const component_context = current_component_context;
  if (component_context === null) {
    throw new Error("beforeUpdate can only be used during component initialisation.");
  }
  if (component_context.update_callbacks === null) {
    component_context.update_callbacks = init_update_callbacks();
  }
  component_context.update_callbacks.before.push(fn);
}
function afterUpdate(fn) {
  const component_context = current_component_context;
  if (component_context === null) {
    throw new Error("afterUpdate can only be used during component initialisation.");
  }
  if (component_context.update_callbacks === null) {
    component_context.update_callbacks = init_update_callbacks();
  }
  component_context.update_callbacks.after.push(fn);
}
export {
  afterUpdate,
  beforeUpdate,
  createEventDispatcher,
  flushSync,
  getAllContexts,
  getContext,
  hasContext,
  mount,
  onDestroy,
  onMount,
  selector,
  setContext,
  tick,
  untrack
};
//# sourceMappingURL=main.js.map
