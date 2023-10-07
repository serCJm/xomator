import { ElementHandle, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";

export class XPup {
	private readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	async click(sel: string, timeout?: number, index: number = 0) {
		await this.page.waitForXPath(sel, { timeout });
		const someBtn = await this.page.$x(sel);
		await (someBtn[index] as ElementHandle<Element>).click();
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
		await this.page.waitForXPath(sel, { timeout });
		const someBtn = await this.page.$x(sel);
		await (someBtn[index] as ElementHandle<Element>).click();
		await setTimeout(1000);
	}

	async clickShadowDom(rootQuerySel: string, elQuerySel: string) {
		const shadowElement = await this.page.evaluateHandle(
			`document.querySelector("${rootQuerySel}").shadowRoot.querySelector("${elQuerySel}")`
		);
		await (shadowElement as ElementHandle<Element>).click();
	}

	async type(
		sel: string,
		text: string,
		delay: number = 0,
		index: number = 0
	) {
		await this.page.waitForXPath(sel);
		const someInput = await this.page.$x(sel);
		await someInput[index]?.type(text, { delay });
		await setTimeout(1000);
	}

	async getText(sel: string) {
		await this.page.waitForXPath(sel);
		const someEl = await this.page.$x(sel);
		const someText = await this.page.evaluate(
			(el) => el.textContent,
			someEl[0] as ElementHandle<Element>
		);
		return someText;
	}

	async getInputValue(sel: string) {
		await this.page.waitForXPath(sel);
		const someEl = await this.page.$x(sel);
		const someValue = await this.page.evaluate(
			(el) => el.value,
			someEl[0] as ElementHandle<HTMLInputElement>
		);
		return someValue;
	}

	async getAttributeValue(sel: string, attr: string) {
		console.log(attr);
		await this.page.waitForXPath(sel);
		const someEl = await this.page.$x(sel);
		const someValue = await this.page.evaluate(
			(el, attr) => el.getAttribute(attr),
			someEl[0] as ElementHandle<HTMLInputElement>,
			attr
		);
		return someValue;
	}

	async textMatch(sel: string, compareText: string) {
		await this.page.waitForXPath(sel);
		const someInput = await this.page.$x(sel);
		return await this.page.evaluate(
			(el, compareText) => el.textContent?.includes(compareText),
			someInput[0],
			compareText
		);
	}

	async waitForRemoved(
		text: string,
		type: string = "*",
		extraSel: string = ""
	) {
		const sel = `//${type}[contains(text(), "${text}")]${extraSel}`;
		await this.page.waitForFunction(
			`document.evaluate('${sel}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue === null`
		);
	}

	async clickBySelector(sel: string, delay?: number) {
		await this.page.waitForSelector(sel, { timeout: delay });
		await this.page.click(sel);
		await setTimeout(1000);
	}

	async typeBySelector(sel: string, text: string, delay?: number) {
		await this.page.waitForSelector(sel, { timeout: delay });
		await this.page.type(sel, text);
		await setTimeout(1000);
	}
}
