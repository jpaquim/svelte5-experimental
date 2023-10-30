// App.svelte (Svelte v5.0.0-preview)
// Note: compiler output will change before 5.0 is released!
import * as $ from "svelte/internal";

function increment(_, count) {
	$.set(count, $.get(count) + 1);
}

const frag = $.template(`<button> </button>`);

export default function App($$anchor, $$props, $$events, $$slots) {
	$.push($$events, true);
	let count = $.source(0);

	/* Init */
	var button = $.open($$anchor, true, frag);

	var text = $.child(button);

	/* Update */
	$.text_effect(text, () => `clicks: ${$.stringify($.get(count))}`);

	button.__click = [increment, count];
	$.close($$anchor, button);
	$.pop();
}

$.delegate(["click"]);