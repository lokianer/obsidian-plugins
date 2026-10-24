import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { globalIgnores, defineConfig } from 'eslint/config';

export default defineConfig(
  globalIgnores([
    'node_modules',
    'dist',
    'esbuild.config.mjs',
    'scripts',
    'versions.json',
    'main.js',
    'package.json',
    'tsconfig.json',
    'tsconfig.test.json',
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['manifest.json'],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.json'],
      },
    },
  },
  ...obsidianmd.configs.recommended,
  {
    // Tests and tool configs run in Node, not in Obsidian.
    files: ['test/**/*.ts', 'vitest.config.ts', 'eslint.config.mts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.test.json',
        projectService: false,
      },
    },
    rules: {
      // Tests read examples/vault from disk with Node; the plugin itself never does.
      'obsidianmd/no-nodejs-modules': 'off',
      'obsidianmd/hardcoded-config-path': 'off',
    },
  },
);
