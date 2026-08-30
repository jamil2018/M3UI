import { Command } from 'commander';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { themeToCss } from '@m3ui/color';

const program = new Command();

/** Published @m3ui/tokens CSS entry points (see packages/tokens/package.json exports). */
const TOKENS_CSS_IMPORTS =
  '@import "@m3ui/tokens/tokens.css";\n@import "@m3ui/tokens/theme.css";\n\n';

program.name('m3ui').description('M3UI CLI — Material Design 3 Expressive tooling').version('0.0.0');

program
  .command('init')
  .description('Initialize M3UI in a project')
  .option('--seed <color>', 'Brand seed color', '#6750A4')
  .option('--out <dir>', 'Output directory', '.')
  .action((opts: { seed: string; out: string }) => {
    const cssPath = join(opts.out, 'm3-theme.css');

    mkdirSync(dirname(cssPath), { recursive: true });
    writeFileSync(cssPath, TOKENS_CSS_IMPORTS + themeToCss({ seed: opts.seed, isDark: false }));

    const configPath = join(opts.out, 'm3ui.config.json');
    if (!existsSync(configPath)) {
      writeFileSync(
        configPath,
        JSON.stringify({ seed: opts.seed, variant: 'expressive', registry: 'https://m3ui.dev/r' }, null, 2) +
          '\n',
      );
    }

    console.log(`Created ${cssPath} and ${configPath}`);
    console.log('Add to your app: import "./m3-theme.css"');
  });

interface ThemeGenerateOptions {
  seed: string;
  variant: string;
  contrast: string;
  dark?: boolean;
  out: string;
}

function writeThemeCss(opts: ThemeGenerateOptions): void {
  const contrast = parseFloat(opts.contrast) as -1 | 0 | 0.5 | 1;
  const css =
    TOKENS_CSS_IMPORTS +
    themeToCss({
      seed: opts.seed,
      variant: opts.variant as 'expressive',
      contrast,
      isDark: !!opts.dark,
    });

  mkdirSync(dirname(opts.out), { recursive: true });
  writeFileSync(opts.out, css);
  console.log(`Theme written to ${opts.out}`);
}

const theme = program.command('theme').description('Generate theme CSS');

theme
  .command('generate')
  .description('Generate m3-theme.css with @m3ui/tokens imports and dynamic color vars')
  .requiredOption('--seed <color>', 'Brand seed color')
  .option('--variant <variant>', 'Theme variant', 'expressive')
  .option('--contrast <level>', 'Contrast level (-1, 0, 0.5, 1)', '0')
  .option('--dark', 'Generate dark scheme')
  .option('--out <file>', 'Output CSS file', 'm3-theme.css')
  .action(writeThemeCss);

// Back-compat alias: `m3ui theme --seed …` (same as `m3ui theme generate --seed …`)
theme
  .option('--seed <color>', 'Brand seed color')
  .option('--variant <variant>', 'Theme variant', 'expressive')
  .option('--contrast <level>', 'Contrast level (-1, 0, 0.5, 1)', '0')
  .option('--dark', 'Generate dark scheme')
  .option('--out <file>', 'Output CSS file', 'm3-theme.css')
  .action((opts: ThemeGenerateOptions) => {
    if (!opts.seed) return;
    writeThemeCss(opts);
  });

program.parse();
