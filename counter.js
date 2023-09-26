// App.svelte (Svelte v5.0.0-preview)
// Note: compiler output will change before 5.0 is released!
import * as $ from "./internal.js";

function increment(_, count) {
	$.set(count, $.get(count) + 1);
}

const main = $.template(`<button> </button>`);

export default function App($$anchor, $$props, $$events, $$slots) {
	$.push($$events, true);
	let count = $.source(0);

	/* Init */
	var button = $.open($$anchor, main);

	var text = $.child(button);

	/* Update */
	$.text(text, () => `clicks: ${$.stringify($.get(count))}`);

	button.__click = [increment, count];
	$.close($$anchor, button);
	$.pop();
}

$.delegate(["click"]);