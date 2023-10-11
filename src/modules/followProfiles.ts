import { Browser, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";
import { MODULES_CONFIG } from "../../config/modules-config.js";
import { countdownTimer } from "../utils/countdownTimer.js";
import { randomNumber } from "../utils/utils.js";
import { XPup } from "../utils/xpup.js";

export async function followProfiles(browser: Browser) {
	const page = await browser.newPage();

	const { HANDLES, MIN_MAX_PROFILE_WAIT_TIME } =
		MODULES_CONFIG[followProfiles.name];
	const [minTime, maxTime] = MIN_MAX_PROFILE_WAIT_TIME!;

	for (const handle of HANDLES!) {
		await followProfile(page, handle);
		await countdownTimer(minTime, maxTime);
	}
}

async function followProfile(page: Page, handle: string) {
	try {
		await page.goto(`https://twitter.com/${handle}`);

		const xPage = new XPup(page);

		await xPage.humanInfiniteScroll(randomNumber(3, 7));

		await xPage.humanScrollToTop();

		const followXPath = `//div[@data-testId="placementTracking"]//span[contains(text(), "Follow")]`;
		const followBtn = await xPage.getElByXPath(followXPath);

		await xPage.humanClick(followBtn);

		await setTimeout(randomNumber(1000, 5000));

		await xPage.moveMouseOutOfPage();

		await page.close();
	} catch (err) {
		console.error(err);
	}
}
