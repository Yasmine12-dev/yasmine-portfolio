// Usage: npm run set-domain -- https://your-domain.com
// Rewrites every canonical / og / hreflang / JSON-LD / robots / sitemap URL, then rebuilds the sitemap.
const fs = require("fs");
const path = require("path");

const target = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[^/\s]+$/.test(target)) {
  console.error(
    "Give a bare https origin, e.g. npm run set-domain -- https://yasmine-baba.dev",
  );
  process.exit(1);
}

const root = path.join(__dirname, "..");
const OLD = [
  "https://yasmine12-dev.github.io/Yasmine-Portfolio",
  "https://https://yasminebaba.vercel.app",
];
const skip = new Set(["node_modules", ".git", ".vercel"]);
let changed = 0;

(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(html|xml|txt|md|json)$/.test(name) || name === "package-lock.json")
      continue;
    let text = fs.readFileSync(full, "utf8");
    const before = text;
    for (const o of [...OLD, target]) text = text.split(o).join(target);
    if (text !== before) {
      fs.writeFileSync(full, text);
      changed++;
    }
  }
})(root);

console.log(`Updated ${changed} files to ${target}`);
require("./build-sitemap.js");
