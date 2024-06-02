import styles from '@pages/home/home.module.css';

class Home {
  #container;

  constructor(container: HTMLElement) {
    this.#container = container;
    this.initRender();
  }

  private initRender() {
    const mainHTML = `
      <main class=${styles.main}>
          <div class=${styles.buttonWrap}>
            <a class=${styles.button} href="/board/normal">기본모드</a>
            <a class=${styles.button} href="/board/ai">AI모드</a>
          </div>
      </main>
    `;

    this.#container.innerHTML = mainHTML;
  }
}

export default Home;
