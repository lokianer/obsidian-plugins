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
    // obsidianmd/regex-lookbehind catches `(?<=` only; iOS before 16.4 cannot parse `(?<!` either,
    // and one such literal stops the whole plugin from loading there.
    files: ['src/**/*.ts'],
    rules: {
      // Complexity limits (asked for 2026-10-26): warnings, so the functions above them stay a
      // visible to-do list (steps 2 and 3 of reducing complexity, HANDOFF.md) and new code does not
      // grow past them unnoticed. Tighten once the list is empty.
      complexity: ['warn', 20],
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[regex.pattern=/\\(\\?<[=!]/]',
          message: 'No lookbehind: iOS before 16.4 cannot parse it.',
        },
      ],
    },
  },
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
  {
    // The UI tests' stand-in for Obsidian builds createEl and friends itself on happy-dom, and hands
    // the renderers plain objects where Obsidian would pass a TFile.
    files: ['test/ui/**/*.ts'],
    rules: {
      'obsidianmd/prefer-create-el': 'off',
      'obsidianmd/no-tfile-tfolder-cast': 'off',
    },
  },
);
