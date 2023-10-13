import { createCursor, GhostCursor } from "ghost-cursor";
import { ElementHandle, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";
import { randomNumber } from "./utils.js";

export class XPup {
	readonly #page: Page;
	readonly #cursor: GhostCursor;

	constructor(page: Page) {
		this.#page = page;
		this.#cursor = createCursor(page);
	}

	async click(sel: string, timeout?: number, index: number = 0) {
		await this.#page.waitForXPath(sel, { timeout });
		const someBtn = await this.#page.$x(sel);
		await (someBtn[index] as ElementHandle<Element>).click();
		await setTimeout(1000);
	}

	async clickBySelector(sel: string, delay?: number) {
		await this.#page.waitForSelector(sel, { timeout: delay });
		await this.#page.click(sel);
		await setTimeout(1000);
	}

	async clickByText(
		text: string,
		type: string = "*",
		extraSel: string = "",
		timeout?: number,
		index: number = 0
	) {
		const sel = `//${type}[contains(text(), "${text}")]${extraSel}`;
		await this.#page.waitForXPath(sel, { timeout });
		const someBtn = await this.#page.$x(sel);
		await (someBtn[index] as ElementHandle<Element>).click();
		await setTimeout(1000);
	}

	async clickShadowDom(rootQuerySel: string, elQuerySel: string) {
		const shadowElement = await this.#page.evaluateHandle(
			`document.querySelector("${rootQuerySel}").shadowRoot.querySelector("${elQuerySel}")`
		);
		await (shadowElement as ElementHandle<Element>).click();
	}

	async getElByXPath(sel: string) {
		await this.#page.waitForXPath(sel);
		const el = await this.#page.$x(sel);
		return el[0] as ElementHandle<Element>;
	}

	async getText(sel: string) {
		await this.#page.waitForXPath(sel);
		const someEl = await this.#page.$x(sel);
		const someText = await this.#page.evaluate(
			(el) => el.textContent,
			someEl[0] as ElementHandle<Element>
		);
		return someText;
	}

	async getInputValue(sel: string) {
		await this.#page.waitForXPath(sel);
		const someEl = await this.#page.$x(sel);
		const someValue = await this.#page.evaluate(
			(el) => el.value,
			someEl[0] as ElementHandle<HTMLInputElement>
		);
		return someValue;
	}

	async getAttributeValue(sel: string, attr: string) {
		console.log(attr);
		await this.#page.waitForXPath(sel);
		const someEl = await this.#page.$x(sel);
		const someValue = await this.#page.evaluate(
			(el, attr) => el.getAttribute(attr),
			someEl[0] as ElementHandle<HTMLInputElement>,
			attr
		);
		return someValue;
	}

	async getRandomElementInViewport(): Promise<ElementHandle<Element> | null> {
		const clickableSelectors = ["a", "button", "article"];
		const randomSelector =
			clickableSelectors[
				Math.floor(Math.random() * clickableSelectors.length)
			];
		const elements = await this.#page.$$(randomSelector);
		const elementsInViewport: ElementHandle<Element>[] = [];

		for (const element of elements) {
			const isInViewport = await element.evaluate((el: Element) => {
				const rect = el.getBoundingClientRect();
				const isVisible =
					window.getComputedStyle(el).visibility !== "hidden" &&
					rect.height > 0 &&
					rect.width > 0;
				return (
					isVisible &&
					rect.top <= window.innerHeight &&
					rect.left <= window.innerWidth &&
					rect.bottom >= 0 &&
					rect.right >= 0
				);
			});

			if (isInViewport) {
				elementsInViewport.push(element);
			}
		}

		if (elementsInViewport.length === 0) {
			return null;
		}

		const randomIndex = randomNumber(0, elementsInViewport.length - 1);
		const selectedElement = elementsInViewport[randomIndex];

		// Debugging line to output the bounding box
		const box = await selectedElement.boundingBox();
		console.log("Selected element bounding box:", box);

		return selectedElement;
	}

	async humanClick(element: ElementHandle<Element>) {
		try {
			const box = await element.boundingBox();
			if (box && box.x >= 0 && box.y >= 0) {
				await this.#cursor.click(element);
			} else {
				console.warn("Element out of view, skipping mouse move.");
			}
		} catch (error) {
			console.warn("Could not move mouse:", error);
		}
	}

	async humanInfiniteScroll(durationSec: number) {
		const SCROLL_UP_PROBABILITY = 0.2;
		const MOVE_MOUSE_PROBABILITY = 0.1;
		const PAUSE_PROBABILITY = 0.2;

		const EASE_IN_OUT_TIME = 300;

		const startTime = Date.now();

		while (Date.now() - startTime < durationSec * 1000) {
			const shouldScrollUp = Math.random() < SCROLL_UP_PROBABILITY;
			const shouldMoveMouse = Math.random() < MOVE_MOUSE_PROBABILITY;

			const deltaY = shouldScrollUp
				? -1 * randomNumber(100, 400)
				: randomNumber(300, 800);

			// Initial easing-in scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });
			await setTimeout(EASE_IN_OUT_TIME);

			// Main scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.5 });
			await setTimeout(EASE_IN_OUT_TIME);

			// Final easing-out scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });

			if (shouldMoveMouse) {
				const element = await this.getRandomElementInViewport();

				if (element) {
					try {
						const box = await element.boundingBox();
						if (box && box.x >= 0 && box.y >= 0) {
							await this.#cursor.move(element);
						} else {
							console.warn(
								"Element out of view, skipping mouse move."
							);
						}
					} catch (error) {
						console.warn("Could not move mouse:", error);
					}
				}
			}

			if (Math.random() < PAUSE_PROBABILITY) {
				await setTimeout(randomNumber(2000, 5000));
			} else {
				await setTimeout(randomNumber(400, 800));
			}
		}
	}

	async humanScrollToTop() {
		let currentScrollY = await this.#page.evaluate(() => window.scrollY);

		while (currentScrollY > 0) {
			const SCROLL_DISTANCE = randomNumber(500, 900);
			const EASE_IN_OUT_TIME = randomNumber(100, 400);

			const deltaY = -Math.min(currentScrollY, SCROLL_DISTANCE);

			// Initial easing-in scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });
			await setTimeout(EASE_IN_OUT_TIME);

			// Main scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.5 });
			await setTimeout(EASE_IN_OUT_TIME);

			// Final easing-out scroll
			await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });
			await setTimeout(EASE_IN_OUT_TIME);

			currentScrollY = await this.#page.evaluate(() => window.scrollY);
		}
	}

	async moveMouseOutOfPage() {
		const viewport = await this.#page.viewport();
		if (!viewport) {
			console.warn("Could not retrieve viewport dimensions.");
			return;
		}

		// To move the mouse out from the top
		await this.#cursor.move({ x: viewport.width / 2, y: -10 });

		await setTimeout(1000, 3000);

		// To move the mouse out from the bottom
		await this.#cursor.move({
			x: viewport.width / 2,
			y: viewport.height + 10,
		});
	}

	async textMatch(sel: string, compareText: string) {
		await this.#page.waitForXPath(sel);
		const someInput = await this.#page.$x(sel);
		return await this.#page.evaluate(
			(el, compareText) => el.textContent?.includes(compareText),
			someInput[0],
			compareText
		);
	}

	async type(
		sel: string,
		text: string,
		delay: number = 0,
		index: number = 0
	) {
		await this.#page.waitForXPath(sel);
		const someInput = await this.#page.$x(sel);
		await someInput[index]?.type(text, { delay });
		await setTimeout(1000);
	}

	async typeBySelector(sel: string, text: string, delay?: number) {
		await this.#page.waitForSelector(sel, { timeout: delay });
		await this.#page.type(sel, text);
		await setTimeout(1000);
	}

	async waitForRemoved(
		text: string,
		type: string = "*",
		extraSel: string = ""
	) {
		const sel = `//${type}[contains(text(), "${text}")]${extraSel}`;
		await this.#page.waitForFunction(
			`document.evaluate('${sel}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue === null`
		);
	}
}
