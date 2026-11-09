import { ZipArchive } from "archiver";
import { createWriteStream } from "node:fs";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
    new URL("../Browser-brightness.zip", import.meta.url)
);
const output = createWriteStream(outputPath);
const archive = new ZipArchive({ zlib: { level: 9 } });

const outputClosed = new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
});

archive.pipe(output);
archive.directory("dist/", false);
await archive.finalize();
await outputClosed;

console.log(`Created ${outputPath}`);
