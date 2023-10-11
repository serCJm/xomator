import { Browser } from "puppeteer-core";
import { config } from "../config/config.js";
import { MODULES_CONFIG, MODULES_MAP } from "../config/modules-config.js";
import { ORDER } from "./types.js";
import { countdownTimer } from "./utils/countdownTimer.js";
import { shuffleArr } from "./utils/utils.js";

const { MODULE_ORDER, MIN_MAX_MODULE_WAIT_TIME } = config;

async function getEnabledModules() {
	let enabledModules = Object.values(MODULES_MAP).filter(
		(module) => MODULES_CONFIG[module.name].ENABLED
	);

	if (enabledModules.length === 0) return [];

	switch (MODULE_ORDER) {
		case ORDER.RANDOM:
			return shuffleArr(enabledModules);
		default:
			return enabledModules;
	}
}

export async function runModules(browser: Browser) {
	const enabledModules = await getEnabledModules();

	const [minTime, maxTime] = MIN_MAX_MODULE_WAIT_TIME;

	for (const [index, module] of enabledModules.entries()) {
		try {
			await module(browser);

			const notLast = index < enabledModules.length - 1;
			if (notLast) await countdownTimer(minTime, maxTime);
		} catch (err) {
			console.error(err);
		}
	}
}
