import { browsePage } from "../src/modules/browsePage.js";

export const MODULES_CONFIG = {
	[browsePage.name]: {
		MIN_MAX_BROWSE_TIME: [60, 120], // seconds
	},
} as const;
