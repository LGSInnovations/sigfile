module.exports = {
  env: {
    browser: true,
    node: true,
    es2017: true,
    jest: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
  },
  plugins: ["jest"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
