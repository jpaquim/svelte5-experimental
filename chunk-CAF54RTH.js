// src/internal/common.js
var EMPTY_FUNC = () => {
};
function is_promise(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && typeof /** @type {any} */
  value.then === "function";
}

// src/store/utils.js
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    if (invalidate)
      invalidate(void 0);
    return EMPTY_FUNC;
  }
  const unsub = store.subscribe(run, invalidate);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

export {
  EMPTY_FUNC,
  is_promise,
  subscribe_to_store
};
//# sourceMappingURL=chunk-CAF54RTH.js.map
