import { config } from "../config/config.js";
import { Profile } from "./types.js";

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
	const url = `${ADS_BROWSER_URL}browser/start?user_id=${userId}`;
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
