type State = { title: string; subTitle: string };

class TestComponents extends HTMLElement {
	#shadowRoot: ShadowRoot;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	static get observedAttributes() {
		return ['title', 'sub-title'];
	}

	attributeChangedCallback() {
		this.render();
	}

	adoptedCallback() {}

	get title() {
		return this.getAttribute('title') || '';
	}

	get subTitle() {
		return this.getAttribute('sub-title') || '';
	}

	render() {
		this.#shadowRoot.innerHTML = this.template({ title: this.title, subTitle: this.subTitle });
	}

	template(state: State) {
		return `
            <h1>${state.title}</h1>
            <h2>${state.subTitle}</h2>
        `;
	}
}

export default TestComponents;
