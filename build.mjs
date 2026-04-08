import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

// Build plugin (sandbox code)
await esbuild.build({
  entryPoints: ["src/plugin.ts"],
  bundle: true,
  outfile: "dist/plugin.js",
  target: "es2020",
  format: "iife",
});

// Copy UI HTML as-is (it's self-contained)
const ui = readFileSync("src/ui.html", "utf-8");
writeFileSync("dist/ui.html", ui);

console.log("Built successfully.");
