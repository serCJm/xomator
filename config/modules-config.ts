import { browsePage } from "../src/modules/browsePage.js";
import { followProfiles } from "../src/modules/followProfiles.js";
import { repost } from "../src/modules/repost.js";

export const MODULES_MAP = {
	browsePage,
	followProfiles,
	repost,
} as const;

export const MODULES_CONFIG = {
	[browsePage.name]: {
		ENABLED: false,
		MIN_MAX_BROWSE_TIME: [60, 120], // seconds
	},
	[followProfiles.name]: {
		ENABLED: false,
		HANDLES: ["Galxe"] as string[], // x username handles
		MIN_MAX_FOLLOW_WAIT_TIME: [60, 300], // seconds
	},
	[repost.name]: {
		ENABLED: true,
		POST_LINKS: ["MyWasteIreland/status/1702725397475963158"] as string[], // x username handles
		MIN_MAX_REPOST_WAIT_TIME: [60, 300], // seconds
	},
} as const;
