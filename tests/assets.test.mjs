import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { html } from "./helpers.mjs";

const root = path.resolve(import.meta.dirname, "..");
function files(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}
test("정적 상대 경로와 모듈 의존성, 인라인 실행 코드 없음", () => {
  assert(!/<style\b/.test(html));
  assert(!/<script(?![^>]*src=)[^>]*>/.test(html));
  assert.equal((html.match(/type="module"/g) || []).length, 1);
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const url = match[1];
    if (/^https?:|^data:/.test(url)) continue;
    assert(!url.startsWith("/"), url);
    assert(fs.existsSync(path.join(root, url.split("?")[0])), url);
  }
  for (const file of files(path.join(root, "assets/js"))) {
    const source = fs.readFileSync(file, "utf8");
    assert(
      !/innerHTML|originalNavigate|originalCalc|window\.storeExpansion/.test(
        source,
      ),
      file,
    );
    for (const match of source.matchAll(/from ['"]([^'"]+)['"]/g))
      assert(
        fs.existsSync(path.resolve(path.dirname(file), match[1].split("?")[0])),
        match[1],
      );
  }
});
test("테스트가 Git 이력 없이 실행 가능한 구성", () => {
  for (const file of files(path.join(root, "tests")).filter(
    (file) => /\.mjs$/.test(file) && !file.endsWith("assets.test.mjs"),
  )) {
    assert(
      !/child_process|git show|execFileSync/.test(
        fs.readFileSync(file, "utf8"),
      ),
      file,
    );
  }
});
