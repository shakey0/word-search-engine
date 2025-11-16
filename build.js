const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/core.js"],
  bundle: true,
  platform: "node",
  outfile: "dist/game_engine.bundle.js",
  format: "cjs",
  target: ["es2020"],
}).catch(() => process.exit(1));
