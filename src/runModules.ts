import { Browser } from "puppeteer-core";
import { browsePage } from "./modules/browsePage.js";

const MODULES_MAP = {
	browsePage,
};

export async function runModules(browser: Browser) {
	await browsePage(browser);
}
