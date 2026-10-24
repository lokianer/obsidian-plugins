// Copies the built plugin into the example vault so it can be enabled there.
// The target folder is git-ignored (examples/vault/.obsidian/plugins/).
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(
	pluginDir,
	'..',
	'..',
	'examples',
	'vault',
	'.obsidian',
	'plugins',
	'dnd5e-bylokianer',
);
const files = ['main.js', 'manifest.json', 'styles.css'];

if (!existsSync(join(pluginDir, 'main.js'))) {
	console.error('main.js is missing — run `pnpm build` first.');
	process.exit(1);
}

mkdirSync(target, { recursive: true });
for (const file of files) {
	copyFileSync(join(pluginDir, file), join(target, file));
}
console.log(`Installed ${files.join(', ')} into ${target}`);
