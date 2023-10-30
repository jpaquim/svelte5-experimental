// App.svelte (Svelte v5.0.0-preview)
// Note: compiler output will change before 5.0 is released!
import * as $ from "svelte/internal";

var object_proto = {
	get done() {
		return $.get(this.__done);
	},
	get text() {
		return $.get(this.__text);
	},
	set done(value) {
		$.set(this.__done, value);
	},
	set text(value) {
		$.set(this.__text, value);
	}
};

const each_block = $.template(`<div><input> <input type="checkbox"></div>`);
var frag = $.template(`<input> <!> <p> </p>`, true);

export default function App($$anchor, $$props, $$events, $$slots) {
	$.push($$events, true);
	let todos = $.source([]);

	function remaining(todos) {
		console.log('recalculating');
		return todos.filter(todo => !todo.done).length;
	}

	function addTodo(event) {
		if (event.key !== 'Enter') return;
		let done = $.source(false);
		let text = $.source(event.target.value);

		$.set(todos, [
			...$.get(todos),
			{
				__done: done,
				__text: text,
				__proto__: object_proto
			}
		]);

		event.target.value = '';
	}

	/* Init */
	var fragment = $.open_frag($$anchor, true, frag);

	var input = $.child_frag(fragment);
	var node = $.sibling($.sibling(input));
	var p = $.sibling($.sibling(node));
	var text_1 = $.child(p);

	/* Update */
	$.text_effect(text_1, () => `${$.stringify(remaining($.get(todos)))} remaining`);

	input.__keydown = addTodo;

	$.each(
		node,
		() => $.get(todos),
		1,
		null,
		($$anchor, todo, $$index) => {
			/* Init */
			var div = $.open($$anchor, true, each_block);

			var input_1 = $.child(div);
			$.remove_input_attr_defaults(input_1);
			var input_2 = $.sibling($.sibling(input_1));
			$.remove_input_attr_defaults(input_2);
			$.bind_value(input_1, () => $.unwrap(todo).text, $$value => $.unwrap(todo).text = $$value);
			$.bind_checked(input_2, () => $.unwrap(todo).done, $$value => $.unwrap(todo).done = $$value);
			$.close($$anchor, div);
		},
		null
	);

	$.close_frag($$anchor, fragment);
	$.pop();
}

$.delegate(["keydown"]);