import { Browser, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";
import { MODULES_CONFIG } from "../../config/modules-config.js";
import { countdownTimer } from "../utils/countdownTimer.js";
import { HPup } from "../utils/hPup.js";
import { randomNumber } from "../utils/utils.js";
import { XPup } from "../utils/xPup.js";

export async function followProfiles(browser: Browser) {
	const page = await browser.newPage();

	const { HANDLES, MIN_MAX_FOLLOW_WAIT_TIME } =
		MODULES_CONFIG[followProfiles.name];
	const [minTime, maxTime] = MIN_MAX_FOLLOW_WAIT_TIME!;

	for (const handle of HANDLES!) {
		await followProfile(page, handle);
		await countdownTimer(minTime, maxTime);
	}
}

async function followProfile(page: Page, handle: string) {
	try {
		await page.goto(`https://x.com/${handle}`);

		const hPage = new HPup(page);
		const xPage = new XPup(page);

		await hPage.infiniteScroll(randomNumber(3, 7));

		await hPage.scrollToTop();

		const followXPath = `//div[@data-testId="placementTracking"]//span[contains(text(), "Follow")]`;
		const followBtn = await xPage.getElByXPath(followXPath);

		await hPage.click(followBtn);

		await setTimeout(randomNumber(1000, 5000));

		await hPage.moveMouseOutOfPage();

		await page.close();
	} catch (err) {
		console.error(err);
	}
}
