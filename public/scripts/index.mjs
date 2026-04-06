export class App {
	#appRef = null;

	constructor({ appSelector, routes }) {
		this.#appRef = document.querySelector(appSelector);
		new Router({ appRef: this.#appRef, routes });
	}
}

class Router {
	#appRef = null;
	#currentUnmount = null;
	#routes = null;
	#notFound = {
		page: '404',
		title: 'Page not found',
		payload: async () => {
			const m = await import('../pages/404/index.js');
			return m.NotFoundPage;
		}
	};

	constructor({ appRef, routes }) {
		this.#routes = routes;
		this.#appRef = appRef;
		this.init();
	}

	init() {
		document.body.addEventListener('click', (e) => {
			if (e.target.matches('[data-link]')) {
				e.preventDefault();
				if (!e.target?.href || e.metaKey || e.ctrlKey) {
					return;
				}

				this.navigateTo(e.target.href);
			}
		});

		// Escuchar los botones "Atrás/Adelante" del navegador
		window.addEventListener('popstate', () => this.render(location.pathname));

		// Render inicial basado en la URL actual
		this.render(location.pathname);
	}

	go(n) {
		window.history.go(n);
	}

	navigateTo(url) {
		if (!this.#samePageCtrl(url)) return;
		// Actualizar la URL sin recargar la página
		this.#browserUpdate().pushState(url);
		this.render(location.pathname);
	}

	async #pathResolver(pathPayload) {
		const payload = await pathPayload();
		const hasConstructor = (payload?.default ?? payload).toString().startsWith('class');
		const isFunction = !hasConstructor && typeof (payload?.default ?? payload) === 'function';

		return {
			render:
				hasConstructor && !isFunction
					? new payload().render
					: !hasConstructor && isFunction
						? (payload?.default ?? payload)
						: () => '',
			mount:
				hasConstructor && !isFunction
					? (new payload()?.mount ?? (() => {}))
					: !hasConstructor && isFunction
						? payload?.mount
						: () => ''
		};
	}

	async render(route) {
		const rule = this.#findPathRule(route);

		try {
			// ==========================================
			// FASE 1: DESMONTAJE (Cleanup de la vista anterior)
			if (typeof this.#currentUnmount === 'function') {
				this.#currentUnmount(); // Aquí se ejecuta el controller.abort()
				this.#currentUnmount = null; // Liberamos la memoria
			}
			// ==========================================
			// FASE 2: RENDERIZADO (Carga e inyección)
			const pathResolver = await this.#pathResolver(rule.payload);

			Promise.try(() => {
				this.#appRef.innerHTML = pathResolver?.render?.();
				this.#browserUpdate().title(rule.title ?? 'Vanilla SPA');
			}).finally(() => {
				// ==========================================
				// FASE 3: MONTAJE (Setup de la vista actual)
				this.#currentUnmount = pathResolver?.mount?.();
			});
			return true;
		} catch (error) {
			console.error('Error loading route:', error);
			this.#appRef.innerHTML = '<h1>500 - Error Interno</h1><p>No se pudo cargar el módulo.</p>';
			return false;
		}
	}

	#browserUpdate() {
		return {
			pushState(url) {
				history.pushState(null, null, url);
			},
			title(title) {
				document.title = title;
			}
		};
	}

	#findPathRule(path) {
		return this.#routes.find((page) => path.match(page.regex)) ?? this.#notFound;
	}

	#samePageCtrl(url) {
		const current = new URL(window.location);
		const target = new URL(url);

		if (current.origin === target.origin) {
			if (current.pathname === target.pathname) {
				return false;
			}
		}

		return true;
	}
}
