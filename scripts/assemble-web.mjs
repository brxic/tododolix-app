import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const webDir = join(root, "dist", "web");
const buildDir = join(root, "dist", "build");
const siteDir = join(root, "site");
const publicDir = join(root, "public");

function getAppSourceDir(name) {
  const directDir = join(buildDir, name);
  const browserDir = join(directDir, "browser");
  return existsSync(browserDir) ? browserDir : directDir;
}

rmSync(webDir, { recursive: true, force: true });
mkdirSync(join(webDir, "app"), { recursive: true });

cpSync(siteDir, webDir, { recursive: true });
cpSync(getAppSourceDir("desktop"), join(webDir, "app", "desktop"), { recursive: true });
cpSync(getAppSourceDir("mobile"), join(webDir, "app", "mobile"), { recursive: true });

if (existsSync(publicDir)) {
  cpSync(publicDir, webDir, { recursive: true });
}

writeFileSync(
  join(webDir, "_redirects"),
  "/app/desktop/* /app/desktop/index.html 200\n/app/mobile/* /app/mobile/index.html 200\n",
  "utf8"
);
