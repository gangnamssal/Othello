// library
import { describe, it, expect, vi, beforeEach } from 'vitest';

// utils
import Router from '@utils/router/router.ts';

class HomeComponent {
  constructor(container: HTMLElement) {
    container.innerHTML = this.render();
  }

  render() {
    return '<div>Home</div>';
  }
}

class AuthComponent {
  constructor(container: HTMLElement) {
    container.innerHTML = this.render();
  }

  render() {
    return '<div>AuthComponents</div>';
  }
}

class PostComponent {
  #params?: Record<string, string>;
  #query?: Record<string, string>;

  constructor(container: HTMLElement, params?: Record<string, string>, query?: Record<string, string>) {
    this.#params = params;
    this.#query = query;
    container.innerHTML = this.render();
  }

  render() {
    return `
            <div>params: ${JSON.stringify(this.#params)}</div>
            <div>query: ${JSON.stringify(this.#query)}</div>
        `;
  }
}

class LoginComponent {
  constructor(container: HTMLElement) {
    container.innerHTML = this.render();
  }

  render() {
    return '<div>Login</div>';
  }
}

class NotFoundComponent {
  constructor(container: HTMLElement) {
    container.innerHTML = this.render();
  }

  render() {
    return '<div>404 Not Found</div>';
  }
}

describe('Router', () => {
  let container: HTMLElement;

  const routes = [
    { path: '/', component: HomeComponent },
    { path: '/auth', component: AuthComponent, guard: () => false },
    { path: '/login', component: LoginComponent },
    { path: '/post/:postId', component: PostComponent },
    { path: '/not-found', component: NotFoundComponent },
  ];

  beforeEach(() => {
    // DOM을 매 테스트마다 초기화합니다.
    document.body.innerHTML = `<div id="app"></div>`;
    container = document.getElementById('app') as HTMLElement;

    // localStorage 목(mock)을 설정합니다.
    const localStorageMock = (function () {
      let store = {} as Record<string, string>;
      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('첫 렌더링에는 홈 컴포넌트가 나온다', () => {
    new Router(container, routes);
    window.history.pushState({}, '', '/');
    expect(container.innerHTML).toContain('Home');
  });

  it('만약 로그인이 필요한 컴포넌트에 로그인이 안된 상태로 접근했을 때 로그인 페이지가 나온다.', () => {
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
    window.history.pushState({}, '', '/auth');
    new Router(container, routes);
    expect(container.innerHTML).toContain('Login');
  });

  it('동적 Params와 Query가 있는 페이지에 접근했을 때, Params와 Query가 정상적으로 나온다.', () => {
    window.history.pushState({}, '', '/post/1?title=hello');
    new Router(container, routes);
    expect(container.innerHTML).toContain('params: {"postId":"1"}');
    expect(container.innerHTML).toContain('query: {"title":"hello"}');
  });

  it('동적 Params가 일치하지 않으면 Not Found 페이지가 나온다.', () => {
    window.history.pushState({}, '', '/post/1/124?title=hello');
    new Router(container, routes);
    expect(container.innerHTML).toContain('404 Not Found');
  });

  it('정의되지 않은 경로가 나오면 404 페이지가 나온다.', () => {
    window.history.pushState({}, '', '/unknown');
    new Router(container, routes);
    expect(container.innerHTML).toContain('404 Not Found');
  });
});
