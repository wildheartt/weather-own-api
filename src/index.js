import { HomePage, CityPage, NotFoundPage } from './pages.js';
import '../css/styles.css';

class AppRouter {
  constructor(options = {}) {
    this.routes = new Map();
    this.mode = options.mode || 'history';
    this.base = options.base || '';
    this.isStarted = false;
  }

  addRoute(pattern, hooks = {}) {
    this.routes.set(pattern, hooks);
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;

    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  async navigate(path) {
    const fullPath = this.base + path;
    if (window.location.pathname !== fullPath) {
      window.history.pushState(null, '', fullPath);
    }
    await this.handleRoute();
  }

  async handleRoute() {
    let path = window.location.pathname;
    if (this.base) {
      path = path.replace(this.base, '') || '/';
    }

    if (this.routes.has(path)) {
      const hooks = this.routes.get(path);
      if (hooks.onEnter) {
        await hooks.onEnter({
          path,
          params: {},
          query: new URLSearchParams(window.location.search),
        });
      }
      return;
    }

    for (const [pattern, hooks] of this.routes.entries()) {
      const match = this.matchRoute(pattern, path);
      if (match) {
        if (hooks.onEnter) {
          await hooks.onEnter({
            path,
            params: match.params,
            query: new URLSearchParams(window.location.search),
          });
        }
        return;
      }
    }

    if (this.routes.has('*')) {
      const hooks = this.routes.get('*');
      if (hooks.onEnter) {
        await hooks.onEnter({
          path,
          params: {},
          query: new URLSearchParams(window.location.search),
        });
      }
    }
  }

  matchRoute(pattern, path) {
    if (pattern === '*') return { params: {} };

    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return { params };
  }
}

const router = new AppRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/weather' : '',
});

window.router = router;

router.addRoute('/', {
  onEnter: HomePage,
});

router.addRoute('/city/:city', {
  onEnter: CityPage,
});

router.addRoute('*', {
  onEnter: NotFoundPage,
});

router.start();
