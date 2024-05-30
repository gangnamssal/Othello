class Home {
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
          메인 페이지에요.
        </main>
      `;
	}
}

export default Home;
