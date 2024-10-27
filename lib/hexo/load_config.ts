import { sep, resolve, join, parse } from 'path';
import tildify from 'tildify';
import Theme from '../theme';
import Source from './source';
import { exists, readdir } from 'hexo-fs';
import { magenta } from 'picocolors';
import { deepMerge } from 'hexo-util';
import validateConfig from './validate_config';
import type Hexo from './index';

export = async (ctx: Hexo): Promise<void> => {
  if (!ctx.env.init) return;

  const baseDir = ctx.base_dir;
  let configPath = ctx.config_path;

  const path = await exists(configPath) ? configPath : await findConfigPath(configPath);
  if (!path) return;
  configPath = path;

  // Load and parse the config file using the render engine
  let config = await ctx.render.render({ path });
  if (!config || typeof config !== 'object') return;

  ctx.log.debug('Config loaded: %s', magenta(tildify(configPath)));

  // Merge the loaded config with existing config
  ctx.config = deepMerge(ctx.config, config);

  // Set default root URL from config.url if not specified
  if (!config.root) {
    let { pathname } = new URL(ctx.config.url);
    if (!pathname.endsWith('/')) pathname += '/';
    ctx.config.root = pathname;
  }
  config = ctx.config;

  validateConfig(ctx);

  ctx.config_path = configPath;
  // Normalize URL paths: ensure root ends with exactly one '/'
  config.root = config.root.replace(/\/*$/, '/');
  // Ensure URL doesn't end with trailing slashes
  config.url = config.url.replace(/\/+$/, '');

  ctx.public_dir = resolve(baseDir, config.public_dir) + sep;
  ctx.source_dir = resolve(baseDir, config.source_dir) + sep;
  ctx.source = new Source(ctx);

  if (!config.theme) return;

  const theme = config.theme.toString();
  config.theme = theme;

  // Define possible theme locations:
  // 1. In themes directory (preferred)
  // 2. In node_modules as a package
  const themeDirFromThemes = join(baseDir, 'themes', theme) + sep;
  const themeDirFromNodeModules = join(ctx.plugin_dir, 'hexo-theme-' + theme) + sep;

  // Set up theme directory and ignore patterns based on theme location
  let ignored: string[] = [];
  if (await exists(themeDirFromThemes)) {
    ctx.theme_dir = themeDirFromThemes;
    ignored = ['**/themes/*/node_modules/**', '**/themes/*/.git/**'];
  } else if (await exists(themeDirFromNodeModules)) {
    ctx.theme_dir = themeDirFromNodeModules;
    ignored = ['**/node_modules/hexo-theme-*/node_modules/**', '**/node_modules/hexo-theme-*/.git/**'];
  }
  ctx.theme_script_dir = join(ctx.theme_dir, 'scripts') + sep;
  ctx.theme = new Theme(ctx, { ignored });
};

async function findConfigPath(path: string): Promise<string> {
  const { dir, name } = parse(path);

  const files = await readdir(dir);
  const item = files.find(item => item.startsWith(name));
  if (item != null) return join(dir, item);
}
