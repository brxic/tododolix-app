import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist", "web");
const port = Number(process.env.PORT || 8080);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function resolvePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0] || "/");
  const safePath = normalize(decodedPath).replace(/^[/\\]+/, "").replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, safePath);
  const requestedExt = extname(safePath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (!existsSync(filePath)) {
    if (requestedExt) {
      return null;
    }
    if (safePath.startsWith("app/mobile/")) {
      return join(root, "app", "mobile", "index.html");
    }
    if (safePath.startsWith("app/desktop/")) {
      return join(root, "app", "desktop", "index.html");
    }
    if (safePath === "app") {
      return join(root, "app", "index.html");
    }
    return join(root, "index.html");
  }

  return filePath;
}

createServer((req, res) => {
  const filePath = resolvePath(req.url || "/");

  if (!filePath || !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = extname(filePath);
  const type = types[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`Preview running at http://localhost:${port}`);
});
