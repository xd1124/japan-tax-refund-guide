import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const list = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? list(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
const files = [
  path.join(root, "index.html"),
  ...list(path.join(root, "assets")),
  ...list(path.join(root, "data")),
].sort();
const withoutVersion = (text) => text.replace(/\?v=[\w-]+/g, "");
const hash = crypto.createHash("sha256");
for (const file of files) {
  hash.update(path.relative(root, file).replaceAll("\\", "/"));
  hash.update(
    /\.(html|css|js)$/.test(file)
      ? withoutVersion(fs.readFileSync(file, "utf8")).replaceAll("\r\n", "\n")
      : fs.readFileSync(file),
  );
}
const version = hash.digest("hex").slice(0, 12);
let outdated = false;
for (const file of files.filter((file) => /\.(html|js)$/.test(file))) {
  const before = fs.readFileSync(file, "utf8");
  const after = file.endsWith(".html")
    ? before.replace(
        /((?:src|href)="assets\/[^"?]+)(?:\?v=[\w-]+)?"/g,
        `$1?v=${version}"`,
      )
    : before.replace(
        /(from\s+['"]\.[^'"?]+)(?:\?v=[\w-]+)?(['"])/g,
        `$1?v=${version}$2`,
      );
  if (before === after) continue;
  outdated = true;
  if (!process.argv.includes("--check")) fs.writeFileSync(file, after);
}
if (outdated && process.argv.includes("--check")) {
  console.error(
    "정적 파일 캐시 버전이 오래되었습니다. npm run cache를 실행하세요.",
  );
  process.exitCode = 1;
} else console.log(`정적 파일 버전 ${version}${outdated ? " 갱신" : " 확인"}`);
