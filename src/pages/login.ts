class Login {
  $container;

  constructor($container: HTMLElement, params?: Record<string, string>) {
    this.$container = $container;
    this.render();

    console.log(params);
  }

  setState() {
    this.render();
  }

  render() {
    this.$container.innerHTML = `
        <main class="mainPage">
          login 페이지에요.
        </main>
      `;
  }
}

export default Login;
