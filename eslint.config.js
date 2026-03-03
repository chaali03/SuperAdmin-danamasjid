export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ignores: ['vendor/**', 'storage/**', 'public/**', '**/*.ts', '**/*.tsx', 'resources/js/wayfinder/**'],
  },
];
