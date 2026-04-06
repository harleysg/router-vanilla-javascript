class PageModule {
	mount() {
		return () => {};
	}

	render() {
		return '';
	}
}

export class AboutPage extends PageModule {
	mount() {
		console.log('⛓️ Mount | About...');
		const controller = new AbortController();
		const { signal } = controller;

		const btn1 = document?.querySelector('#action-btn-1');
		const btn2 = document?.querySelector('#action-btn-2');

		btn1?.addEventListener(
			'click',
			() => {
				console.log('Botón 1 clickeado');
			},
			{ signal }
		);

		btn2?.addEventListener(
			'mouseenter',
			() => {
				console.log('Hover en Botón 2');
			},
			{ signal }
		);

		window.addEventListener(
			'resize',
			() => {
				console.log('Redimensionando ventana desde Home');
			},
			{ signal }
		);

		return function unmount() {
			console.log('🧹 Unmount | About...');
			controller.abort();
		};
	}

	render() {
		return `<app-layout>
		<div slot="header" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between;">
		  <h1>About Page</h1>
			<nav>
			<a href="/" data-link>home</a>
			<a href="/about" data-link>about</a>
			<a href="/not-found" data-link>not-found</a>
			</nav>
		</div>
		  <div style="padding-inline: 1rem;">
			<button id="action-btn-1">Acción 1</button>
			<button id="action-btn-2">Acción 2</button>
		</div>
		</app-layout>`;
	}
}
