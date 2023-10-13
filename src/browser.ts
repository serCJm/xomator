import { config } from "../config/config.js";
import { Profile } from "./types.js";
import { randomNumber } from "./utils/utils.js";

const { ADS_BROWSER_URL } = config;

export async function getBrowserProfiles(): Promise<Profile[]> {
	const url = `${ADS_BROWSER_URL}user/list?page_size=50`;
	const res: any = await fetch(url);
	const data = await res.json();
	if (data.code === 0 && data.data && data.msg === "Success") {
		return data.data.list;
	}
	throw new Error("Didn't obtain the user list");
}

export async function getBrowserWSEndpoint(userId: string) {
	const windowSizes = [
		"1024x768",
		"1280x800",
		"1366x768",
		"1440x900",
		"1600x900",
		"1920x1080",
		"2560x1440",
	];
	const randomSize = windowSizes[randomNumber(0, windowSizes.length - 1)];
	const launchArgs = [`--window-size=${randomSize}`];
	const encodedLaunchArgs = encodeURIComponent(JSON.stringify(launchArgs));

	const url = `${ADS_BROWSER_URL}browser/start?user_id=${userId}&launch_args=${encodedLaunchArgs}`;

	console.log(url);

	const res: any = await fetch(url);
	const data = await res.json();
	if (data.code === 0 && data.data.ws && data.data.ws.puppeteer) {
		return data.data.ws.puppeteer;
	}
	throw new Error(`Could not start the browser for profile: ${userId}`);
}

export async function closeBrowser(userId: string) {
	const url = `${ADS_BROWSER_URL}browser/stop?user_id=${userId}`;
	await fetch(url);
}
