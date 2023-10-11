import { ORDER } from "../src/types.js";
import { importExcludedProfiles } from "./importExcludedProfiles.js";

export const config = {
	ADS_BROWSER_URL: "http://local.adspower.net:50325/api/v1/",
	EXCLUDED_PROFILES: await importExcludedProfiles(
		"resources/excludedProfiles.txt"
	),
	PROFILES_RANGE: "1",
	MIN_MAX_PROFILE_WAIT_TIME: [60 * 5, 60 * 15], // seconds
	MODULE_ORDER: ORDER.RANDOM,
	MIN_MAX_MODULE_WAIT_TIME: [60 * 3, 60 * 7],
	CLOSE_BROWSER: true, // true/false
};
