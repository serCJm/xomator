import { browsePage } from "../src/modules/browsePage.js";
import { followProfiles } from "../src/modules/followProfiles.js";

export const MODULES_MAP = {
	browsePage,
	followProfiles,
} as const;

export const MODULES_CONFIG = {
	[browsePage.name]: {
		ENABLED: true,
		MIN_MAX_BROWSE_TIME: [60, 120], // seconds
	},
	[followProfiles.name]: {
		ENABLED: true,
		HANDLES: ["Galxe"] as string[], // x username handles
		MIN_MAX_PROFILE_WAIT_TIME: [60, 300], // seconds
	},
} as const;
