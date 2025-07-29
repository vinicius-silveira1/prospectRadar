module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "require-jsdoc": "off",
    // Esta regra irá avisar sobre variáveis não utilizadas, mas ignorará qualquer uma que comece com _.
    // Esta é a maneira padrão de lidar com parâmetros intencionalmente não utilizados como `_context`.
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};