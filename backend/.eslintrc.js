module.exports = {
  root: true,
  env: { node: true, jest: true },
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    'no-unused-vars': 'warn',
  },
};
