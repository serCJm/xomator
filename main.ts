import { parseProfilesRange } from "./config/parseProfilesRange.js";
import { getBrowserProfiles } from "./src/browser.js";
import { runProfile } from "./src/runProfile.js";

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

async function main() {
	const toDoRange = parseProfilesRange();
	const allProfiles = await getBrowserProfiles();
	const toDoProfiles = allProfiles.filter((profile) =>
		toDoRange.has(profile.name)
	);
	for (const { user_id } of toDoProfiles) {
		runProfile(user_id);
	}
}

main();
