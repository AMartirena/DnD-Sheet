const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const copies = [
  [path.join(root, "public"), path.join(root, ".next", "standalone", "public")],
  [
    path.join(root, ".next", "static"),
    path.join(root, ".next", "standalone", ".next", "static"),
  ],
];

for (const [source, target] of copies) {
  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true, force: true });
  }
}
