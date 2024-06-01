import styles from './home.module.css';

class Home {
  $container;

  constructor($container: HTMLElement) {
    this.$container = $container;
    this.initEvent();
    this.render();
  }

  setState() {
    this.render();
  }

  initEvent() {
    this.$container.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.dataset.index) {
        console.log(target.dataset.index);
      }
    });
  }

  render() {
    this.$container.innerHTML = `
	  <main class=${styles.main}>
        <section class=${styles.section}>
		  ${Array(100)
        .fill(0)
        .map(
          (_, index) =>
            `<div 
			  class=${(Math.floor(index / 10) + index) % 2 ? styles.evenCell : styles.oddCell}
			  data-index=${index}
			  >
			    <div class=${styles.blackStone} data-index=${index}></div>
			  </div>`,
        )
        .join('')}
		</section>
      </main>
    `;
  }
}

export default Home;
