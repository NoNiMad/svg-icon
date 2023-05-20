"use strict";

class SvgIcon extends HTMLElement
{
	static get observedAttributes()
	{
		return ["path", "size", "viewbox", "flip", "rotate"];
	}

	static get defaults()
	{
		return {
			path: "",
			size: "24",
			viewbox: "0 0 24 24",
			flip: "",
			rotate: "0deg"
		}
	};

	get path() { return this.getAttribute("path"); }
	set path(value) { this.setAttribute("path", value); }

	get size() { return this.getAttribute("size"); }
	set size(value) { this.setAttribute("size", value); }

	get viewbox() { return this.getAttribute("viewbox"); }
	set viewbox(value) { this.setAttribute("viewbox", value); }

	get flip() { return this.getAttribute("flip"); }
	set flip(value) { this.setAttribute("flip", value); }

	get flipDirections()
	{
		const flip = (this.getAttribute("flip") || "").toLowerCase()
		return {
			x: ["both", "horizontal"].includes(flip) ? "-1" : "1",
			y: ["both", "vertical"].includes(flip) ? "-1" : "1",
		};
	}

	get rotate() { return this.getAttribute("rotate"); }
	set rotate(value) { this.setAttribute("rotate", value); }

	constructor()
	{
		super();
		
		this.attachShadow({ mode: "open" });

		const style = document.createElement("style");
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

		style.textContent = `
			svg {
				transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1)); 
			}

			path {
				fill: currentColor;
			}
		`;

		svg.append(path);

		this.shadowRoot.append(style, svg);

		this.svgEl = svg;
		this.pathEl = path;
	}

	connectedCallback()
	{
		for (const attribute in SvgIcon.defaults)
		{
			if (!this.hasAttribute(attribute))
			{
				this.setAttribute(attribute, SvgIcon.defaults[attribute]);
			}
			else if (this.hasOwnProperty(attribute))
			{
				// Element existed before this class was attached to it
				let value = this[attribute];
				delete this[attribute];
				this[attribute] = value;
			}
		}
	}

	attributeChangedCallback(name, oldValue, newValue)
	{
		if (oldValue === newValue)
			return;

		switch (name)
		{
			case "path":
				this.pathEl.setAttribute("d", newValue);
				break;

			case "size":
				this.svgEl.setAttribute("width", this.size);
				this.svgEl.setAttribute("height", this.size);
				break;

			case "viewbox":
				this.svgEl.setAttribute("viewBox", this.viewbox);
				break;

			case "flip":
				this.svgEl.style.setProperty("--sx", this.flipDirections.x);
				this.svgEl.style.setProperty("--sy", this.flipDirections.y);
				break;

			case "rotate":
				this.svgEl.style.setProperty("--r", this.rotate);
				break;
		}
	}
}

customElements.define("svg-icon", SvgIcon);
