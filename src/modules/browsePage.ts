import { Browser } from "puppeteer-core";
import { MODULES_CONFIG } from "../../config/modules-config.js";
import { randomNumber } from "../utils/utils.js";
import { XPup } from "../utils/xpup.js";

export async function browsePage(browser: Browser) {
	console.log("### Starting to browse ###");
	try {
		const page = await browser.newPage();

		await page.goto("https://twitter.com/home");

		const xPage = new XPup(page);
		const [min, max] = MODULES_CONFIG[browsePage.name].MIN_MAX_BROWSE_TIME!;
		await xPage.humanInfiniteScroll(randomNumber(min, max));

		await xPage.moveMouseOutOfPage();

		await page.close();
	} catch (err) {
		console.log(err);
	}
}
