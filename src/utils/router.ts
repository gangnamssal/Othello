// pages
import Home from '@pages/home.ts';
import Post from '@pages/post.ts';
import Shop from '@pages/shop.ts';
import Login from '@/pages/login.ts';

// global
import type { Route } from '@global/global.d.ts';

// components
import { RouteComponents } from '@components/route-components/route-components.ts';

const routes: Route[] = [
	{ path: '/', component: Home },
	{ path: '/post/:postId', component: Post },
	{ path: '/shop', component: Shop, guard: isAuthenticated },
	{ path: '/login', component: Login },
];

function isAuthenticated(): boolean {
	// 여기에 실제 인증 로직을 추가하세요
	return !!localStorage.getItem('authToken');
}

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

	if (container) {
		const router = new Router(container, routes);

		RouteComponents.router = router;
	}
}

export default Router;
