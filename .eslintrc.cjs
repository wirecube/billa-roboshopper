module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: [".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["@stylistic/ts"],
  rules: {
    "@stylistic/ts/indent": ["error", 2],
    "@stylistic/ts/object-curly-spacing": ["error", "always"],
    "@stylistic/ts/brace-style": ["error", "1tbs"],
    "@stylistic/ts/semi": ["error", "always"],
    "@stylistic/ts/comma-dangle": ["error", "always-multiline"],
    "@stylistic/ts/member-delimiter-style": ["error"],
    "@typescript-eslint/explicit-function-return-type": "error",
  },
};
