import puppeteer from "puppeteer-core";
import { config } from "../config/config.js";
import { closeBrowser, getBrowserWSEndpoint } from "./browser.js";
import { runModules } from "./runModules.js";
import { countdownTimer } from "./utils/countdownTimer.js";

const { CLOSE_BROWSER, MIN_MAX_PROFILE_WAIT_TIME } = config;

export async function runProfile(userId: string) {
	const browserWSEndpoint = await getBrowserWSEndpoint(userId);
	const browser = await puppeteer.connect({
		browserWSEndpoint,
	});

	await runModules(browser);

	if (CLOSE_BROWSER) await closeBrowser(userId);

	const [min, max] = MIN_MAX_PROFILE_WAIT_TIME;
	await countdownTimer(min, max);
}
