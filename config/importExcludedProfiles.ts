import fs from "fs/promises";
export async function importExcludedProfiles(path: string) {
	const text = await fs.readFile(path, "utf8");

	const lines = text.split(",");

	const excludedWallets = lines.map((line: string) =>
		line.trim().replace("\r", "")
	);
	return new Set(excludedWallets);
}
