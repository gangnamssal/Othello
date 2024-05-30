class Post {
	$container;

	constructor($container: HTMLElement) {
		this.$container = $container;
		this.render();
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
