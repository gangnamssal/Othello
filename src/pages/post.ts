class Post {
	private $container: HTMLElement;
	#params?: Record<string, string>;
	#query?: Record<string, string>;

	constructor(
		$container: HTMLElement,
		params?: Record<string, string>,
		query?: Record<string, string>,
	) {
		this.$container = $container;
		this.#params = params;
		this.#query = query;
		this.render();
	}

	setState(params?: Record<string, string>, query?: Record<string, string>) {
		this.#params = params;
		this.#query = query;
		this.render();
	}

	private render() {
		this.$container.innerHTML = `
		<main class="mainPage">
			<p>Post Page</p>
		</main>
	  `;
	}
}

export default Post;
