class Post {
	$container;

	constructor(
		$container: HTMLElement,
		params?: Record<string, string>,
		query?: Record<string, string>,
	) {
		this.$container = $container;
		this.render();

		console.log(params);
		console.log(query);
	}

	setState() {
		this.render();
	}

	render() {
		this.$container.innerHTML = `
        <main class="mainPage">
          Post 페이지에요.
        </main>
      `;
	}
}

export default Post;
