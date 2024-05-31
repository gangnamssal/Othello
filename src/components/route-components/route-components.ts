import Router from '@/utils/router';

export class RouteComponents extends HTMLElement {
	#shadowRoot: ShadowRoot;
	static router: Router;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({ mode: 'open' });
		this.handleClick = this.handleClick.bind(this);
	}

	connectedCallback() {
		this.render();
		this.#shadowRoot.addEventListener('click', this.handleClick);
	}

	disconnectedCallback() {
		this.#shadowRoot.removeEventListener('click', this.handleClick);
	}

	static get observedAttributes() {
		return ['href'];
	}

	attributeChangedCallback() {
		this.render();
	}

	adoptedCallback() {}

	handleClick(event: Event) {
		event.preventDefault();
		const href = this.href;
		if (RouteComponents.router && href) {
			RouteComponents.router.navigate(href);
		}
	}

	get href() {
		return this.getAttribute('href') || '';
	}

	render() {
		this.#shadowRoot.innerHTML = this.template({ href: this.href });
	}

	template(state: { href: string }) {
		return `
      <a href="${state.href}">
        <slot></slot>
      </a>
    `;
	}
}

customElements.define('route-components', RouteComponents);
