import { createCursor, GhostCursor } from "ghost-cursor";
import { ElementHandle, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";
import { randomNumber } from "./utils.js";

export class HPup {
	static #viewport: { width: number; height: number };
	readonly #page: Page;
	readonly #cursor: GhostCursor;

	constructor(page: Page) {
		this.#page = page;
		this.#cursor = createCursor(page);
	}

	async #getRandomElementInViewport(): Promise<ElementHandle<Element> | null> {
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

	async #getViewport() {
		if (HPup.#viewport) return HPup.#viewport;

		const dimensions = await this.#page.evaluate(() => {
			return {
				width: window.innerWidth,
				height: window.innerHeight,
			};
		});

		if (!dimensions) {
			throw new Error("Could not retrieve viewport dimensions.");
		}

		HPup.#viewport = dimensions;
		return dimensions;
	}

	async #easingScroll(deltaY: number) {
		const EASE_IN_OUT_TIME = randomNumber(100, 400);

		// Initial easing-in scroll
		await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });
		await setTimeout(EASE_IN_OUT_TIME);

		// Main scroll
		await this.#page.mouse.wheel({ deltaY: deltaY * 0.5 });
		await setTimeout(EASE_IN_OUT_TIME);

		// Final easing-out scroll
		await this.#page.mouse.wheel({ deltaY: deltaY * 0.25 });
	}

	async click(element: ElementHandle<Element>) {
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

	async infiniteScroll(durationSec: number) {
		const SCROLL_UP_PROBABILITY = 0.2;
		const MOVE_MOUSE_PROBABILITY = 0.1;
		const PAUSE_PROBABILITY = 0.2;

		const startTime = Date.now();

		while (Date.now() - startTime < durationSec * 1000) {
			const shouldScrollUp = Math.random() < SCROLL_UP_PROBABILITY;
			const shouldMoveMouse = Math.random() < MOVE_MOUSE_PROBABILITY;

			const deltaY = shouldScrollUp
				? -1 * randomNumber(100, 400)
				: randomNumber(300, 800);

			await this.#easingScroll(deltaY);

			if (shouldMoveMouse) {
				await this.randomMouseMove();
			}

			if (Math.random() < PAUSE_PROBABILITY) {
				await setTimeout(randomNumber(2000, 5000));
			} else {
				await setTimeout(randomNumber(400, 800));
			}
		}
	}

	async moveMouseOutOfPage() {
		console.log("### Move mouse out of page ###");

		const { width } = await this.#getViewport();
		// To move the mouse out from the top
		await this.#cursor.moveTo({
			x: randomNumber(0, width),
			y: -10,
		});

		await setTimeout(1000, 3000);
	}

	async randomMouseMove() {
		try {
			const { width, height } = await this.#getViewport();
			const [x, y] = [randomNumber(0, width), randomNumber(0, height)];
			await this.#cursor.moveTo({ x, y });
		} catch (err) {
			console.log(err);
		}
	}

	async scrollToTop() {
		let currentScrollY = await this.#page.evaluate(() => window.scrollY);

		while (currentScrollY > 0) {
			const SCROLL_DISTANCE = randomNumber(500, 900);

			const deltaY = -Math.min(currentScrollY, SCROLL_DISTANCE);

			await this.#easingScroll(deltaY);

			currentScrollY = await this.#page.evaluate(() => window.scrollY);
		}
	}
}
