// pages
import Home from '@pages/home.ts';

// global
import type { Route } from '@global/global.d.ts';

const routes: Route[] = [{ path: '/', component: Home }];

class Router {
	private routes: Route[];
	private container: HTMLElement;

	constructor(container: HTMLElement, routes: Route[]) {
		this.container = container;
		this.routes = routes;
		this.init();
	}

	private init() {
		window.addEventListener('popstate', () => this.handleLocationChange());
		this.handleLocationChange();
	}

	private handleLocationChange = () => {
		const path = window.location.pathname;
		const query = this.parseQuery(window.location.search);
		const matchedRoute = this.matchRoute(path);

		if (!matchedRoute) return this.renderNotFound();

		const { route, params } = matchedRoute;

		if (route.guard && !route.guard()) return this.navigate('/login');

		new route.component(this.container, params, query);
	};

	// URL 쿼리 문자열을 파싱하는 메소드
	private parseQuery(queryString: string): Record<string, string> {
		const query: Record<string, string> = {};
		const queryParts = queryString.startsWith('?') ? queryString.substring(1).split('&') : [];

		for (const part of queryParts) {
			const [key, value] = part.split('=');
			query[decodeURIComponent(key)] = decodeURIComponent(value || '');
		}

		return query;
	}

	private matchRoute(path: string) {
		for (const route of this.routes) {
			const { isMatch, params } = this.matchPath(route.path, path);

			if (isMatch) return { route, params };
		}

		return null;
	}

	private matchPath(
		routePath: string,
		actualPath: string,
	): { isMatch: boolean; params: Record<string, string> } {
		const params: Record<string, string> = {};
		const routeParts = routePath.split('/');
		const actualParts = actualPath.split('/');

		if (routeParts.length !== actualParts.length) return { isMatch: false, params };

		for (let i = 0; i < routeParts.length; i++) {
			if (routeParts[i].startsWith(':')) {
				params[routeParts[i].substring(1)] = actualParts[i];
			} else if (routeParts[i] !== actualParts[i]) {
				return { isMatch: false, params };
			}
		}

		return { isMatch: true, params };
	}

	private renderNotFound() {
		this.container.innerHTML = `<h1>404 Not Found</h1>`;
	}

	public navigate(path: string) {
		window.history.pushState({}, '', path);
		this.handleLocationChange();
	}
}

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
	const container = document.getElementById('app');

	if (container) new Router(container, routes);
}

export default Router;
