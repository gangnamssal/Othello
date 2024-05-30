import Home from '@pages/home.ts';
import Post from '@pages/post.ts';
import Shop from '@pages/shop.ts';
import type { Route } from '@/global.d.ts';

const routes: Route[] = [
	{ path: '/', component: Home },
	{ path: '/post/123', component: Post },
	{ path: '/shop', component: Shop },
];

class Router {
	private routes: Route[];
	private container: HTMLElement;

	constructor(container: HTMLElement, routes: Route[]) {
		this.container = container;
		this.routes = routes;
		this.init();
	}

	private init() {
		window.addEventListener('popstate', () => {
			this.handleLocationChange();
		});

		this.handleLocationChange();
	}

	private handleLocationChange() {
		const path = window.location.pathname;
		const route = this.routes.find((route) => route.path === path);

		if (route) {
			new route.component(this.container);
		} else {
			this.renderNotFound();
		}
	}

	private renderNotFound() {
		this.container.innerHTML = `<h1>404 Not Found</h1>`;
	}

	public navigate(path: string) {
		window.history.pushState({}, '', path);
		this.handleLocationChange();
	}
}

class RouteComponents extends HTMLElement {
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

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
	const container = document.getElementById('app');

	if (container) {
		const router = new Router(container, routes);

		RouteComponents.router = router;
	}
}

customElements.define('route-components', RouteComponents);
