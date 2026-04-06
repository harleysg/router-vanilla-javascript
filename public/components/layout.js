export class AppLayout extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.shadowRoot.innerHTML = `
			<style>
				/* :host aplica estilos al propio tag <app-layout> */
				:host {
					display: flex;
					flex-direction: column;
					min-height: 100vh; /* Asegura que ocupe al menos toda la pantalla */
					margin: 0;
					padding: 0;
					font-family: system-ui, -apple-system, sans-serif;
				}

				main {
					flex: 1;
				}

				/* Estilos opcionales para homogeneizar las áreas */
				header, footer {
					background-color: #f8f9fa;
					padding: 1rem;
				}
			</style>

			<header>
				<slot name="header">
					<h2>App Default Header</h2>
				</slot>
			</header>

			<main>
				<slot></slot>
			</main>

			<footer>
				<slot name="footer">
					<p>&copy; 2026 - Vanilla SPA</p>
				</slot>
			</footer>
		`;
	}
}

// Registramos el custom element en el navegador
customElements.define('app-layout', AppLayout);
