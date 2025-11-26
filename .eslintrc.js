module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "react-app",
    "react-app/jest",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Disable unused variable errors
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],

    // Allow any type
    "@typescript-eslint/no-explicit-any": "off",

    // Allow implicit any
    "@typescript-eslint/ban-ts-comment": "off",

    // Allow empty interfaces
    "@typescript-eslint/no-empty-interface": "off",

    // Allow non-null assertions
    "@typescript-eslint/no-non-null-assertion": "off",

    // React specific
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",

    // General
    "no-console": "warn",
    "prefer-const": "warn",
  },
  ignorePatterns: ["build/", "dist/", "node_modules/", "*.min.js"],
};
