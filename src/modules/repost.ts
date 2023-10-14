import { Browser, Page } from "puppeteer-core";
import { setTimeout } from "timers/promises";
import { MODULES_CONFIG } from "../../config/modules-config.js";
import { countdownTimer } from "../utils/countdownTimer.js";
import { HPup } from "../utils/hPup.js";
import { randomNumber } from "../utils/utils.js";
import { XPup } from "../utils/xPup.js";

export async function repost(browser: Browser) {
	const page = await browser.newPage();

	const { POST_LINKS, MIN_MAX_REPOST_WAIT_TIME } =
		MODULES_CONFIG[repost.name];
	const [minTime, maxTime] = MIN_MAX_REPOST_WAIT_TIME!;

	for (const postLink of POST_LINKS!) {
		await repostPost(page, postLink);
		await countdownTimer(minTime, maxTime);
	}
}

async function repostPost(page: Page, postLink: string) {
	try {
		await page.goto(`https://x.com/${postLink}`);

		const hPage = new HPup(page);
		const xPage = new XPup(page);

		await hPage.infiniteScroll(randomNumber(3, 7));
		await hPage.scrollToTop();

		await clickRepostBtn(xPage, hPage);

		await setTimeout(randomNumber(1000, 5000));

		await hPage.moveMouseOutOfPage();

		await page.close();
	} catch (err) {
		console.error(err);
	}
}

async function clickRepostBtn(xPage: XPup, hPage: HPup) {
	const repostMenuXpath = `//article[@tabindex=-1]//div[@data-testId="retweet"][contains(@aria-label, 'Repost')]`;
	const repostMen = await xPage.getElByXPath(repostMenuXpath);
	await hPage.click(repostMen);

	const repostBtnXpath = `//div[@data-testId="retweetConfirm"]`;
	const repostBtn = await xPage.getElByXPath(repostBtnXpath);
	await hPage.click(repostBtn);
}
