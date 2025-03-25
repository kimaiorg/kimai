import path from "path";

const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`;

const lintStagedConfig = {
  "*.{ts,tsx,js,jsx,css,yaml,yml}": ["npm run format", buildEslintCommand]
};

export default lintStagedConfig;
