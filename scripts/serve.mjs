import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const port = Number(process.env.PORT || 8765);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
http
  .createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400);
      return response.end();
    }
    const relative =
      pathname
        .replace(/^\/japan-tax-refund-guide(?=\/|$)/, "")
        .replace(/^\//, "") || "index.html";
    const file = path.resolve(root, relative);
    if (
      !file.startsWith(root + path.sep) ||
      !types[path.extname(file)] ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      response.writeHead(404);
      return response.end();
    }
    response.setHeader("Content-Type", types[path.extname(file)]);
    response.setHeader("Cache-Control", "no-store");
    response.end(fs.readFileSync(file));
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`http://127.0.0.1:${port}/japan-tax-refund-guide/`),
  );
