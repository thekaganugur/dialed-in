/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.md",
      options: {
        plugins: ["prettier-plugin-tailwindcss"],
      },
    },
  ],
};
