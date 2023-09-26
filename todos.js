// App.svelte (Svelte v5.0.0-preview)
// Note: compiler output will change before 5.0 is released!
import * as $ from "./internal.js";

const each_block = $.template(`<div><input> <input type="checkbox"></div>`);
var main = $.template(`<input> <!----> <p> </p>`, true);

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
				get done() {
					return $.get(done);
				},
				set done(value) {
					$.set(done, value);
				},
				get text() {
					return $.get(text);
				},
				set text(value) {
					$.set(text, value);
				}
			}
		]);

		event.target.value = '';
	}

	/* Init */
	var fragment = $.open_frag($$anchor, main);

	var input = $.child_frag(fragment);
	var node = $.sibling($.sibling(input));
	var p = $.sibling($.sibling(node));
	var text_1 = $.child(p);

	/* Update */
	$.text(text_1, () => `${$.stringify(remaining($.get(todos)))} remaining`);

	$.event("keydown", input, addTodo, false);

	$.each(
		node,
		() => $.get(todos),
		1,
		null,
		($$anchor, todo, $$index) => {
			/* Init */
			var div = $.open($$anchor, each_block);

			var input_1 = $.child(div);
			var input_2 = $.sibling($.sibling(input_1));
			$.bind_value(input_1, () => $.unwrap(todo).text, $$value => $.unwrap(todo).text = $$value);
			$.bind_checked(input_2, () => $.unwrap(todo).done, $$value => $.unwrap(todo).done = $$value);
			$.close($$anchor, div);
		},
		null
	);

	$.close_frag($$anchor, fragment);
	$.pop();
}