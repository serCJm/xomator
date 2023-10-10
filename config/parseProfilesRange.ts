import { config } from "./config.js";

export function parseProfilesRange() {
	const { PROFILES_RANGE, EXCLUDED_PROFILES } = config;

	const trimmedRange = PROFILES_RANGE.trim();
	const splitRanges = trimmedRange.split(",");

	const range = splitRanges
		.flatMap((s: string) => {
			const r = s.trim();
			if (r.includes("-")) {
				const [start, end] = r.split("-").map(Number);
				return Array.from({ length: end - start + 1 }, (_, i) =>
					(start + i).toString()
				);
			} else {
				return [r];
			}
		})
		.filter((p) => !EXCLUDED_PROFILES.has(p));

	return new Set(range);
}
