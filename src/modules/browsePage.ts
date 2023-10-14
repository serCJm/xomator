import { Browser } from "puppeteer-core";
import { MODULES_CONFIG } from "../../config/modules-config.js";
import { HPup } from "../utils/hPup.js";
import { randomNumber } from "../utils/utils.js";

export async function browsePage(browser: Browser) {
	console.log("### Starting to browse ###");
	try {
		const page = await browser.newPage();
		await page.goto("https://x.com/home");

		const hPage = new HPup(page);

		const [min, max] = MODULES_CONFIG[browsePage.name].MIN_MAX_BROWSE_TIME!;
		await hPage.infiniteScroll(randomNumber(min, max));

		await hPage.moveMouseOutOfPage();

		await page.close();
	} catch (err) {
		console.log(err);
	}
}
